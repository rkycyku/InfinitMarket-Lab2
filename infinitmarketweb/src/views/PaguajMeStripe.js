import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import CheckoutForm from './CheckoutForm';
import './Styles/PaguajMeStripe.css';
import axios from 'axios';

import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
  MDBInputGroup
} from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  'pk_test_51P6womKtaRnYlZxjkkG6JxfliwVl2PdZ4Jt9XdUQDuOqyhfZS5vAXPsi55xtdgoHcGxXtu3xGHvihAvBgeTxmqkZ00WCF43SgM'
);

export default function PaguajMeStripe() {
  const [clientSecret, setClientSecret] = useState('');
  const [items, setItems] = useState([]);

  const [shporta, setShporta] = useState('');

  const getToken = localStorage.getItem('token');
  const getID = localStorage.getItem('id');

  const authentikimi = {
    headers: {
      Authorization: `Bearer ${getToken}`
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const shporta = await axios.get(`https://localhost:7251/api/Produktet/Shporta/ShfaqShporten?userID=${getID}`, authentikimi);

        setShporta(shporta.data);

        const response = await axios.get(
          'https://localhost:7251/api/Produktet/Shporta/shfaqProduktetEShportes?userID=01010101-0101-0101-0101-010101010101',
          authentikimi
        );

        // Map the response data to the format expected by the backend
        const formattedItems = response.data.map((item) => ({
          id: item.emriProduktit,
          amount: item.qmimiProduktit * 100 // Convert price to cents
        }));

        setItems(response.data);

        const paymentIntentResponse = await axios.post(
          'https://localhost:7251/create-payment-intent',
          {
            items: formattedItems,
            shumaTot:
              (shporta.data.totali18TVSH +
                shporta.data.totali8TVSH -
              (shporta.data && shporta.data.kodiZbritjes && shporta.data.kodiZbritjes.qmimiZbritjes
                ? shporta.data && shporta.data.kodiZbritjes && shporta.data.kodiZbritjes.qmimiZbritjes
                : 0))* 100
          },
          authentikimi
        );

        setClientSecret(paymentIntentResponse.data.clientSecret);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const appearance = {
    theme: 'stripe'
  };
  const options = {
    clientSecret,
    appearance
  };

  return (
    <div className="StripeDivMain">
      <section className="h-100 h-custom">
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol size="12">
              <MDBCard className="card-registration card-registration-2" style={{ borderRadius: '15px' }}>
                <MDBCardBody className="p-0">
                  <MDBRow className="g-0">
                    <MDBCol lg="8">
                      <div className="p-5">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                          <MDBTypography tag="h1" className="fw-bold mb-0 text-black">
                            Paguaj Me Stripe
                          </MDBTypography>
                          {/* <MDBTypography className="mb-0 text-muted">
                            {shporta && shporta.totaliProdukteveNeShporte == 0
                              ? 'Asnje produkt'
                              : shporta.totaliProdukteveNeShporte == 1
                              ? '1 produkt'
                              : shporta.totaliProdukteveNeShporte + ' produkte'}{' '}
                          </MDBTypography> */}
                        </div>
                        <hr className="my-4" />
                        <MDBRow className="mb-4 d-none d-md-flex justify-content-between align-items-center">
                          <MDBTypography tag="h5" className="text-uppercase">
                            Total
                          </MDBTypography>
                          <MDBTypography tag="h5">
                            {parseFloat(
                              shporta.totali18TVSH +
                                shporta.totali8TVSH -
                                (shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                                  ? shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                                  : 0)
                            ).toFixed(2)}{' '}
                            €
                          </MDBTypography>
                        </MDBRow>

                        <hr className="my-4 d-none d-md-flex" />
                        {items.map((produkti) => {
                          return (
                            <>
                              <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
                                <MDBCol md="2" lg="2" xl="2">
                                  <MDBCardImage
                                    src={`${process.env.PUBLIC_URL}/img/produktet/${produkti.fotoProduktit}`}
                                    fluid
                                    className="rounded-3"
                                    alt={produkti.fotoProduktit}
                                  />
                                </MDBCol>
                                <MDBCol md="3" lg="3" xl="3">
                                  <MDBTypography tag="h6" className="text-muted">
                                    {produkti.emriKategoris}
                                  </MDBTypography>
                                  <MDBTypography tag="h6" className="text-black mb-0">
                                    {produkti.emriProduktit}
                                  </MDBTypography>
                                </MDBCol>
                                <MDBCol md="3" lg="3" xl="3" className="d-flex align-items-center">
                                  <Button
                                    disabled={produkti.sasiaProduktitNeShporte <= 1}
                                    variant="link"
                                    className="px-2"
                                    onClick={() => UleSasin(produkti.produktiID)}
                                  >
                                    <MDBIcon fas icon="minus" />
                                  </Button>
                                  <MDBTypography tag="h6" className="text-black mb-0">
                                    {produkti.sasiaProduktitNeShporte}
                                  </MDBTypography>
                                  <Button variant="link" className="px-2" onClick={() => RritSasin(produkti.produktiID)}>
                                    <MDBIcon fas icon="plus" />
                                  </Button>
                                </MDBCol>
                                <MDBCol md="3" lg="2" xl="2" className="text-end">
                                  <MDBTypography tag="h6" className="mb-0">
                                    {parseFloat(produkti.qmimiProduktit).toFixed(2)} €
                                  </MDBTypography>
                                </MDBCol>
                                <MDBCol md="1" lg="1" xl="1" className="text-end">
                                  <Button variant="link" className="px-2" onClick={() => LargoProduktin(produkti.produktiID)}>
                                    <MDBIcon fas icon="times" />
                                  </Button>
                                </MDBCol>
                              </MDBRow>

                              <hr className="my-4" />
                            </>
                          );
                        })}
                        <div className="pt-5">
                          <Link to={'/'}>
                            <MDBTypography tag="h6" className="mb-0">
                              <MDBCardText tag="a" href="#!" className="text-body">
                                <MDBIcon fas icon="long-arrow-alt-left me-2" /> Vazhdo Blerjen
                              </MDBCardText>
                            </MDBTypography>
                          </Link>
                        </div>
                      </div>
                    </MDBCol>
                    <MDBCol lg="4" className="bg-grey">
                      <div className="p-5">
                        {clientSecret && (
                          <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm />
                          </Elements>
                        )}
                      </div>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </div>
  );
}
