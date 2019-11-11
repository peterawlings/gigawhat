import App, { Container } from "next/app";
import Page from "../components/Page";
import { ApolloProvider } from "react-apollo";
import withData from "../lib/withData";

class MyApp extends App {
  // special nextjs lifecycle method that runs before 'render'. This means 'pageProps' is available in this.props
  // This isn't necessary if it's a client rendered app (not SSR)
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    // crawls all the pages to find queries that need to be fired off, fetches it, and returns it via 'pageProps'
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // exposes query to the user
    pageProps.query = ctx.query;
    // anything returned here gets exposed as props in render method
    return { pageProps };
  }
  render() {
    const { Component, apollo, pageProps } = this.props;

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withData(MyApp);
