import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Mesazhi from '../../../components/Mesazhi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv, faInfoCircle, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import PerditesoStatusinPorosis from './PerditesoStatusinPorosis';
import { TailSpin } from 'react-loader-spinner';
import PagesaMeSukses from '../../../components/Checkout/PagesaMeSukses';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Table } from 'react-bootstrap';
import './Styles/TabelaEPorosive.css';
import EksportoTeDhenat from '../../../components/EksportoTeDhenat';

function TabelaEPorosive() {
  const [porosite, setPorosite] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [edito, setEdito] = useState(false);
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [id, setId] = useState(0);
  const [loading, setLoading] = useState(false);

  const [shfaqPorosite, setShfaqPorosite] = useState(true);
  const [shfaqDetajet, setShfaqDetajet] = useState(false);
  const [nrFatures, setNumriFatures] = useState(0);

  const [dataFillestare, setDataFillestare] = useState(null);
  const [dataFundit, setDataFundit] = useState(null);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const vendosPorosite = async () => {
      try {
        setLoading(true);
        const porosia = await axios.get('https://localhost:7251/api/TeNdryshme/Porosia/ShfaqPorosit', authentikimi);
        setPorosite(porosia.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    vendosPorosite();
  }, [perditeso]);

  const handleEdito = (id) => {
    setEdito(true);
    setId(id);
  };
  const handleEditoMbyll = () => setEdito(false);

  const handleShfaqFaturen = (nrFatures) => {
    setShfaqPorosite(false);
    setNumriFatures(nrFatures);
    setShfaqDetajet(true);
  };

  function PergatitjaTeDhenavePerEksport() {
    return porosite
      .filter((p) => {
        if (!dataFillestare || !dataFundit) {
          return true;
        } else {
          const dataPorosise = new Date(p.dataPorosis);
          return dataPorosise >= dataFillestare && dataPorosise <= dataFundit;
        }
      })
      .map((user) => {
        const { idPorosia, idKlienti, emri, mbiemri, totaliProdukteve, totali8TVSH, totali18TVSH, zbritja, dataPorosis, statusiPorosis } =
          user;

        return {
          'ID Porosia': idPorosia,
          Klienti: idKlienti + ' - ' + emri + ' ' + mbiemri,
          'Totali Produkteve': totaliProdukteve,
          'Totali €': parseFloat(totali8TVSH + totali18TVSH).toFixed(2),
          'Totali pa TVSH €': parseFloat(totali8TVSH + totali18TVSH - (totali18TVSH * 0.152542 + totali8TVSH * 0.074074)).toFixed(2),
          'TVSH €': parseFloat(totali18TVSH * 0.152542 + totali8TVSH * 0.074074).toFixed(2),
          'Zbritja €': zbritja,
          'Data e Porosise': dataPorosis,
          'Statusi Porosis': statusiPorosis
        };
      });
  }

  return (
    <div>
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
      {edito && (
        <PerditesoStatusinPorosis
          largo={handleEditoMbyll}
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
          <h1 className="title">Porosite e Klienteve</h1>
          {dataFillestare && dataFundit && (
            <h1 className="title">
              Porosit e datave:{' '}
              {new Date(dataFillestare).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })} deri me{' '}
              {new Date(dataFundit).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
            </h1>
          )}
          {shfaqDetajet && (
            <PagesaMeSukses
              handleMbyll={() => {
                setShfaqDetajet(false);
                setShfaqPorosite(true);
              }}
              nrFatures={nrFatures}
            />
          )}
          {shfaqPorosite && (
            <>
              <div className="DataPerFiltrim">
                <div className="datat">
                  <p>Data Fillimit:</p>
                  <DatePicker
                    selected={dataFillestare}
                    onChange={(date) => setDataFillestare(date)}
                    dateFormat="dd/MM/yyyy"
                    maxDate={dataFundit}
                  />
                </div>
                <div>
                  <p>Data Mbarimit:</p>
                  <DatePicker selected={dataFundit} onChange={(date) => setDataFundit(date)} dateFormat="dd/MM/yyyy" />
                </div>
                <div className="datat">
                  <p>Reseto:</p>
                  <Button
                    style={{ marginRight: '0.5em' }}
                    variant="success"
                    onClick={() => {
                      setDataFillestare(null);
                      setDataFundit(null);
                    }}
                  >
                    Shfaq Te Gjitha porosite
                  </Button>
                </div>

                <EksportoTeDhenat teDhenatJSON={PergatitjaTeDhenavePerEksport()} emriDokumentit="Porosite" />
              </div>
              <Table>
                <thead>
                  <tr>
                    <th>ID Porosia</th>
                    <th>Klienti</th>
                    <th>Totali Produkteve</th>
                    <th>Totali €</th>
                    <th>Totali pa TVSH €</th>
                    <th>TVSH €</th>
                    <th>Zbritja €</th>
                    <th>Data e Porosise</th>
                    <th>Statusi Porosis</th>
                    <th>Funksione</th>
                  </tr>
                </thead>
                <tbody>
                  {porosite
                    .filter((p) => {
                      if (!dataFillestare || !dataFundit) {
                        return true;
                      } else {
                        const dataPorosise = new Date(p.dataPorosis);
                        return dataPorosise >= dataFillestare && dataPorosise <= dataFundit;
                      }
                    })
                    .map((p) => (
                      <tr key={p.idPorosia}>
                        <td>{p.idPorosia}</td>
                        <td>
                          {p.idKlienti} - {p.emri} {p.mbiemri}
                        </td>
                        <td>{p.totaliProdukteve}</td>
                        <td>{parseFloat(p.totali8TVSH + p.totali18TVSH).toFixed(2)} €</td>
                        <td>
                          {parseFloat(p.totali8TVSH + p.totali18TVSH - (p.totali18TVSH * 0.152542 + p.totali8TVSH * 0.074074)).toFixed(2)} €
                        </td>
                        <td>{parseFloat(p.totali18TVSH * 0.152542 + p.totali8TVSH * 0.074074).toFixed(2)} €</td>
                        <td>{parseFloat(p.zbritja).toFixed(2)} €</td>
                        <td>
                          {new Date(p.dataPorosis).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        </td>
                        <td>{p.statusiPorosis}</td>
                        <td>
                          <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => handleShfaqFaturen(p.idPorosia)}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                          </Button>
                          {p.statusiPorosis !== 'E Pranuar nga Klienti' && (
                            <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => handleEdito(p.idPorosia)}>
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default TabelaEPorosive;
