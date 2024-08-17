export const environment = {
  production: false,
  baseUrl: 'https://alv-crm-api-mdm-web.dev.ceabr.io',
  msalConfig: {
    auth: {
      clientId: '93411822-5ca8-485a-aaad-e83d6eb8c3b5',
      authority: 'https://login.microsoftonline.com/97e05be6-37b8-44e4-a9d5-4bd3fd6d05fe',
    }
  },
  apiConfig: {
    scopes: ['user.read'],
    uri: 'https://graph.microsoft.com/v1.0/me'
  }
};
