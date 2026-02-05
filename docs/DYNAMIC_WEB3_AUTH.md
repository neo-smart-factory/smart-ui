# NΞØ Smart Factory — Dynamic Backend Verification

Para verificar o JWT do Dynamic no seu backend (ex: API routes), utilize o endpoint JWKS validado abaixo.

## JWKS Endpoint
**URL:** `https://app.dynamic.xyz/api/v0/sdk/<VITE_DYNAMIC_ENVIRONMENT_ID>/.well-known/jwks`

## Como implementar a verificação (Node.js)

```javascript
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: `https://app.dynamic.xyz/api/v0/sdk/${process.env.VITE_DYNAMIC_ENVIRONMENT_ID}/.well-known/jwks`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

export const verifyDynamicToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      issuer: 'https://app.dynamic.xyz',
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};
```

## Status do Ambiente
- **Environment ID:** Configurado via `.env`
- **Modo:** LIVE
- **Conexão:** ✅ Validada via Auditoria (2026-02-05)
