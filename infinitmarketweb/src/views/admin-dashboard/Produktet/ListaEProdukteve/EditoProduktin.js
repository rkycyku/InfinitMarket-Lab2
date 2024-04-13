import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTimes } from '@fortawesome/free-solid-svg-icons';

function EditoProduktin(props) {
  const [produkti, setProdukti] = useState({
    emriProduktit: '',
    pershkrimi: '',
    fotoProduktit: '',
    kategoriaId: '',
    kompaniaId: '',
    sasiaNeStok: '',
    qmimiBleres: '',
    qmimiProduktit: '',
    isDeleted: ''
  });
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [responseProdukti, responseCategories, responseCompanies] = await Promise.all([
          axios.get(`https://localhost:7251/api/Produktet/Produkti/ShfaqProduktinSipasIDsAll/${props.id}`),
          axios.get('https://localhost:7251/api/Produktet/Kategoria/shfaqKategorit'),
          axios.get('https://localhost:7251/api/Produktet/Kompania/shfaqKompanit')
        ]);
        
        const isDeleted = responseProdukti.data.isDeleted ? "true" : "false";

        setProdukti({
          ...responseProdukti.data,
          isDeleted: isDeleted
        });
        setCategories(responseCategories.data);
        setCompanies(responseCompanies.data);
      } catch (error) {
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [props.id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProdukti((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const Produkti = {
        ProduktiId: produkti.produktiId,
        EmriProduktit: produkti.emriProduktit,
        Pershkrimi: produkti.pershkrimi,
        FotoProduktit: produkti.fotoProduktit,
        KompaniaId: produkti.kompaniaId,
        KategoriaId: produkti.kategoriaId,
        isDeleted: produkti.isDeleted,
        TeDhenatProduktit: {
          SasiaNeStok: produkti.sasiaNeStok,
          QmimiBleres: produkti.qmimiBleres,
          QmimiProduktit: produkti.qmimiProduktit
        }
      };
      await axios.put(`https://localhost:7251/api/Produktet/Produkti/PerditesoProduktin/${props.id}`, Produkti);
      setSuccess(true);
      props.perditesoTeDhenat();
    } catch (error) {
      setError('Error updating product.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal show={true} onHide={props.largo}>
      <Modal.Header closeButton>
        <Modal.Title>Edito Produktin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Product updated successfully.</Alert>}
        <Form>
          <Form.Group className="mb-3" controlId="emriProduktit">
            <Form.Label>Emri Produktit</Form.Label>
            <Form.Control type="text" name="emriProduktit" value={produkti.emriProduktit} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="pershkrimi">
            <Form.Label>Pershkrimi</Form.Label>
            <Form.Control type="text" name="pershkrimi" value={produkti.pershkrimi} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="fotoProduktit">
            <Form.Label>Foto Produktit</Form.Label>
            <Form.Control type="text" name="fotoProduktit" value={produkti.fotoProduktit} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="kategoriaId">
            <Form.Label>Kategoria</Form.Label>
            <Form.Select name="kategoriaId" value={produkti.kategoriaId} onChange={handleInputChange}>
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
            <Form.Select name="kompaniaId" value={produkti.kompaniaId} onChange={handleInputChange}>
              <option value="">Zgjidh Kompaninë</option>
              {companies.map((company) => (
                <option key={company.kompaniaID} value={company.kompaniaID}>
                  {company.emriKompanis}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="sasiaNeStok">
            <Form.Label>Sasia në Stok</Form.Label>
            <Form.Control type="number" name="sasiaNeStok" value={produkti.sasiaNeStok} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="qmimiBleres">
            <Form.Label>Çmimi Blerës</Form.Label>
            <Form.Control type="number" name="qmimiBleres" value={produkti.qmimiBleres} onChange={handleInputChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="qmimiProduktit">
            <Form.Label>Çmimi Produktit</Form.Label>
            <Form.Control type="number" name="qmimiProduktit" value={produkti.qmimiProduktit} onChange={handleInputChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.largo} disabled={loading}>
          Anulo <FontAwesomeIcon icon={faTimes} />
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Ruaj'} <FontAwesomeIcon icon={faPenToSquare} />
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditoProduktin;
