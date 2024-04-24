import './Styles/Fatura.css';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

function TeDhenatFatura(props) {
  const [produktet, setProduktet] = useState([]);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const vendosFature = async () => {
      try {
        const produktet = await axios.get(
          `https://localhost:7251/api/TeNdryshme/Porosia/ShfaqTeDhenatEPorosis?nrPorosis=${props.faturaID ?? 61}`,
          authentikimi
        );

        setProduktet(produktet.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    vendosFature();
  }, [props.faturaID]);

  return (
    <>
      <div className="tabelaETeDhenaveProduktit">
        <table>
          <tr>
            <th>Nr.</th>
            <th>Emertimi</th>
            <th>Sasia</th>
            <th>Qmimi €</th>
            <th>Shuma €</th>
          </tr>
          {produktet.slice(props.ProduktiPare, props.ProduktiFundit).map((produkti, index) => (
            <tr key={index}>
              <td>{index + props.ProduktiPare + 1}</td>
              <td>{produkti.emriProduktit}</td>
              <td>{produkti.sasiaPorositur}</td>
              <td>{parseFloat(produkti.qmimiProduktit).toFixed(2)}</td>
              <td>{parseFloat(produkti.sasiaPorositur * produkti.qmimiProduktit).toFixed(2)}</td>
            </tr>
          ))}
        </table>
      </div>
    </>
  );
}

export default TeDhenatFatura;
