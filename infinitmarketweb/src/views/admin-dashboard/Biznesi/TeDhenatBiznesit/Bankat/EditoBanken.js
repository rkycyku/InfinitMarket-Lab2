import { useState, useEffect } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import KontrolloAksesinNeFunksione from "../../../../../components/KontrolliAksesit/KontrolloAksesinNeFunksione";

function EditoBanken(props) {
  const [banka, setBanka] = useState([]);

  const [perditeso, setPerditeso] = useState("");
  const [bankat, setBankat] = useState([]);
  const [kontrolloBanken, setKontrolloBanken] = useState(false);
  const [konfirmoBanken, setKonfirmoBanken] = useState(false);
  const [fushatEZbrazura, setFushatEZbrazura] = useState(false);

  const getToken = localStorage.getItem("token");

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  };

  useEffect(() => {
    const vendosbankat = async () => {
      try {
        const bankat = await axios.get(
          `https://localhost:7251/api/Biznesi/TeDhenatBiznesit/ShfaqBankat`,
          authentikimi
        );
        setBankat(bankat.data);
        console.log(bankat.data);
      } catch (err) {
        console.log(err);
      }
    };

    vendosbankat();
  }, [perditeso]);

  useEffect(() => {
    const shfaqNjesineMatese = async () => {
      try {
        const bankaKerkim = await axios.get(
          `https://localhost:7251/api/Biznesi/TeDhenatBiznesit/ShfaqBankenNgaID?id=${props.id}`,
          authentikimi
        );
        setBanka(bankaKerkim.data[0]);

        console.log(banka);
      } catch (err) {
        console.log(err);
      }
    };

    shfaqNjesineMatese();
  }, []);

  const handleChange = (propertyName) => (event) => {
    setBanka((prev) => ({
      ...prev,
      [propertyName]: event.target.value,
    }));

    console.log(banka);
  };

  const handleValutaChange = (event) => {
    setBanka((prev) => ({ ...prev, valuta: event }));
  };

  function isNullOrEmpty(value) {
    return value === null || value === "" || value === undefined;
  }

  function handleSubmit() {
    axios
      .put(
        `https://localhost:7251/api/Biznesi/TeDhenatBiznesit/PerditesoBanken?id=${banka.bankaID}`,
        banka,
        authentikimi
      )
      .then((x) => {
        props.setTipiMesazhit("success");
        props.setPershkrimiMesazhit("Banka u Perditesua me sukses!");
        props.perditesoTeDhenat();
        props.largo();
        props.shfaqmesazhin();
      })
      .catch((error) => {
        console.error("Error saving njesia matese:", error);
        props.setTipiMesazhit("danger");
        props.setPershkrimiMesazhit(
          "Ndodhi nje gabim gjate perditesimit te grupit te produktit!"
        );
        props.perditesoTeDhenat();
        props.shfaqmesazhin();
      });
  }

  const handleKontrolli = () => {
    if (
      isNullOrEmpty(banka.emriBankes) ||
      isNullOrEmpty(banka.numriLlogaris) ||
      isNullOrEmpty(banka.valuta)
    ) {
      setFushatEZbrazura(true);
    } else {
      if (
        konfirmoBanken == false &&
        bankat.filter(
          (item) =>
            (item.emriBankes === banka.emriBankes &&
              item.numriLlogaris == banka.numriLlogaris) ||
            item.numriLlogaris == banka.numriLlogaris
        ).length !== 0
      ) {
        setKontrolloBanken(true);
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <>
    <KontrolloAksesinNeFunksione
        largo={() => props.largo()}
        shfaqmesazhin={() => props.shfaqmesazhin()}
        perditesoTeDhenat={() => props.perditesoTeDhenat()}
        setTipiMesazhit={(e) => props.setTipiMesazhit(e)}
        setPershkrimiMesazhit={(e) => props.setPershkrimiMesazhit(e)}
      />
      {fushatEZbrazura && (
        <Modal
          size="sm"
          show={fushatEZbrazura}
          onHide={() => setFushatEZbrazura(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "red" }} as="h6">
              Ndodhi nje gabim
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <strong style={{ fontSize: "10pt" }}>
              Ju lutemi plotesoni te gjitha fushat me{" "}
              <span style={{ color: "red" }}>*</span>
            </strong>
          </Modal.Body>
          <Modal.Footer>
            <Button
              size="sm"
              onClick={() => setFushatEZbrazura(false)}
              variant="secondary">
              Mbylle <FontAwesomeIcon icon={faXmark} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {kontrolloBanken && (
        <Modal
          size="sm"
          show={kontrolloBanken}
          onHide={() => setKontrolloBanken(false)}>
          <Modal.Header closeButton>
            <Modal.Title as="h6">Konfirmo vendosjen</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <span style={{ fontSize: "10pt" }}>
              Kjo Banke ekziston ne sistem!
            </span>
            <br />
            <strong style={{ fontSize: "10pt" }}>
              A jeni te sigurt qe deshironi te vazhdoni?
            </strong>
          </Modal.Body>
          <Modal.Footer>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setKontrolloBanken(false)}>
              Korrigjo <FontAwesomeIcon icon={faXmark} />
            </Button>
            <Button
              size="sm"
              variant="warning"
              onClick={() => {
                handleSubmit();
              }}>
              Vazhdoni
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal className="modalEditShto" show={true} onHide={() => props.largo()}>
        <Modal.Header closeButton>
          <Modal.Title>Edito Banken</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>ID Banka</Form.Label>
              <Form.Control value={banka.bankaID} disabled />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Emri Bankes<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                onChange={handleChange("emriBankes")}
                value={banka.emriBankes}
                type="text"
                placeholder="Emri Bankes"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Numri Llogaris<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <Form.Control
                onChange={handleChange("numriLlogaris")}
                value={banka.numriLlogaris}
                type="text"
                placeholder="Numri Llogaris"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Adresa Bankes</Form.Label>
              <Form.Control
                onChange={handleChange("adresaBankes")}
                value={banka.adresaBankes}
                as="textarea"
                placeholder="Adresa Bankes"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1">
              <Form.Label>
                Valuta<span style={{ color: "red" }}>*</span>
              </Form.Label>
              <select
                placeholder="Valuta"
                className="form-select"
                value={banka.valuta}
                onChange={(e) => handleValutaChange(e.target.value)}>
                <option defaultValue selected value="Euro">
                  Euro - €
                </option>
                <option value="Dollar">Dollar - $</option>
                <option value="Franga Zvicerane">Franga Zvicerane - CHF</option>
              </select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.largo()}>
            Anulo <FontAwesomeIcon icon={faXmark} />
          </Button>
          <Button className="Butoni" onClick={handleKontrolli}>
            Edito Banken <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditoBanken;
