import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  });

  // logic for the countdown timer
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <h1>Purchase Order</h1>
      <h4>Order ID: {order.id}</h4>
      <div>{timeLeft} seconds until order expires</div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        // this is the stripe publishable key, so it is safe to share publically
        // best practice would be to use NextJS environment variables
        stripeKey="pk_test_51MKlrRJG0LkC0y0DDAY5xUsRElOJbAflyFJ8E5HJ3c6WA8jF34h5vb5517zstNoKupcYHlQVK2BEwOrZ1a53Wxl400cfH3hvUV"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
