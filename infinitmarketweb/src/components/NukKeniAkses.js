import { Helmet } from "react-helmet";

function NukKeniAkses(props) {
  return (
    <>
      <div className="containerDashboardP">
        <Helmet>
          <title>Nuk Keni Akses | Infinit Market</title>
        </Helmet>
        <div className="teDhenatAplikimit">
          <div className="teDhenatAplikimitHeader">
            <img
              src={`${process.env.PUBLIC_URL}/img/InfiniteMarketLogo/default_crop.png`}
              style={{  marginTop: "0.5em" }}
            />
            <h4>Infinit Market - We don't have any limit. We are Infinit</h4>
            <h1 style={{marginTop: "2em"}}>403 - Nuk keni akses per kete pjese</h1>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default NukKeniAkses;
