import { Helmet } from 'react-helmet';

function Titulli({ titulli }) {
  return (
    <Helmet>
      <title>{titulli} | Infinit Market</title>
    </Helmet>
  );
}

export default Titulli;
