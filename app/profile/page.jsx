'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Tabs,
    Tab,
    Badge,
    ListGroup,
    Alert,
    Modal,
    InputGroup
} from 'react-bootstrap'
import {
    User,
    MapPin,
    ShoppingBag,
    FileText,
    Calendar,
    Settings,
    LogOut,
    Plus,
    Trash2,
    Edit2,
    Shield,
    Bell,
    Key
} from 'lucide-react'

export default function ProfilePage() {
    const { user, isAuthenticated, logout, getMedicalRecords, deleteMedicalRecord, addMedicalRecord } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const tabFromUrl = searchParams.get('tab')

    const [activeTab, setActiveTab] = useState('personal')
    const [isEditing, setIsEditing] = useState(false)
    const [medicalRecords, setMedicalRecords] = useState([])
    const [showAddRecordModal, setShowAddRecordModal] = useState(false)
    const [newRecordData, setNewRecordData] = useState({
        disease: '',
        description: '',
        symptoms: ''
    })

    // Mock Data & State
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        bloodGroup: ''
    })

    const [addresses, setAddresses] = useState([
        {
            id: 1,
            type: 'Home',
            address: '123 Main St, Apartment 4B',
            city: 'New Delhi',
            state: 'Delhi',
            zip: '110001',
            isDefault: true
        }
    ])

    const [orders, setOrders] = useState([
        {
            id: 'ORD-2023-001',
            date: '2023-10-15',
            total: 1250,
            status: 'Delivered',
            items: ['Paracetamol', 'Vitamin C', 'Cough Syrup']
        },
        {
            id: 'ORD-2023-002',
            date: '2023-11-02',
            total: 850,
            status: 'Processing',
            items: ['Bandages', 'Antiseptic Cream']
        }
    ])

    const [appointments, setAppointments] = useState([
        {
            id: 1,
            doctor: 'Dr. Sharma',
            specialty: 'Cardiologist',
            date: '2023-11-20',
            time: '10:00 AM',
            status: 'Upcoming'
        },
        {
            id: 2,
            doctor: 'Dr. Gupta',
            specialty: 'Dermatologist',
            date: '2023-10-05',
            time: '02:30 PM',
            status: 'Completed'
        }
    ])

    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        twoFactor: false
    })

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=/profile')
        } else if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                dob: user.dob || '',
                gender: user.gender || '',
                bloodGroup: user.bloodGroup || ''
            })
            setMedicalRecords(getMedicalRecords())
        }
    }, [isAuthenticated, user, router, getMedicalRecords])

    useEffect(() => {
        if (tabFromUrl) {
            setActiveTab(tabFromUrl)
        }
    }, [tabFromUrl])

    const handleProfileUpdate = (e) => {
        e.preventDefault()
        // API call to update profile would go here
        setIsEditing(false)
        alert('Profile updated successfully!')
    }

    const handleDeleteRecord = (id) => {
        if (confirm('Are you sure you want to delete this record?')) {
            deleteMedicalRecord(id)
            setMedicalRecords(getMedicalRecords())
        }
    }

    const handleAddRecord = (e) => {
        e.preventDefault()
        const symptomsList = newRecordData.symptoms.split(',').map(s => s.trim()).filter(s => s)

        const record = {
            disease: newRecordData.disease,
            description: newRecordData.description,
            symptoms: symptomsList,
        }

        addMedicalRecord(record)
        setMedicalRecords(getMedicalRecords())
        setShowAddRecordModal(false)
        setNewRecordData({
            disease: '',
            description: '',
            symptoms: ''
        })
    }

    if (!isAuthenticated) return null

    return (
        <Container className="py-5">
            <Row>
                {/* Sidebar */}
                <Col md={3} className="mb-4">
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="mb-3">
                                <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                            <h5 className="card-title mb-1">{user?.name}</h5>
                            <p className="text-muted small mb-3">{user?.email}</p>
                            <Button variant="outline-danger" size="sm" onClick={logout} className="w-100">
                                <LogOut size={16} className="me-2" /> Logout
                            </Button>
                        </Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item action active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} className="border-0">
                                <User size={18} className="me-2" /> Personal Info
                            </ListGroup.Item>
                            <ListGroup.Item action active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} className="border-0">
                                <MapPin size={18} className="me-2" /> Addresses
                            </ListGroup.Item>
                            <ListGroup.Item action active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} className="border-0">
                                <ShoppingBag size={18} className="me-2" /> Order History
                            </ListGroup.Item>
                            <ListGroup.Item action active={activeTab === 'medical'} onClick={() => setActiveTab('medical')} className="border-0">
                                <FileText size={18} className="me-2" /> Medical Records
                            </ListGroup.Item>
                            <ListGroup.Item action active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} className="border-0">
                                <Calendar size={18} className="me-2" /> Appointments
                            </ListGroup.Item>
                            <ListGroup.Item action active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} className="border-0">
                                <Settings size={18} className="me-2" /> Settings
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>

                {/* Main Content */}
                <Col md={9}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            {activeTab === 'personal' && (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="mb-0">Personal Information</h4>
                                        <Button variant={isEditing ? "secondary" : "primary"} size="sm" onClick={() => setIsEditing(!isEditing)}>
                                            {isEditing ? 'Cancel' : <><Edit2 size={16} className="me-2" /> Edit Profile</>}
                                        </Button>
                                    </div>
                                    <Form onSubmit={handleProfileUpdate}>
                                        <Row>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Full Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={profileData.name}
                                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                        disabled={!isEditing}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        value={profileData.email}
                                                        disabled
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Phone Number</Form.Label>
                                                    <Form.Control
                                                        type="tel"
                                                        value={profileData.phone}
                                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                        disabled={!isEditing}
                                                        placeholder="+91 98765 43210"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Date of Birth</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        value={profileData.dob}
                                                        onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                                                        disabled={!isEditing}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Gender</Form.Label>
                                                    <Form.Select
                                                        value={profileData.gender}
                                                        onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                                        disabled={!isEditing}
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Blood Group</Form.Label>
                                                    <Form.Select
                                                        value={profileData.bloodGroup}
                                                        onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })}
                                                        disabled={!isEditing}
                                                    >
                                                        <option value="">Select Blood Group</option>
                                                        <option value="A+">A+</option>
                                                        <option value="A-">A-</option>
                                                        <option value="B+">B+</option>
                                                        <option value="B-">B-</option>
                                                        <option value="AB+">AB+</option>
                                                        <option value="AB-">AB-</option>
                                                        <option value="O+">O+</option>
                                                        <option value="O-">O-</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        {isEditing && (
                                            <div className="text-end">
                                                <Button type="submit" variant="success">Save Changes</Button>
                                            </div>
                                        )}
                                    </Form>
                                </div>
                            )}

                            {activeTab === 'addresses' && (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="mb-0">Saved Addresses</h4>
                                        <Button variant="primary" size="sm">
                                            <Plus size={16} className="me-2" /> Add New Address
                                        </Button>
                                    </div>
                                    {addresses.map(addr => (
                                        <Card key={addr.id} className="mb-3 border">
                                            <Card.Body>
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <Badge bg="secondary" className="mb-2">{addr.type}</Badge>
                                                        {addr.isDefault && <Badge bg="success" className="ms-2 mb-2">Default</Badge>}
                                                        <p className="mb-1">{addr.address}</p>
                                                        <p className="mb-0 text-muted">{addr.city}, {addr.state} - {addr.zip}</p>
                                                    </div>
                                                    <div>
                                                        <Button variant="link" className="text-primary p-0 me-3">Edit</Button>
                                                        <Button variant="link" className="text-danger p-0">Delete</Button>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div>
                                    <h4 className="mb-4">Order History</h4>
                                    {orders.map(order => (
                                        <Card key={order.id} className="mb-3 border">
                                            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                                                <div>
                                                    <span className="fw-bold me-3">{order.id}</span>
                                                    <span className="text-muted small">{order.date}</span>
                                                </div>
                                                <Badge bg={order.status === 'Delivered' ? 'success' : 'warning'}>{order.status}</Badge>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={8}>
                                                        <p className="mb-1 text-muted small">Items:</p>
                                                        <p className="mb-0">{order.items.join(', ')}</p>
                                                    </Col>
                                                    <Col md={4} className="text-end">
                                                        <p className="mb-1 text-muted small">Total Amount:</p>
                                                        <h5 className="mb-0">₹{order.total}</h5>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                            <Card.Footer className="bg-white text-end">
                                                <Button variant="outline-primary" size="sm">View Details</Button>
                                            </Card.Footer>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'medical' && (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="mb-0">Medical Records</h4>
                                        <div className="d-flex gap-2">
                                            <Button variant="outline-primary" size="sm" onClick={() => setShowAddRecordModal(true)}>
                                                <Plus size={16} className="me-2" /> Add Record
                                            </Button>
                                        </div>
                                    </div>
                                    {medicalRecords.length === 0 ? (
                                        <Alert variant="info">No medical records found. Add a new record manually.</Alert>
                                    ) : (
                                        medicalRecords.map((record) => (
                                            <Card key={record.id} className="mb-3 border">
                                                <Card.Body>
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <h5 className="mb-1">{record.disease || 'Unknown Condition'}</h5>
                                                            <p className="text-muted small mb-2">
                                                                {new Date(record.timestamp).toLocaleDateString()} at {new Date(record.timestamp).toLocaleTimeString()}
                                                            </p>
                                                            <div className="mb-2">
                                                                {record.symptoms?.map((symptom, idx) => (
                                                                    <Badge key={idx} bg="light" text="dark" className="me-1 border">{symptom}</Badge>
                                                                ))}
                                                            </div>
                                                            {record.description && <p className="small mb-0">{record.description}</p>}
                                                        </div>
                                                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteRecord(record.id)}>
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'appointments' && (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className="mb-0">My Appointments</h4>
                                        <Button variant="primary" size="sm">
                                            <Plus size={16} className="me-2" /> Book Appointment
                                        </Button>
                                    </div>
                                    {appointments.map(appt => (
                                        <Card key={appt.id} className="mb-3 border">
                                            <Card.Body>
                                                <Row className="align-items-center">
                                                    <Col md={2} className="text-center">
                                                        <div className="bg-light rounded p-2">
                                                            <h4 className="mb-0 text-primary">{appt.date.split('-')[2]}</h4>
                                                            <small className="text-uppercase">{new Date(appt.date).toLocaleString('default', { month: 'short' })}</small>
                                                        </div>
                                                    </Col>
                                                    <Col md={7}>
                                                        <h5 className="mb-1">{appt.doctor}</h5>
                                                        <p className="text-muted mb-1">{appt.specialty}</p>
                                                        <p className="mb-0 small"><Calendar size={14} className="me-1" /> {appt.time}</p>
                                                    </Col>
                                                    <Col md={3} className="text-end">
                                                        <Badge bg={appt.status === 'Upcoming' ? 'primary' : 'secondary'} className="mb-2">{appt.status}</Badge>
                                                        <br />
                                                        {appt.status === 'Upcoming' && (
                                                            <Button variant="outline-danger" size="sm">Cancel</Button>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div>
                                    <h4 className="mb-4">Account Settings</h4>

                                    <h6 className="mb-3"><Bell size={18} className="me-2" /> Notifications</h6>
                                    <Card className="mb-4 border">
                                        <Card.Body>
                                            <Form.Check
                                                type="switch"
                                                id="email-notif"
                                                label="Email Notifications"
                                                checked={settings.emailNotifications}
                                                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                                className="mb-3"
                                            />
                                            <Form.Check
                                                type="switch"
                                                id="sms-notif"
                                                label="SMS Notifications"
                                                checked={settings.smsNotifications}
                                                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                                            />
                                        </Card.Body>
                                    </Card>

                                    <h6 className="mb-3"><Shield size={18} className="me-2" /> Security</h6>
                                    <Card className="mb-4 border">
                                        <Card.Body>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <div>
                                                    <p className="mb-0 fw-bold">Change Password</p>
                                                    <p className="text-muted small mb-0">Update your password regularly to keep your account secure</p>
                                                </div>
                                                <Button variant="outline-primary" size="sm">Update</Button>
                                            </div>
                                            <hr />
                                            <Form.Check
                                                type="switch"
                                                id="2fa"
                                                label="Two-Factor Authentication"
                                                checked={settings.twoFactor}
                                                onChange={(e) => setSettings({ ...settings, twoFactor: e.target.checked })}
                                            />
                                        </Card.Body>
                                    </Card>

                                    <div className="text-end">
                                        <Button variant="danger">Delete Account</Button>
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Add Medical Record Modal */}
            <Modal show={showAddRecordModal} onHide={() => setShowAddRecordModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Medical Record</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddRecord}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Condition / Disease</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Viral Fever"
                                value={newRecordData.disease}
                                onChange={(e) => setNewRecordData({ ...newRecordData, disease: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Symptoms (comma separated)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Headache, Fever, Chills"
                                value={newRecordData.symptoms}
                                onChange={(e) => setNewRecordData({ ...newRecordData, symptoms: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description / Notes</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={newRecordData.description}
                                onChange={(e) => setNewRecordData({ ...newRecordData, description: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddRecordModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Record
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container >
    )
}
