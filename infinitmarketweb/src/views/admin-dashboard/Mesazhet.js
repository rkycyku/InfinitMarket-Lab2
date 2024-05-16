import { useState, useEffect } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import Mesazhi from '../../components/Mesazhi';
import Tabela from '../../components/Tabela/Tabela';
import KontrolloAksesinNeFaqe from '../../components/KontrolliAksesit/KontrolloAksesinNeFaqe';
import Titulli from '../../components/Titulli';

function Mesazhet() {
  const [mesazhet, setMesazhet] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [loading, setLoading] = useState(false);
  const [shfaqMesazhin, setShfaqMesazhin] = useState(false);
  const [tipiMesazhit, setTipiMesazhit] = useState('');
  const [pershkrimiMesazhit, setPershkrimiMesazhit] = useState('');

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  function handleEdito(id) {
    axios
      .put(`https://localhost:7251/api/TeNdryshme/ContactForm/konfirmoMesazhin?id=${id}`, {}, authentikimi)
      .then((x) => {
        setTipiMesazhit('success');
        setPershkrimiMesazhit('Statusi i Mesazhit u Perditesua me sukses!');
        setPerditeso(Date.now());
        setShfaqMesazhin(true);
      })
      .catch((error) => {
        console.error(error);
        setTipiMesazhit('danger');
        setPershkrimiMesazhit('Ndodhi nje gabim gjate perditesimit te statusit!');
        setPerditeso(Date.now());
        setShfaqMesazhin(true);
      });
  }

  async function handleFshij(id) {
    try {
      await axios.delete(`https://localhost:7251/api/TeNdryshme/ContactForm/fshiMesazhin?id=${id}`, authentikimi);
      setTipiMesazhit('success');
      setPershkrimiMesazhit('Mesazhi u fshi me sukses!');
      setPerditeso(Date.now());
      setShfaqMesazhin(true);
    } catch (error) {
      console.error(error);
      setTipiMesazhit('danger');
      setPershkrimiMesazhit('Ndodhi nje gabim gjate fshirjes se mesazhit!');
      setPerditeso(Date.now());
      setShfaqMesazhin(true);
    }
  }

  useEffect(() => {
    const shfaqKompanit = async () => {
      try {
        setLoading(true);
        const mesazhet = await axios.get('https://localhost:7251/api/TeNdryshme/ContactForm/shfaqMesazhet', authentikimi);
        setMesazhet(
          mesazhet.data.map((k) => ({
            ID: k.mesazhiId,
            Perdoruesi: k.user ? k.user.userID + ' - ' + k.user.emri + ' ' + k.user.mbiemri : 'Nuk ka Llogari',
            Emri: k.emri,
            Email: k.email,
            Mesazhi: k.mesazhi,
            'Data Dergeses': new Date(k.dataDergeses).toLocaleDateString('en-GB', { dateStyle: 'short' }),
            Statusi: k.statusi
          }))
        );
        console.log(mesazhet.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    shfaqKompanit();
  }, [perditeso]);

  return (
    <div className="containerDashboardP">
      <KontrolloAksesinNeFaqe />
      <Titulli titulli={'Mesazhet e derguara nga Perdoruesit'} />
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
          <Tabela
            data={mesazhet}
            tableName="Mesazhet e derguara nga Perdoruesit"
            kaButona
            funksionButonEdit={(e) => handleEdito(e)}
            funksionButonFshij={(e) => handleFshij(e)}
          />
        </>
      )}
    </div>
  );
}

export default Mesazhet;
