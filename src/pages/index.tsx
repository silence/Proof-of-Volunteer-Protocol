import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import abiJson from '@/abi.json';

export default function HomePage() {
  // The address of the smart contract on Polygon
  const contract = '0x903409a823476a89c35d37231bbec8065ae608ed';
  // The wallet address that will receive the SBT
  const addr = '0x088238BaFC6d368d5aF78F2FD719C0008dec6Fdb';
  // This will determine the which token given to the user, e.g. Event1 -> tokenId 1, Event2 -> tokenId 2
  const tokenId = 1;

  /**
   * This calls the mint function which requires 3 arguments:
   * 1. Recipient wallet's address
   * 2. The token ID
   * 3. Any media url to be associated with this mint
   */
  const { config } = usePrepareContractWrite({
    address: contract,
    abi: abiJson,
    functionName: 'mint',
    args: [addr, tokenId, 'https://www.youtube.com/watch?v=3tGYbYZRqdY']
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  /**
   * In the smart contract the media URI is saved as the type `mapping (address => mapping(uint256 => string))`
   * So when try to retrieve the URI you need to provide both the address and tokenId as argument.
   */
  const { data: tokenUriData } = useContractRead({
    address: contract,
    abi: abiJson,
    functionName: '_tokenURIs',
    args: [addr, tokenId]
  });

  return (
    <div>
      {/* Predefined button  */}
      <Web3Button icon="show" label="Connect Wallet" balance="show" />
      <br />

      {/* Network Switcher Button */}
      <Web3NetworkSwitch />
      <br />

      <br />
      <br />
      <div>
        <button disabled={!write} onClick={() => write?.()}>
          Mint
        </button>
        {isLoading && <div>Check Wallet</div>}
        {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      </div>
      <br />
      <div>{JSON.stringify(tokenUriData)}</div>
    </div>
  );
}
