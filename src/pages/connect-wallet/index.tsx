import React, { useEffect, useState } from 'react';
import { Card, Result, Button, Space, Toast, Dialog, Form, Input, NoticeBar } from 'antd-mobile';
import { SmileOutline } from 'antd-mobile-icons';
import styles from '@/styles/common.module.css';
import { Web3Button } from '@web3modal/react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { postData } from '@/util';
import abiJson from '@/abi.json';
import { CONTRACT_ADDRESS } from '@/constants';
import { useRouter } from 'next/router';
import { useRecipient } from '@/hooks/useRecipient';

export interface ConnectWalletPageProps {}

const useUploadImage = ({ blobUrl, isConnected }: { blobUrl: string; isConnected: boolean }) => {
  const [id, setId] = useState();

  useEffect(() => {
    (async function extractFile() {
      try {
        if (isConnected && blobUrl.length) {
          const file = await (await fetch(blobUrl)).blob();
          const formData = new FormData();
          formData.append('imageFile', file, file.name);
          const res = await postData('/api/upload-image', formData);
          console.log('res', res);
          setId(res?.result.itemId);
        }
      } catch (e: any) {
        Dialog.alert({ content: e?.message || 'Error', confirmText: 'Dismiss' });
      }
    })();
  }, [isConnected, blobUrl]);

  return [id];
};

const ConnectWalletPage: React.FC<ConnectWalletPageProps> = (props) => {
  const [blobUrl, setBlobUrl] = useState<string>('');
  const { isConnected } = useAccount();
  const router = useRouter();
  const [recipient] = useRecipient((router?.query?.email as string) || '');
  const [imageId] = useUploadImage({ blobUrl, isConnected });

  const [walletAddress, setWalletAddress] = useState(recipient?.wallet_address);

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: abiJson,
    functionName: 'mint',
    args: [walletAddress, '1', imageId]
  });
  const { data, isLoading, isSuccess, isError, write } = useContractWrite(config);

  console.log('data', data, isSuccess, walletAddress);

  const handleMint = () => {
    write?.();
  };

  useEffect(() => {
    const url: string = localStorage.getItem('imageBlobUrl') ?? '';
    if (url.length) setBlobUrl(url);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      Dialog.alert({
        content: 'Mint Success!',
        confirmText: 'Got it',
        onConfirm: () => {
          router.push('/done');
        }
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (recipient) {
      setWalletAddress(recipient.wallet_address);
    }
  }, [recipient]);

  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <Card style={{ width: '100%' }}>
          <Result icon={<SmileOutline />} status="success" title="Connect Wallet!" />

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            {blobUrl.length && isConnected && (
              <img
                src={blobUrl}
                alt=""
                style={{ maxHeight: '300px', width: 'auto', maxWidth: '100%' }}
              />
            )}
          </div>

          <div style={{ textAlign: 'center', margin: '32px 0px' }}>
            <Web3Button icon="show" label="Connect Wallet" balance="show"></Web3Button>
          </div>

          {isConnected && !recipient?.wallet_address && (
            <Form
              onValuesChange={({ wallet_address }) => {
                setWalletAddress(wallet_address);
              }}
            >
              <NoticeBar
                content={`As ${recipient?.name} did not bind Etherum address or Unipass account, please input the target address`}
                wrap
                color="alert"
              />

              <Form.Item name="wallet_address">
                <Input placeholder="Input wallet address"></Input>
              </Form.Item>
            </Form>
          )}

          {isConnected && (
            <Button
              style={{ margin: '12px 0px' }}
              block
              color="primary"
              onClick={handleMint}
              loading={isLoading}
              disabled={isSuccess || !walletAddress}
            >
              Mint now
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ConnectWalletPage;
