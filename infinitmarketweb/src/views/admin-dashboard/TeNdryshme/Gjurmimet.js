import { useEffect, useState } from 'react';
import axios from 'axios';
import Mesazhi from '../../../components/Mesazhi';
import { TailSpin } from 'react-loader-spinner';
import Tabela from '../../../components/Tabela/Tabela';
import KontrolloAksesinNeFaqe from '../../../components/KontrolliAksesit/KontrolloAksesinNeFaqe';
import Titulli from '../../../components/Titulli';

function Gjurmimet() {
  const [gjurmimet, setGjurmimet] = useState([]);
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
    const shfaqGjurmimet = async () => {
      try {
        setLoading(true);
        const gjurmimet = await axios.get('https://localhost:7251/api/TeNryshme/AdminLogs/ShfaqGjurmimet', authentikimi);
        setGjurmimet(
          gjurmimet.data.map((k) => ({
            ID: k.id,
            Stafi: k.stafi && k.stafi.emri + ' ' + k.stafi.mbiemri + ' - ' + k.stafi.email,
            Koha: new Date(k.koha).toLocaleDateString('en-GB', { dateStyle: 'short' }),
            Veprimi: k.veprimi,
            Entiteti: k.entiteti,
            'Entiteti ID': k.entitetiId,
            Detajet: k.detaje
          }))
        );
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    shfaqGjurmimet();
  }, [perditeso]);

  return (
    <div>
      <KontrolloAksesinNeFaqe />
      <Titulli titulli={'Kodet e Zbritjeve'} />
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
          <Tabela data={gjurmimet} tableName="Gjurmimet" />
        </>
      )}
    </div>
  );
}

export default Gjurmimet;
