import { Link } from 'react-router-dom';
import './Styles/produktet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import Mesazhi from './Mesazhi';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';

function ProduktetNeHome(props) {
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('success');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [perditeso, setPerditeso] = useState(Date.now());
  const [shporta, setShporta] = useState([]);

  const getToken = localStorage.getItem('token');
  const getID = localStorage.getItem('id');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const ShfaqTeDhenat = async () => {
      try {
        const shporta = await axios.get(
          `https://localhost:7251/api/Produktet/Shporta/shfaqProduktetEShportes?userID=${getID}`,
          authentikimi
        );
        setShporta(shporta.data);
      } catch (err) {
        console.log(err);
      }
    };

    ShfaqTeDhenat();
  }, [perditeso]);

  const handleShtoNeShporte = async () => {
    const eshteNeShporte = shporta.find((item) => item.produktiID === props.produktiID);

    console.log(eshteNeShporte);

    if (eshteNeShporte && eshteNeShporte.sasiaProduktitNeShporte >= eshteNeShporte.sasiaStokutAktual) {
      setTipiMesazhit('danger');
      setPershkrimiMesazhit(
        `Sasia maksimale per <strong>${props.emriProduktit}</strong> eshte <strong>${eshteNeShporte.sasiaStokutAktual}</strong> ne shporte!`
      );
      setShfaqMesazhin(true);
    } else {
      await axios.post(
        `https://localhost:7251/api/Produktet/Shporta/shtoProduktinNeShporte?userID=${getID}&ProduktiID=${props.produktiID}`,
        {},
        authentikimi
      );
      setTipiMesazhit('success');
      setPershkrimiMesazhit(`<strong>${props.emriProduktit}</strong> u shtua ne shporte!`);
      setShfaqMesazhin(true);
    }
  };

  return (
    <div className="artikulli" key={props.produktiID} data-aos="zoom-in">
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
      <Link to={`/produktet/${props.produktiID}`}>
        <div className="emri-foto">
          {props.cmimiMeZbritje != null && (
            <div className="zbritjaBadge">
              <p className="">
                - {props.cmimiMeZbritje != null && (((props.cmimi - props.cmimiMeZbritje) / props.cmimi) * 100).toFixed(0)} %
              </p>
            </div>
          )}
          <img src={`${process.env.PUBLIC_URL}/img/produktet/${props.fotoProduktit}`} alt={props.emriProduktit} />
          <p className="artikulliLabel">{props.emriProduktit}</p>
        </div>
      </Link>
      <div className="cmimet">
        <p className="cmimi">{props.cmimiMeZbritje != null ? parseFloat(props.cmimiMeZbritje).toFixed(2) : props.cmimi.toFixed(2)} €</p>
        <p className="cmimiPaZbritje">{props.cmimiMeZbritje != null && props.cmimi.toFixed(2) + ' €'} </p>
      </div>
      <div className="butonatDiv">
        {props.sasiaNeStok > 0 && (
          <Button onClick={handleShtoNeShporte}>
            Shto ne Shporte <FontAwesomeIcon icon={faCartShopping} />
          </Button>
        )}
        {props.sasiaNeStok <= 0 && (
          <Button disabled style={{ backgroundColor: 'lightgray', color: 'black', cursor: 'unset', marginTop: '0' }}>
            Out of Stock
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProduktetNeHome;
