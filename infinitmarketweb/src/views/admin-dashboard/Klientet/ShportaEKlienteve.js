import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Mesazhi from '../../../components/Mesazhi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faPlus, faClose } from '@fortawesome/free-solid-svg-icons';
import { TailSpin } from 'react-loader-spinner';
import { Table } from 'react-bootstrap';
import EksportoTeDhenat from '../../../components/EksportoTeDhenat';
import DataTable from '../../../components/DataTable';

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

        console.log(klientet.data);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    shfaqKlientet();
  }, [perditeso]);

  function PergatitjaTeDhenavePerEksport() {
    return klientet.map((user) => {
      const { perdoruesi } = user;

      return {
        'Emri & Mbiemri': perdoruesi.emri + ' ' + perdoruesi.mbiemri,
        Email: perdoruesi.email,
        'Nr. Kontaktit': perdoruesi.teDhenatPerdoruesit.nrKontaktit,
        'Data e Lindjes': new Date(perdoruesi.teDhenatPerdoruesit.dataLindjes).toLocaleDateString('en-GB', { dateStyle: 'short' }),
        Adresa: perdoruesi.teDhenatPerdoruesit.qyteti + ', ' + perdoruesi.teDhenatPerdoruesit.shteti
      };
    });
  }
  const headers = ['Emri & Mbiemri', 'Email', 'Nr. Kontaktit', 'Data e Lindjes', 'Adresa'];
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
        <>
          <h1>Lista e Klienteve</h1>
          <EksportoTeDhenat teDhenatJSON={PergatitjaTeDhenavePerEksport()} emriDokumentit="Lista e Klienteve" />
          <DataTable headers={headers} data={UsersData} />
        </>
      )}
    </div>
  );
}

export default ShportaEKlienteve;
