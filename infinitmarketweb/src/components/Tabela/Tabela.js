import { useState } from 'react';
import { Button, Col, Form, InputGroup, Pagination, Row, Table } from 'react-bootstrap';
import EksportoTeDhenat from './EksportoTeDhenat';
import SortIcon from './SortIcon';
import useSortableData from '../../hooks/useSortableData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faBan, faInfoCircle, faMoneyBill, faPlus, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

function Tabela({
  data,
  tableName,
  kaButona,
  funksionButonShto,
  funksionButonEdit,
  funksionButonFshij,
  funksionShfaqFature,
  funksioniEditoStokunQmimin
}) {
  const [perditeso, setPerditeso] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { items, requestSort, sortConfig, currentPage, pageCount, goToPage } = useSortableData(data, perditeso, searchQuery, itemsPerPage);

  const headeri = Object.keys(data[0]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
  };

  return (
    <div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th colSpan={headeri.length + 1}>
              <h1>{tableName}</h1>
            </th>
          </tr>
          <tr>
            <th colSpan={headeri.length + 1}>
              <Row className="align-items-center">
                <Col xs="auto" className="pe-0">
                  {funksionButonShto && (
                    <Button variant="outline-success" onClick={() => funksionButonShto()}>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  )}
                </Col>
                <Col xs="auto" className="ps-0 pe-0">
                  {data.length > 0 && <EksportoTeDhenat teDhenatJSON={data} emriDokumentit={tableName} />}
                </Col>
              </Row>
            </th>
          </tr>

          <tr>
            <th colSpan={headeri.length + 1}>
              <InputGroup>
                <Form.Select
                  value={itemsPerPage}
                  onChange={(e) => {
                    handleItemsPerPageChange(parseInt(e.target.value));
                    goToPage(0);
                  }}
                >
                  <option value={1}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={15}>15 per page</option>
                </Form.Select>
                <Form.Control type="text" placeholder="Search..." value={searchQuery} onChange={handleSearch} />
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    requestSort(null);
                    goToPage(0);
                  }}
                  id="button-addon2"
                >
                  Pastro Filtrat
                </Button>
              </InputGroup>
            </th>
          </tr>
          <tr>
            {headeri.map((header) => (
              <th key={header} onClick={() => requestSort(header)}>
                {header} {sortConfig.key === header ? <SortIcon direction={sortConfig.direction} type="text" /> : <SortIcon />}
              </th>
            ))}
            {kaButona && <th>Funksione</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.ID}>
              {headeri.map((header) => (
                <td key={`${item.ID}-${header}`}>
                  <div className="" dangerouslySetInnerHTML={{ __html: item[header] }} />
                  {}
                </td>
              ))}
              <td>
                {funksionShfaqFature && (
                  <Button variant="outline-success" onClick={() => funksionShfaqFature(item.ID)}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </Button>
                )}
                {funksionButonEdit && (
                  <Button variant="outline-success" onClick={() => funksionButonEdit(item.ID)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </Button>
                )}
                {funksioniEditoStokunQmimin && (
                  <Button variant="outline-info" onClick={() => funksioniEditoStokunQmimin(item.ID)}>
                    <FontAwesomeIcon icon={faMoneyBill} />
                  </Button>
                )}
                {funksionButonFshij && (
                  <Button variant="outline-danger" onClick={() => funksionButonFshij(item.ID)}>
                    <FontAwesomeIcon icon={faBan} />
                  </Button>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={headeri.length + 1}>
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
    </div>
  );
}

export default Tabela;
