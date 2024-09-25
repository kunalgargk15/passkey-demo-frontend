import CardPaymentForm from "./CardPaymentForm";
import { useState } from 'react';

function App() {
  let rawId = new Uint8Array([0, 1, 2, 3, 4, 5, 6]);
  // const [responseData, setResponseData] = useState({
  //   ID: "",
  //   RawID: new ArrayBuffer(8),
  //   Type: "",
  //   response: {
  //     ClientDataJson: new ArrayBuffer(8),
  //     AttestationObject: new ArrayBuffer(8),
  //   },
  //   Random: Math.random(),
  // });
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);  // Base64 encode
  };


  const handleSave = async (responseData) => {
    console.log("🚀 ~ handleSave ~ responseData:", responseData)
    try {
      const response = await fetch('http://localhost:8080/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData),
      });

      if (!response.ok) {
        throw new Error('Failed to make request');
      }

      const data = await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createPasskey = async () => {
    const currentDomain = window.location.hostname;
    const publicKeyCredentialCreationOptions = {
      challenge: new Uint8Array([0, 1, 2, 3, 4, 5, 6]),
      rp: {
        name: "Razorpay",
        id: currentDomain,
        displayName: "Razorpay",
      },
      user: {
        id: new Uint8Array([0, 1, 2, 3, 4, 5, 6]),
        name: "Kunal Garg",
        displayName: "Kunal Garg",
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
      },
      timeout: 60000,
      attestation: "direct",
    };

    try {
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });
      console.log("🚀 ~ createPasskey ~ credential:", credential);
      console.log("🚀 ~ createPasskey ~ credential.rawId:", credential.rawId);
      rawId = credential.rawId;
    } catch (error) {
      console.error("Error creating passkey:", error);
    }
  };

  const verifyPasskey = async () => {
    const publicKeyCredentialRequestOptions = {
      challenge: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]),
      allowCredentials: [
        {
          id: rawId,
          type: "public-key",
          // transports: ['usb', 'ble', 'nfc'],
        },
      ],
      rpId: window.location.hostname,
      timeout: 60000,
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });
    console.log("🚀 ~ verifyPasskey ~ assertion:", assertion);
    handleSave(
      {
        ID: assertion.id,
        RawID: arrayBufferToBase64(assertion.rawId),
        Type: assertion.type,
        response: {
          ClientDataJson: arrayBufferToBase64(assertion.response.clientDataJSON),
          AttestationObject: arrayBufferToBase64(assertion.response.authenticatorData),
        }
      }
    );
  };

  return (
    <>
      <div>
        <CardPaymentForm
          createPasskey={createPasskey}
          verifyPasskey={verifyPasskey}
        />
      </div>
    </>
  );
}

export default App;
