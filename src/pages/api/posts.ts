// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { MESSAGE_TO_BE_SIGNED, W3CTOKEN_ADDRESS } from "@/constants";
import { localChain } from "@/providers/RainbowKit";
import type { NextApiRequest, NextApiResponse } from "next";
import { Address, createPublicClient, erc20Abi, http, verifyMessage } from "viem";

type Post = {
  id: string,
  title: string,
  description: string,
  address: string,
}


type Data = {
  posts: Post[],
  error: string | null
};

const MOCK_POSTS = [
  {
    id: "1",
    title: "Donation for Environmental Causes",
    description: "Support our mission to plant trees and protect endangered ecosystems. Every contribution helps us make a difference.",
    address: "0xA1b2C3d4E5f67890AbCdEf1234567890abcDEF12"
  },
  {
    id: "2",
    title: "Crowdfunding for New Tech Startup",
    description: "We're building an innovative platform that will revolutionize the tech industry. Help us reach our goal and be part of the future.",
    address: "0x1234567890ABCdEf1234567890aBcDeF12345678"
  },
  {
    id: "3",
    title: "Charity Fund for Disaster Relief",
    description: "We provide immediate assistance to families affected by natural disasters. Your support is vital to helping us deliver food, shelter, and care.",
    address: "0x0aBcD12345Ef67890aBCde1234567890AbCDeF67"
  },
  {
    id: "4",
    title: "Crypto Community Investment Pool",
    description: "Join our crypto investment pool where we collectively invest in new and emerging digital assets to maximize returns for all participants.",
    address: "0xAbCDE12345f67890aBCdEF1234567890aBCDEF90"
  }
];


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {

  try {

    if (req.method !== 'POST') {
      res.status(500).json({ posts: [], error: 'Not implemented' });
    }

    const { address, signature } = JSON.parse(req.body);

    if (!address || !signature) {
      res.status(400).json({
        posts: [],
        error: 'Missing address or signature'
      });
    }

    // a assinatura foi assinada por quem está conectado com a wallet?
    const isSignedByAddress = await verifyMessage({
      address: address,
      message: MESSAGE_TO_BE_SIGNED,
      signature: signature
    });

    if (!isSignedByAddress) {
      res.status(400).json({
        posts: [],
        error: 'Invalid signature'
      });
    }


    // agora consultamos a blockchain para saber o balanço da carteira
    const publicClient = createPublicClient({
      chain: localChain,
      transport: http()
    });


    const balanceOf = await publicClient.readContract({
      abi: erc20Abi,
      address: W3CTOKEN_ADDRESS,
      functionName: 'balanceOf', // `balanceOf` é do ERC20 que estendemos
      args: [address as Address]
    });

    console.log(balanceOf);

    // se não tem o token não pode prosseguir
    if (balanceOf === BigInt(0)) {
      res.status(400).json({
        posts: [],
        error: 'No balance'
      });
    }


    res.status(200).json({ posts: MOCK_POSTS, error: null });

  } catch (error) {
    console.log(error);
    res.status(200).json({ posts: [], error: 'Unexpected error' });
  }

}
