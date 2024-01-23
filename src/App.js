import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./page/Login/Login";
import Category from "./components/category/category";
import ImageUpload from "./components/Banner/Banner";
import News from "./components/News/News";
import Header from "./components/Header/Header";
import AddCategory from "./components/addcategory/addcategory";
import Monitoring from "./components/Monitoring/Monitoring";
import FAQ from "./components/FAQ/FAQ";
import Users from "./components/users/users";
import Moderator from "./components/Moderator/Moderator";
import Contact from "./components/Contact/Contact";
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Monitoring" element={<Monitoring />} />
        <Route path="/add-category" element={<AddCategory />} />
        <Route path="/category" element={<Category />} />
        <Route path="/adminAdd" element={<Header />} />
        <Route path="/news" element={<News />} />
        <Route path="/users" element={<Users />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/Moderator" element={<Moderator />} />
        <Route path="/image-upload" element={<ImageUpload />} />
        <Route path="/Contact" element={<Contact/>} />
      </Routes>
    </div>
  );
}
export default App;
