// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import App from "./App.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faBars,
  faXmark,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./NavBar.css";
import { useTitle } from "./Context/TitleProvider.js";

function Navbar(props) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [perditeso, setPerditeso] = useState("");

  const [teDhenat, setTeDhenat] = useState([]);

  const [showMenu, setShowMenu] = useState(false);
  const [showMenu2, setShowMenu2] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const getID = localStorage.getItem("id");
  const getToken = localStorage.getItem("token");

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`,
    },
  };

  useEffect(() => {
    if (getID) {
      const vendosTeDhenat = async () => {
        try {
          const perdoruesi = await axios.get(
            `https://localhost:7251/api/Perdoruesi/shfaqSipasID?idUserAspNet=${getID}`,
            authentikimi
          );
          setTeDhenat(perdoruesi.data);
          console.log(teDhenat.data);
        } catch (err) {
          console.log(err);
        }
      };

      vendosTeDhenat();
    } else {
      navigate("/login");
    }
  }, [perditeso]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const kohaAktive = new Date(decodedToken.exp * 1000);
      const kohaTanishme = new Date();
      const id = localStorage.getItem("id");

      if (kohaAktive < kohaTanishme) {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        navigate("/LogIn");
      }

      if (id !== decodedToken.id) {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        navigate("/LogIn");
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
  };

  const handleArrowClick = (e) => {
    const arrowParent = e.currentTarget.parentElement.parentElement;
    setShowMenu(!showMenu);
    arrowParent.classList.toggle("showMenu");
  };

  const handleAnchorClick = (e) => {
    e.preventDefault();
    const anchorElementsParent =
      e.currentTarget.parentElement.parentElement.parentElement;

    document.querySelectorAll(".showMenu2").forEach((element) => {
      if (element !== anchorElementsParent) {
        element.classList.remove("open");
        element.classList.remove("showMenu2");
      }
    });

    setShowMenu2(!showMenu2);
    anchorElementsParent.classList.toggle("showMenu2");
    anchorElementsParent.classList.toggle("open");
  };

  const handleSidebarClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { title, emri, rolet, mbiemri } = useTitle();

  return (
    <>
      {token && (
        <>
          <div className={isSidebarOpen ? "sidebar close" : "sidebar"}>
            <div class="logo-details">
              <Link to="/">
                <img
                  class="logoImg"
                  src={process.env.PUBLIC_URL + "/img/InfiniteMarketLogo/default.png"}
                />
              </Link>
              <span class="logo_name">Infinit Market</span>
            </div>
            <ul class="nav-links">
              <li>
                <Link to="/PerditesoTeDhenat">
                  <i class="bx bx-pie-chart-alt-2">
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </i>
                  <span class="link_name">Perditesimi i Fjalekalimit</span>
                </Link>
                <ul class="sub-menu blank">
                  <li>
                    <Link class="link_name" to="/PerditesoTeDhenat">
                      Perditesimi i Fjalekalimit
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <div class="profile-details">
                  <div class="profile-content"></div>

                  <a>
                    <div class="name-job">
                      {teDhenat && (
                        <>
                          <div class="profile_name">{emri + " " + mbiemri}</div>

                          <div class="job">{rolet.join(", ")}</div>
                        </>
                      )}
                    </div>
                  </a>
                  <Link to="/" onClick={handleSignOut}>
                    <i class="bx bx-log-out">
                      <FontAwesomeIcon icon={faRightFromBracket} />
                    </i>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
          <section class="home-section">
            <div class="home-content">
              <i class="bx bx-menu" onClick={handleSidebarClick}>
                <FontAwesomeIcon icon={isSidebarOpen ? faBars : faXmark} />
              </i>

              <span class="text"> {title}</span>
            </div>
            <div class="col py-3 ms-3">
              <App />
            </div>
          </section>
        </>
      )}
      {!token && <App />}
    </>
  );
}

export default Navbar;
