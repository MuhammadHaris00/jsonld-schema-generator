import type { FormData, JsonLdBase, SchemaKey } from '../types/schema';

// --- Helper Functions ---

/** Converts human-readable availability/condition text into a Schema.org URL. */
const mapToSchemaUrl = (value: string | undefined): string | null => {
    if (!value) return null;
    // Cleans spaces (e.g., "In Stock" -> "InStock") and forms the URL
    const cleanValue = value.replace(/\s/g, '');
    return `https://schema.org/${cleanValue}`;
};

// --- Transformation Implementations ---

const transformPerson = (formData: FormData): JsonLdBase => {
    // We use 'as any' internally to handle property renaming/deletion,
    // but the final return object conforms to JsonLdBase.
    const jsonLd: any = { ...formData };

    jsonLd["@context"] = "https://schema.org";
    jsonLd["@type"] = "Person";

    // Direct Property Mappings (Form fields -> Schema.org keys)
    // jsonLd.name = jsonLd.fullName; delete jsonLd.fullName;
    // jsonLd.description = jsonLd.professionalDescription; delete jsonLd.professionalDescription;
    // jsonLd.url = jsonLd.professionalWebsite; delete jsonLd.professionalWebsite;
    // jsonLd.image = jsonLd.photoUrl; delete jsonLd.photoUrl;

    // Nested Address
    if (jsonLd.address) {
        jsonLd.address = { "@type": "PostalAddress", ...jsonLd.address };
    }

    // Nested ContactPoint (combines email/phone)
    if (jsonLd.contactPoint) {
        jsonLd.contactPoint = {
            "@type": "ContactPoint",
            "contactType": "Professional",
            "email": jsonLd.contactPoint.email,
            "telephone": jsonLd.contactPoint.telephone
        };
        delete jsonLd.email; delete jsonLd.phone;
    }

    // Nested Organization (worksFor)
    if (jsonLd.worksFor) {
        jsonLd.worksFor["@type"] = "Organization";
    }

    // Nested AlumniOf (Education)
    if (jsonLd.alumniOf) {
        jsonLd.alumniOf["@type"] = "Organization";
        if (jsonLd.alumniOf.hasCredential) {
            jsonLd.alumniOf.hasCredential["@type"] = "EducationalOccupationalCredential";
        }
    }

    return jsonLd as JsonLdBase;
};

const transformProduct = (formData: FormData): JsonLdBase => {
    const jsonLd: any = { ...formData };

    jsonLd["@context"] = "https://schema.org";
    jsonLd["@type"] = "Product";

    jsonLd.name = jsonLd.productName; delete jsonLd.productName;
    jsonLd.description = jsonLd.productDescription; delete jsonLd.productDescription;
    jsonLd.image = jsonLd.imageUrl; delete jsonLd.imageUrl;

    // Nested Brand
    if (jsonLd.brand) jsonLd.brand["@type"] = "Brand";

    // Nested Offer
    if (jsonLd.offers) {
        jsonLd.offers["@type"] = "Offer";
        jsonLd.offers.availability = mapToSchemaUrl(jsonLd.offers.availability);
        jsonLd.offers.itemCondition = mapToSchemaUrl(jsonLd.offers.itemCondition);
        if (jsonLd.offers.seller) jsonLd.offers.seller["@type"] = "Organization";
    }

    // Nested AggregateRating
    if (jsonLd.aggregateRating) jsonLd.aggregateRating["@type"] = "AggregateRating";

    return jsonLd as JsonLdBase;
};

const transformFAQ = (formData: FormData): JsonLdBase => {
    // Transform the 'faqs' array into 'mainEntity' of 'Question'/'Answer'
    const mainEntityList = formData.faqs ? formData.faqs.map((faqItem: any) => ({
        "@type": "Question",
        "name": faqItem.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faqItem.answer
        }
    })) : [];

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": mainEntityList
    };
};

