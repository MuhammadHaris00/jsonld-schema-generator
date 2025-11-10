// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { FormData, JsonLdBase, SchemaKey } from '../types/schema';

const transformPerson = (formData: FormData): JsonLdBase => {
    const jsonLd: JsonLdBase = {
        "@context": "https://schema.org",
        "@type": "Person",
    };

    // Top-level properties
    if (formData.personName) jsonLd.name = formData.personName;
    if (formData.description) jsonLd.description = formData.description;
    if (formData.givenName) jsonLd.givenName = formData.givenName;
    if (formData.familyName) jsonLd.familyName = formData.familyName;
    if (formData.honorificPrefix) jsonLd.honorificPrefix = formData.honorificPrefix;
    if (formData.honorificSuffix) jsonLd.honorificSuffix = formData.honorificSuffix;
    if (formData.jobTitle) jsonLd.jobTitle = formData.jobTitle;
    if (formData.url) jsonLd.url = formData.url;
    if (formData.image) jsonLd.image = formData.image;
    if (formData.birthDate) jsonLd.birthDate = formData.birthDate;
    if (formData.nationality) jsonLd.nationality = formData.nationality;

    // Address
    if (
        formData.streetAddress ||
        formData.city ||
        formData.state ||
        formData.postalCode
    ) {
        jsonLd.address = {
            "@type": "PostalAddress",
            streetAddress: formData.streetAddress,
            addressLocality: formData.city,
            addressRegion: formData.state,
            postalCode: formData.postalCode,
        };
    }

    // ContactPoint
    if (formData.email || formData.phone) {
        jsonLd.contactPoint = {
            "@type": "ContactPoint",
            contactType: "Professional",
            email: formData.email,
            telephone: formData.phone,
        };
    }

    // worksFor / Organization
    if (formData.organizationName || formData.organizationUrl) {
        jsonLd.worksFor = {
            "@type": "Organization",
            name: formData.organizationName,
            url: formData.organizationUrl,
        };
    }

    // Skills / knowsAbout
    if (formData.skills) {
        jsonLd.knowsAbout = formData.skills.toString()
            .split(",")
            .map((skill: string) => skill.trim());
    }

    // Awards
    if (formData.awards) jsonLd.award = formData.awards;

    // Alumni / Education
    if (formData.university || formData.degree || formData.graduationYear) {
        jsonLd.alumniOf = {
            "@type": "Organization",
            name: formData.university,
            hasCredential: {
                "@type": "EducationalOccupationalCredential",
                credentialCategory: formData.degree,
                dateCreated: formData.graduationYear,
            },
        };
    }

    // sameAs / Social URLs
    const sameAs: string[] = [];
    if (formData.socialMediaLinkedIn) sameAs.push(formData.socialMediaLinkedIn as string);
    if (formData.socialMediaTwitter) sameAs.push(formData.socialMediaTwitter as string);
    if (formData.personalWebsite) sameAs.push(formData.personalWebsite as string);
    if (sameAs.length) jsonLd.sameAs = sameAs;

    return jsonLd as JsonLdBase;
};


