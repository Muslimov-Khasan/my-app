import "./FAQ.css";
import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import Trush_Icon from "../../Assets/img/Trush_Icon.png";

const FAQ = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faqItems, setFaqItems] = useState([]);
  const [formError, setFormError] = useState("");
  const [showActions, setShowActions] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFaqItem, setSelectedFaqItem] = useState(null);

  const [faqData, setFaqData] = useState({
    questionL: "",
    questionK: "",
    answerL: "",
    answerK: "",
  });

  const handleFormSubmitFaq = async (event) => {
    event.preventDefault();

    const storedToken = localStorage.getItem("authToken");
    const { questionL, questionK, answerL, answerK } = faqData;

    // Check if any input length is 0
    if (
      questionL.length === 0 ||
      questionK.length === 0 ||
      answerL.length === 0 ||
      answerK.length === 0
    ) {
      setFormError("Barcha malumotlarni to'ldirish shart ?!.");
      return;
    }

    const response = await fetch("https://avtowatt.uz/api/v1/faq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${storedToken}`,
      },
      body: JSON.stringify({
        questionL,
        questionK,
        answerL,
        answerK,
      }),
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();
      setFaqItems((prevFaqItems) => [...prevFaqItems, responseData]);
    }

    // Fetch updated FAQ data and clear form/error
    fetchDataFaq();
    setFormError("");
    closeModal();
  };

  const fetchDataFaq = async () => {
    const storedToken = localStorage.getItem("authToken");
    const response = await fetch("https://avtowatt.uz/api/v1/faq/all", {
      method: "GET", // GET method
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    const data = await response.json();
    setFaqItems(data);
  };

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

  useEffect(() => {
    fetchDataFaq();
  }, []);

  const handleDeleteClick = async (faqItemId) => {
    const storedToken = localStorage.getItem("authToken");
    await fetch(`https://avtowatt.uz/api/v1/faq/${faqItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });

    setFaqItems((prevFaqItems) =>
      prevFaqItems.filter((item) => item.id !== faqItemId)
    );
  };

  const handleInputChange = (name, value) => {
    if (name === "questionL") {
      let convertWord = convertUzbekLatinToCyrillic(value);
      convertWord = convertWord.charAt(0).toUpperCase() + convertWord.slice(1);
      setFaqData((prevData) => ({
        ...prevData,
        ["questionK"]: convertWord,
      }));
    }
    if (name === "answerL") {
      let convertWord = convertUzbekLatinToCyrillic(value);
      convertWord = convertWord.charAt(0).toUpperCase() + convertWord.slice(1);
      setFaqData((prevData) => ({
        ...prevData,
        ["answerK"]: convertWord,
      }));
    }
    setFaqData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError("");
    setFaqData({
      questionL: "",
      questionK: "",
      answerL: "",
      answerK: "",
    });
  };

  const handleActionsClick = (index) => {
    setShowActions((prevShowActions) =>
      prevShowActions === index ? null : index
    );
  };

  const openDeleteModal = (faqItem) => {
    setSelectedFaqItem(faqItem);
    setIsDeleteModalOpen(true);
    handleActionsClick(null)
  };

  const closeDeleteModal = () => {
    setSelectedFaqItem(null);
    setIsDeleteModalOpen(false);
  };

  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <div className="container">
      <div className="admin-wrapper">
        <Nav />
        <div className="news-box">
          <h1 className="news-title">FAQ</h1>
          <button className="modal-btn" onClick={openModal}>
            ➕ FAQ
          </button>
        </div>
        {faqItems.length === 0 && (
          <p className="loading-text">Yuklanmoqda...</p>
        )}

        <ul className="news-list">
          {faqItems.map((faqItem) => (
            <li className="news-item" key={faqItem.id}>
              <button
                className="news-btn"
                onClick={() => handleActionsClick(faqItem.id)}
              >
                &#x22EE;
              </button>
              {showActions === faqItem.id && (
                <div key={`actions-${faqItem.id}`}>
                  <button
                    className="new-delete"
                    onClick={() => openDeleteModal(faqItem)}
                  >
                    <img src={Trush_Icon} alt="Trush" width={25} height={25} />{" "}
                    O'chirish
                  </button>
                </div>
              )}
              <h2 className="new-title">{faqItem.question}</h2>
              <p className="news-content">{faqItem.answer}</p>
            </li>
          ))}
        </ul>
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
            <h2 className="modal-title">FAQ qo’shish</h2>
          </div>
          <form className="modal-form" onSubmit={handleFormSubmitFaq}>
            <h2 className="form-error">{formError}</h2>

            <label htmlFor="adminName">Savol</label>
            <input
              className="adminName"
              type="text"
              id="adminName"
              name="fullName"
              autoComplete="off"
              placeholder="Savol"
              value={faqData.questionL}
              onChange={(e) => handleInputChange("questionL", e.target.value)}
            />
            <label htmlFor="Comment">Jovob</label>
            <textarea
              className="comment"
              type="text"
              id="Comment"
              name="comment"
              autoComplete="off"
              value={faqData.answerL}
              placeholder="Jovob"
              onChange={(e) => handleInputChange("answerL", e.target.value)}
            />
            <label htmlFor="adminName">Савол</label>

            <input
              className="adminName"
              type="text"
              id="adminName"
              name="fullName"
              autoComplete="off"
              placeholder="Савол"
              value={faqData.questionK}
              onChange={(e) => handleInputChange("questionK", e.target.value)}
            />
            <label htmlFor="Comment">Жовоб</label>
            <textarea
              className="comment"
              type="text"
              id="Comment"
              name="comment"
              autoComplete="off"
              value={faqData.answerK}
              placeholder="Жовоб"
              onChange={(e) => handleInputChange("answerK", e.target.value)}
            />

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
          <h3 className="modal-delete-title">
          Haqiqatan ham oʻchirib tashlamoqchimisiz
          </h3>
          <button className="category-delete-modal" onClick={() => handleDeleteClick(selectedFaqItem.id)}>
            Xa
          </button>
          <button className="cancel-modal" onClick={closeDeleteModal}>Yo'q</button>
        </div>
      </Modal>
    </div>
  );
};

export default FAQ;
