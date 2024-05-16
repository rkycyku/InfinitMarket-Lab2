import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Mesazhi from '../../../components/Mesazhi';

import { TailSpin } from 'react-loader-spinner';
import { Form, InputGroup, Pagination, Table } from 'react-bootstrap';
import EksportoTeDhenat from '../../../components/Tabela/EksportoTeDhenat';
import SortIcon from '../../../components/Tabela/SortIcon';
import useSortableData from '../../../hooks/useSortableData';
import Tabela from '../../../components/Tabela/Tabela';
import KontrolloAksesinNeFaqe from '../../../components/KontrolliAksesit/KontrolloAksesinNeFaqe';
import Titulli from './../../../components/Titulli';

function ListaEKlienteve(props) {
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
        setKlientet(
          klientet.data
            .filter((x) => x.rolet.includes('Klient'))
            .map((k) => ({
              ID: k.perdoruesi.userID,
              Klienti: k.perdoruesi.emri + ' ' + k.perdoruesi.mbiemri,
              Email: k.perdoruesi.email,
              'Nr. Kontaktit': k.perdoruesi.teDhenatPerdoruesit && k.perdoruesi.teDhenatPerdoruesit.nrKontaktit,
              Datalindjes:
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

  return (
    <div>
      <KontrolloAksesinNeFaqe />
      <Titulli titulli={'Lista e Klienteve'} />
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
        <Tabela data={klientet} tableName="Lista e Klienteve" />
      )}
    </div>
  );
}

export default ListaEKlienteve;