const transformProduct = (formData: FormData): JsonLdBase => {
    const jsonLd: JsonLdBase = {
        "@context": "https://schema.org",
        "@type": "Product",
    };

    if (formData.name) {
        jsonLd.name = formData.name;
    }
    if (formData.description) {
        jsonLd.description = formData.description;
    }
    if (formData.brand) {
        jsonLd.brand = {
            "@type": "Brand",
            name: formData.brand,
        };
    }
    if (formData.model) {
        jsonLd.model = formData.model;
    }
    if (formData.sku) {
        jsonLd.sku = formData.sku;
    }
    if (formData.gtin) {
        jsonLd.gtin = formData.gtin;
    }
    if (formData.image) {
        jsonLd.image = formData.image;
    }
    if (formData.category) {
        jsonLd.category = formData.category;
    }

// --- Offers ---
    if (
        formData.price ||
        formData.priceCurrency ||
        formData.availability ||
        formData.itemCondition ||
        formData.url ||
        formData.seller ||
        formData.priceValidUntil
    ) {
        jsonLd.offers = {
            "@type": "Offer",
        };

        if (formData.price) jsonLd.offers.price = formData.price;
        if (formData.priceCurrency)
            jsonLd.offers.priceCurrency = formData.priceCurrency;
        if (formData.availability)
            jsonLd.offers.availability = formData.availability;
        if (formData.itemCondition)
            jsonLd.offers.itemCondition = formData.itemCondition;
        if (formData.url) jsonLd.offers.url = formData.url;
        if (formData.priceValidUntil)
            jsonLd.offers.priceValidUntil = formData.priceValidUntil;
        if (formData.seller) {
            jsonLd.offers.seller = {
                "@type": "Organization",
                name: formData.seller,
            };
        }
    }

// --- Aggregate Rating ---
    if (formData.ratingValue || formData.reviewCount) {
        jsonLd.aggregateRating = {
            "@type": "AggregateRating",
        };
        if (formData.ratingValue)
            jsonLd.aggregateRating.ratingValue = formData.ratingValue;
        if (formData.reviewCount)
            jsonLd.aggregateRating.reviewCount = formData.reviewCount;
    }




    return jsonLd;

};

const transformFAQ = (formData: FormData): JsonLdBase => {
    const jsonLd: JsonLdBase = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
    };

    interface FaqInterface{
        question: string;
        answer: string;
    }

    if (formData.faqs && formData.faqs.length) {
        // Filter only FAQs that have a non-empty answer
        const validFaqs = formData.faqs.filter(
            (faq: FaqInterface) => faq.answer && faq.answer.trim() !== ""
        );

        if (validFaqs.length > 0) {
            jsonLd.mainEntity = validFaqs.map((faq: FaqInterface) => ({
                "@type": "Question",
                "name": faq.question || "",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }));
        }
    }

    return jsonLd;
};


const transformLocalBusiness = (formData: FormData): JsonLdBase => {
    const jsonLd: JsonLdBase = {
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

            const dayMap: Record<string, string> = {
                Mo: "Monday",
                Tu: "Tuesday",
                We: "Wednesday",
                Th: "Thursday",
                Fr: "Friday",
                Sa: "Saturday",
                Su: "Sunday",
            };

            const allDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
            let dayOfWeek: string[] = [];

            if (endDay) {
                const startIndex = allDays.indexOf(startDay);
                const endIndex = allDays.indexOf(endDay);
                if (startIndex >= 0 && endIndex >= 0) {
                    dayOfWeek = allDays.slice(startIndex, endIndex + 1).map(d => dayMap[d]);
                }
            } else {
                if (startDay in dayMap) {
                    dayOfWeek = [dayMap[startDay]];
                }
            }

            jsonLd.openingHoursSpecification = {
                "@type": "OpeningHoursSpecification",
                dayOfWeek,
                opens,
                closes,
            };
        } else {
            // Default fallback
            jsonLd.openingHoursSpecification = {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "17:00",
            };
        }
    }


    return jsonLd;
};

const transformService = (formData: FormData): JsonLdBase => {
    const jsonLd: JsonLdBase = {
        "@context": "https://schema.org",
        "@type": formData.businessType?.replace(/\s/g, '') || "Service",
    };

    // Order according to schema example
    if (formData.name) jsonLd.name = formData.name;
    if (formData.description) jsonLd.description = formData.description;

    if (formData.provider) {
        jsonLd.provider = {
            "@type": "Organization",
            name: formData.provider,
        };
    }

    if (formData.brand) {
        jsonLd.brand = {
            "@type": "Brand",
            name: formData.brand,
        };
    }

    if (formData.serviceType) jsonLd.serviceType = formData.serviceType;
    if (formData.areaServed) jsonLd.areaServed = formData.areaServed;
    if (formData.url) jsonLd.url = formData.url;
    if (formData.image) jsonLd.image = formData.image;
    if (formData.category) jsonLd.category = formData.category;
    if (formData.serviceOutput) jsonLd.serviceOutput = formData.serviceOutput;
    if (formData.hoursAvailable) jsonLd.hoursAvailable = formData.hoursAvailable;

    if (formData.termsOfService) jsonLd.termsOfService = formData.termsOfService;

    if (formData.price || formData.priceCurrency) {
        jsonLd.offers = {
            "@type": "Offer",
        };
        if (formData.price) jsonLd.offers.price = formData.price;
        if (formData.priceCurrency) jsonLd.offers.priceCurrency = formData.priceCurrency;
    }

    if (formData.email || formData.phone) {
        jsonLd.contactPoint = {
            "@type": "ContactPoint",
            contactType: "Customer Service",
        };
        if (formData.email) jsonLd.contactPoint.email = formData.email;
        if (formData.phone) jsonLd.contactPoint.telephone = formData.phone;
    }

    if (formData.ratingValue || formData.reviewCount) {
        jsonLd.aggregateRating = {
            "@type": "AggregateRating",
        };
        if (formData.ratingValue) jsonLd.aggregateRating.ratingValue = formData.ratingValue;
        if (formData.reviewCount) jsonLd.aggregateRating.reviewCount = formData.reviewCount;
    }

    return jsonLd;
};



