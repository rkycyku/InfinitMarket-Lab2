import ProduktetNeHome from '../components/ProduktetNeHome';
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
import Titulli from '../components/Titulli';

function Home() {
  const [produktet, setProduktet] = useState([]);

  const [ofertatSlider, setOfertatSlider] = useState([]);
  const [perditeso, setPerditeso] = useState(Date.now());

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const perditesoTeDhenat = async () => {
      try {
        const produktet = await axios.get('https://localhost:7251/api/Produktet/Produkti/Shfaq15ProduktetMeTeFundit', authentikimi);
        const ofertatSlider = await axios.get('https://localhost:7251/api/TeNdryshme/OfertatSlider/ShfaqOfertatSlider', authentikimi);

        setOfertatSlider(ofertatSlider.data);
        setProduktet(produktet.data);
      } catch (err) {
        console.log(err);
      }
    };

    perditesoTeDhenat();
  }, []);

  return (
    <div>
      <Titulli titulli={'Home'} />
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false
        }}
        pagination={{
          clickable: true
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {ofertatSlider &&
          ofertatSlider.map((oferta) => (
            <SwiperSlide>
              <div key={oferta.sliderOfertatID}>
                {oferta.linkuOfertes != 'PaLink' ? (
                  <Link to={oferta.linkuOfertes}>
                    <img src={process.env.PUBLIC_URL + '/img/ofertat/' + oferta.fotoOferta} />
                  </Link>
                ) : (
                  <img src={process.env.PUBLIC_URL + '/img/ofertat/' + oferta.fotoOferta} />
                )}
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="artikujt">
        <div className="titulliArtikuj">
          <h1>Latest Products</h1>
        </div>
        {produktet.map((produkti) => {
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
        })}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
