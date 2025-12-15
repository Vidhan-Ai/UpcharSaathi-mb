'use client'

import { Container, Row, Col, Card, Form, Accordion } from "react-bootstrap"
import { Search } from "lucide-react"

const firstAidGuides = [
  {
    id: "cpr",
    title: "Instant CPR Protocols",
    description: "Emergency lifesaving procedure for cardiac arrest",
    steps: [
      "Check the scene for safety and check for responsiveness.",
      "Call 112 (or local emergency number) immediately if there is no response.",
      "Check for breathing. If not breathing or only gasping, start CPR.",
      "Place the heel of one hand on the center of the chest, place other hand on top.",
      "Push hard and fast (100-120 compressions per minute) at least 2 inches deep.",
      "Allow the chest to recoil completely between compressions.",
      "Continue compressions until help arrives or the person starts breathing.",
    ],
    warning:
      "If you are not trained in rescue breaths, perform hands-only CPR. Do not stop unless you are too exhausted to continue or help arrives.",
  },
  {
    id: "trauma",
    title: "Trauma Management",
    description: "Immediate actions for severe injuries, bleeding, and shock",
    steps: [
      "Ensure your own safety first. Call 112 immediately.",
      "Stop severe bleeding by applying direct pressure with a clean cloth.",
      "Keep the person warm and comfortable to prevent shock.",
      "Do not move the person unless they are in immediate danger.",
      "If spinal injury is suspected, keep the head and neck completely still.",
      "Monitor breathing and consciousness until help arrives.",
    ],
    warning:
      "Do not remove objects impaled in the body. Do not give the person anything to eat or drink.",
  },
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
    <div className="min-vh-100 py-5" style={{ background: '#0f172a' }}>
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
          <p className="fs-5 text-white-50">Quick reference for common medical emergencies and conditions</p>
        </div>

        <div className="mb-4 position-relative" style={{ background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '1rem', padding: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)' }}>
          <Search className="position-absolute" style={{ left: '1.75rem', top: '50%', transform: 'translateY(-50%)', color: '#ef4444' }} size={16} />
          <Form.Control
            placeholder="Search for first aid instructions..."
            className="ps-5 text-white"
            style={{
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.2)',
              color: 'white'
            }}
          />
        </div>

        <Row className="g-4">
          {/* Emergency Hotlines */}
          <Col lg={12}>
            <Card style={{ background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)' }} className="text-white">
              <Card.Body>
                <h5 className="fw-bold mb-4" style={headerGradient}>Emergency Hotlines</h5>
                <Row className="g-3">
                  <Col md={3} sm={6}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '0.5rem', padding: '1.5rem' }} className="text-center h-100">
                      <h6 className="text-danger fw-bold">National Emergency</h6>
                      <p className="display-6 text-white fw-bold mt-2 mb-0">112</p>
                      <small className="text-white-50">All-in-one Emergency</small>
                    </div>
                  </Col>
                  <Col md={3} sm={6}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '0.5rem', padding: '1.5rem' }} className="text-center h-100">
                      <h6 className="text-primary fw-bold">Police</h6>
                      <p className="display-6 text-white fw-bold mt-2 mb-0">100</p>
                      <small className="text-white-50">Police Assistance</small>
                    </div>
                  </Col>
                  <Col md={3} sm={6}>
                    <div style={{ background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)', borderRadius: '0.5rem', padding: '1.5rem' }} className="text-center h-100">
                      <h6 className="fw-bold" style={{ color: '#f97316' }}>Fire</h6>
                      <p className="display-6 text-white fw-bold mt-2 mb-0">101</p>
                      <small className="text-white-50">Fire Brigade</small>
                    </div>
                  </Col>
                  <Col md={3} sm={6}>
                    <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: '0.5rem', padding: '1.5rem' }} className="text-center h-100">
                      <h6 className="text-success fw-bold">Ambulance</h6>
                      <p className="display-6 text-white fw-bold mt-2 mb-0">102</p>
                      <small className="text-white-50">Medical Emergency</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* First Aid Procedures */}
          <Col lg={12}>
            <Card style={{ background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)' }} className="text-white">
              <Card.Body>
                <h5 className="fw-bold mb-2" style={headerGradient}>Common First Aid Procedures</h5>
                <p className="text-white-50 mb-4">Step-by-step guides for handling common injuries and conditions</p>

                <Accordion className="accordion-flush">
                  {firstAidGuides.map((guide, index) => (
                    <Accordion.Item eventKey={guide.id} key={guide.id} className="mb-3 rounded overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'transparent' }}>
                      <Accordion.Header>
                        <div>
                          <h6 className="fw-bold text-white mb-1">{guide.title}</h6>
                          <small className="text-white-50">{guide.description}</small>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body style={{ background: 'rgba(0,0,0,0.2)', color: '#cbd5e1' }}>
                        <div className="mb-3">
                          <h6 className="fw-bold text-danger mb-2">Steps</h6>
                          <ol style={{ paddingLeft: '1.5rem' }}>
                            {guide.steps.map((step, idx) => (
                              <li key={idx} className="mb-2">{step}</li>
                            ))}
                          </ol>
                        </div>
                        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '0.5rem', padding: '1rem' }}>
                          <h6 className="fw-bold text-warning mb-2">Warning</h6>
                          <p className="text-white-50 mb-0">{guide.warning}</p>
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
        .accordion-button {
          background-color: rgba(255, 255, 255, 0.05);
          color: white;
        }
        .accordion-button:not(.collapsed) {
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          box-shadow: none;
        }
        .accordion-button:focus {
          box-shadow: none;
          border-color: rgba(255, 255, 255, 0.1);
        }
        .accordion-button::after {
            filter: invert(1);
        }
        .accordion-button:not(.collapsed)::after {
            filter: invert(1) sepia(1) saturate(5) hue-rotate(-50deg);
        }
        /* Fix search input placeholder color */
        ::placeholder {
            color: rgba(255, 255, 255, 0.5) !important;
        }
      `}</style>
    </div>
  )
}
