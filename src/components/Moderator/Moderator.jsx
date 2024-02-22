import "./Moderator.css";
import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import LocationIcon from "../../Assets/img/location.svg";
import { Link } from "react-router-dom";

const Moderator = () => {
  const [productsItems, setProductsItems] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [productId, setProductId] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [complaintModalIsOpen, setComplaintModalIsOpen] = useState(false);
  const [message, setMessage] = useState(""); // State for the report message

  useEffect(() => {
    fetchData();
  }, []); // Fetch data when the component mounts

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId.id);
    }
  }, [productId]); // Fetch product details when selectedProduct changes

  const fetchData = async () => {
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch(
      `https://avtowatt.uz/api/v1/products/get-all-by-check/${false}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      }
    );

    const data = await response.json();
    setProductsItems(data);
  };

  const fetchProductDetails = async (productId) => {
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch(
      `https://avtowatt.uz/api/v1/products/get-by-id/${productId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      }
    );

    const data = await response.json();
    setProductDetails(data);
  };

  const handleConfirmation = async () => {
    if (productId) {
      const storedToken = localStorage.getItem("authToken");

      await fetch(`https://avtowatt.uz/api/v1/products/${productId.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ productId }), // Assuming you want to update the status
      });
    }
    fetchData(); // refresh
    closeModal(); // Close the modal after confirmation (you can adjust this based on your requirements)
  };

  const handleCreateReport = async (event) => {
    event.preventDefault();
    const storedToken = localStorage.getItem("authToken");

    const response = await fetch("https://avtowatt.uz/api/v1/report/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        message: message,
        productId: productId.id,
      }),
    });
    // If the response status is OK, proceed with parsing JSON
    console.log(response.status);
    const data = await response.json();
    console.log(data);

    // Close the modal after creating the report
    setModalIsOpen(false);
  };

  const openModal = (product) => {
    setProductId(product);
    console.log(product.id);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setProductId(null);
    setProductDetails(null);
    setModalIsOpen(false);
  };

  const openComplaintModal = (event) => {
    event.preventDefault(); // Prevent the default form submission
    closeComplaintModal()
    if (productId) {
      setComplaintModalIsOpen(true);
      closeModal(); // Close the main modal if it's open
      handleCreateReport(event); // Pass the event object to handleCreateReport
      
    }
  };

  const closeComplaintModal = () => {
    setComplaintModalIsOpen(false);
  };

  const shouldAddClass = true;

  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <>
      <div className="contianer">
        <h2 className="moderator-title">Yangi qo’shilgan</h2>
        <div className="button-row">
          <div className="po">
            <Link
              className={`wrapper-link ${shouldAddClass ? "newClass" : ""}`}
              to="/Moderator"
            >
              Yangi qo’shilgan
            </Link>
            <Link
              className={`wrapper-link ${shouldAddClass ? "" : ""}`}
              to="/ModeratorCheked"
            >
              Tasdiqlangan
            </Link>
          </div>
        </div>
        <ul className="productcheked-list">
          {productsItems.map((product, index) => (
            <li
              className="productcheked-item"
              key={index}
              onClick={() => openModal(product)}
            >
              <img
                className="productcheked-img"
                src={product.photoUrl}
                alt=""
                width={280}
                height={180}
              />
              <p className="productcheked-region">
                <img src={LocationIcon} alt="" width={19} height={19} />{" "}
                {product.region}
              </p>
              <h2 className="productcheked-title">{product.name}</h2>
              <p className="productcheked-description">{product.description}</p>
              <div className="productcheked-wrapper">
                <p className="productcheked-price">{product.price} So'm</p>
                <p className="productcheked-weight">{product.weight} tonna</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Modal
        isOpen={modalIsOpen}
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        onRequestClose={closeModal}
      >
        <div>
          <button className="modal-close-button" onClick={closeModal}>
            &#10006;
          </button>
          {productDetails && (
            <>
              <div className="nimaaa">
                <p className="tesy">{productDetails.name} Nomi</p>
                <p className="tesy">{productDetails.category.category.name} Kategory nomi</p>
              </div>
              <div className="modal-img-container">
                {productDetails?.imageList.map((imageUrl, index) => (
                  <img
                    className="modal-img"
                    src={imageUrl}
                    alt="Description"
                    width={120}
                    height={120}
                    key={index}
                  />
                ))}
              </div>
              <div className="nimaaa">
                <p className="tesy">{productDetails.price} So'm</p>
                <p className="tesy">{productDetails.weight} tonna</p>
              </div>
              <div className="description">
                <p>{productDetails.description}</p>
              </div>
              <div className="infos">
                <p className="tesy">{productDetails.region}</p>
                <p className="tesy">{productDetails.address}</p>
                <p className="tesy">{productDetails.district}</p>
                <p className="tesy">{productDetails.status} Status</p>
                <p className="tesy">
                  {productDetails.category.createdDate} Vaqti
                </p>
              </div>
              <div className="moderator-buttons">
                <button className="complaint-btn" onClick={openComplaintModal}>
                  Shikoyat
                </button>
                <button
                  className="confirmation-btn"
                  onClick={handleConfirmation}
                >
                  Tasdiqlash
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={complaintModalIsOpen}
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        onRequestClose={closeComplaintModal}
      >
        <div>
          <button className="close-btn" onClick={closeComplaintModal}>
            &#10006;
          </button>
          <form className="form-comment" onSubmit={handleCreateReport}>
            <textarea
              cols="30"
              rows="10"
              placeholder="Izoh"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button
              className="confirmation-btn"
              onClick={(event) => openComplaintModal(event)}
            >
              Yuborish
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Moderator;
