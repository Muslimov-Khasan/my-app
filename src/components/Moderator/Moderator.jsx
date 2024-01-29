import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Logo from "../../Assets/img/Logo.svg";
import LocationIcon from "../../Assets/img/location.svg";
import "./Moderator.css";

const Moderator = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalIsOpenDelete, setModalIsOpenDelete] = useState(false);
  const [productsItems, setproductsItems] = useState([]);
  const [productsItemsCheked, setproductsItemsCheked] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); // New state to hold the product being edited
  const [reportMessage, setReportMessage] = useState(""); // New state for report message
  const [modalIsOpenProductList, setModalIsOpenProductList] = useState(false);

  const openEditModal = async (productId) => {
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
    const productData = await response.json();
    setEditingProduct(productData);
    setModalIsOpen(true);
  };
  const openEditModalOK = async (productId) => {
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
    const productData = await response.json();
    setEditingProduct(productData);
    setModalIsOpenProductList(true);
  };

  const openModalProductList = () => {
    setModalIsOpenProductList(true);
  };

  const closeModalProductList = () => {
    setModalIsOpenProductList(false);
  };

  const openModalDelete = () => {
    setModalIsOpenDelete(true);
    closeModal();
  };

  const closeModalDelete = () => {
    setModalIsOpenDelete(false);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

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
    setproductsItems(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchDataCheked = async () => {
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch(
      `https://avtowatt.uz/api/v1/products/get-all-by-check/${true}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      }
    );

    const data = await response.json();
    setproductsItemsCheked(data);
  };

  useEffect(() => {
    fetchDataCheked();
  }, []);

  const handleUpdateProduct = async () => {
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch(
      `https://avtowatt.uz/api/v1/products/${editingProduct.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(editingProduct),
      }
    );

    // Handle successful update
    setModalIsOpen(false); // Close the modal after updating
    fetchData(); // Fetch data to update the product list
    fetchDataCheked();
  };

  const handleCreateReport = async (event) => {
    event.preventDefault();
    const storedToken = localStorage.getItem("authToken");

    // Make a POST request to create a report
    const response = await fetch("https://avtowatt.uz/api/v1/report/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        message: reportMessage,
        productId: editingProduct.id, // Assuming editingProduct is the current product being edited
      }),
    });
    setModalIsOpenDelete(false); // Close the modal after creating the report
    setReportMessage(""); // Reset the reportMessage state to an empty string
    const data = response.json();
  };
  Modal.setAppElement("#root"); // Assuming your root element has the id "root"
  return (
    <>
      <img className="logo" src={Logo} alt="logo" width={164} height={42} />
      <h2 className="moderator-title">Yangi qo’shilgan</h2>
      <div className="manko">
        <div className="contianer-fulid">
          <div className="all">
            <ul className="product-list-checked">
              {productsItems.map((product, index) => (
                <li
                  className="product-item-checked"
                  key={index}
                  onClick={() => openEditModal(product.id)} // Open edit modal when clicked
                >
                  <img
                    src={product.photoUrl}
                    alt={product.name}
                    width={170}
                    height={160}
                  />
                  <div className="wrapper-location">
                    <h2 className="product-title">{product.name}</h2>
                    <p className="product-text-checked">
                      {product.description.length > 60
                        ? product.description.slice(0, 60) + "..."
                        : product.description}{" "}
                    </p>
                    <div className="voydod">
                      <img
                        className="location-icon"
                        src={LocationIcon}
                        alt="Location-Icon"
                        width={18}
                        height={23}
                      />
                      <div className="go">
                        <p className="location-word">{product.region}</p>
                        <p className="kg">{product.weight} kg</p>
                        <p className="price">{product.price} So'm</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="contianer-fulid">
          <div className="all">
            <ul className="product-list">
              {productsItemsCheked.map((productCheked, index) => (
                <li
                  className="product-item"
                  key={index}
                  onClick={() => openEditModalOK(productCheked.id)}
                >
                  <img
                    src={productCheked.photoUrl}
                    alt={productCheked.name}
                    width={170}
                    height={160}
                  />
                  <div className="wrapper-location">
                    <h2 className="product-title">{productCheked.name}</h2>
                    <p className="product-text">
                      {" "}
                      {productCheked.description.length > 60
                        ? productCheked.description.slice(0, 60) + "..."
                        : productCheked.description}
                    </p>
                    <div className="voydod">
                      <img
                        className="location-icon"
                        src={LocationIcon}
                        alt="Location-Icon"
                        width={18}
                        height={23}
                      />
                      <div className="go">
                        <p className="location-word">{productCheked.region}</p>
                        <p className="kg">{productCheked.weight} kg</p>
                        <p className="price">{productCheked.price} So'm</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        className="react-modal-moderator"
        overlayClassName="react-modal-overlay"
        onRequestClose={closeModal}
        contentLabel="Example Modal"
      >
        <div className="contianer">
          <div className="modal-content">
            <div className="good">
              <button className="product-btn" onClick={closeModal}>
                &#10006;
              </button>

              <div className="comment-wrapper">
                <p className="product-word">
                  {editingProduct?.category.name} Mahsulot nomi
                </p>
                <p className="product-word">
                  {editingProduct?.category.category.name} category nomi
                </p>
              </div>
              <div className="imgages">
                <div className="form-lord">
                  <img
                    className="photoUrl-img"
                    src={editingProduct?.imageList}
                    alt=""
                    width={96}
                    height={96}
                  />
                </div>
              </div>

              <div className="form-price">
                <p className="contact-price">{editingProduct?.price} narxi</p>
                <p className="contact-weight">{editingProduct?.weight} Vazni</p>
              </div>
              <div className="contact-info">
                <p className="comment-word">{editingProduct?.description}</p>
              </div>
              <div className="region-wrapper">
                <p className="region-word">{editingProduct?.region} viloyat</p>
                <p className="region-words">{editingProduct?.district} Tuman</p>
              </div>
              <p className="contact-text">
                Aloqa uchun qo’shimcha telefon raqam
              </p>
              <a
                className="contact-text"
                href={`tel:${editingProduct?.additionalPhone?.replace(
                  /\D/g,
                  ""
                )}`}
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                  color: "#000",
                }}
              >
                {editingProduct?.additionalPhone}
              </a>

              <div className="wrapper-button">
                <button className="modal-delete" onClick={openModalDelete}>
                  Shikoyat
                </button>
                <button
                  className="confirmation-confirmation"
                  onClick={handleUpdateProduct}
                >
                  Tasdiqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpenProductList}
        className="react-modal-moderator"
        overlayClassName="react-modal-overlay"
        onRequestClose={closeModalProductList}
        contentLabel="Product List Modal"
      >
        <div className="contianer">
          <div className="modal-content">
            <div className="good">
              <button className="product-btn" onClick={closeModal}>
                &#10006;
              </button>

              <div className="comment-wrapper">
                <p className="product-word">
                  {editingProduct?.category.name} Mahsulot nomi
                </p>
                <p className="product-word">
                  {editingProduct?.category.category.name} category nomi
                </p>
              </div>
              <div className="imgages">
                <div className="form-lord">
                  <img
                    className="photoUrl-img"
                    src={editingProduct?.imageList}
                    alt=""
                    width={96}
                    height={96}
                  />
                </div>
              </div>

              <div className="form-price">
                <p className="contact-price">{editingProduct?.price} narxi</p>
                <p className="contact-weight">{editingProduct?.weight} Vazni</p>
              </div>
              <div className="contact-info">
                <p className="comment-word">{editingProduct?.description}</p>
              </div>
              <div className="region-wrapper">
                <p className="region-word">{editingProduct?.region} viloyat</p>
                <p className="region-words">{editingProduct?.district} Tuman</p>
              </div>
              <p className="contact-text">
                Aloqa uchun qo’shimcha telefon raqam
              </p>
              <a
                className="contact-text"
                href={`tel:${editingProduct?.additionalPhone?.replace(
                  /\D/g,
                  ""
                )}`}
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                  color: "#000",
                }}
              >
                {editingProduct?.additionalPhone}
              </a>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modalIsOpenDelete}
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        onRequestClose={closeModalDelete}
        contentLabel="Example Modal"
      >
        <div>
          <button className="moderator-btn" onClick={closeModalDelete}>
            &#10006;
          </button>
          <form className="form-comment">
            <label htmlFor="Shikoyat haqida qisqacha izoh *">
              Shikoyat haqida qisqacha izoh
            </label>
            <textarea
              cols="30"
              rows="10"
              placeholder="Izoh"
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
            ></textarea>
            <button className="confirmation-btn" onClick={handleCreateReport}>
              Tasdiqlash
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Moderator;