const transformLocalBusiness = (formData: FormData): JsonLdBase => {
    const jsonLd: any = {
        "@context": "https://schema.org",
        "@type": formData.businessType?.replace(/\s/g, '') || "LocalBusiness",
    }
    if(formData.name){
        jsonLd.name = formData.name;
    }
    if(formData.description){
        jsonLd.description = formData.description;
    }
    if(formData.url){
        jsonLd.url = formData.url;
    }
    if(formData.telephone){
        jsonLd.telephone = formData.telephone;
    }
    if(formData.email){
        jsonLd.email = formData.email;
    }
    if(formData.priceRange){
        jsonLd.priceRange = formData.priceRange;
    }
    if(formData.image){
        jsonLd.image = formData.image;
    }
    if(formData.streetAddress || formData.addressLocality || formData.addressRegion || formData.postalCode){
        jsonLd.address = {
            '@type': 'PostalAddress',
        }
        if(formData.streetAddress){
            jsonLd.address.streetAddress = formData.streetAddress;
        }
        if(formData.addressLocality){
            jsonLd.address.addressLocality = formData.addressLocality;
        }
        if(formData.addressRegion){
            jsonLd.address.addressRegion = formData.addressRegion;
        }
        if(formData.postalCode){
            jsonLd.address.postalCode = formData.postalCode;
        }
    }
    if(formData.latitude || formData.longitude){
        jsonLd.geo={
            "@type": "GeoCoordinates",
        }
        if(formData.latitude){
            jsonLd.geo.latitude = formData.latitude;
        }
        if(formData.longitude){
            jsonLd.geo.longitude = formData.longitude;
        }
    }

    if (formData.openingHours) {
        // Example input: "Mo-Fr 09:00-17:00"
        const input = formData.openingHours.trim();
        const regex = /([A-Za-z]{2})(?:-([A-Za-z]{2}))?\s+(\d{2}:\d{2})-(\d{2}:\d{2})/;
        const match = input.match(regex);
        if (match) {
            const [, startDay, endDay, opens, closes] = match;

            const dayMap = {
                Mo: "Monday",
                Tu: "Tuesday",
                We: "Wednesday",
                Th: "Thursday",
                Fr: "Friday",
                Sa: "Saturday",
                Su: "Sunday"
            };

            const allDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

            let dayOfWeek:string[] = [];

            if (endDay) {
                // Range (e.g., Mo-Fr)
                const startIndex = allDays.indexOf(startDay);
                const endIndex = allDays.indexOf(endDay);
                dayOfWeek = allDays
                    .slice(startIndex, endIndex + 1)
                    .map(d => dayMap[d]);
            } else {
                // Single day (e.g., Mo)
                dayOfWeek = [dayMap[startDay]];
            }

            jsonLd.openingHoursSpecification = {
                "@type": "OpeningHoursSpecification",
            };

            if(dayOfWeek.length > 0){
                jsonLd.openingHoursSpecification.dayOfWeek = dayOfWeek;
            }
            if(opens){
                jsonLd.openingHoursSpecification.dayOfWeek = opens;
            }
            if(closes){
                jsonLd.openingHoursSpecification.dayOfWeek = closes;
            }
        }
        else{
            jsonLd.openingHoursSpecification = {
                "@type": "OpeningHoursSpecification",
                dayOfWeek:[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                ],
                "opens": "09:00",
                "closes": "17:00"
            }
        }
    }

    return jsonLd;
};

const transformService = (formData: FormData): JsonLdBase => {
    const jsonLd: any = { ...formData };

    jsonLd["@context"] = "https://schema.org";
    jsonLd["@type"] = jsonLd.serviceType || "Service";
    delete jsonLd.serviceType;

    // Direct Mappings
    jsonLd.name = jsonLd.serviceName; delete jsonLd.serviceName;
    jsonLd.description = jsonLd.serviceDescription; delete jsonLd.serviceDescription;
    jsonLd.url = jsonLd.serviceUrl; delete jsonLd.serviceUrl;
    jsonLd.image = jsonLd.serviceImageUrl; delete jsonLd.serviceImageUrl;
    jsonLd.telephone = jsonLd.phone; delete jsonLd.phone;
    jsonLd.termsOfService = jsonLd.termsOfServiceUrl; delete jsonLd.termsOfServiceUrl;

    // Nested Entities
    if (jsonLd.provider) jsonLd.provider = { "@type": "Organization", ...jsonLd.provider };
    if (jsonLd.brand) jsonLd.brand = { "@type": "Brand", ...jsonLd.brand };
    if (jsonLd.offers) jsonLd.offers = { "@type": "Offer", ...jsonLd.offers };
    if (jsonLd.contactPoint) jsonLd.contactPoint = { "@type": "ContactPoint", ...jsonLd.contactPoint };
    if (jsonLd.aggregateRating) jsonLd.aggregateRating = { "@type": "AggregateRating", ...jsonLd.aggregateRating };

    // Simplification for audience
    if (jsonLd.audience && jsonLd.audience.audienceType) {
        jsonLd.audience = jsonLd.audience.audienceType.split(' ')[0];
    }

    return jsonLd as JsonLdBase;
};

const transformNGO = (formData: FormData): JsonLdBase => {
    const jsonLd: any = { ...formData };

    jsonLd["@context"] = "https://schema.org";
    jsonLd["@type"] = "NGO";

    // Nested Entities
    if (jsonLd.address) jsonLd.address = { "@type": "PostalAddress", ...jsonLd.address };
    if (jsonLd.contactPoint) jsonLd.contactPoint = { "@type": "ContactPoint", ...jsonLd.contactPoint };
    if (jsonLd.founder) jsonLd.founder = { "@type": "Person", ...jsonLd.founder };
    if (jsonLd.employee) jsonLd.employee = { "@type": "Person", ...jsonLd.employee };

    // Handle array fields that might be string inputs
    if (jsonLd.keywords && typeof jsonLd.keywords === 'string') {
        jsonLd.keywords = jsonLd.keywords.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    return jsonLd as JsonLdBase;
};

// --- The Central Router (Exported) ---
export const transformJSONLD = (schemaKey: SchemaKey, formData: FormData): string => {
    let jsonLdObject: JsonLdBase | null = null;

    switch (schemaKey) {
        case 'Person':
            jsonLdObject = transformPerson(formData);
            break;
        case 'Product':
            jsonLdObject = transformProduct(formData);
            break;
        case 'FAQ':
            jsonLdObject = transformFAQ(formData);
            break;
        case 'LocalBusiness':
            jsonLdObject = transformLocalBusiness(formData);
            break;
        case 'Service':
            jsonLdObject = transformService(formData);
            break;
        case 'NGO':
            jsonLdObject = transformNGO(formData);
            break;
        default:
            console.error(`Unknown schema key: ${schemaKey}`);
            return '';
    }

    return jsonLdObject ? JSON.stringify(jsonLdObject, null, 2) : '';
};
