import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';

function AboutUs() {
  const [teDhenatBiznesit, setTeDhenatBiznesit] = useState([]);
  const [perditeso, setPerditeso] = useState(Date.now());

  const getToken = localStorage.getItem('token');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    const ShfaqTeDhenat = async () => {
      try {
        const teDhenat = await axios.get('https://localhost:7251/api/Biznesi/TeDhenatBiznesit/ShfaqTeDhenat', authentikimi);
        setTeDhenatBiznesit(teDhenat.data);
        console.log(teDhenat.data);
      } catch (err) {
        console.log(err);
      }
    };

    ShfaqTeDhenat();
  }, [perditeso]);

  return (
    <>
      <Helmet>
        <title>About Us | Infinit Market</title>
      </Helmet>
      <section id="about-us" className="py-5">
        <Container>
          <h2 className="text-center mb-5">About Us</h2>
          <p className="lead text-center">
            Welcome to <strong>{teDhenatBiznesit && teDhenatBiznesit.emriIBiznesit}</strong>, where technology meets convenience!
          </p>
          <p className="text-center">
            At <strong>{teDhenatBiznesit && teDhenatBiznesit.emriIBiznesit}</strong>, we are passionate about providing cutting-edge
            technology products and solutions to enhance your everyday life. Whether you're a tech enthusiast, a professional in need of
            top-of-the-line equipment, or someone simply looking to upgrade their gadgets, we've got you covered.
          </p>
          <h3 className="mt-5">Our Mission</h3>
          <p>
            Our mission is to simplify your technology shopping experience by offering a curated selection of the latest and most innovative
            products, coupled with exceptional customer service. We strive to be your one-stop destination for all things tech-related,
            providing you with everything you need to stay connected, productive, and entertained.
          </p>
          <h3 className="mt-5">Why Choose Us?</h3>
          <Row>
            <Col md={6}>
              <h4>Wide Range of Products</h4>
              <p>
                From smartphones and laptops to smart home devices and accessories, we offer a diverse range of products from leading brands
                in the industry.
              </p>
              <h4>Quality Assurance</h4>
              <p>
                We are committed to delivering high-quality products that meet your expectations. Each item in our inventory undergoes
                rigorous testing to ensure reliability and performance.
              </p>
            </Col>
            <Col md={6}>
              <h4>Expert Advice</h4>
              <p>
                Our team of tech experts is here to assist you every step of the way. Whether you need help choosing the right product or
                troubleshooting technical issues, we're always ready to lend a helping hand.
              </p>
              <h4>Secure Shopping Experience</h4>
              <p>
                Your security is our top priority. We utilize the latest encryption technologies to safeguard your personal information and
                ensure a safe and secure shopping environment.
              </p>
            </Col>
          </Row>
          <h3 className="mt-5">Our Logo</h3>
          <Row className="mb-4 align-items-center justify-content-center">
            <Col sm={8}>
              <Image src={`${process.env.PUBLIC_URL}/img/web/${teDhenatBiznesit.logo}`} fluid alt="Partner Logo 1" />
            </Col>
          </Row>
          <p className="text-center">
            Thank you for choosing {teDhenatBiznesit && teDhenatBiznesit.emriIBiznesit}. Let's embark on a journey of innovation together!
          </p>
        </Container>
      </section>

      <Footer />
    </>
  );
}

export default AboutUs;
