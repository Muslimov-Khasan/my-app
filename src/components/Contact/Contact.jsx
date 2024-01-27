import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { imageDb } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Shablon from "../../Assets/img/shablon.png";
import Modal from "react-modal";
import Nav from "../Nav/Nav";
import "./Contact.css";

const Contact = () => {
  const [file, setFile] = useState(null);
  const [img, setImg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(""); // Add this line

  const [imgaeData, setImageData] = useState({
    name: "",
    url: "",
    icon: "",
  });
  const [fetchedData, setFetchedData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showActions, setShowActions] = useState(false);

  const handleInputChange = (event) => {
    setImageData({ ...imgaeData, url: event.target.value });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch("https://avtowatt.uz/api/v1/contact/all", {
        method: "GET", // GET method
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const data = await response.json();
      setFetchedData(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleFileChange = async (event) => {
    event.preventDefault();
    const selectedFile = event.target.files[0];

    try {
      const imgRef = ref(imageDb, `files/${v4()}`);
      await uploadBytes(imgRef, selectedFile);
      const imgUrl = await getDownloadURL(imgRef);

      setFile(selectedFile);
      setImg(imgUrl);
      setImageData({ ...imgaeData, imageUrl: imgUrl });
    } catch (error) {
      console.log("Error uploading file:", error.message);
    }
  };

  const handleUploadClick = (event) => {
    event.preventDefault();
    document.getElementById("imageUpload").click();
  };

  const resetFile = () => {
    setFile(null);
  };

  const handlePostData = async () => {
    const imgRef = ref(imageDb, `files/${v4()}`);
    await uploadBytes(imgRef, file);
    const icon = await getDownloadURL(imgRef);
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch("https://avtowatt.uz/api/v1/contact", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        icon: icon, // Use imgUrl instead of imageUrl
        url: imgaeData.url,
      }),
    });
    const data = await response.json();
    console.log(data);
    setImageData({ ...imgaeData, imageUrl: icon }); // Update imageUrl
    fetchData();
    closeModal();
    resetFile();
    setImageData("");
  };

  const handleDeleteButtonClick = async (itemId) => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        `https://avtowatt.uz/api/v1/contact/${itemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.ok) {
        // If deletion is successful, update the fetched data state
        const updatedData = fetchedData.filter((item) => item.id !== itemId);
        setFetchedData(updatedData);
        console.log("Item deleted successfully.");
      } else {
        console.error("Error deleting item:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting item:", error.message);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setImageData({
      name: "",
      url: "",
      icon: "",
    });
  };

  const threePointButton = (index) => {
    if (!isModalOpen) {
      setActiveIndex(index);
      setShowActions((prevShowActions) => !prevShowActions);
    }
  };

  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <>
      <div className="container">
        <Nav />
        <div className="contact-boxes">
          <button className="banner-btn" onClick={openModal}>
            +
          </button>
        </div>

        <div className="contact-wrapper">
          <div className="contact-inner">
            {fetchedData.length === 0 && (
              <p className="loading-text">Yuklanmoqda...</p>
            )}
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Rasm</th>
                  <th>Nomi</th>
                  <th>Link</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {fetchedData.map((addcategory, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={addcategory.icon}
                        alt=""
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td>{addcategory.name}</td>
                    <td>
                      <Link
                        className="url-link"
                        to={addcategory.url}
                        target={"_blank"}
                      >
                        {addcategory.url}
                      </Link>
                    </td>
                    <td>
                      <button
                        className="categories-btn"
                        onClick={() => threePointButton(index)} // Pass the index to your function
                      >
                        &#x22EE;
                      </button>
                      {showActions && activeIndex === index && (
                        <div className="wrapper-buttons">
                          <button
                            className="button-delete"
                            onClick={() =>
                              handleDeleteButtonClick(addcategory.id)
                            }
                          >
                            o'chirish
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        isOpen={isModalOpen}
        onRequestClose={closeModal}
      >
        <div className="modal-wrapper">
          <div className="modal-inner">
            <input
              type="file"
              id="imageUpload"
              accept=".svg"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div className="boxes-modal">
              <button className="contact-close" onClick={closeModal}>
                &#10006;
              </button>
              <h3>Biz bilan bog’lanish</h3>
              <input
                className="url-input"
                type="text"
                name="name"
                id="name"
                value={name}
                autoComplete="off"
                placeholder="Ichtimoyi tarmoqlar nomni yozni"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="url-input"
                type="text"
                name="url"
                id="url"
                placeholder="Link yuborish"
                value={imgaeData.url}
                onChange={handleInputChange}
                autoComplete="off"
              />
              <button className="btn-button-file" onClick={handleUploadClick}>
                <img className="Shablon" src={Shablon} alt="" width={465} />
              </button>
              {file && (
                <img
                  className="selected-image"
                  src={URL.createObjectURL(file)}
                  alt="Selected"
                  width={200}
                  height={200}
                />
              )}

              <button className="btn-post" onClick={handlePostData}>
                Saqlash
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Contact;
