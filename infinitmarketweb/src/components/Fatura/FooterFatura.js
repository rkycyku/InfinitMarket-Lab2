import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Styles/Fatura.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { faCopyright } from '@fortawesome/free-regular-svg-icons';

function FooterFatura(props) {
  const [teDhenatFat, setteDhenatFat] = useState([]);
  const [bankat, setBankat] = useState([]);

  const [teDhenatBiznesit, setTeDhenatBiznesit] = useState([]);

  const [konvertimiValutave, setKonvertimiValutave] = useState([]);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  const dataPorosise = new Date(teDhenatFat.dataPorosis);
  const dita = dataPorosise.getDate().toString().padStart(2, '0');
  const muaji = (dataPorosise.getMonth() + 1).toString().padStart(2, '0');
  const viti = dataPorosise.getFullYear().toString().slice(-2);
  const dataMberritjes = new Date(dataPorosise.setDate(dataPorosise.getDate() + 4));
  const skadimiGarancionit = new Date(dataPorosise.setDate(dataPorosise.getDate() + 365));

  useEffect(() => {
    const vendosFature = async () => {
      try {
        const teDhenat = await axios.get(
          `https://localhost:7251/api/TeNdryshme/Porosia/ShfaqPorosineNgaID?nrFatures=${props.faturaID ?? 61}`,
          authentikimi
        );
        const bankat = await axios.get(`https://localhost:7251/api/Biznesi/TeDhenatBiznesit/ShfaqBankat`, authentikimi);
        const apiKonvertimiValutave = await axios.get(
          `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_At6H7hASeL41xhqWxRdKNKxduFJPT9VcktC7iM1m&currencies=EUR%2CUSD%2CCHF&base_currency=EUR`,
          authentikimi
        ); //Version free, Duhet te ruhet sigurt ne rast se ndryshon.
        const teDhenatBiznesit = await axios.get('https://localhost:7251/api/Biznesi/TeDhenatBiznesit/ShfaqTeDhenat', authentikimi);
        setTeDhenatBiznesit(teDhenatBiznesit.data);
        setteDhenatFat(teDhenat.data);
        setBankat(bankat.data);
        setKonvertimiValutave(apiKonvertimiValutave.data.data);

        console.log(apiKonvertimiValutave.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    vendosFature();
  }, [props.faturaID]);

  return (
    <>
      <div className="header">
        <div className="teDhenatKompanis">
          <p>
            Ne rast te pageses me transfer bankar vendosni numrin e Fatures: <strong>{props.Barkodi}</strong>
          </p>
          <p>Ne rast te pageses me transfer bankar ju lutem kontaktoni me stafin!</p>
          <p>
            <strong>Pagesa duhet te behet ne nje nga llogarit e cekura me poshte:</strong>
          </p>
          <Table>
            <thead>
              <tr style={{ fontSize: '12px' }}>
                <th>Emri Bankes</th>
                <th>Numri Llogaris</th>
                <th>Valuta</th>
              </tr>
            </thead>
            <tbody>
              {bankat &&
                bankat.map((x) => (
                  <tr style={{ fontSize: '12px' }} key={x.bankaID}>
                    <td>
                      <strong>{x.emriBankes}</strong>
                    </td>
                    <td>
                      <strong>{x.numriLlogaris}</strong>
                    </td>
                    <td>
                      <strong>{x.valuta}</strong>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <p>
            Porosia arrin me se largu:
            <strong> {dataMberritjes.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</strong>
          </p>
          <p>Te gjitha produktet ne kete fature kane garancion <strong>1 Vjet!</strong></p>
          <p>
            Garancioni vlene deri me:
            <strong> {skadimiGarancionit.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</strong>
          </p>
        </div>

        <div className="data">
          <p>
            <strong>Nentotali: </strong>
            {teDhenatFat && parseFloat(teDhenatFat.totali18TVSH + teDhenatFat.totali8TVSH).toFixed(2)} €
          </p>
          <p>
            <strong>Rabati: </strong>
            {teDhenatFat && parseFloat(-teDhenatFat.zbritja).toFixed(2)} €
          </p>
          <p>
            <strong>Totali Pa TVSH: </strong>
            {teDhenatFat &&
              parseFloat(
                teDhenatFat.totali8TVSH +
                  teDhenatFat.totali18TVSH -
                  (teDhenatFat.totali18TVSH * 0.152542 + teDhenatFat.totali8TVSH * 0.074074)
              ).toFixed(2)}{' '}
            €
          </p>
          <p>
            <strong>TVSH 8%: </strong>
            {teDhenatFat && parseFloat(teDhenatFat.totali8TVSH * 0.074074).toFixed(2)} €
          </p>
          <p>
            <strong>TVSH 18%: </strong>
            {teDhenatFat && parseFloat(teDhenatFat.totali18TVSH * 0.152542).toFixed(2)} €
          </p>
          <p>
            <strong>Transporti: </strong>
            {teDhenatFat && parseFloat(teDhenatFat.qmimiTransportit).toFixed(2)} €
          </p>
          <p>
            <strong style={{ fontSize: '18pt' }}>Qmimi Total: </strong>

            <strong style={{ fontSize: '18pt' }}>
              {teDhenatFat &&
                parseFloat(
                  teDhenatFat.totali8TVSH + teDhenatFat.totali18TVSH - teDhenatFat.zbritja + parseFloat(teDhenatFat.qmimiTransportit)
                ).toFixed(2)}{' '}
              €
            </strong>
          </p>
          <p style={{ marginTop: '-1em', fontSize: '13pt', fontWeight: 'bold' }}>
            {teDhenatFat &&
              parseFloat(
                (teDhenatFat.totali8TVSH + teDhenatFat.totali18TVSH - teDhenatFat.zbritja + parseFloat(teDhenatFat.qmimiTransportit)) *
                  (konvertimiValutave && konvertimiValutave.USD)
              ).toFixed(2)}{' '}
            $
          </p>
          <p style={{ marginTop: '-0.7em', fontSize: '13pt', fontWeight: 'bold' }}>
            {teDhenatFat &&
              parseFloat(
                (teDhenatFat.totali8TVSH + teDhenatFat.totali18TVSH - teDhenatFat.zbritja + parseFloat(teDhenatFat.qmimiTransportit)) *
                  (konvertimiValutave && konvertimiValutave.CHF)
              ).toFixed(2)}{' '}
            CHF
          </p>
        </div>
      </div>

      <br />
      <hr
        style={{
          height: '2px',
          borderWidth: '0',
          color: 'gray',
          backgroundColor: 'black'
        }}
      />
      <div className="nenshkrimet">
        <div className="nenshkrimi">
          <span>_________________________________________________________________</span>
          <span>(Emri, Mbiemri, Nenshkrimi & Vula)</span>
          <span>(Personi Përgjegjës)</span>
          <br />
          <strong>
            <FontAwesomeIcon icon={faCopyright} /> {teDhenatBiznesit && teDhenatBiznesit.emriIBiznesit}
          </strong>
        </div>
        <div className="nenshkrimi">
          <span>_________________________________________________________________</span>
          <span>(Emri, Mbiemri, Nenshkrimi)</span>
          <span>(Klienti)</span>
        </div>
      </div>
    </>
  );
}

export default FooterFatura;
