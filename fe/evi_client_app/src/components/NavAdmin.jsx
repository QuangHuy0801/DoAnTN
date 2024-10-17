import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Nav, Navbar, Container, Button } from "react-bootstrap";
import {
  FaHome,
  FaCalendarAlt,
  FaTicketAlt,
  FaHistory,
  FaInfoCircle,
  FaBars,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import "../assets/navbar.css";

const NavbarComponent = () => {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("admin"));
  const userName = user ? user.user_Name : null;

  const isActiveLink = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("admin");
    navigate("/admin");
  };

  const toggleNavbar = () => {
    setExpanded(!expanded);
  };

  return (
    <Navbar
      bg="primary"
      variant="dark"
      expand="lg"
      className={`flex-column align-items-start justify-content-between ${
        expanded ? "expanded" : "collapsed"
      }`}
      style={{
        height: "100vh",
        width: expanded ? "250px" : "80px",
        transition: "width 0.3s",
        position: "sticky",
        top: 0,
      }}
    >
      <Container fluid className="flex-column align-items-start p-0 h-100">
        <Button
          variant="outline-light"
          onClick={toggleNavbar}
          className="mb-3 align-self-end"
          style={{ position: "absolute", top: "10px", right: "10px" }}
        >
          <FaBars />
        </Button>

        <Nav className="flex-column w-100">
          <Nav.Link
            href="/admin/dashboard"
            className={`${isActiveLink(
              "/admin/dashboard"
            )} d-flex align-items-center`}
          >
            <FaHome className="mr-2" />
            {expanded && <span className="ml-2">Thống kê</span>}
          </Nav.Link>
          <Nav.Link
            href="/admin/management-schedules"
            className={`${isActiveLink(
              "/management-schedules"
            )} d-flex align-items-center`}
          >
            <FaCalendarAlt className="mr-2" />
            {expanded && <span className="ml-2">Quản lý Lịch trình</span>}
          </Nav.Link>
          <Nav.Link
            href="/admin/vehical"
            className={`${isActiveLink(
              "/ticketLookup"
            )} d-flex align-items-center`}
          >
            <FaTicketAlt className="mr-2" />
            {expanded && <span className="ml-2">Quản lý xe</span>}
          </Nav.Link>
          <Nav.Link
            href="/admin/management-route"
            className={`${isActiveLink(
              "/management-route"
            )} d-flex align-items-center`}
          >
            <FaHistory className="mr-2" />
            {expanded && <span className="ml-2">Quản lý tuyến đường</span>}
          </Nav.Link>
          <Nav.Link
            href="/admin/management-user"
            className={`${isActiveLink(
              "/management-user"
            )} d-flex align-items-center`}
          >
            <FaInfoCircle className="mr-2" />
            {expanded && <span className="ml-2">Quản lý user</span>}
          </Nav.Link>
        </Nav>

        <div className="mt-auto w-100">
          <Navbar.Brand href="/home" className="w-100 text-center mb-3">
            {expanded ? (
              <img src="/img/logo.png" alt="Logo" style={{ maxWidth: "80%" }} />
            ) : (
              <img
                src="/img/logo-small.png"
                alt="Logo"
                style={{ maxWidth: "40px" }}
              />
            )}
          </Navbar.Brand>

          {userName && (
            <>
              <Nav.Link
                href="/admin/myprofile"
                className="d-flex align-items-center text-light"
              >
                <FaUser className="mr-2" />
                {expanded && <span className="ml-2">{userName}</span>}
              </Nav.Link>
              <Nav.Link
                onClick={handleSignOut}
                className="d-flex align-items-center text-light"
              >
                <FaSignOutAlt className="mr-2" />
                {expanded && <span className="ml-2">Sign out</span>}
              </Nav.Link>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
