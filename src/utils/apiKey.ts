import { JwksClient } from 'jwks-rsa';

const client = new JwksClient({
  jwksUri: process.env['JWKS_URI'] as string,
  cache: true, // Default Value
  cacheMaxEntries: 5, // Default value
  cacheMaxAge: 600000, // Defaults to 10m
});

export const getKey = async () => {
  const kid = process.env['KEY_KID'];
  const key = await client.getSigningKey(kid);
  return key.getPublicKey();
};
