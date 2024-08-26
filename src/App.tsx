import CardPaymentForm from "./CardPaymentForm";

function App() {
  let rawId = new Uint8Array([0, 1, 2, 3, 4, 5, 6]);

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

    // const decoder = new TextDecoder('utf-8');
    // console.log(decoder.decode(publicKeyCredentialCreationOptions.challenge))
    // console.log(publicKeyCredentialCreationOptions.challenge.toString());

    try {
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });
      console.log("🚀 ~ createPasskey ~ credential:", credential);

      // rawId = credential.rawId;
      console.log("🚀 ~ createPasskey ~ rawId:", rawId)
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
