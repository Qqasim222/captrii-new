// src/authConfig.js
export const msalConfig = {
  auth: {
    clientId: `${process.env.REACT_APP_MICROSOFT_CLIENT_ID}`,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_MICROSOFT_TENANT_ID}`,
    redirectUri: "http://localhost:3000/auth/callback",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [`api://${process.env.REACT_APP_MICROSOFT_CLIENT_ID}/caphead.read`],
};
