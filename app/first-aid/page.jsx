'use client'

import { Container, Row, Col, Card, Form, Accordion } from "react-bootstrap"
import { Search } from "lucide-react"

const firstAidGuides = [
  {
    id: "cuts",
    title: "Cuts and Scrapes",
    description: "How to treat minor cuts and scrapes",
    steps: [
      "Clean your hands with soap and water",
      "Stop the bleeding by applying gentle pressure with a clean cloth or bandage",
      "Clean the wound with clean water. Avoid using soap on the wound itself",
      "Apply an antibiotic ointment to prevent infection",
      "Cover the wound with a sterile bandage",
      "Change the dressing at least once a day or whenever it gets wet or dirty",
    ],
    warning:
      "Seek medical attention if the cut is deep, bleeding heavily, or shows signs of infection (redness, swelling, warmth, or pus).",
  },
  {
    id: "burns",
    title: "Minor Burns",
    description: "First aid for first-degree and small second-degree burns",
    steps: [
      "Cool the burn by holding it under cool (not cold) running water for 10 to 15 minutes",
      "Don't apply ice directly to the burn as it can damage the tissue",
      "Apply a gentle moisturizer or aloe vera gel to the area",
      "Take an over-the-counter pain reliever if needed",
      "Cover the burn with a sterile, non-stick bandage",
      "Don't break blisters as this increases the risk of infection",
    ],
    warning:
      "Seek medical attention for burns that are larger than 3 inches in diameter, on the face, hands, feet, genitals, or major joints, or if the burn appears white, charred, or leathery.",
  },
  {
    id: "sprains",
    title: "Sprains and Strains",
    description: "How to manage joint and muscle injuries",
    steps: [
      "Rest the injured area to prevent further damage",
      "Apply ice wrapped in a thin cloth for 20 minutes several times a day",
      "Compress the area with an elastic bandage to reduce swelling",
      "Elevate the injured limb above the level of your heart when possible",
      "Take over-the-counter pain relievers as needed",
      "After 48 hours, gentle heat can be applied to increase blood flow and healing",
    ],
    warning:
      "Seek medical attention if you cannot bear weight on the injured joint, if there is significant swelling or bruising, or if the pain is severe.",
  },
  {
    id: "choking",
    title: "Choking",
    description: "Emergency steps for choking victims",
    steps: [
      "Encourage the person to cough forcefully if they can",
      "If the person cannot cough, speak, or breathe, stand behind them and wrap your arms around their waist",
      "Make a fist with one hand and place it just above the person's navel",
      "Grasp your fist with your other hand and press hard into the abdomen with a quick, upward thrust",
      "Repeat thrusts until the object is expelled or the person becomes unconscious",
      "If the person becomes unconscious, lower them to the ground and begin CPR if trained",
    ],
    warning: "Call emergency services (112) immediately for any choking incident, even if the obstruction is removed.",
  },
  {
    id: "headache",
    title: "Headache",
    description: "Managing different types of headaches",
    steps: [
      "Rest in a quiet, dark room",
      "Apply a cold or warm compress to your head or neck",
      "Take over-the-counter pain relievers as directed",
      "Stay hydrated by drinking water",
      "Practice relaxation techniques such as deep breathing or meditation",
      "Massage your temples, neck, and scalp to relieve tension",
    ],
    warning:
      "Seek immediate medical attention for sudden, severe headaches, headaches accompanied by fever, stiff neck, confusion, seizures, double vision, weakness, numbness, or difficulty speaking.",
  },
  {
    id: "fever",
    title: "Fever",
    description: "How to manage and reduce fever",
    steps: [
      "Rest and drink plenty of fluids to prevent dehydration",
      "Take over-the-counter fever reducers like acetaminophen or ibuprofen as directed",
      "Dress in lightweight clothing and use a light blanket if you feel cold",
      "Take a lukewarm bath or apply a cool, damp washcloth to your forehead",
      "Monitor your temperature regularly",
      "Avoid alcohol and caffeine as they can contribute to dehydration",
    ],
    warning:
      "Seek medical attention for fevers above 103°F (39.4°C), fevers lasting more than three days, or if accompanied by severe headache, stiff neck, confusion, or difficulty breathing.",
  },
]

