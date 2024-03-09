import { generateKeyPair as generateKeyPairCb } from 'crypto';
import { promisify } from 'util';
import { saveData } from './app.model';

const generateKeyPair = promisify(generateKeyPairCb);

export async function generateRSAKeyPair() {
  try {
    const { publicKey, privateKey } = await generateKeyPair('rsa', {
      modulusLength: 2048, // The length of your key in bits
      publicKeyEncoding: {
        type: 'pkcs1', // "pkcs1" (RSA) or "spki" (for ECC and other algorithms)
        format: 'pem', // The encoding format
      },
      privateKeyEncoding: {
        type: 'pkcs1', // "pkcs1" (traditional RSA) or "pkcs8" (more options)
        format: 'pem', // The encoding format
      },
    });

    console.log('Public Key:', publicKey);
    console.log('Private Key:', privateKey);

    return { publicKey, privateKey };
  } catch (err) {
    console.error('Key pair generation failed:', err);
    throw err; // Re-throw the error to be handled by the caller
  }
}

export async function postInstallation() {
  try {
    const { publicKey, privateKey } = await generateRSAKeyPair();
    saveData({ publicKey, privateKey } , 'private.pem');
    const response = await fetch('https://api.bunq.com/v1/installation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_public_key: publicKey,
      }),
    });

    const data = await response.json();
    const installationToken = data.Response[1].Token.token;
    const serverPublicKey = data.Response[2].ServerPublicKey.server_public_key;
    console.log('Installation Token:', installationToken);
    console.log('Server Public Key:', serverPublicKey);

    return { installationToken, serverPublicKey };
  } catch (error) {
    console.error('Failed to post /installation:', error);
  }
}

// This is a placeholder. You'll need to implement signing according to the bunq API documentation.
function signRequest(data: string, privateKey: string): string {
  // Implement request signing here
  return 'signature';
}

export async function registerDeviceAndStartSession(
  apiKey: string,
  installationToken: string,
) {
  const deviceServerResponse = await fetch(
    'https://api.bunq.com/v1/device-server',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bunq-Client-Authentication': installationToken,
        // Sign your call
        'X-Bunq-Client-Signature': signRequest(
          'your_request_body_here',
          `YOUR_PRIVATE_KEY_HERE`,
        ),
      },
      body: JSON.stringify({
        description: 'My Device',
        secret: apiKey,
      }),
    },
  );

  // Handle the response...

  const sessionServerResponse = await fetch(
    'https://api.bunq.com/v1/session-server',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bunq-Client-Authentication': `TOKEN_FROM_DEVICE_SERVER_RESPONSE`,
        // Sign your call
        'X-Bunq-Client-Signature': signRequest(
          'your_request_body_here',
          `YOUR_PRIVATE_KEY_HERE`,
        ),
      },
      body: JSON.stringify({
        secret: apiKey,
      }),
    },
  );

  // Handle the response...
}

// Replace placeholders and call registerDeviceAndStartSession with actual values
