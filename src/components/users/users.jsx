import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./users.css";

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const [showButtons, setShowButtons] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const usersPerPage = 10;
  const maxPaginationButtons = 5; // Change this value to the desired number of pagination buttons to display

  useEffect(() => {
    fetchDataUsers(currentPage);
  }, [currentPage]);
  const fetchDataUsers = async (page) => {
    setLoading(true);
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch(
      `https://avtowatt.uz/api/v1/users/all?page=${page}&size=${usersPerPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      }
    );

    const data = await response.json();
    setUsersData((prevUsersData) => [...prevUsersData, ...data]);
    setLoading(false);
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

    // Refresh the user data for the current page
    fetchDataUsers(currentPage);
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

    // Refresh the user data for the current page
    fetchDataUsers(currentPage);
    handleThreeDotClick(null);
  };

  // Calculate the index range for the current page
  const indexOfFirstUser = (currentPage - 1) * usersPerPage;
  const indexOfLastUser = currentPage * usersPerPage;
  const currentUsers = usersData.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(usersData.length / usersPerPage);

  const renderPageButtons = () => {
    const totalPages = Math.ceil(usersData.length / usersPerPage);
    const currentPageIndex = currentPage - 1;
  
    // Calculate the range of page buttons to display
    let startPage = currentPageIndex - Math.floor(maxPaginationButtons / 2);
    startPage = Math.max(startPage, 0); // Ensure startPage is not negative
  
    let endPage = startPage + maxPaginationButtons - 1;
    if (endPage >= totalPages) {
      endPage = totalPages - 1;
      startPage = Math.max(endPage - maxPaginationButtons + 1, 0); // Adjust startPage
    }
  
    const pageButtons = Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index + 1
    );
  
    return pageButtons.map((page) => (
      <button
        key={page}
        onClick={() => setCurrentPage(page)}
        className={currentPage === page ? "activePage" : ""}
      >
        {page}
      </button>
    ));
  };
  

  return (
    <>
      {usersData.length === 0 && <p className="loading-text">Yuklanmoqda...</p>}
      <div className="container">
        <div className="admin-wrapper">
          <Nav />

          <table className="table-users">
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
              {currentUsers.map((user, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: localStorage.getItem(
                      `blockedUser_${user.id}`
                    )
                      ? "#FFE1E1"
                      : "#fff",
                  }}
                >
                  <td>{indexOfFirstUser + index + 1}</td>
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
        <div className="pagination">
          {loading && <p>Loading...</p>}
          {!loading && renderPageButtons()}
        </div>
      </div>
    </>
  );
};

export default Users;
