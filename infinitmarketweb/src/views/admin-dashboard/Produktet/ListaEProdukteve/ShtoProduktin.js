import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

function ShtoProduktin(props) {
  const [emriProduktit, setEmriProduktit] = useState('');
  const [pershkrimi, setPershkrimi] = useState('');
  const [fotoProduktit, setFotoProduktit] = useState('');
  const [sasiaNeStok, setSasiaNeStok] = useState(0);
  const [qmimiBleres, setQmimiBleres] = useState(0);
  const [qmimiProduktit, setQmimiProduktit] = useState(0);
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [kategoriaId, setKategoriaId] = useState('');
  const [kompaniaId, setKompaniaId] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://localhost:7251/api/Produktet/Kategoria/shfaqKategorit');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await axios.get('https://localhost:7251/api/Produktet/Kompania/shfaqKompanit');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCategories();
    fetchCompanies();
  }, []);

  const handleSubmit = async () => {
    try {
      await axios.post(
        'https://localhost:7251/api/Produktet/Produkti/ShtoProdukt',
        {
          emriProduktit,
          pershkrimi,
          fotoProduktit,
          kompaniaId,
          kategoriaId,
          isDeleted: "false",
          teDhenatProduktit: {
            sasiaNeStok,
            qmimiBleres,
            qmimiProduktit,
          }
        }
      );
      props.setTipiMesazhit('success');
      props.setPershkrimiMesazhit('Produkti u shtua me sukses!');
      props.perditesoTeDhenat();
      props.largo();
      props.shfaqmesazhin();
      setEmriProduktit('');
      setPershkrimi('');
      setFotoProduktit('');
      setSasiaNeStok(0);
      setQmimiBleres(0);
      setQmimiProduktit(0);
    } catch (error) {
      console.error(error);
      props.setTipiMesazhit('error');
      props.setPershkrimiMesazhit('Gabim gjatë shtimit të produktit.');
      props.shfaqmesazhin();
    }
  };

  return (
    <Modal className="modalEditShto" show={props.shfaq} onHide={props.largo}>
      <Modal.Header closeButton>
        <Modal.Title>Shto Produktin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="emriProduktit">
            <Form.Label>Emri Produktit</Form.Label>
            <Form.Control
              type="text"
              placeholder="Emri Produktit"
              value={emriProduktit}
              onChange={(e) => setEmriProduktit(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="pershkrimi">
            <Form.Label>Pershkrimi</Form.Label>
            <Form.Control
              type="text"
              placeholder="Pershkrimi"
              value={pershkrimi}
              onChange={(e) => setPershkrimi(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="fotoProduktit">
            <Form.Label>Foto Produktit</Form.Label>
            <Form.Control
              type="text"
              placeholder="Foto Produktit"
              value={fotoProduktit}
              onChange={(e) => setFotoProduktit(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="sasiaNeStok">
            <Form.Label>Sasia në Stok</Form.Label>
            <Form.Control
              type="number"
              placeholder="Sasia në Stok"
              value={sasiaNeStok}
              onChange={(e) => setSasiaNeStok(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="qmimiBleres">
            <Form.Label>Qmimi Blerës</Form.Label>
            <Form.Control
              type="number"
              placeholder="Qmimi Blerës"
              value={qmimiBleres}
              onChange={(e) => setQmimiBleres(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="qmimiProduktit">
            <Form.Label>Qmimi Produktit</Form.Label>
            <Form.Control
              type="number"
              placeholder="Qmimi Produktit"
              value={qmimiProduktit}
              onChange={(e) => setQmimiProduktit(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="kategoriaId">
            <Form.Label>Kategoria</Form.Label>
            <Form.Select onChange={(e) => setKategoriaId(e.target.value)} required>
              <option value="">Zgjidh Kategorinë</option>
              {categories.map((category) => (
                <option key={category.kategoriaId} value={category.kategoriaId}>
                  {category.llojiKategoris}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="kompaniaId">
            <Form.Label>Kompania</Form.Label>
            <Form.Select onChange={(e) => setKompaniaId(e.target.value)} required>
              <option value="">Zgjidh Kompaninë</option>
              {companies.map((company) => (
                <option key={company.kompaniaID} value={company.kompaniaID}>
                  {company.emriKompanis}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.largo}>
          Anulo <FontAwesomeIcon icon={faXmark} />
        </Button>
        <Button className="Butoni" onClick={handleSubmit}>
          Shto Produktin <FontAwesomeIcon icon={faPlus} />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ShtoProduktin;
