import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTimes } from '@fortawesome/free-solid-svg-icons';
import EditoFototProduktit from './EditoFototProduktit';

function EditoProduktin(props) {
  const [produkti, setProdukti] = useState({
    emriProduktit: '',
    pershkrimi: '',
    fotoProduktit: '',
    kategoriaId: '',
    kompaniaId: '',
    llojiTVSH: '',
    isDeleted: ''
  });
  const [categories, setCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [perditeso, setPerditeso] = useState(Date.now());

  const [foto, setFoto] = useState(null);

  const [shfaqEditoFotot, setShfaqEditoFotot] = useState(false);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [responseProdukti, responseCategories, responseCompanies] = await Promise.all([
          axios.get(`https://localhost:7251/api/Produktet/Produkti/ShfaqProduktinSipasIDsAll/${props.id}`),
          axios.get('https://localhost:7251/api/Produktet/Kategoria/shfaqKategorit'),
          axios.get('https://localhost:7251/api/Produktet/Kompania/shfaqKompanit')
        ]);

        const isDeleted = responseProdukti.data.produkti.isDeleted ? 'true' : 'false';

        setProdukti({
          ...responseProdukti.data.produkti,
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
  }, [props.id, perditeso]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProdukti((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (event) => {
    setFoto(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (foto) {
      const formData = new FormData();
      formData.append('foto', foto);

      try {
        await axios
          .post(
            `https://localhost:7251/api/TeNdryshme/VendosFotot/EditoProduktin?fotoVjeterProduktit=${produkti.fotoProduktit}`,
            formData,
            authentikimi
          )
          .then(async (response) => {
            await axios
              .put(
                `https://localhost:7251/api/Produktet/Produkti/PerditesoProduktin/${props.id}`,
                {
                  ProduktiId: produkti.produktiId,
                  EmriProduktit: produkti.emriProduktit,
                  Pershkrimi: produkti.pershkrimi,
                  FotoProduktit: response.data,
                  KompaniaId: produkti.kompaniaId,
                  KategoriaId: produkti.kategoriaId,
                  isDeleted: produkti.isDeleted,
                  TeDhenatProduktit: {
                    llojiTVSH: produkti.llojiTVSH
                  }
                },
                authentikimi
              )
              .then((x) => {
                props.setTipiMesazhit('success');
                props.setPershkrimiMesazhit('Produkti u Perditesua me sukses!');
                props.perditesoTeDhenat();
                props.largo();
                props.shfaqmesazhin();
              })
              .catch((error) => {
                console.error('Error saving the product:', error);
                props.setTipiMesazhit('danger');
                props.setPershkrimiMesazhit('Ndodhi nje gabim gjate perditesimit te produktit!');
                props.perditesoTeDhenat();
                props.shfaqmesazhin();
              });
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      await axios
        .put(
          `https://localhost:7251/api/Produktet/Produkti/PerditesoProduktin/${props.id}`,
          {
            ProduktiId: produkti.produktiId,
            EmriProduktit: produkti.emriProduktit,
            Pershkrimi: produkti.pershkrimi,
            FotoProduktit: produkti.fotoProduktit,
            KompaniaId: produkti.kompaniaId,
            KategoriaId: produkti.kategoriaId,
            isDeleted: produkti.isDeleted,
            TeDhenatProduktit: {
              llojiTVSH: produkti.llojiTVSH
            }
          },
          authentikimi
        )
        .then((x) => {
          props.setTipiMesazhit('success');
          props.setPershkrimiMesazhit('Produkti u Perditesua me sukses!');
          props.perditesoTeDhenat();
          props.largo();
          props.shfaqmesazhin();
        })
        .catch((error) => {
          console.error('Error saving the product:', error);
          props.setTipiMesazhit('danger');
          props.setPershkrimiMesazhit('Ndodhi nje gabim gjate perditesimit te produktit!');
          props.perditesoTeDhenat();
          props.shfaqmesazhin();
        });
    }
  };

  return (
    <>
      {shfaqEditoFotot && (
        <EditoFototProduktit
          id={props.id}
          largo={() => setShfaqEditoFotot(false)}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={(e) => props.setTipiMesazhit(e)}
          setPershkrimiMesazhit={(e) => props.setPershkrimiMesazhit(e)}
        />
      )}

      {!shfaqEditoFotot && (
        <Modal show={true} onHide={() => {props.largo(); props.perditesoTeDhenat();}}>
          <Modal.Header closeButton>
            <Modal.Title>Edito Produktin</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Product updated successfully.</Alert>}
            <Form>
              <Form.Group className="mb-3" controlId="emriProduktit">
                <Form.Label>Emri Produktit</Form.Label>
                <Form.Control as="textarea" name="emriProduktit" value={produkti.emriProduktit} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="pershkrimi">
                <Form.Label>Pershkrimi</Form.Label>
                <Form.Control as="textarea" name="pershkrimi" value={produkti.pershkrimi} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Foto Produktit</Form.Label>
                <Form.Control type="file" accept="image/*" placeholder="Foto e Produktit" onChange={handleFotoChange} />
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
                <Form.Label>Lloji TVSH-s</Form.Label>
                <Form.Control type="number" name="llojiTVSH" value={produkti.llojiTVSH} onChange={handleInputChange} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="info" onClick={() => setShfaqEditoFotot(true)} disabled={loading}>
              Perditeso Fotot <FontAwesomeIcon icon={faTimes} />
            </Button>
            <Button variant="secondary" onClick={() => {props.largo(); props.perditesoTeDhenat();}} disabled={loading}>
              Anulo <FontAwesomeIcon icon={faTimes} />
            </Button>
            <Button variant="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Ruaj'} <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default EditoProduktin;
