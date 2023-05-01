import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import { publicProvider } from 'wagmi/providers/public';
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { goerli } from 'wagmi/chains'

import { AuthProvider } from './context/AuthContext'
import { ErrorBoundary } from './components'
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';

const APP_NAME = "ICO Admin App";

const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [
    publicProvider({ priority: 1 }),
  ]
);

const { wallets } = getDefaultWallets({
  appName: APP_NAME,
  chains,
});

const demoAppInfo = {
  appName: APP_NAME,
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: 'VA',
    wallets: [
      argentWallet({ chains }),
      trustWallet({ chains }),
      ledgerWallet({ chains }),
    ],
  },
]);

const wagmiClient = createClient({
  logger: {
    warn: null,
  },
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <AuthProvider>
          <BrowserRouter basename="/admin">
            <WagmiConfig client={wagmiClient}>
              <RainbowKitProvider
                coolMode
                theme={darkTheme({
                  accentColor: '#6366f1',
                  accentColorForeground: 'white',
                  borderRadius: 'small',
                  fontStack: 'system',
                  overlayBlur: 'small',
                })}
                modalSize='compact'
                appInfo={demoAppInfo}
                chains={chains}
              >
                <Suspense fallback={loading}>
                  <Routes>
                    <Route exact path="/" name="Login Page" element={<Login />} />
                    <Route exact path="/register" name="Register Page" element={<Register />} />
                    <Route exact path="/404" name="Page 404" element={<Page404 />} />
                    <Route exact path="/500" name="Page 500" element={<Page500 />} />
                    <Route path="*" name="Home" element={<DefaultLayout />} />
                  </Routes>
                </Suspense>
              </RainbowKitProvider>
            </WagmiConfig>
          </BrowserRouter>
        </AuthProvider>
      </ErrorBoundary>
    )
  }
}

export default App
