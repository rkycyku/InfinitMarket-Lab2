import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Mesazhi from '../../../components/Mesazhi';

import { TailSpin } from 'react-loader-spinner';
import { Form, InputGroup, Pagination, Table } from 'react-bootstrap';
import EksportoTeDhenat from '../../../components/Tabela/EksportoTeDhenat';
import SortIcon from '../../../components/Tabela/SortIcon';
import useSortableData from '../../../hooks/useSortableData';

function ListaEKlienteve(props) {
  const [klientet, setKlientet] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { items, requestSort, sortConfig, currentPage, pageCount, goToPage } = useSortableData(
    klientet,
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
    const shfaqKlientet = async () => {
      try {
        setLoading(true);
        const klientet = await axios.get('https://localhost:7251/api/Perdoruesi/shfaqPerdoruesit', authentikimi);

        console.log(klientet.data);
        setKlientet(
          klientet.data
            .filter((x) => x.rolet.includes('Klient'))
            .map((k) => ({
              ID: k.perdoruesi.userID,
              EmriMbiemri: k.perdoruesi.emri + ' ' + k.perdoruesi.mbiemri,
              Email: k.perdoruesi.email,
              NrKontaktit: k.perdoruesi.teDhenatPerdoruesit && k.perdoruesi.teDhenatPerdoruesit.nrKontaktit,
              DataLindjes:
                k.perdoruesi.teDhenatPerdoruesit &&
                k.perdoruesi.teDhenatPerdoruesit.dataLindjes &&
                new Date(k.perdoruesi.teDhenatPerdoruesit.dataLindjes).toLocaleDateString('en-GB', { dateStyle: 'short' }),
              Adresa:
                k.perdoruesi.teDhenatPerdoruesit &&
                k.perdoruesi.teDhenatPerdoruesit.qyteti &&
                k.perdoruesi.teDhenatPerdoruesit.shteti &&
                `${k.perdoruesi.teDhenatPerdoruesit.qyteti}, ${k.perdoruesi.teDhenatPerdoruesit.shteti}`
            }))
        );
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    shfaqKlientet();
  }, [perditeso]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
  };

  return (
    <div>
      {shfaqMesazhin && <Mesazhi setShfaqMesazhin={setShfaqMesazhin} pershkrimi={pershkrimiMesazhit} tipi={tipiMesazhit} />}
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
          <h1>Lista e Klienteve</h1>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th colSpan={5}>
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

                    {klientet.length > 0 && <EksportoTeDhenat teDhenatJSON={klientet} emriDokumentit="Lista e Klienteve" />}
                  </InputGroup>
                </th>
              </tr>
              <tr>
                <th onClick={() => requestSort('EmriMbiemri')}>
                  Emri & Mbiemri{' '}
                  {sortConfig.key === 'EmriMbiemri' ? <SortIcon direction={sortConfig.direction} type="text" /> : <SortIcon />}
                </th>
                <th onClick={() => requestSort('Email')}>
                  Email {sortConfig.key === 'Email' ? <SortIcon direction={sortConfig.direction} type="text" /> : <SortIcon />}
                </th>
                <th onClick={() => requestSort('NrKontaktit')}>
                  Nr. Kontaktit{' '}
                  {sortConfig.key === 'NrKontaktit' ? <SortIcon direction={sortConfig.direction} type="number" /> : <SortIcon />}
                </th>
                <th onClick={() => requestSort('DataLindjes')}>
                  Data e Lindjes{' '}
                  {sortConfig.key === 'DataLindjes' ? <SortIcon direction={sortConfig.direction} type="date" /> : <SortIcon />}
                </th>
                <th onClick={() => requestSort('Adresa')}>
                  Adresa {sortConfig.key === 'Adresa' ? <SortIcon direction={sortConfig.direction} type="text" /> : <SortIcon />}
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((k) => (
                console.log(typeof(k.DataLindjes)),
                <tr key={k.ID}>
                  <td>{k.EmriMbiemri}</td>
                  <td>{k.Email}</td>
                  <td>{k.NrKontaktit}</td>
                  <td>{k.DataLindjes}</td>
                  <td>{k.Adresa}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={5}>
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
    </div>
  );
}

export default ListaEKlienteve;
