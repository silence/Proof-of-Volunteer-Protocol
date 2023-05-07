import React, { useEffect, useState } from 'react';
import { Card, Result, Button, Space, Toast, Dialog, Form, Input, NoticeBar } from 'antd-mobile';
import { SmileOutline } from 'antd-mobile-icons';
import styles from '@/styles/common.module.css';
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { convertBase64, postData } from '@/util';
import abiJson from '@/povp_abi.json';
import { CONTRACT_ADDRESS } from '@/constants';
import { useRouter } from 'next/router';
import { useGlobalState } from '@/hooks/globalContext';
import { povp_Contract_Address, Web3StorageApi } from '@/constants';
import { Web3Storage } from 'web3.storage';
import Web3 from 'web3';
import Image from 'next/image';
export interface ConnectWalletPageProps {}

// const useUploadImage = ({
//   imageObj,
//   isConnected
// }: {
//   imageObj: ImageObjType;
//   isConnected: boolean;
// }) => {
//   const [id, setId] = useState('init');

//   useEffect(() => {
//     (async function extractFile() {
//       try {
//         if (isConnected && imageObj.name.length > 0 && imageObj.bucket.length > 0) {
//           // const file = await (await fetch(blobUrl)).blob();
//           // const fileBase64 = await convertBase64(file);
//           // const formData = new FormData();
//           // formData.append('imageFile', file, file.name);
//           // const res = await postData('/api/upload-image', {
//           //   content: fileBase64,
//           //   fileName
//           // });
//           setId(`https://${imageObj.bucket}.4everland.store/${imageObj.name}`);
//         }
//       } catch (e: any) {
//         console.log('e', e);
//         // Dialog.alert({
//         //   content: e?.message || 'Error',
//         //   confirmText: 'Dismiss'
//         // });
//         setId('debug');
//       }
//     })();
//   }, [isConnected, imageObj]);

//   return [id];
// };

const ConnectWalletPage: React.FC<ConnectWalletPageProps> = (props) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const { isConnected } = useAccount();
  const router = useRouter();
  const { recipient, ipfsImageUrl, email } = useGlobalState();
  // const [imageId] = useUploadImage({ imageObj: imageUrl, isConnected });
  const [walletAddress, setWalletAddress] = useState<string>();
  const [metaData, setmetaData] = useState<string>();

  const [client, setClient] = useState<Web3Storage>();

  useEffect(() => {
    setClient(new Web3Storage({ token: Web3StorageApi }));
  }, []);

  const { config } = usePrepareContractWrite({
    address: povp_Contract_Address,
    abi: abiJson,
    functionName: 'mint',
    args: [walletAddress, metaData]
  });
  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  // console.log('data', data, isSuccess, walletAddress, imageUrl);

  const handleMint = async () => {
    var web3 = new Web3(Web3.givenProvider);
    if (web3) {
      var accounts = await web3.eth.getAccounts();
      setWalletAddress(accounts[0]);
      console.log(accounts[0]);
    } else {
      console.log('Please connect wallet');
    }
    var rawData = {
      description: 'Jerry Volunteered at Digital Literacy Help',
      external_url: '',
      image: ipfsImageUrl,
      name: 'Volunteering Moment',
      attributes: [
        {
          display_type: 'date',
          trait_type: 'POVP Date',
          value: Math.round(Date.now() / 1000)
        },
        {
          trait_type: 'Organizer',
          value: 'Help & Grow'
        },
        {
          trait_type: 'Event Name',
          value: 'Digital Literacy Help'
        },
        {
          trait_type: 'PIC to Claim From',
          value: 'Katrina'
        },
        {
          trait_type: 'Volunteer Name',
          value: 'Jerry'
        },
        {
          trait_type: 'Volunteer Email',
          value: email
        }
      ]
    };
    if (client) {
      const blob = new Blob([JSON.stringify(rawData)], { type: 'application/json' });
      const rootCid = await client?.put([new File([blob], 'povpsbt.json')]);
      console.log('mint now');
      setmetaData(rootCid);
      write?.();
    }
  };

  // useEffect(() => {
  //   const fileName = localStorage.getItem('ImageFileName') ?? '';
  //   const bucketName = localStorage.getItem('BucketName') ?? '';
  //   if (fileName.length && bucketName.length)
  //     setImageUrl(`https://${bucketName}.4everland.store/${fileName}`);
  // }, []);

  useEffect(() => {
    if (isSuccess) {
      const res = Dialog.alert({
        content: 'Mint Success!',
        confirmText: 'Got it',
        onConfirm: () => {
          router.push('/povp/done');
        }
      });
    }
  }, [isSuccess, router]);

  // useEffect(() => {
  //   if (recipient) {
  //     setWalletAddress(recipient.wallet_address);
  //   }
  // }, [recipient]);

  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <Card style={{ width: '100%' }}>
          <Result icon={<SmileOutline />} status="success" title="Connect Wallet!" />

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '24px'
            }}
          >
            {imageUrl.length && isConnected && (
              <Image
                src={imageUrl}
                alt=""
                style={{ maxHeight: '300px', width: 'auto', maxWidth: '100%' }}
              />
            )}
          </div>

          <div style={{ textAlign: 'center', margin: '32px 0px' }}>
            <Web3NetworkSwitch />
            {/* <Web3Button icon="show" label="Connect Wallet" balance="show"></Web3Button> */}
          </div>

          {/* {isConnected && (
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
          )} */}

          {isConnected && (
            <Button
              style={{ margin: '12px 0px' }}
              block
              color="primary"
              onClick={handleMint}
              loading={isLoading}
              disabled={isSuccess}
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
