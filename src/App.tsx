import CardPaymentForm from "./CardPaymentForm";
import { useState } from 'react';
import { decode, encode } from 'cbor-x';

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

  function base64ToArrayBuffer(base64Input) {
   
    const bytes = new Uint8Array(base64Input);
    return bytes
  
  }


  const handleSaveAfterRegsiterationOutput = async (responseData) => {
    console.log("🚀 ~ handleSave ~ responseData:", responseData)
    try {
      const response = await fetch('http://localhost:8080/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:  JSON.stringify(responseData),
      });

      if (!response.ok) {
        throw new Error('Failed to make request');
      }

      const data = await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // const createPasskey = async () => {
  //   const currentDomain = window.location.hostname;
  //   const publicKeyCredentialCreationOptions = {
  //     challenge: new Uint8Array([0, 1, 2, 3, 4, 5, 6]),
  //     rp: {
  //       name: "Razorpay",
  //       id: currentDomain,
  //       displayName: "Razorpay",
  //     },
  //     user: {
  //       id: new Uint8Array([0, 1, 2, 3, 4, 5, 6]),
  //       name: "Kunal Garg",
  //       displayName: "Kunal Garg",
  //     },
  //     pubKeyCredParams: [{ alg: -7, type: "public-key" }],
  //     authenticatorSelection: {
  //       authenticatorAttachment: "platform",
  //     },
  //     timeout: 60000,
  //     attestation: "direct",
  //   };


  async function registerUser() {
    
      // Fetch public key credential creation options from the backend
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch public key creation options from backend');
      }

      const publicKeyCredentialCreationOptions = await response.json();

      console.log("Printing the create options received from backend RAW", publicKeyCredentialCreationOptions) 
      publicKeyCredentialCreationOptions.challenge = base64ToArrayBuffer(publicKeyCredentialCreationOptions.challenge)
      publicKeyCredentialCreationOptions.user.id = base64ToArrayBuffer(publicKeyCredentialCreationOptions.user.id)


      console.log("Printing the create options received from backend", publicKeyCredentialCreationOptions)
    try {
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });
      console.log("🚀 ~ createPasskey ~ credential:", credential);
      // console.log("🚀 ~ createPasskey ~ credential.rawId:", credential.rawId);
      // rawId = credential.rawId;
      console.log("🚀 ~ createPasskey ~ credential.challenge  is:", credential.challenge);
      handleSaveAfterRegsiterationOutput(credential);

    } catch (error) {
      console.error("Error creating passkey:", error);
    }

    // {
    //   id: credential.id,
    //   raw_id: (credential.rawId),
    //   type: credential.type,
    //   response: {
    //     client_data_json: (credential.response.clientDataJSON),
    //     attestation_object:(credential.response.attestationObject),
    //   }
    // }

    

    
  };



  // const verifyPasskey = async () => {
  //   const publicKeyCredentialRequestOptions = {
  //     challenge: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]),
  //     allowCredentials: [
  //       {
  //         id: rawId,
  //         type: "public-key",
  //         // transports: ['usb', 'ble', 'nfc'],
  //       },
  //     ],
  //     rpId: window.location.hostname,
  //     timeout: 60000,
  //   };

  //   const assertion = await navigator.credentials.get({
  //     publicKey: publicKeyCredentialRequestOptions,
  //   });
  //   console.log("🚀 ~ verifyPasskey from webauthn directly is  ~ assertion:", assertion);

  //   handleSave(
  //     {
  //       id: assertion.id,
  //       raw_id: arrayBufferToBase64(assertion.rawId),
  //       type: assertion.type,
  //       response: {
  //         client_data_json: arrayBufferToBase64(assertion.response.clientDataJSON),
  //         authenticator_data:arrayBufferToBase64(assertion.response.authenticatorData),
  //         signature: arrayBufferToBase64(assertion.response.signature),
  //         user_handle: arrayBufferToBase64(assertion.response.userHandle),
  //       }
  //     }
  //   );

  

  // };




  return (
    <>
      <div>
        <CardPaymentForm
          createPasskey={registerUser}
          // verifyPasskey={verifyPasskey}
        />
      </div>
    </>
  );
}

export default App;
