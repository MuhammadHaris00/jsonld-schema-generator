// src/types/schema.ts

// Define a general structure for the form data (exported)
import type JSONSchema7 from "@rjsf/core";

export type FormData = { [key: string]: unknown };

type JsonLdValue = string | number | boolean | object | JsonLdValue[];
// Define the root JSON-LD structure (exported)
export interface JsonLdBase {
    "@context": "https://schema.org";
    "@type": string;
    [key: string]: JsonLdValue;
}

// Map the possible schema keys (exported)
export type SchemaKey = 'Person' | 'LocalBusiness' | 'Product' | 'FAQ' | 'Service' | 'Organization' | string;

// Props for the main component (exported)
export interface FormProps {
    schemaKey: SchemaKey;
    schema: JSONSchema7;
}