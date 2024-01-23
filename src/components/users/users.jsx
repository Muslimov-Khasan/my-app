import "./users.css";
import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";

const Users = () => {
  const [usersData, setUsersData] = useState([]);

  const fetchDataUsers = async () => {
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch("https://avtowatt.uz/api/v1/users/all", {
      method: "GET", // GET method
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    const data = await response.json();
    setUsersData(data);
  };
  useEffect(() => {
    fetchDataUsers();
  }, []);
  return (
    <div className="container">
      <Nav />

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Rasm</th>
            <th>Ism</th>
            <th>Familiya</th>
            <th>Telefon</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <img src={user.photoUrl} alt="" width={55} />
              </td>
              <td>{user.name}</td>
              <td>{user.surname}</td>
              <td>{user.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;