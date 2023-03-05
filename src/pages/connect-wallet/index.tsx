import React, { useEffect, useState } from 'react';
import { Card, Result, Button, Space } from 'antd-mobile';
import { SmileOutline } from 'antd-mobile-icons';
import styles from '@/styles/common.module.css';
import { Web3Button } from '@web3modal/react';
import { useAccount } from 'wagmi';
import { postData } from '@/util';

export interface ConnectWalletPageProps {}

const ConnectWalletPage: React.FC<ConnectWalletPageProps> = (props) => {
  const [blobUrl, setBlobUrl] = useState<string>('');
  const { isConnected } = useAccount();

  useEffect(() => {
    const url: string = localStorage.getItem('imageBlobUrl') ?? '';
    if (url.length) setBlobUrl(url);
  }, []);

  useEffect(() => {
    async function extractFile() {
      if (isConnected && blobUrl.length) {
        const file = await (await fetch(blobUrl)).blob();
        const formData = new FormData();
        formData.append('imageFile', file, file.name);
        await postData('/api/upload-image', formData)
          .then((res) => {
            //TODO: save the item id from backend
            console.log('res', res);
          })
          .catch((error) => {
            console.log('error: ', error);
            // setErr(error.message);
          });
      }
    }

    extractFile();
  }, [blobUrl, isConnected]);

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

          <div style={{ textAlign: 'center' }}>
            <Web3Button icon="show" label="Connect Wallet" balance="show"></Web3Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConnectWalletPage;
