import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';

export default function HomePage() {
  return (
    <div>
      {/* Predefined button  */}
      <Web3Button
        icon="show"
        label="Connect Wallet"
        balance="show"
      />
      <br />

      {/* Network Switcher Button */}
      <Web3NetworkSwitch />
      <br />
    </div>
  );
}
