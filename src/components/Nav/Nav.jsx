import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Logo from "../../Assets/img/Logo.svg";
import "./Nav.css";

const Nav = () => {
  const [activeBtn, setActiveBtn] = useState();
  const [adminData, setAdminData] = useState([]); // Declare adminData state
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdminData = localStorage.getItem("");
    if (storedAdminData) {
      setAdminData(JSON.parse(storedAdminData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("", JSON.stringify(adminData));
  }, [adminData]);

  const handleButtonClick = (btnName, route) => {
    setActiveBtn(btnName);
    navigate(route);
  };

  return (
    <>
    <div className="contianer">
      <div className="nav-wrapper">

      <Link to="/Monitoring">
        <img className="logo-admin" src={Logo} alt="logo" width={164} height={42} />
      </Link>
      <div className="buttons">
        <NavLink
          to="/Monitoring"
          className={`btn ${activeBtn === "Monitoring" ? "active" : ""}`}
          onClick={() => handleButtonClick("Monitoring", "/Monitoring")}
        >
          Monitoring
        </NavLink>
        <NavLink
          to="/adminAdd"
          className={`btn ${activeBtn === "Admin" ? "active" : ""}`}
          onClick={() => handleButtonClick("Admin", "/adminAdd")}
        >
          Admin
        </NavLink>
        <NavLink
          to="/add-category"
          className={`btn ${activeBtn === "Kategoriya" ? "active" : ""}`}
          onClick={() => handleButtonClick("Kategoriya", "/add-category")}
        >
          Kategoriya 
        </NavLink>
        <NavLink
          to="/news"
          className={`btn ${activeBtn === "Yangiliklar" ? "active" : ""}`}
          onClick={() => handleButtonClick("Yangiliklar", "/news")}
        >
          Yangiliklar
        </NavLink>
        <NavLink
          to="/image-upload"
          className={`btn ${activeBtn === "Banner" ? "active" : ""}`}
          onClick={() => handleButtonClick("Banner", "/image-upload")}
        >
          Banner
        </NavLink>
        <NavLink
          to="/faq"
          className={`btn ${activeBtn === "faq" ? "active" : ""}`}
          onClick={() => handleButtonClick("faq", "/faq")}
        >
          FAQ
        </NavLink>
        <NavLink
          to="/users"
          className={`btn ${activeBtn === "users" ? "active" : ""}`}
          onClick={() => handleButtonClick("users", "/users")}
        >
          Foydalanuvchilar
        </NavLink>
        <NavLink
          to="/Contact"
          className={`btn ${activeBtn === "Contact" ? "active" : ""}`}
          onClick={() => handleButtonClick("Contact", "/Contact")}
        >
          Contact
        </NavLink>
      </div>
      </div>
    </div>
    </>
  );
};

export default Nav;