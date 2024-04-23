import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faCheck, faXmark, faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import EditoProduktin from './EditoProduktin';
import ShtoProduktin from './ShtoProduktin';
import Mesazhi from '../../../../components/Mesazhi';
import { TailSpin } from 'react-loader-spinner';
import LargoProduktin from './LargoProduktin';
import EditoStokunQmimin from './EditoStokunQmimin';

function TabelaEProdukteve() {
  const [produktet, setProduktet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [edito, setEdito] = useState(false);
  const [editoStokunQmimin, setEditoStokunQmimin] = useState(false);
  const [id, setId] = useState(0);
  const [shto, setShto] = useState(false);
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [kategorite, setKategorite] = useState([]);
  const [showLargoModal, setShowLargoModal] = useState(false);
  const [produktIdToDelete, setProduktIdToDelete] = useState(null);

  const [inputValue, setInputValue] = useState();
  const [produktetEFiltruara, setProduktetEFiltruara] = useState(produktet);

  const [perditeso, setPerditeso] = useState(Date.now());

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const fetchProduktet = async () => {
      try {
        const response = await axios.get('https://localhost:7251/api/Produktet/Produkti/ShfaqProduktet', authentikimi);
        setProduktet(response.data);
        setProduktetEFiltruara(response.data);

        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProduktet();
  }, [perditeso]);

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);
    const filtered = produktet.filter((item) => item.emriProduktit.toLowerCase().includes(value));
    setProduktetEFiltruara(filtered);
  };

  const handleEdito = (id) => {
    setEdito(true);
    setId(id);
  };

  const handleEditoMbyll = () => {
    setEdito(false);
    setId(0);
  };

  const handleClose = () => {
    setShto(false);
  };

  const handleShow = () => setShto(true);

  const handleDelete = (produktId) => {
    setProduktIdToDelete(produktId);
    setShowLargoModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://localhost:7251/api/Produktet/Produkti/LargoProduktin/${produktIdToDelete}`);
      setShowLargoModal(false);
      setProduktIdToDelete(null);
      setPerditeso(Date.now());
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCloseLargoModal = () => {
    setShowLargoModal(false);
    setProduktIdToDelete(null);
  };

  return (
    <div>
      {edito && (
        <EditoProduktin
          id={id}
          largo={handleEditoMbyll}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
      {shto && (
        <ShtoProduktin
          shfaq={handleShow}
          largo={handleClose}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      {editoStokunQmimin && (
        <EditoStokunQmimin
          id={id}
          largo={() => setEditoStokunQmimin(false)}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>Lista e Produkteve</h1>
          <Button className="mb-3" variant="primary" onClick={handleShow}>
            Shto Produkt <FontAwesomeIcon icon={faPlus} />
          </Button>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              type="text"
              className="form-control styled-input"
              placeholder="Kerkoni Produktin"
              value={inputValue}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Table responsive>
            <thead>
              <tr>
                <th>Emri i Produktit</th>
                <th>Pershkrimi</th>
                <th>Foto Produktit</th>
                <th>Kompania</th>
                <th>Kategoria</th>
                <th>Lloji TVSH-s</th>
                <th>Sasia në Stok</th>
                <th>Çmimi</th>
                <th>Funksione</th>
              </tr>
            </thead>
            <tbody>
              {produktetEFiltruara.map((produkt) => (
                <tr key={produkt.produktiId}>
                  <td>{produkt.emriProduktit}</td>
                  <td>
                    {produkt.pershkrimi ? <FontAwesomeIcon icon={faCheck} color="green" /> : <FontAwesomeIcon icon={faXmark} color="red" />}
                  </td>
                  <td>
                    <img src={`${process.env.PUBLIC_URL}/img/produktet/${produkt.fotoProduktit}`} width="50" alt="" />
                  </td>
                  <td>{produkt.emriKompanis}</td>
                  <td>{produkt.llojiKategoris}</td>
                  <td>{produkt.llojiTVSH}</td>
                  <td>{produkt.sasiaNeStok}</td>
                  <td>{parseFloat(produkt.qmimiProduktit).toFixed(2)}</td>
                  <td>
                    <Button style={{ marginRight: '0.5em' }} variant="info" onClick={() => handleEdito(produkt.produktiId)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      style={{ marginRight: '0.5em' }}
                      variant="info"
                      onClick={() => {
                        setEditoStokunQmimin(true);
                        setId(produkt.produktiId);
                      }}
                    >
                      <FontAwesomeIcon icon={faMoneyBill} />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(produkt.produktiId)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
      {showLargoModal && (
        <LargoProduktin
          id={produktIdToDelete}
          largo={handleCloseLargoModal}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
          handleDeleteConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

export default TabelaEProdukteve;
