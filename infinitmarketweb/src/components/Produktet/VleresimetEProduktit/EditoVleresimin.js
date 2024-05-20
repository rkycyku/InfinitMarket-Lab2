import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faXmark, faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';

function EditoVleresimin(props) {
  const [vleresimi, setVlersimi] = useState({ vlersimiTekst: '', vlersimiYll: 0 });
  const [perditeso, setPerditeso] = useState('');
  const [fushatEZbrazura, setFushatEZbrazura] = useState(false);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const shfaqVleresimin = async () => {
      try {
        const vleresimi = await axios.get(
          `https://localhost:7251/api/Produktet/VleresimetEProduktit/ShfaqVleresiminNgaID?idVleresimi=${props.id}`,
          authentikimi
        );
        setVlersimi(vleresimi.data);
      } catch (err) {
        console.log(err);
      }
    };

    shfaqVleresimin();
  }, [perditeso]);

  function isNullOrEmpty(value) {
    return value === null || value === '' || value === undefined;
  }

  async function handleSubmit() {
    await axios
      .put(
        `https://localhost:7251/api/Produktet/VleresimetEProduktit/NdryshoVleresiminEProduktit?id=${props.id}`,
        {
          id: props.id,
          produktiID: vleresimi.produktiID,
          klientiID: vleresimi.klientiID,
          vlersimiTekst: vleresimi.vlersimiTekst,
          vlersimiYll: vleresimi.vlersimiYll
        },
        authentikimi
      )
      .then((x) => {
        props.setTipiMesazhit('success');
        props.setPershkrimiMesazhit('Vleresimi u Perditesua me sukses!');
        props.perditesoTeDhenat();
        props.largo();
        props.shfaqmesazhin();
      })
      .catch((error) => {
        console.error('Error saving vleresimi:', error);
        props.setTipiMesazhit('danger');
        props.setPershkrimiMesazhit('Ndodhi nje gabim gjate perditesimit te vleresimit!');
        props.perditesoTeDhenat();
        props.shfaqmesazhin();
      });
  }

  const handleKontrolli = () => {
    if (isNullOrEmpty(vleresimi.vlersimiTekst) || vleresimi.vlersimiYll == 0) {
      setFushatEZbrazura(true);
    } else {
      handleSubmit();
    }
  };

  const handleVendosVleresiminYje = (index) => {
    setVlersimi((prev) => ({ ...prev, vlersimiYll: index }));
  };

  const shfaqYjet = () => {
    const yjet = [];
    for (let i = 1; i <= 5; i++) {
      yjet.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= vleresimi.vlersimiYll ? faSolidStar : faRegularStar}
          onClick={() => handleVendosVleresiminYje(i)}
          style={{ cursor: 'pointer', color: i <= vleresimi.vlersimiYll ? 'gold' : 'gray' }}
        />
      );
    }
    return yjet;
  };

  return (
    <>
      {fushatEZbrazura && (
        <Modal size="sm" show={fushatEZbrazura} onHide={() => setFushatEZbrazura(false)}>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: 'red' }} as="h6">
              Ndodhi nje gabim
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <strong style={{ fontSize: '10pt' }}>
              Ju lutemi plotesoni te gjitha fushat me <span style={{ color: 'red' }}>*</span>
            </strong>
          </Modal.Body>
          <Modal.Footer>
            <Button size="sm" onClick={() => setFushatEZbrazura(false)} variant="secondary">
              Mbylle <FontAwesomeIcon icon={faXmark} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal className="modalEditShto" show={true} onHide={() => props.largo()}>
        <Modal.Header closeButton>
          <Modal.Title>Edito Vleresimin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>
                Pershkrimi <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                onChange={(e) => setVlersimi((prev) => ({ ...prev, vlersimiTekst: e.target.value }))}
                value={vleresimi.vlersimiTekst}
                as="textarea"
                placeholder="Pershkrimi"
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Vleresimi <span style={{ color: 'red' }}>*</span></Form.Label>
              <div>{shfaqYjet()}</div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => props.largo()}>
            Anulo <FontAwesomeIcon icon={faXmark} />
          </Button>
          <Button className="Butoni" onClick={handleKontrolli}>
            Edito Vleresimin <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditoVleresimin;
