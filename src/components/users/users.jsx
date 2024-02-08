import "./users.css";
import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [showButtons, setShowButtons] = useState(null);

  useEffect(() => {
    fetchDataUsers();
  }, []);

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

  const blockUser = async (userId) => {
    const storedToken = localStorage.getItem("authToken");
    await fetch(`https://avtowatt.uz/api/v1/users/block/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ block: true }), // Assuming blocked is the field to toggle
    });
    // After blocking, you may want to refresh the user data
    fetchDataUsers();
  };

  const unblockUser = async (userId) => {
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch(
      `https://avtowatt.uz/api/v1/users/block/${userId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ block: false }), // Assuming blocked is the field to toggle
      }
    );
    console.log(response);
    // After unblocking, you may want to refresh the user data
    fetchDataUsers();
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
                      <button
                        className="admin-delete"
                        onClick={() => blockUser(user.id)}
                      >
                        Block
                      </button>
                      <button
                        className="admin-delete"
                        onClick={() => unblockUser(user.id)}
                      >
                        Unblock
                      </button>
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
