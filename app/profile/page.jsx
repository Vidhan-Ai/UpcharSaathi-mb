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
    Badge,
    Modal,
    ProgressBar
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
    Key,
    ChevronRight,
    Activity,
    Clock,
    CheckCircle,
    Brain, // Imported Brain
    AlertTriangle
} from 'lucide-react'
import { AccountSettings } from "@stackframe/stack";
import { getAssessmentHistory, deleteAssessmentResult } from '@/app/actions/mental-health'
import { getHealthScreeningHistory, deleteHealthScreening } from '@/app/actions/health-scanner'
import Tesseract from 'tesseract.js'

export default function ProfilePage() {
    const { user, isAuthenticated, loading, logout, getMedicalRecords, deleteMedicalRecord, addMedicalRecord, updateProfile } = useAuth()
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
    const [assessmentHistory, setAssessmentHistory] = useState([])
    const [screeningHistory, setScreeningHistory] = useState([])
    const [isProcessingOcr, setIsProcessingOcr] = useState(false)

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



    useEffect(() => {
        if (loading) return;

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
    }, [isAuthenticated, user, router, getMedicalRecords, loading])

    useEffect(() => {
        if (tabFromUrl) {
            setActiveTab(tabFromUrl)
        }
    }, [tabFromUrl])

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        try {
            await updateProfile(profileData);
            setIsEditing(false)
            alert('Profile updated successfully!')
        } catch (error) {
            console.error("Failed to update profile", error);
            alert('Failed to update profile');
        }
    }


    useEffect(() => {
        if (activeTab === 'assessments' && user) {
            getAssessmentHistory().then(setAssessmentHistory);
        }
        if (activeTab === 'screenings' && user) {
            getHealthScreeningHistory().then(setScreeningHistory);
        }
    }, [activeTab, user]);

    const handleDeleteRecord = (id) => {
        if (confirm('Are you sure you want to delete this record?')) {
            deleteMedicalRecord(id)
            setMedicalRecords(getMedicalRecords())
        }
    }

    const handleDeleteAssessment = async (id) => {
        if (confirm('Delete this assessment result?')) {
            await deleteAssessmentResult(id)
            setAssessmentHistory(prev => prev.filter(a => a.id !== id))
        }
    }

    const handleDeleteScreening = async (id) => {
        if (confirm('Delete this screening report?')) {
            await deleteHealthScreening(id)
            setScreeningHistory(prev => prev.filter(s => s.id !== id))
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

    if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border text-primary" role="status"></div></div>
    if (!isAuthenticated) return null

    const menuItems = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'medical', label: 'Medical Records', icon: FileText },
        { id: 'assessments', label: 'Past Assessments', icon: Brain },
        { id: 'screenings', label: 'Health Screenings', icon: Activity },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsProcessingOcr(true);
            Tesseract.recognize(
                file,
                'eng',
                { logger: m => console.log(m) }
            ).then(({ data: { text } }) => {
                setNewRecordData(prev => ({ ...prev, description: prev.description ? prev.description + '\n\nExtracted Text:\n' + text : text }));
                setIsProcessingOcr(false);
            }).catch(err => {
                console.error(err);
                setIsProcessingOcr(false);
                alert("Failed to read file.");
            });
        }
    };

    return (
        <div className="profile-page-wrapper">
            <Container className="py-5">
                <Row className="g-4">
                    {/* Sidebar */}
                    <Col lg={3}>
                        <div className="profile-sidebar sticky-top" style={{ top: '100px', zIndex: 100 }}>
                            {/* User Profile Card */}
                            <Card className="border-0 shadow-sm mb-4 overflow-hidden profile-card">
                                <div className="profile-header-bg"></div>
                                <Card.Body className="text-center position-relative pt-0">
                                    <div className="profile-avatar-wrapper mx-auto mb-3">
                                        <div className="profile-avatar">
                                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    </div>
                                    <h5 className="fw-bold mb-1">{user?.name}</h5>
                                    <p className="text-muted small mb-3">{user?.email}</p>
                                    <div className="d-flex justify-content-center gap-2 mb-3">
                                        <Badge bg="light" text="dark" className="border">
                                            {user?.bloodGroup || 'Blood Group N/A'}
                                        </Badge>
                                        <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25">
                                            Verified Patient
                                        </Badge>
                                    </div>
                                </Card.Body>
                            </Card>

                            {/* Navigation Menu */}
                            <Card className="border-0 shadow-sm navigation-card">
                                <Card.Body className="p-2">
                                    <div className="d-flex flex-column gap-1">
                                        {menuItems.map((item) => {
                                            const Icon = item.icon
                                            const isActive = activeTab === item.id
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => {
                                                        setActiveTab(item.id);
                                                        router.push(`/profile?tab=${item.id}`);
                                                    }}
                                                    className={`nav-item-btn ${isActive ? 'active' : ''}`}
                                                >
                                                    <Icon size={18} className="nav-icon" />
                                                    <span>{item.label}</span>
                                                    {isActive && <ChevronRight size={16} className="ms-auto" />}
                                                </button>
                                            )
                                        })}
                                        <hr className="my-2 text-muted opacity-25" />
                                        <button onClick={logout} className="nav-item-btn text-danger logout-btn">
                                            <LogOut size={18} className="nav-icon" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                    {/* Main Content */}
                    <Col lg={9}>
                        <div className="fade-in-up">
                            {activeTab === 'personal' && (
                                <Card className="border-0 shadow-sm content-card">
                                    <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h4 className="fw-bold mb-1">Personal Information</h4>
                                                <p className="text-muted small">Manage your personal details</p>
                                            </div>
                                            <Button
                                                variant={isEditing ? "light" : "primary"}
                                                className={isEditing ? "border" : "shadow-sm"}
                                                onClick={() => setIsEditing(!isEditing)}
                                            >
                                                {isEditing ? 'Cancel' : <><Edit2 size={16} className="me-2" /> Edit Profile</>}
                                            </Button>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        <Form onSubmit={handleProfileUpdate}>
                                            <Row className="g-4">
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="text-muted small fw-bold text-uppercase">Full Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            value={profileData.name}
                                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                            disabled={!isEditing}
                                                            className="modern-input"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="text-muted small fw-bold text-uppercase">Email Address</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            value={profileData.email}
                                                            disabled
                                                            className="modern-input bg-light"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="text-muted small fw-bold text-uppercase">Phone Number</Form.Label>
                                                        <Form.Control
                                                            type="tel"
                                                            value={profileData.phone}
                                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                            disabled={!isEditing}
                                                            placeholder="+91 98765 43210"
                                                            className="modern-input"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="text-muted small fw-bold text-uppercase">Date of Birth</Form.Label>
                                                        <Form.Control
                                                            type="date"
                                                            value={profileData.dob}
                                                            onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                                                            disabled={!isEditing}
                                                            className="modern-input"
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="text-muted small fw-bold text-uppercase">Gender</Form.Label>
                                                        <Form.Select
                                                            value={profileData.gender}
                                                            onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                                            disabled={!isEditing}
                                                            className="modern-input"
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                            <option value="Other">Other</option>
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group>
                                                        <Form.Label className="text-muted small fw-bold text-uppercase">Blood Group</Form.Label>
                                                        <Form.Select
                                                            value={profileData.bloodGroup}
                                                            onChange={(e) => setProfileData({ ...profileData, bloodGroup: e.target.value })}
                                                            disabled={!isEditing}
                                                            className="modern-input"
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
                                                <div className="mt-4 text-end fade-in">
                                                    <Button variant="light" className="me-2" onClick={() => setIsEditing(false)}>Cancel</Button>
                                                    <Button type="submit" variant="primary" className="px-4 shadow-sm">Save Changes</Button>
                                                </div>
                                            )}
                                        </Form>
                                    </Card.Body>
                                </Card>
                            )}

                            {activeTab === 'addresses' && (
                                <Card className="border-0 shadow-sm content-card">
                                    <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h4 className="fw-bold mb-1">Saved Addresses</h4>
                                                <p className="text-muted small">Manage your delivery locations</p>
                                            </div>
                                            <Button variant="primary" size="sm" className="shadow-sm">
                                                <Plus size={16} className="me-2" /> Add New
                                            </Button>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        <Row className="g-3">
                                            {addresses.map(addr => (
                                                <Col md={6} key={addr.id}>
                                                    <div className="address-card p-3 border rounded-3 h-100 position-relative">
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <Badge bg="light" text="dark" className="border">{addr.type}</Badge>
                                                            {addr.isDefault && <Badge bg="success" className="bg-opacity-10 text-success">Default</Badge>}
                                                        </div>
                                                        <p className="mb-1 fw-medium">{addr.address}</p>
                                                        <p className="mb-3 text-muted small">{addr.city}, {addr.state} - {addr.zip}</p>
                                                        <div className="d-flex gap-3 mt-auto">
                                                            <button className="btn-link-custom text-primary">Edit</button>
                                                            <button className="btn-link-custom text-danger">Delete</button>
                                                        </div>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Card.Body>
                                </Card>
                            )}



                            {activeTab === 'medical' && (
                                <Card className="border-0 shadow-sm content-card">
                                    <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h4 className="fw-bold mb-1">Medical Records</h4>
                                                <p className="text-muted small">Your health history timeline</p>
                                            </div>
                                            <Button variant="primary" size="sm" className="shadow-sm" onClick={() => setShowAddRecordModal(true)}>
                                                <Plus size={16} className="me-2" /> Add Record
                                            </Button>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        {medicalRecords.length === 0 ? (
                                            <div className="text-center py-5 text-muted">
                                                <Activity size={48} className="mb-3 opacity-25" />
                                                <p>No medical records found. Add your first record to get started.</p>
                                            </div>
                                        ) : (
                                            <div className="timeline">
                                                {medicalRecords.map((record) => (
                                                    <div key={record.id} className="timeline-item">
                                                        <div className="timeline-marker"></div>
                                                        <div className="timeline-content">
                                                            <Card className="border-0 shadow-sm mb-3 hover-card">
                                                                <Card.Body>
                                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                                        <h5 className="fw-bold mb-0 text-primary">{record.disease || 'Unknown Condition'}</h5>
                                                                        <Button variant="ghost" size="sm" className="text-danger p-0" onClick={() => handleDeleteRecord(record.id)}>
                                                                            <Trash2 size={16} />
                                                                        </Button>
                                                                    </div>
                                                                    <p className="text-muted small mb-3">
                                                                        <Clock size={14} className="me-1" />
                                                                        {new Date(record.timestamp).toLocaleDateString()} at {new Date(record.timestamp).toLocaleTimeString()}
                                                                    </p>
                                                                    <div className="mb-3">
                                                                        {record.symptoms?.map((symptom, idx) => (
                                                                            <Badge key={idx} bg="light" text="dark" className="me-1 border rounded-pill px-3 py-2 fw-normal">{symptom}</Badge>
                                                                        ))}
                                                                    </div>
                                                                    {record.description && (
                                                                        <div className="bg-light rounded p-3 text-muted small">
                                                                            {record.description}
                                                                        </div>
                                                                    )}
                                                                </Card.Body>
                                                            </Card>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            )}



                            {activeTab === 'assessments' && (
                                <Card className="border-0 shadow-sm content-card">
                                    <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
                                        <h4 className="fw-bold mb-1">Mental Health Assessments</h4>
                                        <p className="text-muted small">Your past screening results</p>
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        {assessmentHistory.length === 0 ? (
                                            <div className="text-center py-5 text-muted">
                                                <Brain size={48} className="mb-3 opacity-25" />
                                                <p>No assessment history found.</p>
                                                <Button variant="link" href="/mental-health" className="text-decoration-none">Take an Assessment</Button>
                                            </div>
                                        ) : (
                                            <div className="d-grid gap-3">
                                                {assessmentHistory.map(record => (
                                                    <Card key={record.id} className="border-0 shadow-sm hover-card">
                                                        <Card.Body>
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                <h6 className="fw-bold mb-0 text-primary">{record.assessmentName}</h6>
                                                                <div className="d-flex align-items-center">
                                                                    <small className="text-muted me-3">{new Date(record.createdAt).toLocaleDateString()}</small>
                                                                    <Button variant="link" className="text-danger p-0" onClick={() => handleDeleteAssessment(record.id)}>
                                                                        <Trash2 size={16} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Badge bg="light" className={`bg-${record.color} bg-opacity-10 text-${record.color} border border-${record.color} border-opacity-25 px-3 py-2 fw-normal`}>
                                                                    {record.resultText}
                                                                </Badge>
                                                                <span className="text-muted small">Score: {record.score}</span>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            )}

                            {activeTab === 'screenings' && (
                                <Card className="border-0 shadow-sm content-card">
                                    <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
                                        <h4 className="fw-bold mb-1">Health Screening Reports</h4>
                                        <p className="text-muted small">AI-based deficiency analysis results</p>
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        {screeningHistory.length === 0 ? (
                                            <div className="text-center py-5 text-muted">
                                                <Activity size={48} className="mb-3 opacity-25" />
                                                <p>No screening history found.</p>
                                                <Button variant="link" href="/health-scanner" className="text-decoration-none">New Health Scan</Button>
                                            </div>
                                        ) : (
                                            <div className="d-grid gap-3">
                                                {screeningHistory.map(record => (
                                                    <Card key={record.id} className="border-0 shadow-sm hover-card bg-light">
                                                        <Card.Body>
                                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                                <h6 className="fw-bold mb-0 text-primary">Health Scan Report</h6>
                                                                <div className="d-flex align-items-center">
                                                                    <small className="text-muted me-3">{new Date(record.createdAt).toLocaleDateString()}</small>
                                                                    <Button variant="link" className="text-danger p-0" onClick={() => handleDeleteScreening(record.id)}>
                                                                        <Trash2 size={16} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            {/* Display Deficiencies if any */}
                                                            {record.deficienciesDetected && record.deficienciesDetected.length > 0 ? (
                                                                <div className="mb-2">
                                                                    <div className="small fw-bold text-muted mb-1">Potential Deficiencies:</div>
                                                                    <div className="d-flex flex-wrap gap-2">
                                                                        {record.deficienciesDetected.map((def, i) => (
                                                                            <Badge key={i} bg="warning" text="dark" className="fw-normal border border-warning">
                                                                                <AlertTriangle size={12} className="me-1" /> {def}
                                                                            </Badge>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="text-success small fw-bold">
                                                                    <CheckCircle size={14} className="me-1" /> No significant risks detected
                                                                </div>
                                                            )}
                                                        </Card.Body>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            )}

                            {activeTab === 'settings' && (
                                <div className="p-4">
                                    <AccountSettings />
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>

                {/* Add Medical Record Modal */}
                <Modal show={showAddRecordModal} onHide={() => setShowAddRecordModal(false)} centered>
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fw-bold">Add Medical Record</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleAddRecord}>
                        <Modal.Body className="pt-3">
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-muted">Condition / Disease</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. Viral Fever"
                                    value={newRecordData.disease}
                                    onChange={(e) => setNewRecordData({ ...newRecordData, disease: e.target.value })}
                                    required
                                    className="modern-input"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-muted">Symptoms (comma separated)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. Headache, Fever, Chills"
                                    value={newRecordData.symptoms}
                                    onChange={(e) => setNewRecordData({ ...newRecordData, symptoms: e.target.value })}
                                    className="modern-input"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-muted">Description / Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newRecordData.description}
                                    onChange={(e) => setNewRecordData({ ...newRecordData, description: e.target.value })}
                                    className="modern-input"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold text-muted">Upload Report (Image for OCR)</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="modern-input"
                                />
                                {isProcessingOcr && <div className="text-info small mt-1">Processing text from image... <div className="spinner-border spinner-border-sm" role="status"></div></div>}
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className="border-0 pt-0">
                            <Button variant="light" onClick={() => setShowAddRecordModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" className="px-4">
                                Save Record
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Container>

            <style jsx global>{`
                .profile-page-wrapper {
                    background-color: #f8fafc;
                    min-height: 100vh;
                }
                
                .profile-card {
                    border-radius: 1rem;
                    overflow: hidden;
                }

                .profile-header-bg {
                    height: 80px;
                    background: linear-gradient(135deg, #dc2626 0%, #fb7185 100%);
                }

                .profile-avatar-wrapper {
                    margin-top: -40px;
                    padding: 4px;
                    background: white;
                    border-radius: 50%;
                    width: 88px;
                    height: 88px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .profile-avatar {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #fef2f2;
                    color: #dc2626;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    font-weight: bold;
                }

                .navigation-card {
                    border-radius: 1rem;
                }

                .nav-item-btn {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: none;
                    background: transparent;
                    border-radius: 0.5rem;
                    color: #64748b;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    text-align: left;
                }

                .nav-item-btn:hover {
                    background-color: #fef2f2;
                    color: #dc2626;
                }

                .nav-item-btn.active {
                    background-color: #fef2f2;
                    color: #dc2626;
                    font-weight: 600;
                }

                .nav-icon {
                    margin-right: 0.75rem;
                }

                .logout-btn:hover {
                    background-color: #fef2f2;
                    color: #dc2626;
                }

                .content-card {
                    border-radius: 1rem;
                    overflow: hidden;
                }

                .modern-input {
                    border-radius: 0.5rem;
                    padding: 0.75rem 1rem;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s;
                }

                .modern-input:focus {
                    border-color: #fb7185;
                    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
                }

                .address-card {
                    transition: all 0.2s;
                    background: #fff;
                }

                .address-card:hover {
                    border-color: #fb7185 !important;
                    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.05);
                }

                .btn-link-custom {
                    background: none;
                    border: none;
                    padding: 0;
                    font-size: 0.875rem;
                    font-weight: 500;
                    text-decoration: none;
                }

                .btn-link-custom:hover {
                    text-decoration: underline;
                }

                .order-item {
                    transition: all 0.2s;
                }

                .order-item:hover {
                    background-color: #fef2f2;
                }

                /* Timeline Styles */
                .timeline {
                    position: relative;
                    padding-left: 1.5rem;
                }

                .timeline::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: #e2e8f0;
                }

                .timeline-item {
                    position: relative;
                    margin-bottom: 1.5rem;
                }

                .timeline-marker {
                    position: absolute;
                    left: -1.5rem;
                    top: 1rem;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #dc2626;
                    border: 2px solid white;
                    box-shadow: 0 0 0 2px #fecaca;
                    transform: translateX(-50%);
                    z-index: 1;
                }

                .hover-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .hover-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
                }

                .appointment-ticket {
                    transition: all 0.2s;
                }

                .appointment-ticket:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .fade-in-up {
                    animation: fadeInUp 0.4s ease-out;
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    )
}
