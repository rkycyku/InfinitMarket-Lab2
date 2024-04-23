import { useEffect, useState } from 'react';
import classes from './Styles/TabelaEPorosive.module.css';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Mesazhi from '../../../components/Mesazhi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import PerditesoStatusinPorosis from './PerditesoStatusinPorosis';
import { TailSpin } from 'react-loader-spinner';
import PagesaMeSukses from '../../../components/Checkout/PagesaMeSukses';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ExcelJS from 'exceljs';

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

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Porosite');

    // Add headers
    const headers = [
      'ID Porosia',
      'Klienti',
      'Totali Produkteve',
      'Totali €',
      'Totali pa TVSH €',
      'TVSH €',
      'Zbritja €',
      'Data e Porosise',
      'Statusi Porosis'
    ];
    worksheet.addRow(headers);
    const headerRow = worksheet.getRow(1);

    // Set the fill color of each cell in the header row
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '13CDD3' } // Change this hex code to the desired color
      };
    });
    // Add data rows
    porosite
      .filter((p) => {
        if (!dataFillestare || !dataFundit) {
          return true;
        } else {
          const dataPorosise = new Date(p.dataPorosis);
          return dataPorosise >= dataFillestare && dataPorosise <= dataFundit;
        }
      })
      .forEach((user) => {
        const { idPorosia, idKlienti, emri, mbiemri, totaliProdukteve, totali8TVSH, totali18TVSH, zbritja, dataPorosis, statusiPorosis } =
          user;

        const klienti = idKlienti + ' - ' + emri + ' ' + mbiemri;
        const totaliEuro = parseFloat(totali8TVSH + totali18TVSH).toFixed(2);
        const totaliPaTvshEuro = parseFloat(totali8TVSH + totali18TVSH - (totali18TVSH * 0.152542 + totali8TVSH * 0.074074)).toFixed(2);
        const totaliTvshEuro = parseFloat(totali18TVSH * 0.152542 + totali8TVSH * 0.074074).toFixed(2);

        worksheet.addRow([
          idPorosia,
          klienti,
          totaliProdukteve,
          totaliEuro,
          totaliPaTvshEuro,
          totaliTvshEuro,
          zbritja,
          dataPorosis,
          statusiPorosis
        ]);
      });

    // Generate Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Porosite.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  function downloadJsonData() {
    // Define the filename for the downloaded JSON file
    const filename = 'porosite.json';

    // Process the data and call the download function
    const jsonData = [];
    porosite
      .filter((p) => {
        if (!dataFillestare || !dataFundit) {
          return true;
        } else {
          const dataPorosise = new Date(p.dataPorosis);
          return dataPorosise >= dataFillestare && dataPorosise <= dataFundit;
        }
      })
      .forEach((user) => {
        const { idPorosia, idKlienti, emri, mbiemri, totaliProdukteve, totali8TVSH, totali18TVSH, zbritja, dataPorosis, statusiPorosis } =
          user;

        const klienti = idKlienti + ' - ' + emri + ' ' + mbiemri;
        const totaliEuro = parseFloat(totali8TVSH + totali18TVSH).toFixed(2);
        const totaliPaTvshEuro = parseFloat(totali8TVSH + totali18TVSH - (totali18TVSH * 0.152542 + totali8TVSH * 0.074074)).toFixed(2);
        const totaliTvshEuro = parseFloat(totali18TVSH * 0.152542 + totali8TVSH * 0.074074).toFixed(2);

        // Add the processed data to the jsonData array
        jsonData.push({
          'ID Porosia': idPorosia,
          Klienti: klienti,
          'Totali Produkteve': totaliProdukteve,
          'Totali €': totaliEuro,
          'Totali pa TVSH €': totaliPaTvshEuro,
          'TVSH €': totaliTvshEuro,
          'Zbritja €': zbritja,
          'Data e Porosise': dataPorosis,
          'Statusi Porosis': statusiPorosis
        });
      });
    // Convert the data to JSON string
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Create a Blob containing the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a link element to download the JSON file
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;

    // Append the link to the body and programmatically trigger the download
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

function exportToCsv() {
    
// Example usage:
const filename = 'porosite';
  const headers = [
    'ID Porosia',
    'Klienti',
    'Totali Produkteve',
    'Totali €',
    'Totali pa TVSH €',
    'TVSH €',
    'Zbritja €',
    'Data e Porosise',
    'Statusi Porosis'
  ];
  const data = porosite
  .filter((p) => {
    if (!dataFillestare || !dataFundit) {
      return true;
    } else {
      const dataPorosise = new Date(p.dataPorosis);
      return dataPorosise >= dataFillestare && dataPorosise <= dataFundit;
    }
  })
  .map((user) => {
    const { idPorosia, idKlienti, emri, mbiemri, totaliProdukteve, totali8TVSH, totali18TVSH, zbritja, dataPorosis, statusiPorosis } = user;
    const klienti = idKlienti + ' - ' + emri + ' ' + mbiemri;
    const totaliEuro = parseFloat(totali8TVSH + totali18TVSH).toFixed(2);
    const totaliPaTvshEuro = parseFloat(totali8TVSH + totali18TVSH - (totali18TVSH * 0.152542 + totali8TVSH * 0.074074)).toFixed(2);
    const totaliTvshEuro = parseFloat(totali18TVSH * 0.152542 + totali8TVSH * 0.074074).toFixed(2);

    return {
      'ID Porosia': idPorosia,
      Klienti: klienti,
      'Totali Produkteve': totaliProdukteve,
      'Totali €': totaliEuro,
      'Totali pa TVSH €': totaliPaTvshEuro,
      'TVSH €': totaliTvshEuro,
      'Zbritja €': zbritja,
      'Data e Porosise': dataPorosis,
      'Statusi Porosis': statusiPorosis
    };
  });

  const csvData = [
    headers,
    ...data.map(row => [
      row['ID Porosia'],
      row['Klienti'],
      row['Totali Produkteve'],
      row['Totali €'],
      row['Totali pa TVSH €'],
      row['TVSH €'],
      row['Zbritja €'],
      row['Data e Porosise'],
      row['Statusi Porosis']
    ])
  ];

  const csv = csvData.map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename + '.csv';
  a.click();

  URL.revokeObjectURL(a.href);
}



  return (
    <div className={classes.containerDashboardP}>
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
              <div className={classes.DataPerFiltrim}>
                <div className={classes.datat}>
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
                <div className={classes.datat}>
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
                <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => exportToExcel()}>
                  Export to Excel
                </Button>
                <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => downloadJsonData()}>
                  Export to JSON
                </Button>
                <Button style={{ marginRight: '0.5em' }} variant="success" onClick={() => exportToCsv()}>
                  Export to CSV
                </Button>
              </div>
              <table className="tableBig">
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
                      <td>{new Date(p.dataPorosis).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</td>
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
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default TabelaEPorosive;
