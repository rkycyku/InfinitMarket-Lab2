import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Mesazhi from '../../../components/Mesazhi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPlus, faClose } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import { Table } from 'react-bootstrap';
import EksportoTeDhenat from '../../../components/Tabela/EksportoTeDhenat';
import Tabela from '../../../components/Tabela/Tabela';

function ShportaEKlienteve(props) {
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
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    shfaqKlientet();
  }, [perditeso]);

  const UsersData = klientet.map((k) => ({
    ID: k.perdoruesi.userID,
    'Emri & Mbiemri': k.perdoruesi.emri + ' ' + k.perdoruesi.mbiemri,
    Email: k.perdoruesi.email,
    'Nr. Kontaktit': k.perdoruesi.teDhenatPerdoruesit && k.perdoruesi.teDhenatPerdoruesit.nrKontaktit,
    'Data e Lindjes': new Date(k.perdoruesi.teDhenatPerdoruesit && k.perdoruesi.teDhenatPerdoruesit.dataLindjes).toLocaleDateString(
      'en-GB',
      { dateStyle: 'short' }
    ),
    Adresa:
      k.perdoruesi.teDhenatPerdoruesit &&
      k.perdoruesi.teDhenatPerdoruesit.qyteti + ' ' + k.perdoruesi.teDhenatPerdoruesit &&
      k.perdoruesi.teDhenatPerdoruesit.shteti
  }));

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
        <>{UsersData.length > 0 ? <Tabela data={UsersData} tableName="Shporta e Klienteve" /> : 'Nuk ka te Dhena'}</>
      )}
    </div>
  );
}

export default ShportaEKlienteve;
