import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Mesazhi from '../../components/Mesazhi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPlus, faClose } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import { Table } from 'react-bootstrap';

function Klientet(props) {
  const [klientet, setKlientet] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');
  const [loading, setLoading] = useState(false);

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
        setKlientet(klientet.data.filter((x) => x.rolet.includes('Klient')));
        setLoading(false);

        console.log(klientet.data);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    shfaqKlientet();
  }, [perditeso]);

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

          <Table responsive>
            <thead>
              <tr>
                <th>Emri & Mbiemri</th>
                <th>Email</th>
                <th>Nr. Kontaktit</th>
                <th>Data e Lindjes</th>
                <th>Adresa</th>
              </tr>
            </thead>
            <tbody>
              {klientet.map((k) => (
                <tr key={k.perdoruesi.userID}>
                  <td>
                    {k.perdoruesi.emri} {k.perdoruesi.mbiemri}
                  </td>
                  <td>{k.perdoruesi.email}</td>
                  <td>{k.perdoruesi.teDhenatPerdoruesit && k.perdoruesi.teDhenatPerdoruesit.nrKontaktit}</td>
                  <td>
                    {new Date(k.perdoruesi.teDhenatPerdoruesit && k.perdoruesi.teDhenatPerdoruesit.dataLindjes).toLocaleDateString(
                      'en-GB',
                      { dateStyle: 'short' }
                    )}
                  </td>
                  <td>
                    {k.perdoruesi.teDhenatPerdoruesit && k.perdoruesi.teDhenatPerdoruesit.qyteti},{' '}
                    {k.perdoruesi.teDhenatPerdoruesit && k.perdoruesi.teDhenatPerdoruesit.shteti}
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

export default Klientet;
