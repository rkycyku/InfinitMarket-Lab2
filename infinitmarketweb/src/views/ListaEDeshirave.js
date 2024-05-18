import ProduktetNeHome from '../components/Produktet/ProduktetNeHome';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import './Styles/Home.css';
import '../assets/css/swiperSlider.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Titulli from '../components/Titulli';

function Home() {
  const [produktet, setProduktet] = useState([]);

  const [perditeso, setPerditeso] = useState(Date.now());

  const getToken = localStorage.getItem('token');
  const getID = localStorage.getItem('id');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const perditesoTeDhenat = async () => {
      try {
        const produktet = await axios.get(
          `https://localhost:7251/api/Produktet/Shporta/ShfaqListenEDeshirave?userID=${getID}`,
          authentikimi
        );

        setProduktet(produktet.data);
      } catch (err) {
        console.log(err);
      }
    };

    perditesoTeDhenat();
  }, [perditeso]);

  return (
    <div>
      <Titulli titulli={'Lista e Deshirave'} />
      <div className="artikujt">
        <div className="titulliArtikuj">
          <h1>Lista e Deshirave</h1>
        </div>

        {produktet.length > 0 ? (
          produktet.map((produkti) => {
            return (
              <ProduktetNeHome
                produktiID={produkti.produktiId}
                fotoProduktit={produkti.fotoProduktit}
                emriProduktit={produkti.emriProduktit}
                cmimi={produkti.qmimiProduktit}
                sasiaNeStok={produkti.sasiaNeStok}
                cmimiMeZbritje={produkti.qmimiMeZbritjeProduktit}
              />
            );
          })
        ) : (
          <h1 className="shporta-zbrazet">
            Nuk Keni asnje Produkt ne Liste! <FontAwesomeIcon icon={faFaceFrown} />
          </h1>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
