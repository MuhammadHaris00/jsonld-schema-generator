// src/types/schema.ts

// Define a general structure for the form data (exported)
export type FormData = { [key: string]: any };

// Define the root JSON-LD structure (exported)
export interface JsonLdBase {
    "@context": "https://schema.org";
    "@type": string;
    [key: string]: any;
}

// Map the possible schema keys (exported)
export type SchemaKey = 'Person' | 'LocalBusiness' | 'Product' | 'FAQ' | 'Service' | 'NGO';

// Props for the main component (exported)
export interface FormProps {
    schemaKey: SchemaKey;
    schema: any;
}