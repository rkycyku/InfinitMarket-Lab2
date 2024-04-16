import { useParams } from 'react-router-dom';
import './Styles/Produkti.css';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import ProduktetNeHome from '../components/ProduktetNeHome';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Mesazhi from '../components/Mesazhi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import EditoProduktin from './admin-dashboard/Produktet/ListaEProdukteve/EditoProduktin';
import Footer from '../components/Footer';
import { Button } from 'react-bootstrap';

function Produkti() {
  const { id } = useParams();
  const [produkti, setProdukti] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [kaPershkrim, setKaPershkrim] = useState(false);
  const [produktet, setProduktet] = useState([]);
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('success');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [edito, setEdito] = useState(false);
  const [teDhenat, setTeDhenat] = useState([]);

  const [shporta, setShporta] = useState([]);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  const getID = localStorage.getItem('id');

  useEffect(() => {
    if (getID) {
      const vendosTeDhenat = async () => {
        try {
          const perdoruesi = await axios.get(`https://localhost:7251/api/Perdoruesi/shfaqSipasID?idUserAspNet=${getID}`, authentikimi);
          setTeDhenat(perdoruesi.data);
        } catch (err) {
          console.log(err);
        }
      };

      vendosTeDhenat();
    }
  }, [perditeso]);

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

  useEffect(() => {
    const teDhenatProd = async () => {
      try {
        const teDhenatProduktit = await axios.get(
          `https://localhost:7251/api/Produktet/Produkti/ShfaqProduktinSipasIDsAll/${id}`,
          authentikimi
        );
        setProdukti(teDhenatProduktit.data);
        if (teDhenatProduktit.data.pershkrimi !== '') {
          setKaPershkrim(true);
        } else {
          setKaPershkrim(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    teDhenatProd();
  }, [perditeso, id]);

  useEffect(() => {
    const shfaqProduktet = async () => {
      try {
        const produktet = await axios.get('https://localhost:7251/api/Produktet/Produkti/Shfaq15ProduktetMeTeFundit', authentikimi);
        setProduktet(produktet.data);
      } catch (err) {
        console.log(err);
      }
    };

    shfaqProduktet();
  }, []);

  const handleShtoNeShporte = async () => {
    const eshteNeShporte = shporta.find((item) => item.produktiID === produkti.produktiId);

    console.log(eshteNeShporte);

    if (eshteNeShporte && eshteNeShporte.sasiaProduktitNeShporte >= eshteNeShporte.sasiaStokutAktual) {
      setTipiMesazhit('danger');
      setPershkrimiMesazhit(
        `Sasia maksimale per <strong>${produkti.emriProduktit}</strong> eshte <strong>${eshteNeShporte.sasiaStokutAktual}</strong> ne shporte!`
      );
      setShfaqMesazhin(true);
    } else {
      await axios.post(
        `https://localhost:7251/api/Produktet/Shporta/shtoProduktinNeShporte?userID=${getID}&ProduktiID=${produkti.produktiId}`,
        {},
        authentikimi
      );
      setTipiMesazhit('success');
      setPershkrimiMesazhit(`<strong>${produkti.emriProduktit}</strong> u shtua ne shporte!`);
      setShfaqMesazhin(true);
    }
  };

  useEffect(() => {
    const shfaqMesazhinStorage = localStorage.getItem('shfaqMesazhin');
    const pershkrimiMesazhitStorage = localStorage.getItem('pershkrimiMesazhit');
    const tipiMesazhitStorage = localStorage.getItem('tipiMesazhit');

    setShfaqMesazhin(shfaqMesazhinStorage === 'true');
    setPershkrimiMesazhit(pershkrimiMesazhitStorage || '');
    setTipiMesazhit(tipiMesazhitStorage || '');
    if (localStorage.getItem('shfaqMesazhinPasRef') === 'true') {
      setShfaqMesazhin(true);
    }
    localStorage.setItem('shfaqMesazhinPasRef', false);
  }, []);

  useEffect(() => {
    localStorage.setItem('shfaqMesazhin', shfaqMesazhin);
    localStorage.setItem('pershkrimiMesazhit', pershkrimiMesazhit);
    localStorage.setItem('tipiMesazhit', tipiMesazhit);
  }, [shfaqMesazhin, pershkrimiMesazhit, tipiMesazhit]);

  const handleEdito = (e) => {
    e.preventDefault();
    setEdito(true);
  };

  return (
    <div className="container">
      <Helmet>
        <title>{produkti.emriProduktit !== '' ? produkti.emriProduktit + ' | Tech Store' : 'Tech Store'}</title>
      </Helmet>
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
      {edito && (
        <EditoProduktin
          shfaq={edito}
          largo={() => setEdito(false)}
          id={produkti.produktiId}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      <div className="produkti">
        <div className="detajet">
          <div className="foto">
            <img src={`${process.env.PUBLIC_URL}/img/produktet/${produkti.fotoProduktit}`} alt={produkti.emriProduktit} />
          </div>
          <div>
            <div className="teDhenatProduktit">
              <table>
                <tbody>
                  <tr>
                    <th colSpan="2">
                      <h1 className="emriProd">{produkti.emriProduktit}</h1>
                    </th>
                  </tr>
                  <tr>
                    <td>Kompania:</td>
                    <td>
                      <Link to={`/Produktet/kompania/${produkti.emriKompanis}`}>{produkti.emriKompanis}</Link>
                    </td>
                  </tr>
                  <tr>
                    <td>Kategoria:</td>
                    <td>
                      <Link to={`/Produktet/kategoria/${produkti.llojiKategoris}`}>{produkti.llojiKategoris}</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="blerja">
              <form>
                <h5 className="qmimiPaZbritje">
                  {produkti.qmimiMeZbritjeProduktit != null && parseFloat(produkti.qmimiProduktit).toFixed(2) + ' €'}
                </h5>
                <h5>
                  {produkti.qmimiMeZbritjeProduktit != null &&
                    'Ju Kureseni: ' +
                      (produkti.qmimiProduktit - produkti.qmimiMeZbritjeProduktit).toFixed(2) +
                      ' €' +
                      ' (' +
                      (((produkti.qmimiProduktit - produkti.qmimiMeZbritjeProduktit) / produkti.qmimiProduktit) * 100).toFixed(0) +
                      '%)'}
                </h5>
                <h1 className="">
                  {produkti.qmimiMeZbritjeProduktit != null
                    ? parseFloat(produkti.qmimiMeZbritjeProduktit).toFixed(2)
                    : parseFloat(produkti.qmimiProduktit).toFixed(2)}{' '}
                  €
                </h1>
                <p>
                  {produkti.qmimiMeZbritjeProduktit != null
                    ? parseFloat(produkti.qmimiMeZbritjeProduktit - produkti.qmimiMeZbritjeProduktit * 0.152542).toFixed(2)
                    : parseFloat(produkti.qmimiProduktit - produkti.qmimiProduktit * 0.152542).toFixed(2)}{' '}
                  € pa TVSH
                </p>
                <p>Disponueshmëria: {produkti.sasiaNeStok > 10 ? 'Me shume se 10 artikuj' : produkti.sasiaNeStok + ' artikuj'}</p>

                <div style={{ display: 'flex', gap: '1em' }}>
                  {produkti.sasiaNeStok > 0 && (
                    <Button onClick={handleShtoNeShporte}>
                      Shto ne Shporte <FontAwesomeIcon icon={faCartShopping} />
                    </Button>
                  )}
                  {teDhenat != '' &&
                    (teDhenat.rolet.includes('Admin') || teDhenat.rolet.includes('Menaxher')) &&
                    produkti.sasiaNeStok > 0 && (
                      <Button onClick={(e) => handleEdito(e)}>
                        Perditeso <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>
                    )}
                  {produkti.sasiaNeStok <= 0 && (
                    <Button disabled style={{ backgroundColor: 'lightgray', color: 'black', cursor: 'unset' }}>
                      Out of Stock
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        {kaPershkrim && (
          <div className="pershkrimi">
            <h2>Pershkrimi: </h2>
            <p>{produkti.pershkrimi}</p>
          </div>
        )}
      </div>

      <div className="artikujt">
        <div className="titulliArtikuj">
          <h1 className="">Me te Shiturat</h1>
        </div>
        {produktet.map((produkti) => {
          return (
            <ProduktetNeHome
              produktiID={produkti.produktiId}
              fotoProduktit={produkti.fotoProduktit}
              emriProduktit={produkti.emriProduktit}
              cmimi={produkti.qmimiProduktit}
              sasiaNeStok={produkti.sasiaNeStok}
              cmimiMeZbritje={produkti.qmimiProduktit}
            />
          );
        })}
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default Produkti;