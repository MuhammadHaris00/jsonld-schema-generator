import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
import ReactDOMServer from 'react-dom/server';
import {type ReactElement, type SetStateAction, useEffect, useRef, useState} from "react";
import SchemaForm from "./components/SchemaForm.tsx";
import type {SchemaKey} from "./types/schema.ts";
import "bootstrap-icons/font/bootstrap-icons.css";

interface TabInterface {
    heading: string;
    description: string;
    active?: boolean;
    schemaKey: 'LocalBusiness' | 'Product' | 'FAQ' | 'Organization' | 'Article' | 'Service' | 'Person';
}

function App() {
    const schemaList = ['LocalBusiness', 'FAQ', 'Product', 'Service', 'Organization', 'Person'];
    const [currentSchema, setCurrentSchema] = useState<SchemaKey>(schemaList[0]);
    const [output, setOutput] = useState<ReactElement>();
    const copyBtn = useRef<HTMLButtonElement>(null);
    const [tabs, setTabs] = useState<TabInterface[]>([
        {
            heading: "Local Business",
            description: "Essential for local SEO and map listings",
            schemaKey: "LocalBusiness",
        },
        {
            heading: "FAQ Schema",
            description: "Get featured in AI-generated answers",
            schemaKey: "FAQ",
        },
        {
            heading: "Product Schema",
            description: "E-commerce & service product rich results",
            schemaKey: "Product"
        },
        {
            heading: "Service Schema",
            description: "Company knowledge graph presence",
            schemaKey: "Service"
        },
        {
            heading: "Organization",
            description: "Ideal for question-answer content",
            schemaKey: "Organization"
        },
        {
            heading: "Person/Author",
            description: "Establish expertise and authority",
            schemaKey: "Person"
        },
    ]);

    async function copyTextToClipboard(text:string) {
        try {
            await navigator.clipboard.writeText(text);
            // Optional: Provide user feedback, e.g., a temporary "Copied!" message
        } catch (err) {
            console.log("Cannot copy text from clipboard", err);
            // Optional: Inform the user about the failure
        }
    }

    useEffect(() => {
        tabs[0].active = true;
    }, []);


    function handleCopy() {
        if (copyBtn && copyBtn.current) {
            copyBtn.current.classList.add("active");
            copyBtn.current.innerHTML = "Copied";

            // Get the pre element content (escaped HTML)
            const preContent = ReactDOMServer.renderToStaticMarkup(output); // or output.innerHTML if you have a ref to the <pre>

            // Convert escaped HTML to real HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(preContent, "text/html");
            const unescapedHTML = doc.body.textContent || "";

            // Copy to clipboard
            copyTextToClipboard(unescapedHTML);

            setTimeout(() => {
                if (copyBtn.current) {
                    copyBtn.current.classList.remove("active");
                    copyBtn.current.innerHTML = "Copy Schema";
                }
            }, 1500);
        }
    }



function activateTab(index: number, schemaKey: SetStateAction<string>) {
        setTabs((prevTabs) =>
            prevTabs.map((tab, i) => ({
                ...tab,
                active: i === index, // Only activate the clicked one
            }))
        );
        setCurrentSchema(schemaKey);
    }

function getCurrentSchemaBestPractice(key: SchemaKey) {
        switch (key){
            case "LocalBusiness":
                return (
                    <div className={"local-business-practices"}>
                        <h4>FAQ Schema Best Practices:</h4>
                        <ul>
                            <li>Essential for appearing in AI search results and voice assistant responses</li>
                            <li>Answer common customer questions clearly and completely</li>
                            <li>Use natural language that matches how people actually ask questions</li>
                            <li>Keep answers concise but comprehensive (150-300 words optimal)</li>
                            <li>Critical for GEO - helps AI engines provide direct answers to user queries</li>
                        </ul>
                    </div>
                )
            case "FAQ":
                return (
                    <div className={"faq-practices"}>
                        <h4>FAQ Schema Best Practices:</h4>
                        <ul>
                            <li>Essential for appearing in AI search results and voice assistant responses</li>
                            <li>Answer common customer questions clearly and completely</li>
                            <li>Use natural language that matches how people actually ask questions</li>
                            <li>Keep answers concise but comprehensive (150-300 words optimal)</li>
                            <li>Critical for GEO - helps AI engines provide direct answers to user queries</li>
                        </ul>
                    </div>
                )
            case "Product":
                return (
                    <div className={"product-practices"}>
                        <h4>Product Schema Best Practices:</h4>
                        <ul>
                            <li>Essential for e-commerce and product visibility in AI search</li>
                            <li>Include brand, SKU, and pricing information for complete product data</li>
                            <li>Add ratings and reviews to build credibility and trust signals</li>
                            <li>Use specific product categories and detailed descriptions</li>
                            <li>Critical for GEO - helps AI engines understand and recommend products</li>
                        </ul>
                    </div>
                )
            case "Service":
                return (
                    <div className={"service-practices"}>
                        <h4>Service Schema Best Practices:</h4>
                        <ul>
                            <li>Essential for service-based businesses to appear in AI search results</li>
                            <li>Include provider information, service area, and contact details</li>
                            <li>Add pricing, ratings, and service descriptions for better visibility</li>
                            <li>Use specific service types (ProfessionalService vs Service)</li>
                            <li>Critical for GEO - helps AI engines understand and recommend services</li>
                        </ul>
                    </div>
                )
            case "Organization":
                return (
                    <div className={"organization-practices"}>
                        <h4>Organization Schema Best Practices:</h4>
                        <ul>
                            <li>Essential for establishing business entity authority in AI systems</li>
                            <li>Include founding date, legal identifiers, and contact information</li>
                            <li>Connect to social profiles and founder information for credibility</li>
                            <li>Use specific organization types (Corporation vs Organization)</li>
                            <li>Critical for GEO - helps AI engines validate your business legitimacy</li>
                        </ul>
                    </div>
                )
            case "Person":
                return (
                    <div className={"person-practices"}>
                        <h4>Person Schema for E-A-T Authority:</h4>
                        <ul>
                            <li>Essential for building expertise and authoritativeness (E-A-T) in AI systems</li>
                            <li>Include professional credentials, education, and awards for credibility</li>
                            <li>Connect to social profiles and professional websites for entity validation</li>
                            <li>Use for authors of blog content, company leadership, and expert contributors</li>
                            <li>Critical for GEO - helps AI engines identify you as a citation-worthy expert</li>
                        </ul>
                    </div>
                )
            default:
                return <></>
        }
}

function getImplementation(key:SchemaKey){
        switch (key) {
            case "LocalBusiness":
                return (
                    <div className={"implementation-local-business"}>
                        <p><strong>Implementation:</strong> Add this JSON-LD schema to your website's homepage inside a &lt;script type='application/ld+json'&gt; tag in the &lt;head&gt; section.</p>
                    </div>
                )
            case "FAQ":
                return (
                    <div className={"implementation-faq"}>
                        <p><strong>Implementation:</strong> FAQ schema helps your content appear in AI search results and voice assistant responses. Add this to FAQ pages, service pages, and knowledge base articles.</p>
                    </div>
                )
            case "Product":
                return (
                    <div className={"implementation-product"}>
                        <p><strong>Implementation:</strong> Product schema enhances product visibility in AI search results and shopping engines. Essential for e-commerce pages and product listings.</p>
                    </div>
                )
            case "Service":
                return (
                    <div className={"implementation-service"}>
                        <p><strong>Implementation:</strong> Service schema increases visibility for service-based businesses in AI search results and voice assistants. Essential for service pages and business listings.</p>
                    </div>
                )
            case "Organization":
                return (
                    <div className={"implementation-organization"}>
                        <p><strong>Implementation:</strong> Organization schema establishes business entity credibility in AI knowledge graphs. Essential for company pages, about sections, and business validation.</p>
                    </div>
                )
            case "Person":
                return (
                    <div className={"implementation-person"}>
                        <p><strong>Implementation:</strong> Person schema is crucial for establishing individual expertise in AI knowledge graphs. Use this for company leaders, content authors, and expert contributors to build citation-worthy authority.</p>
                    </div>
                )
        }
}

    return (
        <>
            <Container className="schema-generator py-5">
                <Row className="section ">
                    <Col className="d-flex flex-column align-items-center">
                        <h4 className="section-heading">
                            Choose Your <span className="hi-light">Schema Type</span>
                        </h4>
                        <p className="section description">
                            Select the appropriate schema markup for your AEO-GEO strategy
                        </p>
                    </Col>
                </Row>

                <Row className="section section-tabs ">
                    {tabs.map((tab, index) => (
                        <Col
                            key={tab.schemaKey}
                            className={`tab text-center blur-bg ${
                                tab.active ? "tab-active" : ""
                            }`}
                            onClick={() => activateTab(index, tab.schemaKey)}
                        >
                            <h5 className="tab-heading">{tab.heading}</h5>
                            <small className="tab-desc d-block">{tab.description}</small>
                        </Col>
                    ))}
                </Row>

                <Row className="section form-section-heading ">
                    <Col className="d-flex flex-column align-items-center mb-4">
                        <h4 className="section-heading">
                            Choose Your <span className="hi-light">Schema Type</span>
                        </h4>
                        <p className="section description">
                            Select the appropriate schema markup for your AEO-GEO strategy
                        </p>
                    </Col>
                </Row>

                <Row className="section form-section">
                    <Col lg={6} className={"form-container blur-bg"}>
                        <h3 className={"heading-inner"}>Schema Details</h3>
                        <SchemaForm schemaKey={currentSchema} setOutput={setOutput} />
                        <div className={"best-practices"}>
                            {getCurrentSchemaBestPractice(currentSchema)}
                        </div>
                    </Col>
                    <Col lg={6} className={"preview-container blur-bg"}>
                        <div className={'preview-header mb-4'}>
                            <h3 className={"heading-inner w-50"}>Live JSON Preview</h3>
                            <button className={"copy-schema-btn"} ref={copyBtn} onClick={handleCopy}>
                                Copy Schema
                            </button>
                        </div>
                        {output}
                        <div className={"implementations"}>
                            {getImplementation(currentSchema)}
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default App;
