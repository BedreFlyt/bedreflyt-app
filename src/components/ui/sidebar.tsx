import React, { useState } from "react";
import { Button, Nav } from "react-bootstrap";

import SearchIcon from '../../assets/icons/bedreflyt-icon-search.webp';
import BedIcon from '../../assets/icons/bedreflyt-icon-bed.webp';
import StaffIcon from '../../assets/icons/bedreflyt-icon-staff.webp';
import DoctorIcon from '../../assets/icons/bedreflyt-icon-doctor.webp';
import UserIcon from '../../assets/icons/bedreflyt-icon-user.webp';
import HospitalIcon from '../../assets/icons/bedreflyt-icon-hospital.webp';

const CustomSidebar = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
      {/* Toggle Button */}
      <Button
        variant="dark"
        className="menu-button"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? "←" : "→"}
      </Button>

      {/* Navigation Items */}
      <Nav className="flex-column mt-3">
        {[
          { id: "1", text: "Hospital Ward", icon: HospitalIcon, link: "#how-to-install" },
          { id: "2", text: "Staff adjustments", icon: DoctorIcon, link: "#usage" },
          { id: "3", text: "Patients management", icon: UserIcon, link: "#overview" },
          { id: "4", text: "Staff allocation", icon: StaffIcon, link: "#api" },
          { id: "5", text: "Bed allocation", icon: BedIcon, link: "/bed-allocation" },
          { id: "6", text: "Browse data", icon: SearchIcon, link: "/inspect" },
        ].map((item) => (
          <Nav.Link key={item.id} href={item.link} className="sidebar-item">
            <img src={item.icon} alt={item.text} height="30" className="icon" />
            {expanded && <span className="text">{item.text}</span>}
          </Nav.Link>
        ))}
      </Nav>

      {/* Styles */}
      <style>{`
        .sidebar {
          height: 100vh;
          background-color: #1e1e1e;
          color: white;
          padding: 10px;
          transition: width 0.3s ease-in-out;
          display: flex;
          flex-direction: column;
          align-items: ${expanded ? "flex-start" : "center"};
          width: ${expanded ? "300px" : "60px"};
          position: fixed;
          z-index: 9999;
        }

        .menu-button {
          align-self: ${expanded ? "flex-end" : "center"};
          margin-bottom: 10px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          padding: 10px;
          color: white;
          text-decoration: none;
        }

        .icon {
          font-size: 18px;
          margin-right: ${expanded ? "10px" : "0"};
        }

        .text {
          display: ${expanded ? "inline" : "none"};
        }
      `}</style>
    </aside>
  );
}

export default CustomSidebar;