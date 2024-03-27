import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import  "./Styles/BrandsSlider.css";

function BrandsSlider() {
  const kornizaEBrendeveRef = useRef([]);
  const shkoDjathtasRef = useRef([]);
  const shkoMajtasRef = useRef([]);

  const [kompanit, setKompanit] = useState([]);

  const getToken = localStorage.getItem("token");

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  };

  useEffect(() => {
    const shfaqKompanit = async () => {
      try {
        const kopmania = await axios.get(
          "https://localhost:7285/api/Kompania/shfaqKompanit", authentikimi
        );
        setKompanit(kopmania.data);
      } catch (err) {
        console.log(err);
      }
    };

    shfaqKompanit();
  }, []);

  useEffect(() => {
    kornizaEBrendeveRef.current.forEach((item, i) => {
      let containerDimensions = item.getBoundingClientRect();
      let containerWidth = containerDimensions.width;

      shkoDjathtasRef.current[i].addEventListener("click", () => {
        item.scrollLeft += containerWidth;
      });

      shkoMajtasRef.current[i].addEventListener("click", () => {
        item.scrollLeft -= containerWidth;
      });
    });
  }, []);

  return (
    <section className="brandsSlider">
      <h2 className="brandsSliderLabel">Brands</h2>
      <button
        className="shkoMajtas"
        ref={(el) => (shkoMajtasRef.current[0] = el)}
      >
        <img src={`${process.env.PUBLIC_URL}/img/slider/arrow.png`} alt="" />
      </button>
      <button
        className="shkoDjathtas"
        ref={(el) => (shkoDjathtasRef.current[0] = el)}
      >
        <img src={`${process.env.PUBLIC_URL}/img/slider/arrow.png`} alt="" />
      </button>
      <div
        className="kornizaEBrendeve"
        ref={(el) => (kornizaEBrendeveRef.current[0] = el)}
      >
        {kompanit.map((kompania) => (
          <div className="kartelaEBrendit" key={kompania.kompaniaId} data-aos="zoom-out">
            <div className="logoBrendit">
              <Link to={`/Produktet/${kompania.emriKompanis}`}>
                <img
                  src={`${process.env.PUBLIC_URL}/img/slider/sliderIcons/${kompania.logo}`}
                  alt=""
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BrandsSlider;
