'use client'
import React from 'react';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap'
import { User, Settings, ShoppingBag, FileText, Calendar, LogOut, Bell } from 'lucide-react'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function NavbarComponent() {
  const pathname = usePathname()
  const { isAuthenticated, logout, user } = useAuth()
  const [expanded, setExpanded] = React.useState(false)
  const navRef = React.useRef(null)

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setExpanded(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [navRef])

  // Navigation links array for reuse
  const navigationLinks = [
    { href: '/', label: 'Home' },
    { href: '/find-doctors', label: 'Find Doctors' },
    { href: '/first-aid', label: 'First Aid' },
    { href: '/blood-bank', label: 'Blood Bank' },
    { href: '/about-us', label: 'About Us' },
    { href: '/contact-us', label: 'Contact Us' }
  ]

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user && user.name) {
      return user.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }
    return 'US'
  }

  const navbarContainerStyle = {
    position: 'fixed',
    top: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 2rem)',
    maxWidth: '1400px',
    zIndex: 1030,
    padding: '0 1rem'
  }

  const navbarStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    border: '1px solid rgba(220, 38, 38, 0.1)',
    boxShadow: '0 4px 20px rgba(220, 38, 38, 0.08)',
    padding: '0.5rem 1rem'
  }

  const navLinkStyle = (isActive) => ({
    color: isActive ? '#dc2626' : '#6c757d',
    fontWeight: isActive ? '600' : '500',
    fontSize: '0.875rem',
    paddingBottom: '0.5rem',
    borderBottom: isActive ? '2px solid #dc2626' : '2px solid transparent',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    marginRight: '2rem',
    position: 'relative',
    display: 'inline-block',
    pointerEvents: isActive ? 'none' : 'auto'
  })

  const brandStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #dc2626, #fb7185)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }

  const avatarStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(to right, #dc2626, #fb7185)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.75rem',
    cursor: 'pointer',
    border: '2px solid rgba(220, 38, 38, 0.2)',
    transition: 'transform 0.3s ease'
  }

  const dropdownMenuStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #fecaca',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 40px rgba(220, 38, 38, 0.1)',
    marginTop: '0.5rem'
  }

  return (
    <>
      <div style={navbarContainerStyle} ref={navRef}>
        <Navbar
          expand="sm"
          expanded={expanded}
          style={navbarStyle}
          className="navbar-light"
        >
          <Container fluid className="px-2">
            {/* Logo */}
            <Navbar.Brand
              as={Link}
              href="/"
              style={brandStyle}
              className="me-4 navbar-brand-hover"
              onClick={() => setExpanded(false)}
            >
              UpcharSaathi
            </Navbar.Brand>

            {/* Toggle Button for Mobile */}
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              onClick={() => setExpanded(!expanded)}
            />

            {/* Navigation and Auth */}
            <Navbar.Collapse id="basic-navbar-nav">
              {/* Desktop Navigation Links */}
              <Nav className="mx-auto d-none d-sm-flex">
                {navigationLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`nav-link px-0 ${!isActive ? 'navbar-link-animated' : ''}`}
                      style={navLinkStyle(isActive)}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </Nav>

              {/* Mobile Navigation Links */}
              <Nav className="flex-column d-sm-none">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="nav-link mobile-nav-link"
                    style={{
                      color: pathname === link.href ? '#dc2626' : '#6c757d',
                      backgroundColor: pathname === link.href ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                      borderRadius: '0.375rem',
                      padding: '0.5rem 0.75rem',
                      marginBottom: '0.5rem',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setExpanded(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </Nav>

              {/* Auth Section */}
              <div className="d-flex align-items-center gap-3 mt-3 mt-sm-0 ms-sm-4">
                {isAuthenticated ? (
                  <>
                    {/* Notification Bell */}
                    <Button
                      variant="link"
                      className="position-relative p-0 border-0 bell-animated"
                      style={{ fontSize: '1.25rem', color: '#dc2626', transition: 'transform 0.3s ease' }}
                    >
                      <Bell size={20} />
                      <span
                        className="position-absolute top-0 end-0 pulse-dot"
                        style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#dc2626',
                          borderRadius: '50%'
                        }}
                      />
                    </Button>

                    {/* User Dropdown */}
                    <Dropdown>
                      <Dropdown.Toggle
                        id="dropdown-basic"
                        className="border-0 p-0 avatar-animated"
                        style={avatarStyle}
                        as={Button}
                      >
                        {getUserInitials()}
                      </Dropdown.Toggle>

                      <Dropdown.Menu
                        align="end"
                        style={dropdownMenuStyle}
                        className="border-0"
                      >
                        {/* User Info */}
                        <div className="px-3 py-2">
                          <p className="mb-0 text-dark fw-medium" style={{ fontSize: '0.875rem' }}>
                            {user?.name || 'User'}
                          </p>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>

                        <Dropdown.Divider className="my-2" style={{ borderColor: '#fecaca' }} />

                        {/* Menu Items */}
                        <Dropdown.Item as={Link} href="/profile?tab=personal" className="text-dark dropdown-item-animated" onClick={() => setExpanded(false)}>
                          <User size={16} className="me-2" style={{ display: 'inline', color: '#fb7185' }} />
                          My Profile
                        </Dropdown.Item>

                        <Dropdown.Item as={Link} href="/profile?tab=orders" className="text-dark dropdown-item-animated" onClick={() => setExpanded(false)}>
                          <ShoppingBag size={16} className="me-2" style={{ display: 'inline', color: '#f43f5e' }} />
                          Order History
                        </Dropdown.Item>

                        <Dropdown.Item as={Link} href="/profile?tab=medical" className="text-dark dropdown-item-animated" onClick={() => setExpanded(false)}>
                          <FileText size={16} className="me-2" style={{ display: 'inline', color: '#ff6b6b' }} />
                          Medical Records
                        </Dropdown.Item>

                        <Dropdown.Item as={Link} href="/profile?tab=appointments" className="text-dark dropdown-item-animated" onClick={() => setExpanded(false)}>
                          <Calendar size={16} className="me-2" style={{ display: 'inline', color: '#dc2626' }} />
                          My Appointments
                        </Dropdown.Item>

                        <Dropdown.Item as={Link} href="/profile?tab=settings" className="text-dark dropdown-item-animated" onClick={() => setExpanded(false)}>
                          <Settings size={16} className="me-2" style={{ display: 'inline', color: '#6c757d' }} />
                          Account Settings
                        </Dropdown.Item>

                        <Dropdown.Divider className="my-2" style={{ borderColor: '#fecaca' }} />

                        {/* Sign Out */}
                        <Dropdown.Item
                          onClick={() => {
                            logout();
                            setExpanded(false);
                          }}
                          className="text-danger dropdown-item-animated"
                        >
                          <LogOut size={16} className="me-2" style={{ display: 'inline' }} />
                          Sign Out
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                ) : (
                  <div className="d-flex gap-2">
                    <Link href="/auth/login" className="text-decoration-none" onClick={() => setExpanded(false)}>
                      <Button
                        className="btn-sm auth-button-animated"
                        style={{
                          background: 'linear-gradient(to right, #dc2626, #fb7185)',
                          border: 'none',
                          color: '#fff',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                        onClick={() => setExpanded(false)}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="text-decoration-none" onClick={() => setExpanded(false)}>
                      <Button
                        variant="outline-danger"
                        className="btn-sm auth-button-animated"
                        style={{
                          borderColor: '#dc2626',
                          color: '#dc2626',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}
                        onClick={() => setExpanded(false)}
                      >
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      {/* Spacer to prevent content from going under fixed navbar */}
      <div style={{ height: '80px' }} />

      {/* CSS Animations */}
      <style jsx global>{`
        .navbar-link-animated {
          position: relative;
        }
        
        .navbar-link-animated::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(to right, #dc2626, #fb7185);
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .navbar-link-animated:hover::before {
          width: 100%;
        }
        
        .navbar-link-animated:hover {
          color: #dc2626 !important;
        }

        .navbar-brand-hover:hover {
          transform: scale(1.05);
        }

        .bell-animated:hover {
          transform: scale(1.1);
        }

        .avatar-animated:hover {
          transform: scale(1.05);
        }

        .pulse-dot {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .dropdown-item-animated {
          transition: all 0.2s ease;
        }

        .dropdown-item-animated:hover {
          background-color: rgba(220, 38, 38, 0.05) !important;
          transform: translateX(4px);
        }

        .auth-button-animated:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }

        .mobile-nav-link:hover {
          background-color: rgba(220, 38, 38, 0.05) !important;
          color: #dc2626 !important;
        }
      `}</style>
    </>
  )
}