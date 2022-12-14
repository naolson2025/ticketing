import buildClient from '../api/build-client';

// This component will have access to the data returned from getInitialProps
const Landing = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

// getInitialProps will be executed on the server one time
// before the component is rendered
// this way the component will be rendered with the data
// context is the same kind of request object as node/express
// The cookie that is saved on the browser will be sent to the server in the context.req.headers
Landing.getInitialProps = async (context) => {
  // there is one usecase where getInitialProps will be executed
  // on the client side, when we navigate from one page to another
  // in that case we don't want to make a request to ingress-nginx
  // if (typeof window === 'undefined') {
  //   // we are on the server
  //   // requests should be made to http://SERVICENAME.NAMESPACE.svc.cluster.local
  //   const { data } = await axios.get(
  //     'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
  //     {
  //       headers: req.headers,
  //     }
  //   )
  //   return data;
  // } else {
  //   // we are on the browser
  //   // requests can be made with a base url of ''
  //   const { data } = await axios.get('/api/users/currentuser')
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  //   return data;
  // }
  console.log('LANDING PAGE!');
  // The above code logic was moved to the buildClient function
  const { data } = await buildClient(context).get('/api/users/currentuser');
  return data;
};

export default Landing;
