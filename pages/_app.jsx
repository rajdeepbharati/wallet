import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'react-redux'
import { theme, ThemeProvider } from '../components/Shared'
import withReduxStore from '../lib/with-redux-store'
import WalletProviderWrapper from '../WalletProvider'
import NetworkChecker from '../lib/check-network'
import BalancePoller from '../lib/update-balance'
import { WasmLoader } from '../lib/WasmLoader'
import ErrorBoundary from '../lib/ErrorBoundary'
import '../stylesheets/normalize.css'
import '../stylesheets/styles.css'

class MyApp extends App {
  static getInitialProps({ ctx: { query, pathname, accountAddresses } }) {
    return { query, pathname, accountAddresses }
  }

  render() {
    const {
      Component,
      pageProps,
      reduxStore,
      query,
      pathname,
      accountAddresses
    } = this.props
    return (
      <>
        <Head>
          <title>Filecoin Miner Marketplace</title>
        </Head>
        <Provider store={reduxStore}>
          <ThemeProvider theme={theme}>
            <WasmLoader>
              <NetworkChecker
                pathname={pathname}
                query={query}
                accountAddresses={accountAddresses}
              />
              <WalletProviderWrapper network={reduxStore.getState().network}>
                <BalancePoller />
                <ErrorBoundary>
                  <ChakraProvider>
                    <Component
                      accountAddresses={accountAddresses}
                      {...pageProps}
                    />
                  </ChakraProvider>
                </ErrorBoundary>
              </WalletProviderWrapper>
            </WasmLoader>
          </ThemeProvider>
        </Provider>
      </>
    )
  }
}

export default withReduxStore(MyApp)
