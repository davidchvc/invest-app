import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddCompany from "./components/addcompany";
import Company from "./components/company";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Company />} />
        <Route path="/addCompany" element={<AddCompany />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
