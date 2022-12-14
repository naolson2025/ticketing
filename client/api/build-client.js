import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // we are on the server
    // requests should be made to http://SERVICENAME.NAMESPACE.svc.cluster.local
    // create a configured instance of axios
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // we are on the browser
    // requests can be made with a base url of ''
    return axios.create({
      baseURL: '/',
    });
  }
};
