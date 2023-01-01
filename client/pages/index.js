// import buildClient from '../api/build-client';

import Link from 'next/link';

// This component will have access to the data returned from getInitialProps
const Landing = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link
            href="/tickets/[ticketId]"
            as={`/tickets/${ticket.id}`}
          >
            View
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// getInitialProps will be executed on the server one time
// before the component is rendered
// this way the component will be rendered with the data
// context is the same kind of request object as node/express
// The cookie that is saved on the browser will be sent to the server in the context.req.headers
Landing.getInitialProps = async (context, client, currentUser) => {
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
  // ** The above code logic was moved to the buildClient function
  // const { data } = await buildClient(context).get('/api/users/currentuser');
  // return data;
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default Landing;
