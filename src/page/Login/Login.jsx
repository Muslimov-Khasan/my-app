import "./Login.css";
import loginImage from "../../Assets/img/loginimage.svg";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [token, setToken] = useState(null);
  const [setCategory, setCategories] = useState(null);
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleFormSubmitLogin = async (event) => {
    event.preventDefault();
  };

 

  const handleLogin = async () => {
    try {
      const { phone, password } = loginData;
      // Trim input values
      const trimmedPhone = phone.trim();
      const trimmedPassword = password.trim();

      const response = await fetch(
        "https://avtowatt.uz/api/v1/auth/login/admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: trimmedPhone,
            password: trimmedPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setError(
            "Admin topilmadi. Iltimos, telefon raqamingizni yoki Parol tekshiring."
          );
        } else {
          setError(data.errorMessage || "Login failed");
        }
        return;
      }

      const authToken = data.token;
      localStorage.setItem("authToken", authToken);
      setToken(authToken);

      try {
        const storedToken = localStorage.getItem("authToken");
        const responseGetcategory = await fetch(
          "https://avtowatt.uz/api/v1/admin/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        const dataGet = await responseGetcategory.json();
        setCategories(dataGet);
        if (dataGet.role === "ROLE_MODERATOR") {
          navigate("/Moderator");
        } else if (dataGet.role === "ROLE_ADMIN") {
          navigate("/Monitoring");
        } else {
          alert("Bunday toifadagi foydalanuvchi topilmadi");
        }
      } catch (error) {
        console.error("Error fetching admin/moderator data:", error);
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className="wrapper-login">
        <form className="form-login" onSubmit={handleFormSubmitLogin}>
          <h2 className="user-msg">Tizimga kirish</h2>
          <p className="login-info">
            Boshqaruv paneliga kirish uchun telefon raqamingiz va parolni
            kiriting
          </p>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <label className="label-phone">
            Telefon raqamingizni:
            <input
              className="phone-input"
              type="tel"
              value={loginData.phone || "+998"}
              onChange={(e) =>
                setLoginData({ ...loginData, phone: e.target.value.trim() })
              }
            />
          </label>
          <label className="label-phone">
            Parol:
            <input
              className="password-input"
              type="password"
              placeholder="Parol"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value.trim(),
                })
              }
            />
          </label>
          <button className="login-btn" onClick={handleLogin}>
            Tizimga kirish
          </button>
        </form>
        <img className="image" src={loginImage} alt="image"  />
      </div>
    </div>
  );
};

export default Login;
