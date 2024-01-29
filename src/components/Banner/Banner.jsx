import React, { useState, useEffect } from "react";
import { v4 } from "uuid";
import { imageDb } from "../firebase/firebase";
import { Link } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Shablon from "../../Assets/img/shablon.png";
import Trush_Icon_red from "../../Assets/img/Trush_Icon_red.svg";
import Modal from "react-modal";
import Nav from "../Nav/Nav";
import "./Banner.css";

const Banner = () => {
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [imgaeData, setImageData] = useState({
    url: "",
    imageUrl: "",
  });
  const [fetchedData, setFetchedData] = useState([]);
  
  const handleInputChange = (event) => {
    setImageData({ ...imgaeData, url: event.target.value });
  };

  useEffect(() => {
    // Fetch data using GET method when component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        "https://avtowatt.uz/api/v1/banner/all",
        {
          method: "GET", // GET method
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const data = await response.json();

      // Store fetched data in state
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
    const imgUrl = await getDownloadURL(imgRef);
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch("https://avtowatt.uz/api/v1/banner", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageUrl: imgUrl, // Use imgUrl instead of imageUrl
        url: imgaeData.url,
      }),
    });
    const data = await response.json();

    setImageData({ ...imgaeData, imageUrl: imgUrl }); // Update imageUrl
    fetchData();
    closeModal();
    resetFile(); 
    setImageData("")
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setImageData({
      url: "",
      imageUrl: "",
    });
  };

  const handleDeleteButtonClick = async (itemId) => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch(
        `https://avtowatt.uz/api/v1/banner/${itemId}`,
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
  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <>
      <div className="container">
        <Nav />
        <h2 className="banner-title">Banner</h2>
        <button className="banner-btn" onClick={openModal}>
          +
        </button>
        {fetchedData.length === 0 && <p className="loading-text">Yuklanmoqda...</p>}

        <div className="banner-wrapper">
          <div className="banner-inner">
            <ul className="banner-list">
              
              {fetchedData.map((item) => (
                <li key={item.id} className="banner-item">
                
                  <img
                    className="add-image"
                    src={item.imageUrl}
                    alt="imgage"
                  />
                  <Link className="url-link" to={item.url} target={"_blank"}>
                    {item.url}
                  </Link>
                  <button
                    className="banner-delete"
                    onClick={() => handleDeleteButtonClick(item.id)}
                  >
                    <img
                      className="trush-red"
                      src={Trush_Icon_red}
                      alt="Trush"
                      width={20}
                      height={20}
                    />
                    Oʻchirish
                  </button>
                </li>
              ))}
            </ul>
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
              accept=".png, .jpg, .jpeg"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div className="boxes-modal">
              <button className="banner-close" onClick={closeModal}>
                &#10006;
              </button>
              <h3 className="banner-title">Rasm Yuklash</h3>
              
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
              <input
                className="url-input"
                type="text"
                name="url"
                id="url"
                placeholder="Link yuborish (ixtiyoriy)"
                value={imgaeData.url}
                onChange={handleInputChange}
                autoComplete="off"
              />
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

export default Banner;