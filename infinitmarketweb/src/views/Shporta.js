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
import { Link } from 'react-router-dom';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function Shporta() {
  const [perditeso, setPerditeso] = useState(Date.now());

  const [shporta, setShporta] = useState('');
  const [detajetShporta, setDetajetShporta] = useState([]);
  const [transporti, setTransporti] = useState(2);

  const [promoCode, setPromoCode] = useState('');
  const [kontrollo, setKontrollo] = useState('');
  const [largoKodinEZbritjes, setLargoKodinEZbritjes] = useState('');
  const [teDhenatZbritje, setTeDhenatZbritjes] = useState([]);

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

  useEffect(() => {
    let qmimiTot = shporta.totali18TVSH + shporta.totali8TVSH;
    let kodiZbritjesNeShporte = shporta.kodiZbritjesID;

    console.log(shporta);

    const KontrolloKodin = async () => {
      try {
        const kodiZbritjes = await axios.get(
          `https://localhost:7251/api/TeNdryshme/KodiZbritje/GjejKodin?kodi=${promoCode !== '' ? promoCode : kodiZbritjesNeShporte}`,
          authentikimi
        );

        setTeDhenatZbritjes(kodiZbritjes.data);

        if (kodiZbritjes.data.ProduktiId === null) {
          if (
            qmimiTot >= kodiZbritjes.data.qmimiZbritjes &&
            kodiZbritjesNeShporte != kodiZbritjesNeShporte &&
            kodiZbritjesNeShporte != promoCode
          ) {
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
              `Shuma e zbritjes eshte: <strong>${shumaZbritjes.toFixed(2)} €</strong> ndersa totali juaj eshte: <strong>${qmimiTot.toFixed(
                2
              )} € </strong>ju lutemi provoni nje kod tjeter ose shtoni produkte ne shporte!`
            );
            setShfaqMesazhin(true);
            setPromoCode('');
          }
        } else {
          {
            detajetShporta.length !== 0 &&
              detajetShporta.map((item) => {
                if (
                  detajetShporta.find((item) => item.id === kodiZbritjes.data.ProduktiId) &&
                  kodiZbritjesNeShporte != kodiZbritjesNeShporte &&
                  kodiZbritjesNeShporte != promoCode
                ) {
                  axios.put(
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

    KontrolloKodin();
  }, [kontrollo, perditeso, shporta]);

  const LargoKodinEZbritjes = async () => {
    try {
      await axios.put(
        `https://localhost:7251/api/Produktet/Shporta/PerditesoKodinZbritjesNeShporte?userID=${getID}&KodiZbritjes=NukKaZbritje`,
        {},
        authentikimi
      );
      setPerditeso(Date.now());
    } catch (err) {
      console.log(err);
    }
  };

  async function RritSasin(idProdukti) {
    const eshteNeShporte = detajetShporta.find((item) => item.produktiID === idProdukti);

    if (eshteNeShporte && eshteNeShporte.sasiaProduktitNeShporte >= eshteNeShporte.sasiaStokutAktual) {
      setTipiMesazhit('danger');
      setPershkrimiMesazhit(
        `Sasia maksimale per <strong>${eshteNeShporte.emriProduktit}</strong> eshte <strong>${eshteNeShporte.sasiaStokutAktual}</strong> ne shporte!`
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

  const handleApplyPromoCode = () => {
    setKontrollo(Date.now());
  };

  return (
    <>
      <section className="h-100 h-custom">
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol size="12">
              <MDBCard className="card-registration card-registration-2" style={{ borderRadius: '15px' }}>
                <MDBCardBody className="p-0">
                  <MDBRow className="g-0">
                    <MDBCol lg="8">
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
                          <MDBCol md="3" lg="3" xl="3" className="d-flex align-items-center">
                            <MDBTypography tag="h6" className="text-muted">
                              Sasia
                            </MDBTypography>
                          </MDBCol>
                          <MDBCol md="3" lg="2" xl="2" className="text-end">
                            <MDBTypography tag="h6" className="text-muted">
                              Qmimi Produktit
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
                                    className="rounded-3"
                                    alt={produkti.fotoProduktit}
                                  />
                                </MDBCol>
                                <MDBCol md="3" lg="3" xl="3">
                                  <MDBTypography tag="h6" className="text-muted">
                                    {produkti.emriKategoris}
                                  </MDBTypography>
                                  <MDBTypography tag="h6" className="text-black mb-0">
                                    {produkti.emriProduktit}
                                  </MDBTypography>
                                </MDBCol>
                                <MDBCol md="3" lg="3" xl="3" className="d-flex align-items-center">
                                  <Button
                                    disabled={produkti.sasiaProduktitNeShporte <= 1}
                                    variant="link"
                                    className="px-2"
                                    onClick={() => UleSasin(produkti.produktiID)}
                                  >
                                    <MDBIcon fas icon="minus" />
                                  </Button>
                                  <MDBTypography tag="h6" className="text-black mb-0">
                                    {produkti.sasiaProduktitNeShporte}
                                  </MDBTypography>
                                  <Button variant="link" className="px-2" onClick={() => RritSasin(produkti.produktiID)}>
                                    <MDBIcon fas icon="plus" />
                                  </Button>
                                </MDBCol>
                                <MDBCol md="3" lg="2" xl="2" className="text-end">
                                  <MDBTypography tag="h6" className="mb-0">
                                    {parseFloat(produkti.qmimiProduktit).toFixed(2)} €
                                  </MDBTypography>
                                </MDBCol>
                                <MDBCol md="1" lg="1" xl="1" className="text-end">
                                  <Button variant="link" className="px-2" onClick={() => LargoProduktin(produkti.produktiID)}>
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
                    <MDBCol lg="4" className="bg-grey">
                      <div className="p-5">
                        <MDBTypography tag="h3" className="fw-bold mb-5 mt-2 pt-1">
                          Totali i porosisë
                        </MDBTypography>

                        <hr className="my-4" />
                        {teDhenatZbritje.length === 0 && shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes === '0' && (
                          <>
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
                              <Button onClick={handleApplyPromoCode}>
                                <FontAwesomeIcon icon={faCheck} />
                              </Button>
                            </MDBInputGroup>
                          </>
                        )}
                        {shporta && shporta.kodiZbritjes && (shporta.kodiZbritjes.qmimiZbritjes || shporta.kodiZbritjes.kodi != "NukKaZbritje")&& (
                          <>
                            <MDBTypography tag="h6" className="text-uppercase mb-3">
                              Kodi i zbritjes
                            </MDBTypography>

                            <MDBInputGroup className="mb-3">
                              <MDBInput
                                id="promo-input"
                                className="form-control"
                                type="text"
                                placeholder="Kodi Zbritjes"
                                value={shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.kodi}
                                disabled
                              />
                              <Button onClick={() => LargoKodinEZbritjes()}>
                                <FontAwesomeIcon icon={faXmark} />
                              </Button>
                            </MDBInputGroup>
                          </>
                        )}

                        <MDBTypography tag="h6" className="text-uppercase mb-1">
                          Shipping
                        </MDBTypography>

                        <div className="mb-1 pb-2">
                          <select
                            className="select p-2 rounded bg-grey"
                            style={{ width: '100%' }}
                            onChange={(e) => setTransporti(e.target.value)}
                          >
                            <option value="2">Dergese ne Shtepi - 2.00€</option>
                            <option value="0">Merre ne Zyre - 0.00€</option>
                          </select>
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
                          <MDBTypography tag="h6">{parseFloat(transporti).toFixed(2)} €</MDBTypography>
                        </div>
                        <div className="d-flex justify-content-between">
                          <MDBTypography tag="h6" className="text-uppercase">
                            Zbritja
                          </MDBTypography>
                          <MDBTypography tag="h6">
                            - {parseFloat(shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes).toFixed(2)} €
                          </MDBTypography>
                        </div>
                        <div className="d-flex justify-content-between">
                          <MDBTypography tag="h6" className="text-uppercase">
                            Kodi i Perdorur
                          </MDBTypography>
                          <MDBTypography tag="h6">{shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.kodi}</MDBTypography>
                        </div>
                        {(teDhenatZbritje.length !== 0 || (shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes)) && (
                          <div className="zbritja">
                            <hr />
                            <p>
                              <strong>Kodi i Perdorur: </strong>
                            </p>
                            <p>
                              <strong>Qmimi i Zbritjes: </strong>
                              {shporta.kodiZbritjes.qmimiZbritjes.toFixed(2)} €
                            </p>
                          </div>
                        )}

                        <hr className="my-4" />

                        <div className="d-flex justify-content-between mb-5">
                          <MDBTypography tag="h5" className="text-uppercase">
                            Total
                          </MDBTypography>
                          <MDBTypography tag="h5">
                            {parseFloat(
                              shporta.totali18TVSH +
                                shporta.totali8TVSH +
                                transporti -
                                (shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                                  ? shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                                  : 0)
                            ).toFixed(2)}{' '}
                            €
                          </MDBTypography>
                        </div>

                        <MDBBtn color="dark" block size="lg">
                          Kalo tek Pagesa
                        </MDBBtn>
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
  );
}
