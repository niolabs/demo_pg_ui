export default {
  pubkeeper: {
    staticPubkeeper: true,
    pkConfig: {
      PK_HOST: 'a62b0864-24c3-4142-8fc6-a3a97bff8098.pubkeeper.nio.works',
      PK_PORT: 443,
      PK_SECURE: true,
      PK_JWT: '5e64ecd89682c6dcb87c368f6fb27c79231d79881e7986ab6b1b21839bfa37b2',
      WS_HOST: 'a62b0864-24c3-4142-8fc6-a3a97bff8098.websocket.nio.works',
      WS_PORT: 443,
      WS_SECURE: true,
    },
  },
  auth0: {
    loginRequired: false,
    webAuth: {
      domain: 'nio.auth0.com',
      clientID: 'quLReF2fOEnrBFtLA5yuh0pnuRUEuCVd',
      audience: 'https://api.n.io/v1',
      responseType: 'token',
      redirectUri: `${window.location.origin}?authorize=true`,
      leeway: 60,
      __disableExpirationCheck: true,
    },
  },
};
