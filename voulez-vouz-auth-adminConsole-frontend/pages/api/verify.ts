import { SismoConnect, SismoConnectVerifiedResult, SismoConnectResponse, AuthType, SismoConnectConfig } from "@sismo-core/sismo-connect-server";
import { NextApiRequest, NextApiResponse } from 'next'

const config: SismoConnectConfig = {
  appId: "0x867ab269c645f8f28ba861ff9cf8ec0e", 
}

const sismoConnect = SismoConnect({ config });


export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    try {
      const sismoConnectResponse = req.body;
      const result = await sismoConnect.verify(sismoConnectResponse, {
        auths: [
          { authType: AuthType.VAULT },
        ],
      });

      const vaultId = result.getUserId(AuthType.VAULT);

      // Do something with the vaultId and twitterId, e.g., save them to a database
      // You can also add additional validation or processing here

      res.status(200).json({ vaultId });
    } catch (error) {
      console.error("Error verifying response:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}