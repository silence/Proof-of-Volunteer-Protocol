import { useWalletLogin } from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Button } from "antd-mobile";

const LoginButton = () => {
  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending,
  } = useWalletLogin();

  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  // Called when the user clicks "login"
  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();
    if (connector instanceof InjectedConnector) {
      const signer = await connector.getSigner();
      await login(signer);
    }
  };

  return (
    <div>
      {loginError && <p>{loginError.message}</p>}
      <Button disabled={isLoginPending} onClick={onLoginClick}>
        Connect Wallet
      </Button>
    </div>
  );
};

export default LoginButton;
