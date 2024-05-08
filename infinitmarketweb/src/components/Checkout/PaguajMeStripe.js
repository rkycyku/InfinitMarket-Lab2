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
import { Button, Tab, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  'pk_test_51P6womKtaRnYlZxjkkG6JxfliwVl2PdZ4Jt9XdUQDuOqyhfZS5vAXPsi55xtdgoHcGxXtu3xGHvihAvBgeTxmqkZ00WCF43SgM'
);

export default function PaguajMeStripe({llojiTransportit, qmimiTransportit}) {
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

        setItems(response.data);

        const paymentIntentResponse = await axios.post(
          'https://localhost:7251/api/TeNdryshme/Stripe/KrijoPagesenStripe',
          {
            shportaID: shporta.data.shportaID,
            shumaTotale: (
              (shporta.data.totali18TVSH +
                shporta.data.totali8TVSH -
                (shporta.data && shporta.data.kodiZbritjes && shporta.data.kodiZbritjes.qmimiZbritjes
                  ? shporta.data && shporta.data.kodiZbritjes && shporta.data.kodiZbritjes.qmimiZbritjes
                  : 0) +
                qmimiTransportit) *
              100
            ).toFixed()
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
      <div className="detajetPorosia">
        <h1>Paguaj Me Stripe</h1>
        <div className="adresaDorezimit">
          <h3>Adresa Dorezimit</h3>
          <div className="d-flex justify-content-between">
            <MDBTypography tag="h6" className="text-uppercase">
              Klienti
            </MDBTypography>
            <MDBTypography tag="h6">
              {shporta && shporta.adresa && shporta.adresa.emri} {shporta && shporta.adresa && shporta.adresa.mbiemri}
            </MDBTypography>
          </div>
          <div className="d-flex justify-content-between">
            <MDBTypography tag="h6" className="text-uppercase">
              Email
            </MDBTypography>
            <MDBTypography tag="h6">{shporta && shporta.adresa && shporta.adresa.email}</MDBTypography>
          </div>
          <div className="d-flex justify-content-between">
            <MDBTypography tag="h6" className="text-uppercase">
              Numri i telefonit
            </MDBTypography>
            <MDBTypography tag="h6">{shporta && shporta.adresa && shporta.adresa.nrKontaktit}</MDBTypography>
          </div>
          <div className="d-flex justify-content-between">
            <MDBTypography tag="h6" className="text-uppercase">
              Adresa dorezimit
            </MDBTypography>
            <MDBTypography tag="h6">
              {shporta && shporta.adresa && shporta.adresa.adresa}
              <br />
              {shporta && shporta.adresa && shporta.adresa.qyteti}, {shporta && shporta.adresa && shporta.adresa.zipKodi}
              <br />
              {shporta && shporta.adresa && shporta.adresa.shteti}
            </MDBTypography>
          </div>
        </div>
        <div className="teDhenatShporta">
          <h3>Detajet e Shportes</h3>
          <div className="d-flex justify-content-between">
            <MDBTypography tag="h6" className="text-uppercase">
              Totali Produkteve
            </MDBTypography>
            <MDBTypography tag="h6">
              {shporta && shporta.totaliProdukteveNeShporte == 0
                ? 'Asnje produkt'
                : shporta.totaliProdukteveNeShporte == 1
                ? '1 produkt'
                : shporta.totaliProdukteveNeShporte + ' produkte'}{' '}
            </MDBTypography>
          </div>
          <div className="d-flex justify-content-between">
            <MDBTypography tag="h6" className="text-uppercase">
              Nentotali
            </MDBTypography>
            <MDBTypography tag="h6">
              {parseFloat(
                shporta.totali18TVSH +
                  shporta.totali8TVSH -
                  (shporta.totali18TVSH - (100 / (100 + 18)) * shporta.totali18TVSH) -
                  shporta.totali8TVSH -
                  (100 / (100 + 8)) * shporta.totali8TVSH
              ).toFixed(2)}{' '}
              €
            </MDBTypography>
          </div>
          <div className="d-flex justify-content-between">
            <MDBTypography tag="h6" className="text-uppercase">
              TVSH 18%
            </MDBTypography>
            <MDBTypography tag="h6">
              {parseFloat(shporta.totali18TVSH - (100 / (100 + 18)) * shporta.totali18TVSH).toFixed(2)} €
            </MDBTypography>
          </div>
          <div className="d-flex justify-content-between">
            <MDBTypography tag="h6" className="text-uppercase">
              TVSH 8%
            </MDBTypography>
            <MDBTypography tag="h6">{parseFloat(shporta.totali8TVSH - (100 / (100 + 8)) * shporta.totali8TVSH).toFixed(2)}€</MDBTypography>
          </div>
          <div className="d-flex justify-content-between">
            <MDBTypography tag="h6" className="text-uppercase">
              Transporti
            </MDBTypography>
            <MDBTypography tag="h6">
              {llojiTransportit} - {parseFloat(qmimiTransportit).toFixed(2)} €
            </MDBTypography>
          </div>
          <div className="d-flex justify-content-between">
            <MDBTypography tag="h6" className="text-uppercase">
              Zbritja
            </MDBTypography>
            <MDBTypography tag="h6">
              - {parseFloat(shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes).toFixed(2)} €
            </MDBTypography>
          </div>

          <hr className="my-4" />

          <div className="d-flex justify-content-between mb-5">
            <MDBTypography tag="h5" className="text-uppercase">
              Total
            </MDBTypography>
            <MDBTypography tag="h5">
              {parseFloat(
                shporta.totali18TVSH +
                  shporta.totali8TVSH -
                  (shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                    ? shporta && shporta.kodiZbritjes && shporta.kodiZbritjes.qmimiZbritjes
                    : 0) +
                    qmimiTransportit
              ).toFixed(2)}{' '}
              €
            </MDBTypography>
          </div>
        </div>
        <Link to={'/'}>
          <MDBTypography tag="h6" className="mb-0">
            <MDBCardText tag="a" href="#!" className="text-body">
              <MDBIcon fas icon="long-arrow-alt-left me-2" /> Vazhdo Blerjen
            </MDBCardText>
          </MDBTypography>
        </Link>
      </div>

      <div className="stripePagesa">
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm llojiTransportit={llojiTransportit} qmimiTransportit={qmimiTransportit}/>
          </Elements>
        )}
      </div>
    </div>
  );
}
