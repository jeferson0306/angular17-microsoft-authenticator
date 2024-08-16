export const environment = {
  production: true,
  msalConfig: {
    auth: {
      clientId: 'clientId from portal.azure.com',
      authority: 'https://login.microsoftonline.com/common'
    }
  },
  apiConfig: {
    scopes: ['user.read'],
    uri: 'https://graph.microsoft.com/v1.0/me'
  }
};
