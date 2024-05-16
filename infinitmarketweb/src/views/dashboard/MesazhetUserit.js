import { useEffect, useState } from 'react';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import Tabela from '../../components/Tabela/Tabela';
import Titulli from '../../components/Titulli';

function MesazhetUserit(props) {
  const [mesazhet, setMesazhet] = useState([]);
  const [perditeso, setPerditeso] = useState('');
  const [loading, setLoading] = useState(false);
  const getID = localStorage.getItem('id');

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    if (getID) {
      const vendosMesazhet = async () => {
        try {
          await axios
            .get(`https://localhost:7251/api/Perdoruesi/shfaqSipasID?idUserAspNet=${getID}`, authentikimi)
            .then(async (response) => {
              const mesazhi = await axios.get(
                `https://localhost:7251/api/TeNdryshme/ContactForm/shfaqMesazhetNgaUseri?idUserit=${response.data.teDhenatPerdoruesit.userID}`,
                authentikimi
              );
              setMesazhet(
                mesazhi.data.map((k) => ({
                  ID: k.mesazhiId,
                  Mesazhi: k.mesazhi,
                  'Data Dergeses': new Date(k.dataDergeses).toLocaleDateString('en-GB', { dateStyle: 'short' }),
                  Statusi: k.statusi
                }))
              );
            });
        } catch (err) {
          console.log(err);
        }
      };
      vendosMesazhet();
    }
  }, [perditeso]);

  return (
    <div>
      <Titulli titulli={'Mesazhet e derguara nga Ju'} />
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
        <Tabela data={mesazhet} tableName="Mesazhet e derguara nga Ju" />
      )}
    </div>
  );
}

export default MesazhetUserit;
