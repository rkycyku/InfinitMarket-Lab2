import { Link } from 'react-router-dom';
import '../Styles/produktet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faCartShopping, faFaceFrown, faHeart, faHeartCrack } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartZbarzur } from '@fortawesome/free-regular-svg-icons';

import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios';
import Mesazhi from '../Mesazhi';

function ProduktetNeHome(props) {
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('success');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [perditeso, setPerditeso] = useState(Date.now());

  const [shporta, setShporta] = useState([]);
  const [eshteNeListenEDeshirave, setEshteNeListenEDeshirave] = useState();

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

        const listaEDeshirave = await axios.get(
          `https://localhost:7251/api/Produktet/Shporta/KontrolloProduktinNeListenEDeshirave?userID=${getID}&ProduktiID=${props.produktiID}`,
          authentikimi
        );
        setEshteNeListenEDeshirave(listaEDeshirave.data);
      } catch (err) {
        console.log(err);
      }
    };

    ShfaqTeDhenat();
  }, [perditeso]);

  const handleShtoNeShporte = async () => {
    const eshteNeShporte = shporta.find((item) => item.produktiID === props.produktiID);

    if (eshteNeShporte && eshteNeShporte.sasiaProduktitNeShporte >= eshteNeShporte.sasiaStokutAktual) {
      setTipiMesazhit('danger');
      setPershkrimiMesazhit(
        `Sasia maksimale per <span>${props.emriProduktit}</span> eshte <span>${eshteNeShporte.sasiaStokutAktual}</span> ne shporte!`
      );
      setShfaqMesazhin(true);
    } else {
      await axios.post(
        `https://localhost:7251/api/Produktet/Shporta/shtoProduktinNeShporte?userID=${getID}&ProduktiID=${props.produktiID}`,
        {},
        authentikimi
      );
      setTipiMesazhit('success');
      setPershkrimiMesazhit(`<span>${props.emriProduktit}</span> u shtua ne shporte!`);
      setShfaqMesazhin(true);
    }
  };

  async function handleListenEDeshirave(lloji) {
    if (lloji == 'shto') {
      await axios.post(
        `https://localhost:7251/api/Produktet/Shporta/ShtoProduktinNeListenEDeshirave?userID=${getID}&ProduktiID=${props.produktiID}`,
        {},
        authentikimi
      );
      setTipiMesazhit('success');
      setPershkrimiMesazhit(`<span>${props.emriProduktit}</span> u shtua në listën e dëshirave!`);
    } else {
      await axios.delete(
        `https://localhost:7251/api/Produktet/Shporta/LargoProduktinNgaListaEDeshirave?ListaEDeshiraveID=${eshteNeListenEDeshirave.listaEDeshiraveID}`,
        authentikimi
      );
      setTipiMesazhit('success');
      setPershkrimiMesazhit(`<span>${props.emriProduktit}</span> u largua nga lista e dëshirave!`);
    }
    setShfaqMesazhin(true);

    if (props.perditeso) {
      props.perditeso;
      console.log(props.perditeso);
    }
    setPerditeso(Date.now());
  }

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
          <Button variant="success" onClick={handleShtoNeShporte}>
            SHTO NË SHPORTË
          </Button>
        )}
        {props.sasiaNeStok <= 0 && (
          <Button disabled variant="secondary">
            JASHTË STOKU
          </Button>
        )}
        {eshteNeListenEDeshirave ? (
          <Button variant='info' onClick={() => handleListenEDeshirave('largo')}>
            <FontAwesomeIcon icon={faHeartCrack} />
          </Button>
        ) : (
          <Button variant='outline-info' onClick={() => handleListenEDeshirave('shto')}>
            <FontAwesomeIcon icon={faHeart} />
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProduktetNeHome;
