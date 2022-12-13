// This component will have access to the data returned from getInitialProps
const Landing = ({ color }) => {
  console.log('I am on the browser', color)
  return <h1>Landing Page</h1>;
};

// getInitialProps will be executed on the server one time
// before the component is rendered
// this way the component will be rendered with the data
Landing.getInitialProps = async () => {
  console.log('I am on the server')

  return { color: 'red' }
}

export default Landing;