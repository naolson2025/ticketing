import axios from 'axios';

// This component will have access to the data returned from getInitialProps
const Landing = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

// getInitialProps will be executed on the server one time
// before the component is rendered
// this way the component will be rendered with the data
Landing.getInitialProps = async () => {
  // there is one usecase where getInitialProps will be executed
  // on the client side, when we navigate from one page to another
  // in that case we don't want to make a request to ingress-nginx
  if (typeof window === 'undefined') {
    // we are on the server
    // requests should be made to http://SERVICENAME.NAMESPACE.svc.cluster.local
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: {
          Host: 'ticketing.dev',
        }
      }
    )
    return data;
  } else {
    // we are on the browser
    // requests can be made with a base url of ''
    const { data } = await axios.get('/api/users/currentuser')
      .catch((err) => {
        console.log(err.message);
      });
    return data;
  }
};

export default Landing;
