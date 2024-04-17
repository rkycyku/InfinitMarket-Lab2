import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Mesazhi from '../../../../components/Mesazhi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import EditoKompanin from './EditoKodin';
import LargoKompanin from './FshijKodin';
import { TailSpin } from 'react-loader-spinner';
import ShtoKodin from './ShtoKodin';
import { Table } from 'react-bootstrap';

function KodiZbritjes() {
  const [kodetEZbritjeve, setKodetEZbritjeve] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [shto, setShto] = useState(false);
  const [edito, setEdito] = useState(false);
  const [fshij, setFshij] = useState(false);
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const shfaqKompanit = async () => {
      try {
        setLoading(true);
        const kodi = await axios.get('https://localhost:7251/api/TeNdryshme/KodiZbritje/ShfaqKodet', authentikimi);
        setKodetEZbritjeve(kodi.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    shfaqKompanit();
  }, [perditeso]);

  const handleClose = () => {
    setShto(false);
  };
  const handleShow = () => setShto(true);

  const handleEdito = (id) => {
    setEdito(true);
    setId(id);
  };
  const handleEditoMbyll = () => setEdito(false);

  const handleFshij = (id) => {
    setFshij(true);
    setId(id);
  };
  const handleFshijMbyll = () => setFshij(false);

  return (
    <div>
      {shto && (
        <ShtoKodin
          shfaq={handleShow}
          largo={handleClose}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
      {edito && (
        <EditoKompanin
          largo={handleEditoMbyll}
          id={id}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      {fshij && (
        <LargoKompanin
          largo={handleFshijMbyll}
          id={id}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
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
          <h1 className="title">Kodet e Zbritjeve</h1>

          <Button className="mb-3 Butoni" onClick={handleShow}>
            Shto Kodin <FontAwesomeIcon icon={faPlus} />
          </Button>

          <Table>
            <thead>
              <tr>
                <th>Kodi Zbritjes</th>
                <th>Qmimi Zbritjes</th>
                <th>Vlen per</th>
                <th>Data Krijimit</th>
                <th>Funksione</th>
              </tr>
            </thead>
            <tbody>
              {kodetEZbritjeve.map((k) => (
                <tr key={k.kodi}>
                  <td>{k.kodi}</td>
                  <td>{k.qmimiZbritjes.toFixed(2)} €</td>
                  <td>{k.produktiId !== null ? k.produkti && k.produkti.emriProduktit : 'Kodi vlene per komplet shporten'}</td>
                  <td>{new Date(k.dataKrijimit).toLocaleDateString('en-GB', { dateStyle: 'short' })}</td>
                  <td>
                    <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => handleEdito(k.kodi)}>
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                    <Button variant="danger" onClick={() => handleFshij(k.kodi)}>
                      <FontAwesomeIcon icon={faBan} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
}

export default KodiZbritjes;
