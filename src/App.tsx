import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
import {type ReactElement, useState} from "react";
import {SchemaForm} from "./components/SchemaForm.tsx";

interface TabInterface {
    heading: string;
    description: string;
    active?: boolean;
}

function App() {
    const currentSchema = 'Person';
    const [output,setOutput] = useState<ReactElement>();
    const [tabs, setTabs] = useState<TabInterface[]>([
        {
            heading: "Local Business",
            description: "Essential for local SEO and map listings",
        },
        {
            heading: "Product",
            description: "Great for eCommerce and product-rich snippets",
        },
        {
            heading: "Event",
            description: "Used for marking up events and schedules",
        },
        {
            heading: "Article",
            description: "Helps improve content SEO for blogs and news",
        },
        {
            heading: "FAQ",
            description: "Ideal for question-answer content",
        },
        {
            heading: "How-To",
            description: "Enhances instructional content with step data",
        },
    ]);

    function activateTab(index: number) {
        setTabs((prevTabs) =>
            prevTabs.map((tab, i) => ({
                ...tab,
                active: i === index, // Only activate the clicked one
            }))
        );
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
                            key={index}
                            className={`tab text-center blur-bg ${
                                tab.active ? "tab-active" : ""
                            }`}
                            onClick={() => activateTab(index)}
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
                    </Col>
                    <Col lg={6} className={"preview-container blur-bg"}>
                        <h3 className={"heading-inner"}>Live JSON Preview</h3>
                        {output}
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default App;
