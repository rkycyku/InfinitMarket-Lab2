import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import "../../Styles/DizajniPergjithshem.css";
import "../../Styles/PerditesoTeDhenat.css";
import axios from "axios";
import Mesazhi from "../../../Components/TeTjera/layout/Mesazhi";
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faX,
  faEye,
  faEyeSlash,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

function PerditesoTeDhenat(props) {
  const [teDhenat, setTeDhenat] = useState([]);
  const [perditeso, setPerditeso] = useState("");
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState("");
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState("");
  const [loading, setLoading] = useState(false);

  const [editoFjalekalimin, setEditoFjalekalimin] = useState(false);

  const [fjalekalimiAktual, setFjalekalimiAktual] = useState("");
  const [fjalekalimiIRi, setFjalekalimiIRi] = useState("");
  const [fjalekalimiIRiKonfirmim, setFjalekalimiIRiKonfirmim] = useState("");
  const [shfaqFjalekalimin, setShfaqFjalekalimin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  const getID = localStorage.getItem("id");

  const getToken = localStorage.getItem("token");

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
            `https://localhost:7285/api/Perdoruesi/shfaqSipasID?idUserAspNet=${getID}`,
            authentikimi
          );
          setTeDhenat(perdoruesi.data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      };

      vendosTeDhenat();
    } else {
      navigate("/login");
    }
  }, [perditeso]);

  const handleFjalekalimiAktual = (e) => {
    setFjalekalimiAktual(e.target.value);
  };

  const handleFjalekalimiIRi = (e) => {
    setFjalekalimiIRi(e.target.value);
  };

  const handleFjalekalimiIRiKonfirmim = (e) => {
    setFjalekalimiIRiKonfirmim(e.target.value);
  };

  const handleEditoFjalekalimn = (e) => {
    e.preventDefault();

    setEditoFjalekalimin(true);
  };

  const handleAnuloPerditesimin = (event) => {
    event.preventDefault();

    setEditoFjalekalimin(false);
  };

  function isNullOrEmpty(value) {
    return value === null || value === "" || value === undefined;
  }

  async function EditoFjalekalimin(e) {
    e.preventDefault();
    try {
      if (
        !isNullOrEmpty(fjalekalimiAktual) &&
        !isNullOrEmpty(fjalekalimiIRi) &&
        !isNullOrEmpty(fjalekalimiIRiKonfirmim)
      ) {
        const passREGEX =
          /^[A-Z][A-Za-z0-9@$!%*?&]*[a-z][A-Za-z0-9@$!%*?&]*[0-9][A-Za-z0-9@$!%*?&]*$/;

        if (fjalekalimiIRi === fjalekalimiIRiKonfirmim) {
          const kontrolloFjalekalimin = await axios.get(
            `https://localhost:7251/api/Perdoruesi/KontrolloFjalekalimin?AspNetID=${getID}&fjalekalimi=${fjalekalimiAktual}`,
            authentikimi
          );

          if (kontrolloFjalekalimin.data === true) {
            if (passREGEX.test(fjalekalimiIRi)) {
              await axios.post(
                `https://localhost:7251/api/Perdoruesi/NdryshoFjalekalimin?AspNetID=${getID}&fjalekalimiAktual=${fjalekalimiAktual}&fjalekalimiIRi=${fjalekalimiIRi}`,
                {},
                authentikimi
              );

              setPerditeso(Date.now());

              setFjalekalimiAktual("");
              setFjalekalimiIRi("");
              setFjalekalimiIRiKonfirmim("");
              setShfaqFjalekalimin(false);

              setPershkrimiMesazhit(
                "<strong>Fjalekalimi u perditesua!</strong>"
              );
              setTipiMesazhit("success");
              setShfaqMesazhin(true);
              setPerditeso(Date.now());

              handleAnuloPerditesimin(e);
            } else {
              setShfaqFjalekalimin(false);

              setPershkrimiMesazhit(
                "Fjalekalimi duhet te permbaj <strong>shkronja, numra dhe simbole si dhe shkroja e pare duhet te jete e madhe!</strong>"
              );
              setTipiMesazhit("danger");
              setShfaqMesazhin(true);
              setPerditeso(Date.now());
            }
          } else {
            setShfaqFjalekalimin(false);

            setPershkrimiMesazhit(
              "<strong>Fjalekalimi aktual eshte gabim!</strong>"
            );
            setTipiMesazhit("danger");
            setShfaqMesazhin(true);
            setPerditeso(Date.now());
          }
        } else {
          setShfaqFjalekalimin(false);

          setPershkrimiMesazhit(
            "<strong>Konfirmimi i Passwordit me ate te ri nuk jane njesoj!</strong>"
          );
          setTipiMesazhit("danger");
          setShfaqMesazhin(true);
          setPerditeso(Date.now());
        }
      } else {
        setShfaqFjalekalimin(false);

        setPershkrimiMesazhit(
          "<strong>Ju lutem plotesoni te gjitha fushat e fjalekalimit!</strong>"
        );
        setTipiMesazhit("danger");
        setShfaqMesazhin(true);
        setPerditeso(Date.now());
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Helmet>
        <title>Perditesimi i Fjalekalimit | Infinit Market</title>
      </Helmet>

      <div className="containerDashboardP">
        {shfaqMesazhin && (
          <Mesazhi
            setShfaqMesazhin={setShfaqMesazhin}
            pershkrimi={pershkrimiMesazhit}
            tipi={tipiMesazhit}
          />
        )}
        {loading ? (
          <div className="Loader">
            <TailSpin
              height="80"
              width="80"
              color="#009879"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : (
          <>
            <div className="PerditesoTeDhenatContainer mb-4">
              <MDBRow tag="form" className="g-3">
                <h1 className="title"></h1>
                <MDBCol md="4">
                  <MDBInput
                    value={fjalekalimiAktual}
                    name="fjalekalimiAktual"
                    onChange={handleFjalekalimiAktual}
                    id="fjalekalimiAktual"
                    required
                    label="Fjalekalimi aktual"
                    disabled={!editoFjalekalimin}
                    type={showPassword ? "text" : "password"}
                  />
                </MDBCol>
                <MDBCol md="4">
                  <MDBInput
                    value={fjalekalimiIRi}
                    name="fjalekalimiIRi"
                    onChange={handleFjalekalimiIRi}
                    id="fjalekalimiIRi"
                    required
                    label="Fjalekalimi i ri"
                    disabled={!editoFjalekalimin}
                    type={showPassword ? "text" : "password"}
                  />
                </MDBCol>
                <MDBCol md="4">
                  <MDBInput
                    value={fjalekalimiIRiKonfirmim}
                    name="fjalekalimiIRiKonfirmim"
                    onChange={handleFjalekalimiIRiKonfirmim}
                    id="fjalekalimiIRiKonfirmim"
                    required
                    label="Konfirmoni Fjalekalimin"
                    disabled={!editoFjalekalimin}
                    type={showPassword ? "text" : "password"}
                  />
                </MDBCol>
                <MDBCol md="1"></MDBCol>
                <div className="col-12">
                  {!editoFjalekalimin && (
                    <button
                      className="btn btn-primary btn-small"
                      role="button"
                      onClick={handleEditoFjalekalimn}>
                      Ndrysho Fjalekalimin{" "}
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  )}

                  {editoFjalekalimin && (
                    <div className="butonatPerditesoTeDhenat">
                      <button
                        className="btn btn-success btn-small"
                        role="button"
                        onClick={EditoFjalekalimin}>
                        Ruaj
                      </button>
                      <button
                        className="btn btn-secondary btn-small"
                        role="button"
                        onClick={handleAnuloPerditesimin}>
                        Anulo
                      </button>
                      <button
                        className="btn btn-secondary btn-small"
                        type="button"
                        onClick={handleTogglePassword}>
                        {showPassword ? (
                          <FontAwesomeIcon icon={faEyeSlash} />
                        ) : (
                          <FontAwesomeIcon icon={faEye} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </MDBRow>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PerditesoTeDhenat;
