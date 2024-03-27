import ProduktetNeHome from '../components/ProduktetNeHome';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import BrandsSlider from '../components/BrandsSlider';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import './Styles/Home.css';
import '../assets/css/swiperSlider.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';

function Home() {
  const [produktet, setProduktet] = useState([]);

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const shfaqProduktet = async () => {
      try {
        const produktet = await axios.get('https://localhost:7285/api/Produkti/15ProduktetMeTeFundit', authentikimi);
        setProduktet(produktet.data);
      } catch (err) {
        console.log(err);
      }
    };

    shfaqProduktet();
  }, []);

  const slideImages = [
    {
      url: 'https://iqq6kf0xmf.gjirafa.net/images/acd7d917-df70-4db3-a5e5-1baabc56ad40/acd7d917-df70-4db3-a5e5-1baabc56ad40.jpeg?w=1920',
      caption: 'Slide 1',
      link: '/dashboard'
    },
    {
      url: 'https://iqq6kf0xmf.gjirafa.net/images/a98b91f6-7a3f-40e4-b230-717a16ad8581/a98b91f6-7a3f-40e4-b230-717a16ad8581.jpeg?w=1920',
      caption: 'Slide 2',
      link: '/'
    },
    {
      url: 'https://iqq6kf0xmf.gjirafa.net/images/428afded-00ef-4241-8a2d-c4bd1b6fefc9/428afded-00ef-4241-8a2d-c4bd1b6fefc9.jpeg?w=1920',
      caption: 'Slide 3',
      link: '/'
    }
  ];

  return (
    <div>
      <Helmet>
        <title>Home | Tech Store</title>
      </Helmet>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {slideImages.map((slideImage, index) => (
          <SwiperSlide>
            <div key={index}>
              <Link to={slideImage.link}>
                <img src={slideImage.url}></img>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <BrandsSlider />
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
