export const environment = {
  production: false,
  msalConfig: {
    auth: {
      clientId: 'clientId from portal.azure.com',
      authority: 'https://login.microsoftonline.com/3b90567f-f3c2-4b0c-ba72-78ae0ed3cc2e',
    }
  },
  apiConfig: {
    scopes: ['user.read'],
    uri: 'https://graph.microsoft.com/v1.0/me'
  }
};
