import { Helmet } from "react-helmet";

function NukKeniAkses(props) {
  return (
    <>
      <div className="containerDashboardP">
        <Helmet>
          <title>Nuk u Gjet | Infinit Market</title>
        </Helmet>
        <div className="teDhenatAplikimit">
          <div className="teDhenatAplikimitHeader">
            <img
              src={`${process.env.PUBLIC_URL}/img/InfiniteMarketLogo/default_crop.png`}
              style={{  marginTop: "0.5em" }}
            />
            <h4>Infinit Market - We don't have any limit. We are Infinit</h4>
            <h1 style={{marginTop: "2em"}}>404 - Na vjen keq, por nuk mund të gjejmë atë që po kërkoni</h1>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default NukKeniAkses;
