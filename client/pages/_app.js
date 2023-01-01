import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

// define our own custom app component
// Whenever a page is changed, this component is re-rendered
// The Component prop is the active page, so whenever we navigate between pages, this value will change to the new page
// pageProps is an object with the initial props that were preloaded for your page by one of our data fetching methods
// this is basically a wrapper around our page component
// we can only use global css here
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

// when we call getInitialProps on the app component
// other instances of getInitialProps will not be called
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  // since the getInitialProps on the Landing page has been disabled
  // we need to call it here
  // the Component here is the active page
  // if the active page does not have a getInitialProps method, then
  // appContext.Component.getInitialProps will be undefined
  // and we return an empty object
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
