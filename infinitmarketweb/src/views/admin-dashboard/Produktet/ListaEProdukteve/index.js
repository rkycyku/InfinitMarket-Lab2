import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import EditoProduktin from './EditoProduktin';
import ShtoProduktin from './ShtoProduktin';
import Mesazhi from '../../../../components/Mesazhi';
import { TailSpin } from 'react-loader-spinner';
import LargoProduktin from './LargoProduktin';

function TabelaEProdukteve() {
  const [produktet, setProduktet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [edito, setEdito] = useState(false);
  const [id, setId] = useState(0);
  const [shto, setShto] = useState(false);
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [kategorite, setKategorite] = useState([]);
  const [showLargoModal, setShowLargoModal] = useState(false);
  const [produktIdToDelete, setProduktIdToDelete] = useState(null);

  useEffect(() => {
    const fetchProduktet = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://localhost:7251/api/Produktet/Produkti/ShfaqProduktet');
        setProduktet(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchProduktet();
  }, []);

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
          perditesoTeDhenat={() => setProduktet(Date.now())}
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
          perditesoTeDhenat={() => setProduktet(Date.now())}
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
          <Table responsive>
            <thead>
              <tr>
                <th>Emri i Produktit</th>
                <th>Pershkrimi</th>
                <th>Sasia në Stok</th>
                <th>Çmimi</th>
                <th>Funksione</th>
              </tr>
            </thead>
            <tbody>
              {produktet.map((produkt) => (
                <tr key={produkt.produktiId}>
                  <td>{produkt.emriProduktit}</td>
                  <td>{produkt.pershkrimi}</td>
                  <td>{produkt.sasiaNeStok}</td>
                  <td>{produkt.qmimiProduktit}</td>
                  <td>
                    <Button style={{ marginRight: '0.5em' }} variant="info" onClick={() => handleEdito(produkt.produktiId)}>
                      <FontAwesomeIcon icon={faEdit} />
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
          perditesoTeDhenat={() => setProduktet(Date.now())}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
    </div>
  );
}

export default TabelaEProdukteve;
