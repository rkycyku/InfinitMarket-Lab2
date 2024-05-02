import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import ShtoKategori from './ShtoKategori';
import Mesazhi from '../../../../components/Mesazhi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPenToSquare, faPlus, faClose } from '@fortawesome/free-solid-svg-icons';
import EditoKategorin from './EditoKategorin';
import LargoKategorin from './LargoKategorin';
import { TailSpin } from 'react-loader-spinner';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EksportoTeDhenat from '../../../../components/Tabela/EksportoTeDhenat';

function TabelaEKategorive(props) {
  const [kategorit, setKategorit] = useState([]);
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
    const shfaqKateogrit = async () => {
      try {
        setLoading(true);
        const kategoria = await axios.get('https://localhost:7251/api/Produktet/Kategoria/shfaqKategorit', authentikimi);
        setKategorit(kategoria.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    shfaqKateogrit();
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

  function PergatitjaTeDhenavePerEksport() {
    return kategorit.map((proukti) => {
      const { llojiKategoris, pershkrimiKategoris } = proukti;

      return {
        'Emri Kategoris': llojiKategoris,
        'Pershkrimi Kategoris': pershkrimiKategoris !== null && pershkrimiKategoris.trim() !== '' ? pershkrimiKategoris : 'Nuk Ka Pershkrim'
      };
    });
  }

  return (
    <div>
      {shto && (
        <ShtoKategori
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
        <EditoKategorin
          largo={handleEditoMbyll}
          id={id}
          shfaqmesazhin={() => setShfaqMesazhin(true)}
          perditesoTeDhenat={() => setPerditeso(Date.now())}
          setTipiMesazhit={setTipiMesazhit}
          setPershkrimiMesazhit={setPershkrimiMesazhit}
        />
      )}
      {fshij && (
        <LargoKategorin
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
          <h1>Lista e Kategorive te Produkteve</h1>
          <Link to="/admin/produktet/ListaEProdukteve">
            <Button className="mb-3 Butoni">
              Mbyll Kategorite <FontAwesomeIcon icon={faClose} />
            </Button>
          </Link>
          <Button className="mb-3 Butoni" onClick={handleShow}>
            Shto Kategori <FontAwesomeIcon icon={faPlus} />
          </Button>
          <EksportoTeDhenat teDhenatJSON={PergatitjaTeDhenavePerEksport()} emriDokumentit="Lista e Kategorive te Produkteve" />

          <Table responsive>
            <thead>
              <tr>
                <th>Emri Kategoris</th>
                <th>Pershkrimi Kategoris</th>
                <th>Funksione</th>
              </tr>
            </thead>
            <tbody>
              {kategorit.map((k) => (
                <tr key={k.kategoriaId}>
                  <td>{k.llojiKategoris}</td>
                  <td>
                    {k.pershkrimiKategoris !== null && k.pershkrimiKategoris.trim() !== '' ? k.pershkrimiKategoris : 'Nuk Ka Pershkrim'}
                  </td>
                  <td>
                    <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => handleEdito(k.kategoriaId)}>
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Button>
                    <Button variant="danger" onClick={() => handleFshij(k.kategoriaId)}>
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

export default TabelaEKategorive;
