import * as React from 'react';
import { 
  Box,
  Typography
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
  SismoConnectButton, // the Sismo Connect React button displayed below
  SismoConnectConfig,
  SismoConnectResponse,
  AuthType, 
} from "@sismo-core/sismo-connect-react";

const config: SismoConnectConfig = {
  appId: "0x867ab269c645f8f28ba861ff9cf8ec0e", 
  vault: {
    impersonate: [
    ],
  },
}


export const YourAccount = () => {
   const [verificationResult, setVerificationResult] = React.useState(null);

    const handleResponse = async (response: any) => {
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(response),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data); 
        setVerificationResult(data);
      } else {
        // Handle the error response from the server
        console.error("Error verifying response:", res.statusText);
      }
    } catch (error) {
      console.error("Error verifying response:", error);
    }
  }; 
  
        
  if ( verificationResult === null) {
    return (
      <Box sx={{ width: '50%',justifyConent: 'center', p: '1rem', border: 1, borderRadius: '10px', borderColor: '#e1e3e4', backgroundColor: '#ffffff'}}>
          Create your zero-knowledge proof to be part of your organisation
          <SismoConnectButton 
              text="Proof you are part of this organisation"
              config={config}

              auths={[{authType: AuthType.VAULT}]}
              onResponse={handleResponse}
          />
      </Box>
    );
  } else {
    return (
      <Box sx={{ width: '50%',justifyConent: 'center', p: '1rem', border: 1, borderRadius: '10px', borderColor: '#e1e3e4', backgroundColor: '#ffffff'}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', width:'100%', justifyConent: 'center'}}>
          <LockOpenIcon />
          <Box sx={{ display: 'flex', flexDirection: 'column', width:'90%'}}>
            <Typography sx={{width:'100%'}}> Thanks for proofing your affiliation with the organization </Typography>
            <Typography> The vaultID now connected with the organization is: </Typography>
            <Typography> { verificationResult.vaultId } </Typography>
          </Box>
        </Box>
      </Box>
    );
  }



};
