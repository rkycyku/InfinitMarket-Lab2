import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PagesaMeSukses from './PagesaMeSukses';
import EditoTeDhenat from './EditoTeDhenat';
import Mesazhi from '../Mesazhi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown, faMapLocationDot, faMoneyBill, faUserPen } from '@fortawesome/free-solid-svg-icons';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { MDBCardText, MDBIcon, MDBTypography } from 'mdb-react-ui-kit';

import '../../views/Styles/Shporta.css';
import './Styles/PaguajMeStripe.css';
import { faStripe } from '@fortawesome/free-brands-svg-icons';
import PaguajMeStripe from './PaguajMeStripe';

function Checkout(props) {
  const [teDhenat, setTeDhenat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perditeso, setPerditeso] = useState('');
  const [pagesaMeSukses, setPagesaMeSukses] = useState(false);
  const [pagesaDeshtoi, setPagesaDeshtoi] = useState(false);
  const [paguajMeStripe, setPaguajMeStripe] = useState(false);
  const [vendosjaTeDhenaveSukses, setVendosjaTeDhenaveSukses] = useState(false);
  const [vendosjaPorosisSukses, setVendosjaPorosisSukses] = useState(false);
  const [rregulloUseEffect, setRregulloUseEffect] = useState(true);
  const [mbyllPerditesoTeDhenat, setMbyllPerditesoTeDhenat] = useState(true);
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');

  const [shporta, setShporta] = useState('');
  const [detajetShporta, setDetajetShporta] = useState([]);

  const [qmimiTransportit, setQmimiTransportit] = useState(0);
  const [llojiTransportit, setLlojiTransportit] = useState('Merre ne zyre');
  const [llojiPageses, setLlojiPageses] = useState('Cash');

  const getID = localStorage.getItem('id');
  const navigate = useNavigate();
  const [nrFatures, setNrFatures] = useState(0);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  const location = useLocation();

  useEffect(() => {
    const getQueryParam = (name) => {
      const params = new URLSearchParams(location.search);
      return params.get(name);
    };

    const redirectStatus = getQueryParam('redirect_status');
    const llojiTransportitParam = getQueryParam('llojiTransportit');
    const qmimiTransportitParam = getQueryParam('qmimiTransportit');

    async function PerdfundoPorosineStripe() {
      if (redirectStatus === 'succeeded') {
        try {
          await axios
            .post(
              `https://localhost:7251/api/TeNdryshme/Porosia/VendosPorosine?AspNetUserID=${getID}`,
              {
                llojiTransportit: llojiTransportitParam,
                qmimiTransportit: qmimiTransportitParam.toString(),
                llojiPageses: 'Stripe'
              },
              authentikimi
            )
            .then((response) => {
              console.log(response);
              if (response.status === 201 || response.status === 200) {
                setVendosjaPorosisSukses(true);
                setNrFatures(response.data);
              }
            })
            .finally(() => {
              setPagesaMeSukses(true);
            });
        } catch (e) {
          console.error(e);
        }
      }
    }

    PerdfundoPorosineStripe();
  }, [location.search]);

  useEffect(() => {
    if (getID) {
      const vendosTeDhenat = async () => {
        try {
          const perdoruesi = await axios.get(`https://localhost:7251/api/Perdoruesi/shfaqSipasID?idUserAspNet=${getID}`, authentikimi);
          setTeDhenat(perdoruesi.data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

      vendosTeDhenat();
    } else {
      navigate('/login');
    }
  }, [perditeso]);

  useEffect(() => {
    const ShfaqTeDhenat = async () => {
      try {
        const shporta = await axios.get(`https://localhost:7251/api/Produktet/Shporta/ShfaqShporten?userID=${getID}`, authentikimi);
        const detajetShporta = await axios.get(
          `https://localhost:7251/api/Produktet/Shporta/shfaqProduktetEShportes?userID=${getID}`,
          authentikimi
        );
        setShporta(shporta.data);
        setDetajetShporta(detajetShporta.data);
      } catch (err) {
        console.log(err);
      }
    };

    ShfaqTeDhenat();
  }, [perditeso]);

  const handlePerfundoPorosine = async () => {
    try {
      await axios
        .post(
          `https://localhost:7251/api/TeNdryshme/Porosia/VendosPorosine?AspNetUserID=${getID}`,
          {
            llojiTransportit: llojiTransportit,
            qmimiTransportit: qmimiTransportit.toString(),
            llojiPageses: llojiPageses
          },
          authentikimi
        )
        .then((response) => {
          console.log(response);
          if (response.status === 201 || response.status === 200) {
            setVendosjaPorosisSukses(true);
            setNrFatures(response.data);
          }
        })
        .finally(() => {
          setPagesaMeSukses(true);
        });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (rregulloUseEffect) {
      return;
    }

    if (vendosjaPorosisSukses) {
      setPagesaMeSukses(true);
    } else if (!vendosjaPorosisSukses) {
      setPagesaDeshtoi(true);
    }
  }, [vendosjaPorosisSukses]);

  function handleTransporti(lloji) {
    switch (lloji) {
      case 'DSHPP':
        setLlojiTransportit('Dergese ne shtepi');
        setQmimiTransportit(0);
        break;
      case 'DSH1.5':
        setLlojiTransportit('Dergese ne shtepi');
        setQmimiTransportit(1.5);
        break;
      case 'DSH2.5':
        setLlojiTransportit('Dergese ne shtepi');
        setQmimiTransportit(2.5);
        break;
      case 'MZPP':
        setLlojiTransportit('Merre ne zyre');
        setQmimiTransportit(0);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <h1 style={{ textAlign: 'center', marginBottom: '1em' }}>Konfirmimi Porosis</h1>
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
      {pagesaMeSukses && <PagesaMeSukses nrFatures={nrFatures} />}
      {!mbyllPerditesoTeDhenat && (
        <EditoTeDhenat
          setMbyllPerditesoTeDhenat={() => setMbyllPerditesoTeDhenat(true)}
          perditeso={() => setPerditeso(Date.now())}
          setShfaqMesazhin={() => setShfaqMesazhin(true)}
          pershkrimi={setPershkrimiMesazhit}
          tipi={setTipiMesazhit}
        />
      )}
      {paguajMeStripe && (
        <PaguajMeStripe llojiPageses={llojiPageses} llojiTransportit={llojiTransportit} qmimiTransportit={qmimiTransportit} />
      )}
      {pagesaMeSukses === false && pagesaDeshtoi === false && paguajMeStripe === false && (
        <div className="StripeDivMain">
          <div className="detajetPorosia">
            <div className="adresaDorezimit">
              <h3>Adresa Dorezimit</h3>
              <div className="d-flex justify-content-between">
                <MDBTypography tag="h6" className="text-uppercase">
                  Klienti
                </MDBTypography>
                <MDBTypography tag="h6">
                  {shporta && shporta.adresa && shporta.adresa.emri} {shporta && shporta.adresa && shporta.adresa.mbiemri}
                </MDBTypography>
              </div>
              <div className="d-flex justify-content-between">
                <MDBTypography tag="h6" className="text-uppercase">
                  Email
                </MDBTypography>
                <MDBTypography tag="h6">{shporta && shporta.adresa && shporta.adresa.email}</MDBTypography>
              </div>
              <div className="d-flex justify-content-between">
                <MDBTypography tag="h6" className="text-uppercase">
                  Numri i telefonit
                </MDBTypography>
                <MDBTypography tag="h6">{shporta && shporta.adresa && shporta.adresa.nrKontaktit}</MDBTypography>
              </div>
              <div className="d-flex justify-content-between">
                <MDBTypography tag="h6" className="text-uppercase">
                  Adresa dorezimit
                </MDBTypography>
                <MDBTypography tag="h6">
                  {shporta && shporta.adresa && shporta.adresa.adresa}
                  <br />
                  {shporta && shporta.adresa && shporta.adresa.qyteti}, {shporta && shporta.adresa && shporta.adresa.zipKodi}
                  <br />
                  {shporta && shporta.adresa && shporta.adresa.shteti}
                </MDBTypography>
              </div>
            </div>
            <div className="teDhenatShporta">
              <h3>Detajet e Shportes</h3>
              <div className="d-flex justify-content-between">
                <MDBTypography tag="h6" className="text-uppercase">
                  Totali Produkteve
                </MDBTypography>
                <MDBTypography tag="h6">
                  {shporta && shporta.totaliProdukteveNeShporte == 0
                    ? 'Asnje produkt'
                    : shporta.totaliProdukteveNeShporte == 1
                    ? '1 produkt'
                    : shporta.totaliProdukteveNeShporte + ' produkte'}{' '}
                </MDBTypography>
              </div>
              <div className="d-flex justify-content-between">
                <MDBTypography tag="h6" className="text-uppercase">
                  Nentotali
                </MDBTypography>
                <MDBTypography tag="h6">
                  {parseFloat(
                    shporta.totali18TVSH +
                      shporta.totali8TVSH -
                      (shporta.totali18TVSH - (100 / (100 + 18)) * shporta.totali18TVSH) -
                      shporta.totali8TVSH -
                      (100 / (100 + 8)) * shporta.totali8TVSH
                  ).toFixed(2)}{' '}
                  €
                </MDBTypography>
              </div>
              <div className="d-flex justify-content-between">
                <MDBTypography tag="h6" className="text-uppercase">
                  TVSH 18%
                </MDBTypography>
                <MDBTypography tag="h6">
                  {parseFloat(shporta.totali18TVSH - (100 / (100 + 18)) * shporta.totali18TVSH).toFixed(2)} €
                </MDBTypography>
              </div>
              <div className="d-flex justify-content-between">
                <MDBTypography tag="h6" className="text-uppercase">
                  TVSH 8%
                </MDBTypography>
                <MDBTypography tag="h6">
                  {parseFloat(shporta.totali8TVSH - (100 / (100 + 8)) * shporta.totali8TVSH).toFixed(2)}€
                </MDBTypography>
              </div>
              <div className="d-flex justify-content-between">
                <MDBTypography tag="h6" className="text-uppercase">
                  Transporti
                </MDBTypography>
                <MDBTypography tag="h6">
                  {llojiTransportit} - {parseFloat(qmimiTransportit).toFixed(2)} €
                </MDBTypography>
              </div>
              <div className="d-flex justify-content-between">
                <MDBTypography tag="h6" className="text-uppercase">
                  Zbritja
                </MDBTypography>
                <MDBTypography tag="h6">
                  - {parseFloat(shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes).toFixed(2)} €
                </MDBTypography>
              </div>

              <hr className="my-4" />

              <div className="d-flex justify-content-between mb-5">
                <MDBTypography tag="h5" className="text-uppercase">
                  Total
                </MDBTypography>
                <MDBTypography tag="h5">
                  {parseFloat(
                    shporta.totali18TVSH +
                      shporta.totali8TVSH -
                      (shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                        ? shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                        : 0) +
                      qmimiTransportit
                  ).toFixed(2)}{' '}
                  €
                </MDBTypography>
              </div>
            </div>
          </div>

          <div className="stripePagesa" style={{ width: '100%' }}>
            <form id="payment-form">
              <div className="adresaDorezimit">
                <h5>Lloji i Transportit</h5>
                <Form.Select className="mb-2" onChange={(e) => handleTransporti(e.target.value)}>
                  {shporta.totali18TVSH +
                    shporta.totali8TVSH -
                    (shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                      ? shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                      : 0) >
                    200 && <option value={'DSHPP'}>Dergese ne shtepi - Pa Pagese</option>}

                  {shporta.totali18TVSH +
                    shporta.totali8TVSH -
                    (shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                      ? shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                      : 0) >
                    100 &&
                    shporta.totali18TVSH +
                      shporta.totali8TVSH -
                      (shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                        ? shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                        : 0) <
                      200 && <option value={'DSH1.5'}>Dergese ne shtepi - 1.50 €</option>}
                  {shporta.totali18TVSH +
                    shporta.totali8TVSH -
                    (shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                      ? shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                      : 0) <
                    100 && <option value={'DSH2.5'}>Dergese ne shtepi - 2.50 €</option>}
                  <option value={'MZPP'} selected>
                    Merre ne zyre - Pa Pagese
                  </option>
                </Form.Select>
                <div className="d-flex justify-content-between">
                  <Button onClick={() => navigate('/')}>
                    Vazhdo Blerjen <FontAwesomeIcon icon={faCartArrowDown} />
                  </Button>

                  <Button onClick={() => setMbyllPerditesoTeDhenat(false)}>
                    Ndrysho Adresen <FontAwesomeIcon icon={faMapLocationDot} />
                  </Button>
                </div>
                <div className="d-flex justify-content-between">
                  <Button onClick={() => handlePerfundoPorosine()}>
                    Paguaj pas Pranimit <FontAwesomeIcon icon={faMoneyBill} />
                  </Button>
                  <Button
                    onClick={() => {
                      setLlojiPageses('Stripe');
                      setPaguajMeStripe(true);
                    }}
                  >
                    Paguaj me Stripe <FontAwesomeIcon icon={faStripe} style={{ color: '#0A2540' }} />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Checkout;
