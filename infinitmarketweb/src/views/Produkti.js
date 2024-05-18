import { useParams } from 'react-router-dom';
import './Styles/Produkti.css';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import ProduktetNeHome from '../components/Produktet/ProduktetNeHome';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Mesazhi from '../components/Mesazhi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import EditoProduktin from './admin-dashboard/Produktet/ListaEProdukteve/EditoProduktin';
import Footer from '../components/Footer';
import { Button } from 'react-bootstrap';

import { Swiper, SwiperSlide } from 'swiper/react';
import '../assets/css/swiperSlider.css';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import Titulli from '../components/Titulli';
import VleresimetEProduktit from '../components/Produktet/VleresimetEProduktit';

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
  const navigate = useNavigate();

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
        const response = await axios.get(`https://localhost:7251/api/Produktet/Produkti/ShfaqProduktinSipasIDsAll/${id}`, authentikimi);
        const teDhenatProduktit = response.data;

        console.log(response.data);

        if (!teDhenatProduktit.produkti) {
          navigate('/404'); // Redirect to 404 page if product not found
        } else {
          setProdukti(teDhenatProduktit);
          if (teDhenatProduktit.produkti.pershkrimi !== '') {
            setKaPershkrim(true);
          } else {
            setKaPershkrim(false);
          }
        }
      } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 0)) {
          navigate('/404');
        } else {
          console.error('An error occurred:', error);
        }
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
    const eshteNeShporte = shporta.find((item) => item.produktiID === produkti && produkti.produkti && produkti.produkti.produktiId);

    if (eshteNeShporte && eshteNeShporte.sasiaProduktitNeShporte >= eshteNeShporte.sasiaStokutAktual) {
      setTipiMesazhit('danger');
      setPershkrimiMesazhit(
        `Sasia maksimale per <strong>${produkti && produkti.produkti && produkti.produkti.emriProduktit}</strong> eshte <strong>${
          eshteNeShporte.sasiaStokutAktual
        }</strong> ne shporte!`
      );
      setShfaqMesazhin(true);
    } else {
      await axios.post(
        `https://localhost:7251/api/Produktet/Shporta/shtoProduktinNeShporte?userID=${getID}&ProduktiID=${
          produkti && produkti.produkti && produkti.produkti.produktiId
        }`,
        {},
        authentikimi
      );
      setTipiMesazhit('success');
      setPershkrimiMesazhit(`<strong>${produkti && produkti.produkti && produkti.produkti.emriProduktit}</strong> u shtua ne shporte!`);
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
      <Titulli
        titulli={
          produkti && produkti.produkti && produkti.produkti.emriProduktit !== ''
            ? produkti && produkti.produkti && produkti.produkti.emriProduktit
            : ' '
        }
      />
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
      {edito && (
        <EditoProduktin
          shfaq={edito}
          largo={() => setEdito(false)}
          id={produkti && produkti.produkti && produkti.produkti.produktiId}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      <div className="produkti">
        <div className="detajet">
          <div className="foto">
            {produkti && produkti.fotoProduktit && produkti.fotoProduktit.length > 0 ? (
              <Swiper
                pagination={{
                  clickable: true
                }}
                modules={[Pagination]}
                className="mySwiper"
              >
                {produkti.fotoProduktit &&
                  produkti.fotoProduktit.map((foto) => (
                    <SwiperSlide>
                      <img src={`${process.env.PUBLIC_URL}/img/produktet/${foto.emriFotos}`} alt={foto.emriFotos} />
                    </SwiperSlide>
                  ))}
              </Swiper>
            ) : (
              <Swiper
                pagination={{
                  clickable: true
                }}
                modules={[Pagination]}
                className="mySwiper"
              >
                <SwiperSlide>
                  <img
                    src={`${process.env.PUBLIC_URL}/img/produktet/${produkti && produkti.produkti && produkti.produkti.fotoProduktit}`}
                    alt={produkti && produkti.produkti && produkti.produkti.fotoProduktit}
                  />
                </SwiperSlide>
              </Swiper>
            )}
          </div>
          <div className="ContainerTeDhenat">
            <div className="teDhenatProduktit">
              <table>
                <tbody>
                  <tr>
                    <th colSpan="2">
                      <h1 className="emriProd">{produkti && produkti.produkti && produkti.produkti.emriProduktit}</h1>
                    </th>
                  </tr>
                  <tr>
                    <td>Kompania:</td>
                    <td>
                      <Link to={`/Produktet/kompania/${produkti && produkti.produkti && produkti.produkti.emriKompanis}`}>
                        {produkti && produkti.produkti && produkti.produkti.emriKompanis}
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td>Kategoria:</td>
                    <td>
                      <Link to={`/Produktet/kategoria/${produkti && produkti.produkti && produkti.produkti.llojiKategoris}`}>
                        {produkti && produkti.produkti && produkti.produkti.llojiKategoris}
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="blerja">
              <form>
                <h5 className="qmimiPaZbritje">
                  {produkti &&
                    produkti.produkti &&
                    produkti.produkti.qmimiMeZbritjeProduktit != null &&
                    parseFloat(produkti && produkti.produkti && produkti.produkti.qmimiProduktit).toFixed(2) + ' €'}
                </h5>
                <h5>
                  {produkti &&
                    produkti.produkti &&
                    produkti.produkti.qmimiMeZbritjeProduktit != null &&
                    'Ju Kureseni: ' +
                      parseFloat(
                        (produkti && produkti.produkti && produkti.produkti.qmimiProduktit) -
                          (produkti && produkti.produkti && produkti.produkti.qmimiMeZbritjeProduktit)
                      ).toFixed(2) +
                      ' €' +
                      ' (' +
                      (
                        (((produkti && produkti.produkti && produkti.produkti.qmimiProduktit) -
                          (produkti && produkti.produkti && produkti.produkti.qmimiMeZbritjeProduktit)) /
                          (produkti && produkti.produkti && produkti.produkti.qmimiProduktit)) *
                        100
                      ).toFixed(0) +
                      '%)'}
                </h5>
                <h1 className="">
                  {produkti && produkti.produkti && produkti.produkti.qmimiMeZbritjeProduktit != null
                    ? parseFloat(produkti && produkti.produkti && produkti.produkti.qmimiMeZbritjeProduktit).toFixed(2)
                    : parseFloat(produkti && produkti.produkti && produkti.produkti.qmimiProduktit).toFixed(2)}{' '}
                  €
                </h1>
                <p>
                  {produkti && produkti.produkti && produkti.produkti.qmimiMeZbritjeProduktit != null
                    ? parseFloat(
                        (produkti && produkti.produkti && produkti.produkti.qmimiMeZbritjeProduktit) -
                          (produkti && produkti.produkti && produkti.produkti.qmimiMeZbritjeProduktit) *
                            ((produkti && produkti.produkti && produkti.produkti.llojiTVSH) /
                              (100 + (produkti && produkti.produkti && produkti.produkti.llojiTVSH)))
                      ).toFixed(2)
                    : parseFloat(
                        (produkti && produkti.produkti && produkti.produkti.qmimiProduktit) -
                          (produkti && produkti.produkti && produkti.produkti.qmimiProduktit) *
                            ((produkti && produkti.produkti && produkti.produkti.llojiTVSH) /
                              (100 + (produkti && produkti.produkti && produkti.produkti.llojiTVSH)))
                      ).toFixed(2)}{' '}
                  € pa TVSH
                </p>
                <p>
                  Disponueshmëria:{' '}
                  {produkti && produkti.produkti && produkti.produkti.sasiaNeStok > 10
                    ? 'Me shume se 10 artikuj'
                    : produkti && produkti.produkti && produkti.produkti.sasiaNeStok + ' artikuj'}
                </p>

                <div style={{ display: 'flex', gap: '1em' }}>
                  {produkti && produkti.produkti && produkti.produkti.sasiaNeStok > 0 && (
                    <Button onClick={handleShtoNeShporte}>
                      Shto ne Shporte <FontAwesomeIcon icon={faCartShopping} />
                    </Button>
                  )}
                  {produkti && produkti.produkti && produkti.produkti.sasiaNeStok <= 0 && (
                    <Button disabled style={{ backgroundColor: 'lightgray', color: 'black', cursor: 'unset' }}>
                      Out of Stock
                    </Button>
                  )}
                  {teDhenat != '' && (teDhenat.rolet.includes('Admin') || teDhenat.rolet.includes('Shites')) && (
                    <Button onClick={(e) => handleEdito(e)}>
                      Perditeso <FontAwesomeIcon icon={faPenToSquare} />
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
            <p>{produkti && produkti.produkti && produkti.produkti.pershkrimi}</p>
          </div>
        )}
        {produkti && produkti.vleresimetPoduktiList && (
          <>
            <h1>Product Reviews</h1>
            <VleresimetEProduktit reviews={produkti && produkti.vleresimetPoduktiList} />
          </>
        )}
      </div>

      <div className="artikujt">
        <div className="titulliArtikuj">
          <h1 className="">Me te Shiturat</h1>
        </div>
        {produktet.map((produkti) => {
          return (
            <ProduktetNeHome
              produktiID={produkti && produkti.produktiId}
              fotoProduktit={produkti && produkti.fotoProduktit}
              emriProduktit={produkti && produkti.emriProduktit}
              cmimi={produkti && produkti.qmimiProduktit}
              sasiaNeStok={produkti && produkti.sasiaNeStok}
              cmimiMeZbritje={produkti && produkti.qmimiMeZbritjeProduktit}
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
