import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const TitleContext = createContext();


export const useTitle = () => useContext(TitleContext);

export const TitleProvider = ({ children }) => {
  const getID = localStorage.getItem("id");
  const getToken = localStorage.getItem("token");
  
  const [perditeso, setPerditeso] = useState("");

  const [title, setTitle] = useState("");
  const [emri, setEmri] = useState("");
  const [mbiemri, setMbiemri] = useState("");
  const [rolet, setRolet] = useState([]);

  const [resetoFaqen, setResetoFaqen] = useState(0);

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  };
  useEffect(() => {
    if (getID) {
      const vendosTeDhenat = async () => {
        try {
          const perdoruesi = await axios.get(
            `https://localhost:7251/api/Perdoruesi/shfaqSipasID?idUserAspNet=${getID}`,
            authentikimi
          );
          setEmri(perdoruesi.data.emri);
          setMbiemri(perdoruesi.data.mbiemri);
          setRolet(perdoruesi.data.rolet);

        } catch (err) {
          console.log(err);
        }
      };

      vendosTeDhenat();

    }
  }, [perditeso]);

  function aktivizoSetPerditeso(){
    setPerditeso(Date.now());
  }

  return (
    <TitleContext.Provider value={{ title, setTitle, emri, mbiemri, rolet, aktivizoSetPerditeso}}>
      {children}
    </TitleContext.Provider>
  );
};
