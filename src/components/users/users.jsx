import "./users.css";
import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [showButtons, setShowButtons] = useState(null);

  const fetchDataUsers = async () => {
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch("https://avtowatt.uz/api/v1/users/all", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    const data = await response.json();
    setUsersData(data);
  };

  const handleThreeDotClick = (userId) => {
    setShowButtons((prevShowButtons) =>
      prevShowButtons === userId ? null : userId
    );
  };

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
            <th></th>
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
              <td>
                <div className="three-dot-container">
                  <button
                    className="three-dot"
                    onClick={() => handleThreeDotClick(user.id)}
                  >
                    &#8942;
                  </button>
                  {showButtons === user.id && (
                    <div className="buttons-container">
                      <button className="admin-delete">Block</button>
                      {/* Add similar logic for unblocking */}
                      <button className="admin-delete">Unblock</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
