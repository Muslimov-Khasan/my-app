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
    try {
      const storedToken = localStorage.getItem("authToken");
      const { titleL, titleK, messageL, messageK } = newsaddData;
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
      const responseData = await response.json();

      setnewsaddData({
        titleK: "",
        titleL: "",
        messageK: "",
        messageL: "",
      });
      setNewsItems((prevNewsItems) => [...prevNewsItems, responseData]);
    } catch (error) {
      setFormError(
        "Yangilik qo‘shib bo‘lmadi. Iltimos, yana bir bor urinib ko'ring.",
        error
      );
      return;
    }

    // Clear the input fields
    setnewsaddData({
      titleK: "",
      titleL: "",
      messageK: "",
      messageL: "",
    });

    closeModal();
  };

  const fetchDataNews = async () => {
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch("https://avtowatt.uz/api/v1/news/all", {
      method: "GET", // GET method
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setNewsItems(data);
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
  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <div className="container">
      <Nav />
      <div className="box">
        <h1 className="news-title">Yangilik nomi</h1>
        <button className="modal-btn" onClick={openModal}>
          +
        </button>
      </div>
      {newsItems.length === 0 && <p className="loading-text">Yuklanmoqda...</p>}

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
                  onClick={() => handleDeleteClick(newsItem.id)}
                >
                  <img src={Trush_Icon} alt="Trush" width={25} height={25} />{" "}
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
  );
};

export default News;