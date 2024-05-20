import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus, faStar } from '@fortawesome/free-solid-svg-icons';
import '../Styles/ShtoVleresimin.css'; // Import the CSS file

const ShtoVleresimin = (props) => {
  const [pershkrimi, setPershkrimi] = useState('');
  const [vleresimi, setVleresimi] = useState(0);
  const [fushatEZbrazura, setFushatEZbrazura] = useState(false);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  async function handleSubmit() {
    try {
      await axios
        .post(
          'https://localhost:7251/api/Produktet/VleresimetEProduktit/VendosVleresimetPerProduktin',
          {
            id: null,
            produktiID: props.idProdukti,
            klientiID: props.idKlienti,
            vlersimiTekst: pershkrimi,
            vlersimiYll: vleresimi
          },
          authentikimi
        )
        .then(() => {
          props.setTipiMesazhit('success');
          props.setPershkrimiMesazhit('Vleresimi u insertua me sukses!');
          props.perditesoTeDhenat();
          props.largo();
          props.shfaqmesazhin();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  function isNullOrEmpty(value) {
    return value === null || value === '' || value === undefined;
  }

  const handleKontrolli = () => {
    if (vleresimi == 0 || isNullOrEmpty(pershkrimi)) {
      setFushatEZbrazura(true);
    } else {
      handleSubmit();
    }
  };

  const StarRating = ({ value, onChange }) => {
    const [rating, setRating] = useState(value);

    const handleClick = (index) => {
      setRating(index);
      onChange(index);
    };

    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={() => handleClick(star)}
          />
        ))}
      </div>
    );
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
      <Modal className="modalEditShto" show={props.shfaq} onHide={props.largo}>
        <Modal.Header closeButton>
          <Modal.Title>Shto Vleresmin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="pershkrimi">
              <Form.Label>
                Pershkrimi <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Pershkrimi"
                value={pershkrimi}
                onChange={(e) => setPershkrimi(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="vleresimi">
              <Form.Label>
                Vleresimi <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <StarRating value={vleresimi} onChange={setVleresimi} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.largo}>
            Mbyll <FontAwesomeIcon icon={faXmark} />
          </Button>
          <Button style={{ backgroundColor: '#009879', border: 'none' }} onClick={() => handleKontrolli()}>
            Shtoni Vlersimin <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ShtoVleresimin;
