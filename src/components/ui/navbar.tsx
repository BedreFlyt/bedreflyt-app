import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

import SearchIcon from '../../assets/icons/search-icon.webp';
import BedIcon from '../../assets/icons/bed-icon.webp';
import StaffIcon from '../../assets/icons/staff-icon.webp';

const CustomNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
            height="30"
            className="d-inline-block align-top"
            alt="Your Company"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#search">
              <img src={SearchIcon} alt="Search" height="30" />
            </Nav.Link>
            <Nav.Link href="/bed-allocation">
              <img src={BedIcon} alt="Beds" height="30" />
            </Nav.Link>
            <Nav.Link href="#staff-allocation">
              <img src={StaffIcon} alt="Staff" height="30" />
            </Nav.Link>
            <Nav.Link href="#calendar">Calendar</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="#notifications">
              <i className="bi bi-bell"></i>
            </Nav.Link>
            <NavDropdown title={<img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" className="rounded-circle" height="30" />} id="basic-nav-dropdown">
              <NavDropdown.Item href="#profile">Your Profile</NavDropdown.Item>
              <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#signout">Sign out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;