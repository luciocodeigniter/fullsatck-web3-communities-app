import { MESSAGE_TO_BE_SIGNED, W3CTOKEN_ADDRESS } from '@/constants';
import React from 'react'
import { json } from 'stream/consumers';
import { Address, erc20Abi, formatUnits, verifyMessage } from 'viem'; //! Cuidado: esse só expõe as funções que tem no contrato ERC20 e não os específicos do nosso contrato
import { useAccount, useReadContract, useSignMessage } from 'wagmi';


export default function MainPanel() {

    const { address } = useAccount();
    
    const { data } = useReadContract({
        abi: erc20Abi,
        address: W3CTOKEN_ADDRESS,
        functionName: 'balanceOf', // `balanceOf` é do ERC20 que estendemos
        args: [address as Address]
    });

    // utilizada para assinar a mensagem com a wallet para geração do JWT no backend
    const { signMessageAsync } = useSignMessage();


    async function signMessage() {
        try {

            if (!address) return;

            // com esse resultado da assinatura, poderemos decodificar no backend
            // e sabermos o endereç público que assinou essa mensagem
            const signature = await signMessageAsync({
                message: MESSAGE_TO_BE_SIGNED,
            });

            console.log('signature', signature);


            const isSignedByAddress = await verifyMessage({
                address: address,
                message: MESSAGE_TO_BE_SIGNED,
                signature: signature
            });


            console.log('isSignedByAddress', isSignedByAddress);

            const posts = await fetch('/api/posts', {
                method: 'POST',
                body: JSON.stringify({
                    address: address,
                    signature: signature
                })
            })


            console.log(posts);

        } catch (error) {
            console.log(error);
            /// @todo handle error
        }
    }

    return (
        <div>
            <h1>Web3Comunities</h1>
            <p>A gated Web 3 community</p>
            <p>Seu balanço é: {formatUnits(data || BigInt(0), 18)}</p>
            <button onClick={signMessage}>Assinar</button>
        </div>
    )
}
