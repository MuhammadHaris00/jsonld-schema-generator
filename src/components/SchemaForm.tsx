// SchemaForm.tsx

import { useEffect, useState, useMemo, ReactElement } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

// Import necessary types and the central transformation logic
import type { FormData, SchemaKey } from '../types/schema';
import { transformJSONLD } from '../utils/transformations';

// --- MOCK SCHEMA IMPORTS ---
import personSchema from '../forms_schema/personSchema.json';
// --- Add imports for all your other schemas here ---

// --- MOCK SCHEMA SELECTION LOGIC ---
// Mapped keys must match the string literals in SchemaKey type (e.g., 'LocalBusiness', 'Product')
const schemaMap: Record<SchemaKey, any> = {
    'Person': personSchema,
    'Product': { title: "Product Form", type: "object", properties: {} }, // Placeholder
    'FAQ': { title: "FAQ Form", type: "object", properties: {} }, // Placeholder
    'LocalBusiness': { title: "LocalBusiness Form", type: "object", properties: {} }, // Placeholder
    'Service': { title: "Service Form", type: "object", properties: {} }, // Placeholder
    'NGO': { title: "NGO Form", type: "object", properties: {} }, // Placeholder
};
// ---------------------------------------------------


// Define the interface for the component props
interface SchemaFormProps {
    schemaKey: SchemaKey; // Renamed 'schema' to 'schemaKey' for clarity
    setOutput: (element: ReactElement) => void; // Correctly type the setOutput function
}


export const SchemaForm = ({ schemaKey, setOutput }: SchemaFormProps) => {
    // Determine the current schema using the key
    const currentSchema = schemaMap[schemaKey];
    const [formData, setFormData] = useState<FormData>({});
    const [jsonLdOutput, setJsonLdOutput] = useState<string>('');

    // 1. Reactive JSON-LD calculation
    const calculatedJsonLd = useMemo(() => {
        return transformJSONLD(schemaKey, formData);
    }, [formData, schemaKey]); // Dependency on schemaKey ensures reset when switching tabs

    useEffect(() => {
        setJsonLdOutput(calculatedJsonLd);
        console.log(`Current Schema Key: ${schemaKey}`);

        // Check if formData has values
        const isFormEmpty = !formData ||
            (typeof formData === "object" && Object.keys(formData).length === 0);

        const preClass = `p-4 rounded text-sm overflow-auto ${isFormEmpty ? "inactive" : "active"}`;

            setOutput(
                <pre className={preClass + (!(calculatedJsonLd && !isFormEmpty )? " text-muted":"")}>
                &lt;script type="application/ld+json"&gt;
                    {calculatedJsonLd}
                    &lt;/script&gt;
            </pre>
            );

    }, [calculatedJsonLd, setOutput, schemaKey, formData]);



    const handleSubmit = ({ formData }: { formData: FormData }) => {
        // Form submission logic
    };

    return (
        <div>
            <h3 className={"heading-inner"}>Schema Details ({schemaKey})</h3>
            <Form
                schema={currentSchema}
                validator={validator}
                onSubmit={handleSubmit}
                onChange={({ formData }: { formData: FormData }) => setFormData(formData)}
            />
        </div>
    );
};