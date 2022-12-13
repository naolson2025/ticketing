import 'bootstrap/dist/css/bootstrap.css';

// define our own custom app component
// Whenever a page is changed, this component is re-rendered
// The Component prop is the active page, so whenever we navigate between pages, this value will change to the new page
// pageProps is an object with the initial props that were preloaded for your page by one of our data fetching methods
// this is basically a wrapper around our page component
// we can only use global css here
export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
}