const transformOrganization = (formData: FormData): JsonLdBase => {
    const jsonLd: JsonLdBase = {
        "@context":"https://schema.org",
        "@type": formData.organizationType?.replace(/\s/g, '') || "LocalBusiness",
    };

    // Organization info
    if (formData.name) jsonLd.name = formData.name;
    if (formData.description) jsonLd.description = formData.description;
    if (formData.url) jsonLd.url = formData.url;
    if (formData.logo) jsonLd.logo = formData.logo;
    if (formData.foundingDate) jsonLd.foundingDate = formData.foundingDate;
    if (formData.legalName) jsonLd.legalName = formData.legalName;
    if (formData.slogan) jsonLd.slogan = formData.slogan;
    if (formData.numberOfEmployees) jsonLd.numberOfEmployees = formData.numberOfEmployees;

    // Address
    if (formData.streetAddress || formData.addressLocality || formData.addressRegion || formData.postalCode) {
        jsonLd.address = {
            "@type": "PostalAddress",
        };
        if (formData.streetAddress) {
            jsonLd.address.streetAddress = formData.streetAddress;
        }
        if (formData.addressLocality) jsonLd.address.addressLocality = formData.addressLocality;
        if (formData.addressRegion) jsonLd.address.addressRegion = formData.addressRegion;
        if (formData.postalCode) jsonLd.address.postalCode = formData.postalCode;
    }

    // Contact
    if (formData.phone || formData.email) {
        jsonLd.contactPoint = {
            "@type": "ContactPoint",
            contactType: "Customer Service",
        };
        if (formData.phone) jsonLd.contactPoint.telephone = formData.phone;
        if (formData.email) jsonLd.contactPoint.email = formData.email;
    }

    // Industry
    if (formData.industry) jsonLd.industry = formData.industry;

    // Founder
    if (formData.founderName) {
        jsonLd.founder = {
            "@type": "Person",
            name: formData.founderName
        };
    }

    // Employee / CEO
    if (formData.ceoName) {
        jsonLd.employee = {
            "@type": "Person",
            name: formData.ceoName,
            jobTitle: "CEO"
        };
    }

    // Keywords
    if (formData.keywords) {
        jsonLd.keywords = formData.keywords.toString().split(",").map((k: string) => k.trim());
    }

    // VAT / Tax IDs
    if (formData.vatID) jsonLd.vatID = formData.vatID;
    if (formData.taxID) jsonLd.taxID = formData.taxID;

    // Social links
    const sameAs: string[] = [];
    if (formData.linkedinURL) sameAs.push(formData.linkedinURL as string);
    if (formData.twitterURL) sameAs.push(formData.twitterURL as string);
    if (formData.facebookURL) sameAs.push(formData.facebookURL as string);
    if (sameAs.length) jsonLd.sameAs = sameAs;

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
        case 'Organization':
            jsonLdObject = transformOrganization(formData);
            break;
        default:
            console.error(`Unknown schema key: ${schemaKey}`);
            return '';
    }

    return jsonLdObject ? JSON.stringify(jsonLdObject, null, 2) : '';
};
