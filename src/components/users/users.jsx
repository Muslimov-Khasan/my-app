import "./users.css";
import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [showButtons, setShowButtons] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);

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
      body: JSON.stringify({ block: true }),
    });
    // After blocking, update the blocked users list
    setBlockedUsers((prevBlockedUsers) => [...prevBlockedUsers, userId]);
    localStorage.setItem(`blockedUser_${userId}`, true);

    // Refresh the user data
    fetchDataUsers();
    handleThreeDotClick(null);
  };

  const unblockUser = async (userId) => {
    const storedToken = localStorage.getItem("authToken");
    fetch(`https://avtowatt.uz/api/v1/users/block/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ block: false }),
    });

    // After unblocking, update the blocked users list
    setBlockedUsers((prevBlockedUsers) =>
      prevBlockedUsers.filter((blockedUserId) => blockedUserId !== userId)
    );
    localStorage.removeItem(`blockedUser_${userId}`);

    // Refresh the user data
    fetchDataUsers();
    handleThreeDotClick(null);
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
            <tr
              key={index}
              style={{
                backgroundColor: localStorage.getItem(`blockedUser_${user.id}`)
                  ? "#FFE1E1"
                  : "#fff",
              }}
            >
              <td>{index + 1}</td>
              <td>
                <img src={user.photoUrl} alt="user" width={55} />
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
                        Bloklash
                      </button>
                      <button
                        className="admin-delete"
                        onClick={() => unblockUser(user.id)}
                      >
                        Blokdan chiqarish
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
