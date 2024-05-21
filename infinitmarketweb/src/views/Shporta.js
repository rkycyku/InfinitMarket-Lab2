import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
  MDBInputGroup
} from 'mdb-react-ui-kit';
import React from 'react';
import './Styles/Shporta.css';
import { Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import Mesazhi from '../components/Mesazhi';
import Checkout from '../components/Checkout/Checkout';
import Titulli from '../components/Titulli';

export default function Shporta() {
  const [perditeso, setPerditeso] = useState(Date.now());
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');

  const [shporta, setShporta] = useState('');
  const [detajetShporta, setDetajetShporta] = useState([]);

  const [promoCode, setPromoCode] = useState('');
  const [teDhenatZbritje, setTeDhenatZbritjes] = useState([]);

  const [checkout, setCheckout] = useState(false);

  const getToken = localStorage.getItem('token');
  const getID = localStorage.getItem('id');

  const location = useLocation();

  useEffect(() => {
    // Function to parse query parameters from URL
    const getQueryParam = (name) => {
      const params = new URLSearchParams(location.search);
      return params.get(name);
    };

    // Get the redirect_status from the query parameters
    const redirectStatus = getQueryParam('redirect_status');

    // Check if the redirect_status is "succeeded"
    if (redirectStatus === 'succeeded') {
      // Perform your action here
      console.log('Redirect status is succeeded. Perform action...');
      // Example: Redirect to a different page
      // window.location.href = '/success'; // Assuming '/success' is your success page route
      setCheckout(true);
    }
  }, [location.search]);

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  let perditesoKontrollinKodit = 0;

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
        if (shporta.data.kodiZbritjes.kodi !== 'NukKaZbritje') {
          setPromoCode(shporta.data.kodiZbritjes.kodi);
        }
      } catch (err) {
        console.log(err);
      }
    };

    ShfaqTeDhenat();
  }, [perditeso]);

  let qmimiTot = shporta.totali18TVSH + shporta.totali8TVSH;
  const KontrolloKodin = async () => {
    try {
      const kodiZbritjes = await axios.get(`https://localhost:7251/api/TeNdryshme/KodiZbritje/GjejKodin?kodi=${promoCode}`, authentikimi);

      setTeDhenatZbritjes(kodiZbritjes.data);
      console.log(kodiZbritjes.data);

      if (kodiZbritjes.data.produktiId === null) {
        if (qmimiTot >= kodiZbritjes.data.qmimiZbritjes) {
          await axios.put(
            `https://localhost:7251/api/Produktet/Shporta/PerditesoKodinZbritjesNeShporte?userID=${getID}&KodiZbritjes=${promoCode}`,
            {},
            authentikimi
          );
          setPerditeso(Date.now());
        } else {
          let shumaZbritjes = kodiZbritjes.data.qmimiZbritjes;

          setTeDhenatZbritjes([]);
          setTipiMesazhit('danger');
          setPershkrimiMesazhit(
            `Shuma e zbritjes eshte: <span>${shumaZbritjes.toFixed(2)} €</span> ndersa totali juaj eshte: <span>${qmimiTot.toFixed(
              2
            )} € </span>ju lutemi provoni nje kod tjeter ose shtoni produkte ne shporte!`
          );
          setShfaqMesazhin(true);
          setPromoCode('');
        }
      } else {
        {
          detajetShporta.length !== 0 &&
            detajetShporta.map(async (item) => {
              if (detajetShporta.find((item) => item.produktiID === kodiZbritjes.data.produktiId)) {
                await axios.put(
                  `https://localhost:7251/api/Produktet/Shporta/PerditesoKodinZbritjesNeShporte?userID=${getID}&KodiZbritjes=${promoCode}`,
                  {},
                  authentikimi
                );
                setPerditeso(Date.now());
              } else {
                setTeDhenatZbritjes([]);
                setTipiMesazhit('danger');
                setPershkrimiMesazhit(`Ky kod nuk vlen për produktet në shportën tuaj!`);
                setShfaqMesazhin(true);
                setPromoCode('');
              }
            });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const LargoKodinEZbritjes = async () => {
    try {
      await axios.put(
        `https://localhost:7251/api/Produktet/Shporta/PerditesoKodinZbritjesNeShporte?userID=${getID}&KodiZbritjes=NukKaZbritje`,
        {},
        authentikimi
      );
      setPerditeso(Date.now());
      setPromoCode('');
    } catch (err) {
      console.log(err);
    }
  };

  async function RritSasin(idProdukti) {
    const eshteNeShporte = detajetShporta.find((item) => item.produktiID === idProdukti);

    if (eshteNeShporte && eshteNeShporte.sasiaProduktitNeShporte >= eshteNeShporte.sasiaStokutAktual) {
      setTipiMesazhit('danger');
      setPershkrimiMesazhit(
        `Sasia maksimale per <span>${eshteNeShporte.emriProduktit}</span> eshte <span>${eshteNeShporte.sasiaStokutAktual}</span> ne shporte!`
      );
      setShfaqMesazhin(true);
    } else {
      await axios.post(
        `https://localhost:7251/api/Produktet/Shporta/menaxhoShporten?userID=${getID}&ProduktiID=${idProdukti}&llojiFunksionit=rritje`,
        {},
        authentikimi
      );
      setPerditeso(Date.now());
    }
  }

  async function UleSasin(idProdukti) {
    await axios.post(
      `https://localhost:7251/api/Produktet/Shporta/menaxhoShporten?userID=${getID}&ProduktiID=${idProdukti}&llojiFunksionit=ulje`,
      {},
      authentikimi
    );
    setPerditeso(Date.now());
  }

  async function LargoProduktin(idProdukti) {
    await axios.post(
      `https://localhost:7251/api/Produktet/Shporta/menaxhoShporten?userID=${getID}&ProduktiID=${idProdukti}&llojiFunksionit=fshije`,
      {},
      authentikimi
    );
    setPerditeso(Date.now());
  }

  const handlePromoCodeChange = (event) => {
    setPromoCode(event.target.value);
  };

  return (
    <>
      <Titulli titulli={'Shporta'} />
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
      {checkout && (
        <Checkout
          setCheckout={() => setCheckout(false)}
          qmimiTotal={qmimiTot.toFixed(2)}
          zbritja={teDhenatZbritje.qmimiZbritjes ? teDhenatZbritje.qmimiZbritjes.toFixed(2) : 0}
          kodiZbrijtes={teDhenatZbritje.kodi ? teDhenatZbritje.kodi : ''}
          totaliProdukteve={detajetShporta.length}
        />
      )}
      {!checkout && (
        <>
          <section className="h-100 h-custom">
            <MDBContainer className="py-5 h-100">
              <MDBRow className="justify-content-center align-items-center h-100">
                <MDBCol size="12">
                  <MDBCard className="card-registration card-registration-2" style={{ borderRadius: '15px' }}>
                    <MDBCardBody className="p-0">
                      <MDBRow className="g-0">
                        <MDBCol lg="9">
                          <div className="p-5">
                            <div className="d-flex justify-content-between align-items-center mb-5">
                              <MDBTypography tag="h1" className="fw-bold mb-0 text-black">
                                Shporta
                              </MDBTypography>
                              <MDBTypography className="mb-0 text-muted">
                                {shporta && shporta.totaliProdukteveNeShporte == 0
                                  ? 'Asnje produkt'
                                  : shporta.totaliProdukteveNeShporte == 1
                                  ? '1 produkt'
                                  : shporta.totaliProdukteveNeShporte + ' produkte'}{' '}
                              </MDBTypography>
                            </div>
                            <hr className="my-4" />
                            <MDBRow className="mb-4 d-none d-md-flex justify-content-between align-items-center">
                              <MDBCol md="2" lg="2" xl="2">
                                <MDBTypography tag="h6" className="text-muted">
                                  Foto
                                </MDBTypography>
                              </MDBCol>
                              <MDBCol md="3" lg="3" xl="3">
                                <MDBTypography tag="h6" className="text-muted">
                                  Produkti
                                </MDBTypography>
                              </MDBCol>
                              <MDBCol md="1" lg="1" xl="1" className="d-flex align-items-center">
                                <MDBTypography tag="h6" className="text-muted">
                                  Sasia
                                </MDBTypography>
                              </MDBCol>
                              <MDBCol md="2" lg="2" xl="2" className="text-end">
                                <MDBTypography tag="h6" className="text-muted">
                                  Qmimi Produktit
                                </MDBTypography>
                              </MDBCol>
                              <MDBCol md="2" lg="2" xl="2" className="text-end">
                                <MDBTypography tag="h6" className="text-muted">
                                  Qmimi Total
                                </MDBTypography>
                              </MDBCol>
                              <MDBCol md="1" lg="1" xl="1" className="text-end">
                                <MDBTypography tag="h6" className="text-muted">
                                  Fshij
                                </MDBTypography>
                              </MDBCol>
                            </MDBRow>

                            <hr className="my-4 d-none d-md-flex" />
                            {detajetShporta.map((produkti) => {
                              return (
                                <>
                                  <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
                                    <MDBCol md="2" lg="2" xl="2">
                                      <MDBCardImage
                                        src={`${process.env.PUBLIC_URL}/img/produktet/${produkti.fotoProduktit}`}
                                        fluid
                                        className="rounded-3 fotoShporta"
                                        alt={produkti.fotoProduktit}
                                      />
                                    </MDBCol>
                                    <MDBCol md="3" lg="3" xl="3">
                                      <Link to={`/produktet/kategoria/${produkti.emriKategoris}`}>
                                        <MDBTypography tag="h6" className="text-muted">
                                          {produkti.emriKategoris}
                                        </MDBTypography>
                                      </Link>
                                      <Link to={`/produktet/${produkti.produktiID}`}>
                                        <MDBTypography tag="h6" className="text-black mb-0">
                                          {produkti.emriProduktit}
                                        </MDBTypography>
                                      </Link>
                                    </MDBCol>
                                    <MDBCol md="1" lg="1" xl="1" className="d-flex align-items-center butonShporta">
                                      <Button
                                        disabled={produkti.sasiaProduktitNeShporte <= 1}
                                        variant="link"
                                        className="butonShporta"
                                        size="sm"
                                        onClick={() => UleSasin(produkti.produktiID)}
                                      >
                                        <MDBIcon fas icon="minus" />
                                      </Button>
                                      <MDBTypography tag="h6" className="text-black mb-0">
                                        {produkti.sasiaProduktitNeShporte}
                                      </MDBTypography>
                                      <Button
                                        variant="link"
                                        size="sm"
                                        className="butonShporta"
                                        onClick={() => RritSasin(produkti.produktiID)}
                                      >
                                        <MDBIcon fas icon="plus" />
                                      </Button>
                                    </MDBCol>
                                    <MDBCol md="2" lg="2" xl="2" className="text-end">
                                      <MDBTypography tag="h6" className="mb-0">
                                        {parseFloat(produkti.qmimiProduktit).toFixed(2)} €
                                      </MDBTypography>
                                    </MDBCol>
                                    <MDBCol md="2" lg="2" xl="2" className="text-end">
                                      <MDBTypography tag="h6" className="mb-0">
                                        {parseFloat(produkti.qmimiProduktit * produkti.sasiaProduktitNeShporte).toFixed(2)} €
                                      </MDBTypography>
                                    </MDBCol>
                                    <MDBCol md="1" lg="1" xl="1" className="text-end">
                                      <Button
                                        variant="link"
                                        size="sm"
                                        className="butonShporta"
                                        onClick={() => LargoProduktin(produkti.produktiID)}
                                      >
                                        <MDBIcon fas icon="times" />
                                      </Button>
                                    </MDBCol>
                                  </MDBRow>

                                  <hr className="my-4" />
                                </>
                              );
                            })}
                            <div className="pt-5">
                              <Link to={'/'}>
                                <MDBTypography tag="h6" className="mb-0">
                                  <MDBCardText tag="a" href="#!" className="text-body">
                                    <MDBIcon fas icon="long-arrow-alt-left me-2" /> Vazhdo Blerjen
                                  </MDBCardText>
                                </MDBTypography>
                              </Link>
                            </div>
                          </div>
                        </MDBCol>
                        <MDBCol lg="3" className="bg-grey">
                          <div className="p-5">
                            <MDBTypography tag="h3" className="fw-bold mb-5 mt-2 pt-1">
                              Totali i porosisë
                            </MDBTypography>

                            <hr className="my-4" />

                            <MDBTypography tag="h6" className="text-uppercase mb-3">
                              Kodi i zbritjes
                            </MDBTypography>

                            <MDBInputGroup className="mb-3">
                              <MDBInput
                                id="promo-input"
                                className="form-control"
                                type="text"
                                placeholder="Kodi Zbritjes"
                                value={promoCode}
                                onChange={handlePromoCodeChange}
                              />
                              {shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.kodi == 'NukKaZbritje' ? (
                                <Button onClick={() => KontrolloKodin()} disabled={shporta && shporta.totaliProdukteveNeShporte == 0}>
                                  <FontAwesomeIcon icon={faCheck} />
                                </Button>
                              ) : (
                                <Button onClick={() => LargoKodinEZbritjes()}>
                                  <FontAwesomeIcon icon={faXmark} />
                                </Button>
                              )}
                            </MDBInputGroup>

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
                              <MDBTypography tag="h6">Kalkulohet gjate pageses</MDBTypography>
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
                                      : 0)
                                ).toFixed(2)}{' '}
                                €
                              </MDBTypography>
                            </div>
                            <Button disabled={shporta && shporta.totaliProdukteveNeShporte == 0} onClick={() => setCheckout(true)}>
                              Kalo tek Pagesa
                            </Button>
                          </div>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </section>
        </>
      )}
    </>
  );
}