export default function FirstAidPage() {
  const headerGradient = {
    background: 'linear-gradient(to right, #dc2626, #fb7185)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }

  return (
    <div className="min-vh-100 py-5" style={{ background: 'linear-gradient(to right, #fef2f2, #ffe4e6, #fef2f2)' }}>
      <Container>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-4" style={headerGradient}>
            First Aid Guide
          </h1>
          <div style={{
            width: '128px',
            height: '4px',
            background: 'linear-gradient(to right, #dc2626, #fb7185)',
            margin: '1rem auto',
            borderRadius: '2px'
          }} />
          <p className="fs-5 text-muted">Quick reference for common medical emergencies and conditions</p>
        </div>

        <div className="mb-4 position-relative" style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: '1rem', padding: '1rem', boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.1)' }}>
          <Search className="position-absolute" style={{ left: '1.75rem', top: '50%', transform: 'translateY(-50%)', color: '#dc2626' }} size={16} />
          <Form.Control
            placeholder="Search for first aid instructions..."
            className="ps-5 bg-light text-dark border-light"
            style={{ border: '1px solid #fecaca' }}
          />
        </div>

        <Row className="g-4">
          {/* Emergency Contacts */}
          <Col lg={12}>
            <Card style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.1)' }} className="text-dark">
              <Card.Body>
                <h5 className="fw-bold mb-4" style={headerGradient}>Emergency Contacts</h5>
                <Row className="g-3">
                  <Col md={6}>
                    <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '0.5rem', padding: '1.5rem' }} className="text-center">
                      <h6 className="text-danger fw-bold">Emergency Services</h6>
                      <p className="display-6 text-dark fw-bold mt-2">112</p>
                      <small className="text-muted">For life-threatening emergencies</small>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.5rem', padding: '1.5rem' }} className="text-center">
                      <h6 className="text-danger fw-bold">Poison Control</h6>
                      <p className="display-6 text-dark fw-bold mt-2">1800-222-1222</p>
                      <small className="text-muted">For poison emergencies</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* First Aid Procedures */}
          <Col lg={12}>
            <Card style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(220, 38, 38, 0.1)' }} className="text-dark">
              <Card.Body>
                <h5 className="fw-bold mb-2" style={headerGradient}>Common First Aid Procedures</h5>
                <p className="text-muted mb-4">Step-by-step guides for handling common injuries and conditions</p>

                <Accordion className="accordion-flush">
                  {firstAidGuides.map((guide, index) => (
                    <Accordion.Item eventKey={guide.id} key={guide.id} className="mb-3 border rounded overflow-hidden">
                      <Accordion.Header>
                        <div>
                          <h6 className="fw-bold text-dark mb-1">{guide.title}</h6>
                          <small className="text-muted">{guide.description}</small>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="bg-light">
                        <div className="mb-3">
                          <h6 className="fw-bold text-danger mb-2">Steps</h6>
                          <ol style={{ paddingLeft: '1.5rem' }}>
                            {guide.steps.map((step, idx) => (
                              <li key={idx} className="text-dark mb-2">{step}</li>
                            ))}
                          </ol>
                        </div>
                        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '0.5rem', padding: '1rem' }}>
                          <h6 className="fw-bold text-warning mb-2" style={{ color: '#d97706' }}>Warning</h6>
                          <p className="text-muted mb-0">{guide.warning}</p>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <style jsx global>{`
        .accordion-button:not(.collapsed) {
          background-color: rgba(220, 38, 38, 0.05);
          color: #dc2626;
        }
        .accordion-button:focus {
          box-shadow: none;
          border-color: rgba(220, 38, 38, 0.1);
        }
      `}</style>
    </div>
  )
}
