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
    try {
      const responseData = await response.json();
      setFaqItems((prevFaqItems) => [...prevFaqItems, responseData]);
      console.log(responseData);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      // Handle the error appropriately
    }

    fetchDataFaq();
    setFormError("");
    closeModal();
  };

  const fetchDataFaq = async () => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const response = await fetch("https://avtowatt.uz/api/v1/faq/all", {
        method: "GET", // GET method
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setFaqItems(data);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
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

  Modal.setAppElement("#root"); // Assuming your root element has the id "root"

  return (
    <div className="container">
      <Nav />
      <div className="box">
        <h1 className="news-title">FAQ</h1>
        <button className="modal-btn" onClick={openModal}>
          +
        </button>
      </div>
      {faqItems.length === 0 && <p className="loading-text">Yuklanmoqda...</p>}

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
                  onClick={() => handleDeleteClick(faqItem.id)}
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
  );
};

export default FAQ;