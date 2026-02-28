import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Container, Badge, ListGroup, Button } from 'react-bootstrap';
import { BsBell, BsBellFill } from 'react-icons/bs';
import { useNotifications } from '../../context/NotificationContext.tsx';
import Logo from '../../assets/bedreflyt-logo.webp';

const CustomNavbar = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } =
    useNotifications();
  const [showPanel, setShowPanel] = useState(false);

  const handleBellClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPanel((prev) => !prev);
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" style={{ paddingLeft: '110px' }}>
        <Container>
          <Navbar.Brand href="#home">
            <img
              src={Logo}
              height="60"
              className="d-inline-block align-top"
              alt="Bedreflyt DT"
            />
            <span style={{ fontSize: '1.7em', padding: '10px' }}>BedreFlyt DT</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              {/* ── Bell icon ── */}
              <Nav.Link
                href="#notifications"
                onClick={handleBellClick}
                className="position-relative me-3"
                aria-label="Notifications"
              >
                {unreadCount > 0 ? (
                  <BsBellFill size={22} color="#ffc107" />
                ) : (
                  <BsBell size={22} color="white" />
                )}
                {unreadCount > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      fontSize: '0.65rem',
                      transform: 'translate(40%, -30%)',
                    }}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Nav.Link>

              {/* ── User dropdown ── */}
              <NavDropdown
                title={
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User"
                    className="rounded-circle"
                    height="30"
                  />
                }
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item href="#profile">Your Profile</NavDropdown.Item>
                <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#signout">Sign out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ── Notification slide-down panel ── */}
      {showPanel && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '20px',
            width: '380px',
            maxHeight: '460px',
            overflowY: 'auto',
            backgroundColor: '#1e1e1e',
            border: '1px solid #444',
            borderRadius: '8px',
            zIndex: 10000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="d-flex justify-content-between align-items-center px-3 py-2"
            style={{ borderBottom: '1px solid #444' }}
          >
            <strong style={{ color: 'white' }}>
              Notifications{unreadCount > 0 && ` (${unreadCount} new)`}
            </strong>
            <div className="d-flex gap-2">
              {unreadCount > 0 && (
                <Button size="sm" variant="outline-light" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => setShowPanel(false)}
              >
                ✕
              </Button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <p className="text-muted text-center py-3 mb-0">No notifications yet.</p>
          ) : (
            <ListGroup variant="flush">
              {notifications.map((n) => (
                <ListGroup.Item
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id)}
                  style={{
                    backgroundColor: n.read ? '#2a2a2a' : '#1a3a5c',
                    color: 'white',
                    cursor: 'pointer',
                    borderColor: '#444',
                  }}
                  className="notification-item"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div style={{ flex: 1 }}>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        {!n.read && (
                          <Badge bg="warning" text="dark" style={{ fontSize: '0.6rem' }}>
                            NEW
                          </Badge>
                        )}
                        <strong style={{ fontSize: '0.9rem' }}>
                          Order #{n.payload.id ?? '—'}
                        </strong>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#ccc' }}>
                        <span>Item: {n.payload.inventoryItem?.itemName}</span>
                        <br />
                        <span>Qty: {n.payload.numberToOrder}</span>
                        <br />
                        <span>
                          Received:{' '}
                          {new Date(n.receivedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      style={{ fontSize: '0.7rem', padding: '2px 6px', marginLeft: '8px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(n.id);
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      )}

      <style>{`
        .notification-item:hover {
          background-color: #24507a !important;
        }
      `}</style>
    </>
  );
};

export default CustomNavbar;