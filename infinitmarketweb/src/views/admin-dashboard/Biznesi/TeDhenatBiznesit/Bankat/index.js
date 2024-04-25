import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import ShtoBanken from './ShtoBanken';
import Mesazhi from '../../../../../components/Mesazhi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPenToSquare, faPlus, faClose } from '@fortawesome/free-solid-svg-icons';
import EditoBanken from './EditoBanken';
import LargoBanken from './LargoBanken';
import { TailSpin } from 'react-loader-spinner';
import { MDBBtn, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import EksportoTeDhenat from '../../../../../components/EksportoTeDhenat';

function Bankat(props) {
  const [njesiteMatese, setNjesiteMatese] = useState([]);
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
    const shfaqNjesiteMatese = async () => {
      try {
        setLoading(true);
        const Bankat = await axios.get('https://localhost:7251/api/Biznesi/TeDhenatBiznesit/ShfaqBankat', authentikimi);
        setNjesiteMatese(Bankat.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    shfaqNjesiteMatese();
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
    return njesiteMatese.map((banka) => {
      const { bankaID, emriBankes, numriLlogaris, adresaBankes, valuta } = banka;

      return {
        'ID Banka': bankaID,
        'Emri Bankes': emriBankes,
        'Numri i Llogaris': numriLlogaris,
        Adresa: adresaBankes,
        Valuta: valuta
      };
    });
  }

  return (
    <>
      <Helmet>
        <title>Bankat | InfinitMarket Online</title>
      </Helmet>

      <div className="containerDashboardP">
        {shto && (
          <ShtoBanken
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
          <EditoBanken
            largo={handleEditoMbyll}
            id={id}
            shfaqmesazhin={() => setShfaqMesazhin(true)}
            perditesoTeDhenat={() => setPerditeso(Date.now())}
            setTipiMesazhit={setTipiMesazhit}
            setPershkrimiMesazhit={setPershkrimiMesazhit}
          />
        )}
        {fshij && (
          <LargoBanken
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
            <h1 className="title">Bankat</h1>

            <Button onClick={handleShow}>
              Shtoni Banken <FontAwesomeIcon icon={faPlus} />
            </Button>
            <EksportoTeDhenat teDhenatJSON={PergatitjaTeDhenavePerEksport()} emriDokumentit="Bankat" />

            <MDBTable>
              <MDBTableHead>
                <tr>
                  <th scope="col">ID Banka</th>
                  <th scope="col">Emri Bankes</th>
                  <th scope="col">Numri i Llogaris</th>
                  <th scope="col">Adresa</th>
                  <th scope="col">Valuta</th>
                  <th scope="col">Funksione</th>
                </tr>
              </MDBTableHead>

              <MDBTableBody>
                {njesiteMatese.map((k) => (
                  <tr key={k.bankaID}>
                    <td>{k.bankaID}</td>
                    <td>{k.emriBankes}</td>
                    <td>{k.numriLlogaris}</td>
                    <td>{k.adresaBankes}</td>
                    <td>{k.valuta}</td>
                    <td>
                      <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => handleEdito(k.bankaID)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </Button>
                      <Button variant="danger" onClick={() => handleFshij(k.bankaID)}>
                        <FontAwesomeIcon icon={faBan} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </>
        )}
      </div>
    </>
  );
}

export default Bankat;
