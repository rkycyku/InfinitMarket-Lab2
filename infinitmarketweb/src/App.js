import { Navigate, useNavigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/Dashboard";
import LogIn from "./Pages/LogIn";
import PerditesoTeDhenat from "./Pages/Gjenerale/TeDhenat/PerditesoTeDhenat";
import { useTitle } from "./Context/TitleProvider";
import { useEffect } from "react";
import { useState } from "react";
import NukKeniAkses from "./Pages/Gjenerale/NukKeniAkses";
import axios from "axios";

function App() {
  const { setTitle, aktivizoSetPerditeso } = useTitle();
  const [perditeso, setPerditeso] = useState(Date.now());
  const navigate = useNavigate();

  const getID = localStorage.getItem("id");

  const getToken = localStorage.getItem("token");

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  };

  useEffect(() => {
    setPerditeso(Date.now());
  }, [navigate]);

  useEffect(() => {
    setTitle(document.title.split("|")[0].trim());
    aktivizoSetPerditeso();
  }, [perditeso]);

  useEffect(() => {
    if (getID) {
      const vendosTeDhenat = async () => {
        try {
          const rolet = await axios.get(
            `https://localhost:7251/api/Perdoruesi/shfaqSipasID?idUserAspNet=${getID}`,
            authentikimi
          );

          if (rolet.data.rolet.includes("Student")) {
            await axios.post(
              `https://localhost:7251/api/Studentet/VendosTarifenMujore?studentiID=${getID}`,
              authentikimi
            );
          }
        } catch (err) {
          console.log(err);
        }
      };

      vendosTeDhenat();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route path="/Dashboard" element={<Dashboard key={Date.now()} />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/PerditesoTeDhenat" element={<PerditesoTeDhenat />} />
        <Route path="/NukKeniAkses" element={<NukKeniAkses />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
