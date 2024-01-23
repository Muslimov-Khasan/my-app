import React, { useEffect, useState } from "react";
import { imageDb } from "../firebase/firebase";
import Modal from "react-modal";
import Edit from "../../Assets/img/edit.png";
import Shablon from "../../Assets/img/imge-add.png";
import Trush_Icon from "../../Assets/img/Trush_Icon.png";
import { v4 } from "uuid";
import Nav from "../Nav/Nav";
import "./catolog.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NavLink } from "react-router-dom";
const Catolog = () => {
  const [img, setImg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formError, setFormError] = useState("");
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [toggleStatus, setToggleStatus] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [catalogData, setcatalogData] = useState({
    nameK: "",
    nameL: "",
    photoUrl: "",
  });

  const [editCatalogData, setEditCatalogyData] = useState({
    nameK: "",
    nameL: "",
    photoUrl: "",
  });
  const shouldAddClass = true;

  const handleFormSubmitCatalog = async (event) => {
    event.preventDefault();

    try {
      const storedToken = localStorage.getItem("authToken");
      const { nameK, nameL } = catalogData;
      const response = await fetch(`http://188.225.10.97:8080/api/v1/catalog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          nameK,
          nameL,
          status: "ACTIVE",
          photoUrl: imageUrl,
        }),
      });

      const responseData = await response.json();

      const imgRef = ref(imageDb, responseData.photoStoragePath);
      const imgUrl = await getDownloadURL(imgRef);
      setcatalogData({ ...catalogData, photoUrl: imgUrl });
      setCategories((prevCategories) => [
        ...prevCategories,
        { name: newCategory, photoUrl: imgUrl },
      ]);
      setcatalogData({ ...catalogData, photoUrl: imgUrl });

      setCategories((prevCategories) => [
        ...prevCategories,
        { name: newCategory, photoUrl: imgUrl },
      ]);

      if (selectedCategory !== null) {
        setCategories((prevCategories) =>
          prevCategories.map((category, index) =>
            index === selectedCategory
              ? { ...category, name: newCategory }
              : category
          )
        );
        setSelectedCategory(null);
      } else {
        setCategories((prevCategories) => [
          ...prevCategories,
          { name: newCategory, photoUrl: imgUrl },
        ]);
      }

      setNewCategory("");
      setFormError("");
      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      window.location.reload();
    }
  };

  const updateCatalog = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");

      if (
        categories.length === 0 ||
        selectedCategory === null ||
        !categories[selectedCategory]
      ) {
        return;
      }

      const { nameK, nameL } = catalogData;

      // Get the ID of the selected catalog
      const catalogIdToUpdate = categories[selectedCategory].id;

      const response = await fetch(
        `http://188.225.10.97:8080/api/v1/catalog/update/${catalogIdToUpdate}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({
            nameK,
            nameL,
            photoUrl: imageUrl,
          }),
        }
      );
      // Successfully updated category
      const responseData = await response.json();

      // Additional logic if needed after successful update
    } catch (error) {
      console.log("Error updating category:", error);
    }
  };

  useEffect(() => {
    updateCatalog();
  }, []);

  const fetchDataGetCatalog = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const responseGet = await fetch(
        "http://188.225.10.97:8080/api/v1/catalog/all",
        {
          method: "GET", // GET method
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      const data = await responseGet.json();
      setCategories(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataGetCatalog();
  }, []);

  const openEditModal = (category) => {
    setEditCatalogyData({
      nameK: category.nameK,
      nameL: category.nameL,
      photoUrl: category.photoUrl,
    });
    setSelectedCategory(category.id);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (index) => {
    setEditCatalogyData({
      nameK: categories[index].nameK,
      nameL: categories[index].nameL,
      photoUrl: categories[index].photoUrl,
    });
    setSelectedCategory(index);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditCatalogyData({
      nameK: "",
      nameL: "",
      photoUrl: "",
    });
    setSelectedCategory(null);
    setFormError("");
  };

  const handleDeleteClick = async (index) => {
    const storedToken = localStorage.getItem("authToken");
    const catalogIDToDelete = categories[index].id;

    const responseDelete = await fetch(
      `http://188.225.10.97:8080/api/v1/catalog/${catalogIDToDelete}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      }
    );

    // Check if the deletion was successful (status code 200)
    if (responseDelete.ok) {
      // If deletion is successful, update the state to reflect the change
      setCategories((prevCategories) =>
        prevCategories.filter((_, i) => i !== index)
      );
    } else {
      // Handle the case where deletion was not successful
      console.error("Error deleting category:", responseDelete.status);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormError("");
  };

  const handleToggle = () => {
    setToggleStatus(!toggleStatus); // Toggle the status
  };
  const handleFileChange = async (event) => {
    event.preventDefault();
    const selectedFile = event.target.files[0];

    try {
      const imgRef = ref(imageDb, `files/${v4()}`);
      await uploadBytes(imgRef, selectedFile);
      const imgUrl = await getDownloadURL(imgRef);

      setFile(selectedFile);
      setImg(imgUrl); // Set the state img with the URL of the uploaded image
      setcatalogData({ ...catalogData, photoUrl: imgUrl });
    } catch (error) {
      console.log("Error uploading file:", error.message);
    }
  };

  const handleUploadClick = async (event) => {
    event.preventDefault();
    document.getElementById("imageUpload").click();
    const imgRef = ref(imageDb, `files/${v4()}`);
    await uploadBytes(imgRef, file);
    const imgUrl = await getDownloadURL(imgRef);
    setImageUrl(imgUrl);
  };

  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <div className="contianer">
      <Nav />
      <div>
        <NavLink
          className={`wrapper-link ${shouldAddClass ? "newClass" : ""}`}
          to="/add-category"
        >
          Katolog
        </NavLink>
        <NavLink
          className={`wrapper-link ${shouldAddClass ? "" : ""}`}
          to="/category"
        >
          Kategoriya
        </NavLink>
      </div>
      <div className="uf">
        <h1 className="header-title">Katolog qo’shish</h1>
        <button className="category-btn" onClick={openModal}>
          +
        </button>
      </div>
      <Modal
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        isOpen={isModalOpen}
        onRequestClose={closeModal}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button className="close-btn" onClick={closeModal}>
              &#10006;
            </button>
            <h2 className="modal-title">Kategoriya qo’shish</h2>
          </div>
          <form className="modal-form" onSubmit={handleFormSubmitCatalog}>
            <input
              type="file"
              id="imageUpload"
              accept=".png, .jpg, .jpeg"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <label htmlFor="categoryL">Kategoriya nomi (L)</label>
            <input
              className="category-input"
              type="text"
              id="categoryL"
              name="category.nameL"
              autoComplete="off"
              placeholder="Kategoriya nomi (L)"
              value={catalogData.nameL}
              onChange={(e) =>
                setcatalogData({ ...catalogData, nameL: e.target.value })
              }
            />
            {formError && <p className="form-error">{formError}</p>}

            <label htmlFor="categoryK">Katolog nomi (K)</label>
            <input
              className="category-input"
              type="text"
              id="katologK"
              name="katolog.nameK"
              autoComplete="off"
              placeholder="Katolog nomi (K)"
              value={catalogData.nameK}
              onChange={(e) =>
                setcatalogData({ ...catalogData, nameK: e.target.value })
              }
            />
            <div>{imageUrl && <img src={imageUrl} alt="" />}</div>

            <button className="save-btn" type="submit">
              Saqlash
            </button>
          </form>
          <div>
            <button className="btn-file" onClick={handleUploadClick}>
              <img
                className="Shablon"
                src={Shablon}
                alt="Shablon"
                width={465}
              />
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button className="close-btn" onClick={() => closeEditModal()}>
              &#10006;
            </button>
            <h2 className="modal-title">Kategoriya qo’shish</h2>
          </div>
          <form className="modal-form" onSubmit={updateCatalog}>
            <input
              type="file"
              id="imageUpload"
              accept=".png, .jpg, .jpeg"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <label htmlFor="categoryL">Kategoriya nomi (L)</label>
            <input
              className="category-input"
              type="text"
              id="categoryL"
              name="category.nameL"
              autoComplete="off"
              placeholder="Kategoriya nomi (L)"
              value={catalogData.nameL}
              onChange={(e) =>
                setcatalogData({ ...catalogData, nameL: e.target.value })
              }
            />
            {formError && <p className="form-error">{formError}</p>}

            <label htmlFor="categoryK">Kategoriya nomi (K)</label>
            <input
              className="category-input"
              type="text"
              id="categoryK"
              name="category.nameK"
              autoComplete="off"
              placeholder="Kategoriya nomi (K)"
              value={catalogData.nameK}
              onChange={(e) =>
                setcatalogData({ ...catalogData, nameK: e.target.value })
              }
            />
            <div>
              {imageUrl && <img src={imageUrl} alt="" className="rasm" />}
            </div>

            <button className="save-btn" type="submit">
              Yangilash
            </button>
          </form>
          <div>
            <button className="btn-file" onClick={handleUploadClick}>
              <img
                className="Shablon"
                src={Shablon}
                alt="Shablon"
                width={465}
              />
            </button>
          </div>
        </div>
      </Modal>
      <table className="table-catolog">
        <thead>
          <tr>
            <th>ID</th>
            <th>Kategoriya nomi</th>
            <th>Категория номи</th>
            <th>Status</th>
            <th>Rasm</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{category.nameL}</td>
              <td>{category.nameK}</td>
              <td>
                <div className="toggle-wrapper">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={toggleStatus}
                      onChange={handleToggle}
                    />
                    <span className="slider round"></span>
                  </label>
                  {toggleStatus && (
                    <p className="toggle-message">{category.status}</p>
                  )}
                </div>
              </td>

              <td>
                <img src={category.photoUrl} alt="logo" width={100} />
              </td>
              <td>
                <button
                  className="card-btn"
                  onClick={() => {
                    setSelectedCategory((prevIndex) => {
                      const indexToStore = prevIndex !== null ? prevIndex : 0;
                      localStorage.setItem(
                        "deleted_id",
                        categories[indexToStore].id
                      ); // Use categories[indexToStore].id instead of category.id
                      return prevIndex === index ? null : index;
                    });
                  }}
                >
                    
                  &#x22EE;
                </button>
                {selectedCategory !== null && selectedCategory === index && (
                  <div className="catolog-buttons">
                    <button
                      className="button-delete"
                      onClick={() => handleDeleteClick(index)}
                    >
                      <img
                        src={Trush_Icon}
                        alt="Trush"
                        width={25}
                        height={25}
                      />
                      O’chirish
                    </button>
                    <button
                      className="button-edit"
                      onClick={() => handleEditClick(index)}
                    >
                      <img src={Edit} alt="Edit" height={25} />
                      Edit
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Catolog;
export { imageDb };
