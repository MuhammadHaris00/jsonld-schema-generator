import { useEffect, useState, useMemo, type ReactElement } from 'react';
import Form from '@rjsf/core';
import type { IChangeEvent } from '@rjsf/core';
import type RJSFSchema from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

// Import necessary types and the central transformation logic
import type { FormData, SchemaKey } from '../types/schema';
import { transformJSONLD } from '../utils/transformations';

// --- MOCK SCHEMA IMPORTS ---
import personSchema from '../forms_schema/personSchema.json';
import localBusinessSchema from  '../forms_schema/localBusiness.json';
import productSchema from  '../forms_schema/productSchema.json';
import faqSchema from  '../forms_schema/faqSchema.json';
import serviceSchema from  '../forms_schema/serviceSchema.json';
import organizationSchema from  '../forms_schema/organizationSchema.json';
// --- Add imports for all your other schemas here ---

// --- MOCK SCHEMA SELECTION LOGIC ---
// Mapped keys must match the string literals in SchemaKey type (e.g., 'LocalBusiness', 'Product')
const schemaMap: Record<SchemaKey, unknown> = {
    'Person': personSchema,
    'Product': productSchema, // Placeholder
    'FAQ': faqSchema,
    'LocalBusiness': localBusinessSchema, // Placeholder
    'Service': serviceSchema,
    'Organization': organizationSchema,
};
// ---------------------------------------------------


// Define the interface for the component props
interface SchemaFormProps {
    schemaKey: SchemaKey; // Renamed 'schema' to 'schemaKey' for clarity
    setOutput: (element: ReactElement) => void; // Correctly type the setOutput function
}

const SchemaForm = ({ schemaKey, setOutput }: SchemaFormProps) => {
    // Determine the current schema using the key
    const currentSchema = schemaMap[schemaKey] as RJSFSchema;
    const [formData, setFormData] = useState<FormData>({});
    const [, setJsonLdOutput] = useState<string>('');

    // 1. Reactive JSON-LD calculation
    const calculatedJsonLd = useMemo(() => {
        return transformJSONLD(schemaKey, formData);
    }, [formData, schemaKey]); // Dependency on schemaKey ensures reset when switching tabs

    useEffect(() => {
        setJsonLdOutput(calculatedJsonLd);
        // console.log(`Current Schema Key: ${schemaKey}`);

        // Check if formData has values
        const isFormEmpty = !formData ||
            (typeof formData === "object" && Object.keys(formData).length === 0) ||
        Object.keys(formData).every((k)=>{
            return formData[k] === undefined || formData[k] === '' || (formData[k] !== null && Object.keys(formData[k]).length === 0);
        });

        const preClass = `p-4 rounded text-sm overflow-auto ${isFormEmpty ? "inactive" : "active"}`;

            setOutput(
                <pre className={preClass + (!(calculatedJsonLd && !isFormEmpty )? " text-muted":"")}>
                &lt;script type="application/ld+json"&gt;
                    {calculatedJsonLd}
                    &lt;/script&gt;
            </pre>
            );

    }, [calculatedJsonLd, setOutput, schemaKey, formData]);



    return (
        <div>
            <h3 className={"heading-inner"}>Schema Details ({schemaKey})</h3>
            <Form
                schema={currentSchema}
                validator={validator}
                onChange={(e: IChangeEvent<FormData>) => {
                    // IChangeEvent.formData is always defined
                    setFormData(e.formData ?? {});
                }}
            />
        </div>
    );
};
export default SchemaForm