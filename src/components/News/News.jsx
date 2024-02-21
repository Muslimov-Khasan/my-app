import "./News.css";
import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import Trush_Icon from "../../Assets/img/Trush_Icon.png";

const News = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newsItems, setNewsItems] = useState([]);
  const [formError, setFormError] = useState("");
  const [showActions, setShowActions] = useState(false);

  const [newsaddData, setnewsaddData] = useState({
    titleK: "",
    titleL: "",
    messageK: "",
    messageL: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNewsItem, setSelectedNewsItem] = useState(null);

  function convertUzbekLatinToCyrillic(uzbekLatinWord) {
    const uzbekLatinToCyrillicMapping = {
      a: "а",
      b: "б",
      d: "д",
      e: "е",
      f: "ф",
      g: "г",
      h: "ҳ",
      i: "и",
      j: "ж",
      k: "к",
      l: "л",
      m: "м",
      n: "н",
      o: "о",
      p: "п",
      q: "қ",
      r: "р",
      s: "с",
      t: "т",
      u: "у",
      v: "в",
      x: "х",
      y: "й",
      z: "з",
      sh: "ш",
      ch: "ч",
      ng: "нг",
    };

    const uzbekCyrillicWord = uzbekLatinWord
      .toLowerCase()
      .replace(/sh|ch|gh/g, (match) => uzbekLatinToCyrillicMapping[match])
      .replace(
        /[a-z]/g,
        (letter) => uzbekLatinToCyrillicMapping[letter] || letter
      );

    return uzbekCyrillicWord;
  }

  const handleFormSubmitNew = async (event) => {
    event.preventDefault();
    const { titleK, titleL, messageK, messageL } = newsaddData;
    if (
      titleK.length === 0 ||
      titleL.length === 0 ||
      messageK.length === 0 ||
      messageL.length === 0
    ) {
      setFormError("Barcha malumotlarni to'ldirish shart ?!.");
      return;
    }

    const storedToken = localStorage.getItem("authToken");

    const response = await fetch("https://avtowatt.uz/api/v1/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        titleK,
        titleL,
        messageK,
        messageL,
      }),
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      setNewsItems((prevNewsItems) => [...prevNewsItems, responseData]);
    }
    setnewsaddData({
      titleK: "",
      titleL: "",
      messageK: "",
      messageL: "",
    });
    fetchDataNews();
    closeModal();
  };

  const fetchDataNews = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const response = await fetch("https://avtowatt.uz/api/v1/news/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      setNewsItems(data);
      setFormError(""); // Clear any previous error messages
    } catch (error) {
      setFormError("Error fetching news data. Please try again later.");
    }
  };

  const handleInputChange = (name, value) => {
    if (name === "titleL") {
      let convertWord = convertUzbekLatinToCyrillic(value);
      convertWord = convertWord.charAt(0).toUpperCase() + convertWord.slice(1);
      setnewsaddData((prevData) => ({
        ...prevData,
        ["titleK"]: convertWord,
      }));
    }
    if (name === "messageL") {
      let convertWord = convertUzbekLatinToCyrillic(value);
      convertWord = convertWord.charAt(0).toUpperCase() + convertWord.slice(1);
      setnewsaddData((prevData) => ({
        ...prevData,
        ["messageK"]: convertWord,
      }));
    }
    setnewsaddData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    fetchDataNews();
  }, []);

  const handleDeleteClick = async (newsItemId) => {
    const storedToken = localStorage.getItem("authToken");
    await fetch(`https://avtowatt.uz/api/v1/news/${newsItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
    setNewsItems((prevNewsItems) =>
      prevNewsItems.filter((item) => item.id !== newsItemId)
    );
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setnewsaddData({
      titleK: "",
      titleL: "",
      messageK: "",
      messageL: "",
    });
  };

  const handleActionsClick = (index) => {
    setShowActions((prevShowActions) =>
      prevShowActions === index ? null : index
    );
  };

  const openDeleteModal = (newsItem) => {
    setSelectedNewsItem(newsItem);
    setIsDeleteModalOpen(true);
    handleActionsClick(null);
  };
  const closeDeleteModal = () => {
    setSelectedNewsItem(null);
    setIsDeleteModalOpen(false);
  };

  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <>
      {newsItems.length === 0 && <p className="loading-text">Yuklanmoqda...</p>}
      <div className="container">
        <div className="admin-wrapper">
          <Nav />
          <div className="news-box">
            <h1 className="news-title">Yangiliklar</h1>
            <button className="news-modal-btn" onClick={openModal}>
              ➕ Qo’shish
            </button>
          </div>

          <ul className="news-list">
            {newsItems.map((newsItem) => (
              <li className="news-item" key={newsItem.id}>
                <button
                  className="news-btn"
                  onClick={() => handleActionsClick(newsItem.id)}
                >
                  &#x22EE;
                </button>
                {showActions === newsItem.id && (
                  <div key={`actions-${newsItem.id}`}>
                    <button
                      className="new-delete"
                      onClick={() => openDeleteModal(newsItem)}
                    >
                      <img
                        src={Trush_Icon}
                        alt="Trush"
                        width={25}
                        height={25}
                      />{" "}
                      O'chirish
                    </button>
                  </div>
                )}
                <h2 className="new-title">{newsItem.title}</h2>
                <p className="news-content">{newsItem.message}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        onRequestClose={closeModal}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button className="news-close-btn" onClick={closeModal}>
              &#10006;
            </button>
            <h2 className="modal-title">Yangilik nomi</h2>
            <h2 className="form-error">{formError}</h2>
          </div>
          <form className="modal-form" onSubmit={handleFormSubmitNew}>
            <label htmlFor="adminName">
              Yangilik nomi
              <input
                className="adminName"
                type="text"
                id="adminName"
                name="fullName"
                autoComplete="off"
                placeholder="Yangilik nomi"
                value={newsaddData.titleL}
                onChange={(e) => handleInputChange("titleL", e.target.value)}
              />
            </label>
            <label htmlFor="Comment">
              Izoh
              <textarea
                className="comment"
                type="text"
                id="Comment"
                name="comment"
                autoComplete="off"
                placeholder="Izoh"
                value={newsaddData.messageL}
                onChange={(e) => handleInputChange("messageL", e.target.value)}
              />
            </label>
            <label htmlFor="adminName">
              Мавзу
              <input
                className="adminName"
                type="text"
                id="adminName"
                name="fullName"
                autoComplete="off"
                placeholder="Мавзу"
                value={newsaddData.titleK}
                onChange={(e) => handleInputChange("titleK", e.target.value)}
              />
            </label>
            <label htmlFor="Comment">
              Изоҳ
              <textarea
                className="comment"
                type="text"
                id="Comment"
                name="comment"
                autoComplete="off"
                placeholder="Изоҳ"
                value={newsaddData.messageK}
                onChange={(e) => handleInputChange("messageK", e.target.value)}
              />
            </label>

            <button className="save-btn" type="submit">
              Saqlash
            </button>
          </form>
        </div>
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        className="react-modal-content"
        overlayClassName="react-modal-overlay"
        onRequestClose={closeDeleteModal}
      >
        <div>
          <button className="news-close-btn" onClick={closeDeleteModal}>
            &#10006;
          </button>
          <h2 className="modal-delete-title">
            Haqiqatan ham oʻchirib tashlamoqchimisiz
          </h2>
          <button
            className="category-delete-modal"
            onClick={() => handleDeleteClick(selectedNewsItem.id)}
          >
            Xa
          </button>
          <button className="cancel-modal" onClick={closeDeleteModal}>
            Yo'q
          </button>
        </div>
      </Modal>
    </>
  );
};

export default News;