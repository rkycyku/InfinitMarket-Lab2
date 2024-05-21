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
import { faCartShopping, faPenToSquare, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import EditoProduktin from './admin-dashboard/Produktet/ListaEProdukteve/EditoProduktin';
import Footer from '../components/Footer';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../assets/css/swiperSlider.css';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import Titulli from '../components/Titulli';
import ShtoVleresimin from '../components/Produktet/VleresimetEProduktit/ShtoVleresimin';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import EditoVleresimin from '../components/Produktet/VleresimetEProduktit/EditoVleresimin';
import LargoVleresimin from '../components/Produktet/VleresimetEProduktit/LargoVleresimin';

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
  const [shtoVleresimin, setShtoVleresimin] = useState(false);
  const [editoVleresimin, setEditoVleresimin] = useState(false);
  const [fshijVleresimin, setFshijVleresimin] = useState(false);
  const [teDhenat, setTeDhenat] = useState([]);
  const [vleresimiProduktitNgaKlienti, setVleresimiProduktitNgaKlienti] = useState();

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

    const VleresimiProduktitNgaKlienti = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7251/api/Produktet/VleresimetEProduktit/ShfaqVleresimetEKlientitPerProduktin?produktiId=${id}&klientiID=${
            teDhenat && teDhenat.userID
          }`,
          authentikimi
        );

        setVleresimiProduktitNgaKlienti(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    VleresimiProduktitNgaKlienti();
    teDhenatProd();
  }, [perditeso, id, teDhenat]);

  useEffect(() => {
    const shfaqProduktet = async () => {
      try {
        const produktet = await axios.get('https://localhost:7251/api/TeNdryshme/Statistikat/15ProduktetMeTeShitura', authentikimi);
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

  const handleEdito = (e) => {
    e.preventDefault();
    setEdito(true);
  };

  const handleShtoVleresimin = async (e) => {
    const lejohetVleresimi = await axios.get(
      `https://localhost:7251/api/Produktet/VleresimetEProduktit/KontrolloALejohetVleresimi?produktiId=${id}&userID=${
        teDhenat && teDhenat.userID
      }`,
      authentikimi
    );

    if (vleresimiProduktitNgaKlienti != false) {
      setTipiMesazhit('danger');
      setPershkrimiMesazhit(`<span>Na vjen keq lejohet vetem nje vleresim! Ju lutem editoni ose fshini ate aktual!</span>`);
      setShfaqMesazhin(true);
    } else {
      if (lejohetVleresimi.data === true) {
        e.preventDefault();
        setShtoVleresimin(true);
      } else {
        setTipiMesazhit('danger');
        setPershkrimiMesazhit(`<span>Na vjen keq vleresimi lejohet vetem pasi te keni blere kete produkt!</span>`);
        setShfaqMesazhin(true);
      }
    }
  };

  //Vleresimi Start
  let vleresimiTotal = 0;

  produkti &&
    produkti.vleresimetPoduktiList &&
    produkti.vleresimetPoduktiList.map((vleresimi) => {
      vleresimiTotal += vleresimi.vlersimiYll;
    });

  const vleresimiMesatar =
    vleresimiTotal > 0 ? vleresimiTotal / (produkti && produkti.vleresimetPoduktiList && produkti.vleresimetPoduktiList.length) : 0;
  const numriVleresimeve = produkti && produkti.vleresimetPoduktiList && produkti.vleresimetPoduktiList.length;

  const shfaqYllat = (vleresimi) => {
    const yllIcons = [];
    for (let i = 0; i < 5; i++) {
      if (vleresimi >= i + 1) {
        yllIcons.push(<FontAwesomeIcon key={i} icon={faStar} className="yll" />);
      } else if (vleresimi >= i + 0.5) {
        yllIcons.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="yll" />);
      } else {
        yllIcons.push(<FontAwesomeIcon key={i} icon={faStarEmpty} className="yll" />);
      }
    }
    return yllIcons;
  };
  //Vleresimi Mbarimi

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
      {shtoVleresimin && (
        <ShtoVleresimin
          shfaq={shtoVleresimin}
          largo={() => setShtoVleresimin(false)}
          idProdukti={produkti && produkti.produkti && produkti.produkti.produktiId}
          idKlienti={teDhenat && teDhenat.userID}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      {editoVleresimin && (
        <EditoVleresimin
          shfaq={editoVleresimin}
          largo={() => setEditoVleresimin(false)}
          id={vleresimiProduktitNgaKlienti.id}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      {fshijVleresimin && (
        <LargoVleresimin
          shfaq={fshijVleresimin}
          largo={() => setFshijVleresimin(false)}
          id={vleresimiProduktitNgaKlienti.id}
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
        <Tabs defaultActiveKey="Pershkrimi" id="fill-tab-example" className="mb-3" fill>
          <Tab eventKey="Pershkrimi" title="Pershkrimi">
            {kaPershkrim && (
              <div className="pershkrimi">
                <h2>Pershkrimi: </h2>
                <p>{produkti && produkti.produkti && produkti.produkti.pershkrimi}</p>
              </div>
            )}
          </Tab>
          <Tab eventKey="Vleresimet" title="Vleresimet">
            {produkti && produkti.vleresimetPoduktiList && (
              <>
                <div className="vleresimetEProduktit">
                  <div className="vleresimiTotal">
                    <div className="yllatVleresimi">
                      <span className="vleresimiMesatar">{vleresimiMesatar.toFixed(2)}</span>
                      <span className="numriVleresimeve">
                        {' '}
                        {numriVleresimeve === 0
                          ? 'Nuk ka asnje vleresim'
                          : numriVleresimeve === 1
                          ? numriVleresimeve + ' vlerësim'
                          : numriVleresimeve + ' vlerësime'}
                      </span>
                      <span className="yllat yll">{shfaqYllat(vleresimiMesatar)}</span>
                    </div>
                    <div className="shtoVleresim">
                      <Button variant="primary" onClick={(e) => handleShtoVleresimin(e)}>
                        Vendosni nje vleresim <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </div>
                  </div>
                  {produkti &&
                    produkti.vleresimetPoduktiList &&
                    produkti.vleresimetPoduktiList.map((vleresimi) => (
                      <div key={vleresimi.id} className="vleresimiProduktit">
                        <div className="klienti">
                          {vleresimi.emri} {vleresimi.mbiemri} - {vleresimi.email}
                          {vleresimiProduktitNgaKlienti != false &&
                            vleresimiProduktitNgaKlienti &&
                            vleresimiProduktitNgaKlienti.id == vleresimi.id && (
                              <div className="shtoVleresim">
                                <Button variant="danger" onClick={() => setFshijVleresimin(true)}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </Button>

                                <Button variant="info" onClick={() => setEditoVleresimin(true)}>
                                  <FontAwesomeIcon icon={faPenToSquare} />
                                </Button>
                              </div>
                            )}
                        </div>
                        <div className="yllat yll">{shfaqYllat(vleresimi.vlersimiYll)}</div>
                        <div className="vleresimi">{vleresimi.vlersimiTekst}</div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </Tab>
        </Tabs>
      </div>

      <div className="artikujt">
        <div className="titulliArtikuj">
          <h1 className="">Me te Shiturat</h1>
        </div>
        {produktet.map((produkti) => {
          return (
            <ProduktetNeHome
              produktiID={produkti && produkti.produkti && produkti.produkti.produktiId}
              fotoProduktit={produkti && produkti.produkti && produkti.produkti.fotoProduktit}
              emriProduktit={produkti && produkti.produkti && produkti.produkti.emriProduktit}
              cmimi={produkti && produkti.produkti && produkti.produkti.qmimiProduktit}
              sasiaNeStok={produkti && produkti.produkti && produkti.produkti.sasiaNeStok}
              cmimiMeZbritje={produkti && produkti.produkti && produkti.produkti.qmimiMeZbritjeProduktit}
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
