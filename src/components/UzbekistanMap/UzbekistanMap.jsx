// UzbekistanMap.jsx
import React from "react";
import "./UzbekistanMap.css";
import Logo from "../../Assets/img/Logo.svg";
import { Link } from "react-router-dom";

const UzbekistanMap = () => {
  const handleRegionClick = (region) => {
    console.log(`Clicked on region: ${region}`);
    // Implement specific actions for each region click if needed
  };

  return (
    <div className="contianer">
      <div className="mood">
        <Link to={"/"}>
          <img src={Logo} alt="logo" />
        </Link>
        <nav className="navbar">
          <ul className="nav-list">
            <li className="nav-item">Faoliyat</li>
            <li className="nav-item">Normativ hujjat</li>
            <li className="nav-item">Fermerlar uchun</li>
            <li className="nav-item">Ochiq ma’lumot</li>
            <li className="nav-item">Maxsus imkoniyat</li>
          </ul>
        </nav>

        <select className="lang" name="lang" id="lang">
          <option value="uzbek">uzbek</option>
          <option value="rus">rus</option>
        </select>
      </div>
    </div>
  );
};

export default UzbekistanMap;
