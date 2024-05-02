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
import { Form, InputGroup, Pagination, Table } from 'react-bootstrap';
import './Styles/TabelaEPorosive.css';
import EksportoTeDhenat from '../../../components/Tabela/EksportoTeDhenat';
import useSortableData from '../../../hooks/useSortableData';
import SortIcon from '../../../components/Tabela/SortIcon';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { items, requestSort, sortConfig, currentPage, pageCount, goToPage } = useSortableData(
    porosite,
    perditeso,
    searchQuery,
    itemsPerPage
  );

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
        setPorosite(
          porosia.data.map((k) => ({
            IDPorosia: k.idPorosia,
            Klienti: k.idKlienti + ' - ' + k.emri + ' ' + k.mbiemri,
            TotaliProdukteve: k.totaliProdukteve,
            TotaliEuro: parseFloat(k.totali8TVSH + k.totali18TVSH).toFixed(2),
            TotaliPaTVSH: parseFloat(k.totali8TVSH + k.totali18TVSH - (k.totali18TVSH * 0.152542 + k.totali8TVSH * 0.074074)).toFixed(2),
            TVSH: parseFloat(k.totali18TVSH * 0.152542 + k.totali8TVSH * 0.074074).toFixed(2),
            Zbritja: k.zbritja,
            DataEPorosise: new Date(k.dataPorosis).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }),
            StatusiPorosis: k.statusiPorosis
          }))
        );
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  }; // Sherben per te kerkuar permes rreshtave

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
  }; //Per caktimin se sa rreshta mund te shfaqen ne nje faqe te vetme

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
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th colSpan={10}>
                      <InputGroup>
                        <Form.Select
                          value={itemsPerPage}
                          onChange={(e) => {
                            handleItemsPerPageChange(parseInt(e.target.value));
                            goToPage(0);
                          }}
                        >
                          <option value={5}>5 per page</option>
                          <option value={10}>10 per page</option>
                          <option value={15}>15 per page</option>
                        </Form.Select>
                        <Form.Control type="text" placeholder="Search..." value={searchQuery} onChange={handleSearch} />
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSearchQuery('');
                            requestSort(null);
                            goToPage(0);
                          }}
                          id="button-addon2"
                        >
                          Pastro Filtrat
                        </Button>

                        {porosite.length > 0 && <EksportoTeDhenat teDhenatJSON={porosite} emriDokumentit="Porosite e Klienteve" />}
                      </InputGroup>
                    </th>
                  </tr>
                  <tr>
                    <th onClick={() => requestSort('IDPorosia')}>
                      ID Porosia{' '}
                      {sortConfig.key === 'IDPorosia' ? <SortIcon direction={sortConfig.direction} type="number" /> : <SortIcon />}
                    </th>
                    <th onClick={() => requestSort('Klienti')}>
                      Klienti {sortConfig.key === 'Klienti' ? <SortIcon direction={sortConfig.direction} type="text" /> : <SortIcon />}
                    </th>
                    <th onClick={() => requestSort('TotaliProdukteve')}>
                      Totali Produkteve{' '}
                      {sortConfig.key === 'TotaliProdukteve' ? <SortIcon direction={sortConfig.direction} type="number" /> : <SortIcon />}
                    </th>
                    <th onClick={() => requestSort('TotaliEuro')}>
                      Totali €{' '}
                      {sortConfig.key === 'TotaliEuro' ? <SortIcon direction={sortConfig.direction} type="number" /> : <SortIcon />}
                    </th>
                    <th onClick={() => requestSort('TotaliPaTVSH')}>
                      Totali pa TVSH €{' '}
                      {sortConfig.key === 'TotaliPaTVSH' ? <SortIcon direction={sortConfig.direction} type="number" /> : <SortIcon />}
                    </th>
                    <th onClick={() => requestSort('TVSH')}>
                      TVSH € {sortConfig.key === 'TVSH' ? <SortIcon direction={sortConfig.direction} type="number" /> : <SortIcon />}
                    </th>
                    <th onClick={() => requestSort('Zbritja')}>
                      Zbritja € {sortConfig.key === 'Zbritja' ? <SortIcon direction={sortConfig.direction} type="number" /> : <SortIcon />}
                    </th>
                    <th onClick={() => requestSort('DataEPorosise')}>
                      Data e Porosise{' '}
                      {sortConfig.key === 'DataEPorosise' ? <SortIcon direction={sortConfig.direction} type="date" /> : <SortIcon />}
                    </th>
                    <th onClick={() => requestSort('StatusiPorosis')}>
                      Statusi Porosis{' '}
                      {sortConfig.key === 'StatusiPorosis' ? <SortIcon direction={sortConfig.direction} type="text" /> : <SortIcon />}
                    </th>
                    <th>Funksione</th>
                  </tr>
                </thead>
                <tbody>
                  {items
                    .filter((p) => {
                      if (!dataFillestare || !dataFundit) {
                        return true;
                      } else {
                        const dataPorosise = new Date(p.DataEPorosise);
                        return dataPorosise >= dataFillestare && dataPorosise <= dataFundit;
                      }
                    })
                    .map((p) => (
                      <tr key={p.IDPorosia}>
                        <td>{p.IDPorosia}</td>
                        <td>{p.Klienti}</td>
                        <td>{p.TotaliProdukteve}</td>
                        <td>{p.TotaliEuro} €</td>
                        <td>{p.TotaliPaTVSH} €</td>
                        <td>{p.TVSH} €</td>
                        <td>{p.Zbritja} €</td>
                        <td>{p.DataEPorosise}</td>
                        <td>{p.StatusiPorosis}</td>
                        <td>
                          <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => handleShfaqFaturen(p.IDPorosia)}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                          </Button>
                          {p.StatusiPorosis !== 'E Pranuar nga Klienti' && (
                            <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => handleEdito(p.IDPorosia)}>
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  <tr>
                    <td colSpan={10}>
                      <Pagination>
                        <Pagination.Prev onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0} />
                        {Array.from({ length: pageCount }, (_, index) => (
                          <Pagination.Item key={index} active={index === currentPage} onClick={() => goToPage(index)}>
                            {index + 1}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount - 1} />
                      </Pagination>
                    </td>
                  </tr>
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
