import './Styles/Fatura.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Barkodi from './Barkodi';
import QRCode from 'qrcode.react';

function HeaderFatura(props) {
  const [teDhenatBiznesit, setTeDhenatBiznesit] = useState([]);

  const [teDhenatFat, setTeDhenatFat] = useState([]);

  const [teDhenatQRCode, setTeDhenatQrCode] = useState(null);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const vendosFature = async () => {
      try {
        const teDhenat = await axios.get(
          `https://localhost:7251/api/TeNdryshme/Porosia/ShfaqPorosineNgaID?nrFatures=${props.faturaID}`,
          authentikimi
        );

        const teDhenatBiznesit = await axios.get('https://localhost:7251/api/Biznesi/TeDhenatBiznesit/ShfaqTeDhenat', authentikimi);

        const teDhenatQRCode = await axios.get(`https://localhost:7251/api/TeNdryshme/Porosia/TeDhenatFatQRCode?nrPorosis=${props.faturaID}&nrBarkodit=${props.Barkodi}`, authentikimi);

        setTeDhenatFat(teDhenat.data);
        setTeDhenatBiznesit(teDhenatBiznesit.data);
        setTeDhenatQrCode(teDhenatQRCode.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    vendosFature();
  }, [props.faturaID, props.Barkodi]);

  const jsonString = JSON.stringify(teDhenatQRCode);

  return (
    <>
      <div className="header">
        <div className="teDhenatKompanis">
          <img
            src={`${process.env.PUBLIC_URL}/img/web/${teDhenatBiznesit.logo}`}
            style={{ width: '150px', height: 'auto', marginTop: '0.5em' }}
          />
          <h2 style={{ fontSize: '24pt' }}>{teDhenatBiznesit && teDhenatBiznesit.emriIBiznesit}</h2>
          <p>
            <strong>Adresa: </strong>
            {teDhenatBiznesit && teDhenatBiznesit.adresa}
          </p>
          <p>
            <strong>NUI: </strong>
            {teDhenatBiznesit && teDhenatBiznesit.nui} / <strong>NF: </strong>
            {teDhenatBiznesit && teDhenatBiznesit.nf} / <strong>TVSH: </strong>
            {teDhenatBiznesit && teDhenatBiznesit.nrtvsh}
          </p>

          <p>
            <strong>Kontakti: </strong>
            {teDhenatBiznesit && teDhenatBiznesit.nrKontaktit} - {teDhenatBiznesit && teDhenatBiznesit.email}
          </p>
          <hr />
          <p>
            <strong>Data e Fatures: </strong>
            {new Date(teDhenatFat && teDhenatFat.dataPorosis).toLocaleDateString('en-GB', { dateStyle: 'short' })}
          </p>
          <p>
            <strong>Shenime Shtese: </strong>
            {teDhenatFat && teDhenatFat.regjistrimet && (
              <span
                dangerouslySetInnerHTML={{
                  __html: teDhenatFat.regjistrimet.pershkrimShtese
                }}
              />
            )}
          </p>
          <strong>
            Faqe: {props.NrFaqes} / {props.NrFaqeve}
          </strong>
        </div>

        <div className="data">
          <div className="barkodi">
            <span id="nrFatures">
              <Barkodi value={props.Barkodi} />
            </span>
            <span id="nrFatures">
              <QRCode size={180} value={jsonString} />
            </span>
          </div>
          <div className="teDhenatEKlientit">
            <p>
              <strong>
                {teDhenatFat && teDhenatFat.emriAdresaDorezimit} {teDhenatFat && teDhenatFat.mbiemriAdresaDorezimit}
              </strong>
            </p>
            <p>
              <strong>
                {teDhenatFat && teDhenatFat.email} {' / '}
                {teDhenatFat && teDhenatFat.nrKontaktit}
              </strong>
            </p>
            <p>
              <strong>Adresa: </strong>
              {teDhenatFat && teDhenatFat.adresa}, {teDhenatFat && teDhenatFat.qyteti}, {teDhenatFat && teDhenatFat.shteti}{' '}
              {teDhenatFat && teDhenatFat.zipKodi}
            </p>
            <p>
              <strong>Lloji Transportit: </strong>
              {teDhenatFat && teDhenatFat.llojiTransportit}
            </p>
            <p>
              <strong>Lloji Pageses: </strong>
              {teDhenatFat && teDhenatFat.llojiPageses}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderFatura;
