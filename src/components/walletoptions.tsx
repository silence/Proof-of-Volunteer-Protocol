import { useConnect } from 'wagmi'
import { Card, Result, Button, Space, Toast, Dialog, Form, Input, NoticeBar } from 'antd-mobile';

export function WalletOptions() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
 
  return (
    <Card>
      {connectors.map((connector) => (
        <Button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && ' (unsupported)'}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </Button>
      ))}
 
      {error && <div>{error.message}</div>}
    </Card>
  )
}