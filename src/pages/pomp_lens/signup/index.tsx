import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { client, challenge, authenticate } from '../../api/lens_api';
import styles from '@/styles/common.module.css';
import { Card, Space,Form,Input, Result, ImageUploader, ImageUploadItem, Dialog, Tag, Button } from 'antd-mobile';
import { useSetGlobalState, useGlobalState } from '@/hooks/globalContext';
import { LensClient, development } from '@lens-protocol/client';
import { useRouter } from 'next/router';
import LocalStorageProvider from '../storage';
import { Web3Storage } from 'web3.storage';
import { useNotification } from '@web3uikit/core';
import { SmileOutline, CameraOutline } from 'antd-mobile-icons';
import { Web3StorageApi } from '@/constants';
import { isRelayerResult } from "@lens-protocol/client";
const AllowedImageTypes = ['jpeg', 'png', 'gif','jpg'];

export default function Home() {
  /* local state variables to hold user's address and access token */
  const [address, setAddress] = useState<string>();
  const [token, setToken] = useState<string>();
  // var { lensClient } = useGlobalState();
  const setGlobalState = useSetGlobalState();


  const lensClient = new LensClient({
    environment: development,
    storage: new LocalStorageProvider()
  });

  const router = useRouter();
  const [err, setErr] = useState<string>();
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [imageURL, setImageURL] = useState<string>();
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const notification = useNotification();
  const [imageObj, setImageObj] = useState<{ name: string; bucket: string }>();

  const [client, setClient] = useState<Web3Storage>();
  useEffect(() => {

    setClient(new Web3Storage({ token: Web3StorageApi }));
    // setClient(s3);
  }, []);
  useEffect(() => {
    /* when the app loads, check to see if the user has already connected their wallet */
    async function checkLogin() {
      if (await lensClient?.authentication?.isAuthenticated()==false) {

        router.push('/pomp_lens/login');

      }
    }
  }
  )

  async function finishForm(event :any){
    if (imageURL == null){
      notification({
        type: 'warning',
        message: 'Please upload image',

        position: 'topR'
      });
      return
    }


      // lensClient is an authenticated instance of LensClient

      const profileCreateResult = await lensClient.profile.create({ 
        handle: event.handle,
        
          // other request args 
      });

      // profileCreateResult is a Result object
      const profileCreateResultValue = profileCreateResult.unwrap();

      if (!isRelayerResult(profileCreateResultValue)) {
        console.log(`Something went wrong`, profileCreateResultValue);
        return;
      }

      console.log(
        `Transaction was successfuly broadcasted with txId ${profileCreateResultValue.txId}`
      );
  }
  const handleUpload = async (file: File): Promise<ImageUploadItem> => {
    setShowWarning(false);
    if (AllowedImageTypes.map((t) => 'image/' + t).includes(file.type)) {

      console.log('Upload Started');
      if (client) {
        const rootCid = await client.put([file]);
        var ipfsImageUrl = `https://${rootCid}.ipfs.w3s.link/${file.name}`;

        setImageURL(ipfsImageUrl);
    }
    } else {
      setShowWarning(true);
    }
    return {
      url: URL.createObjectURL(file)
    };
  };


  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <Card>

        
            <Form onFinish={finishForm}>
            <Form.Item name='Address' label='Ethereum Address' rules={[{ required: true }]}>
              <Input placeholder='Address' id="Address" type='text' />
            </Form.Item>
            <Form.Item name='Handle' label='Handle' rules={[{ required: true }]}>
                <Input placeholder='Handle' id="Handle" type='text' />
            </Form.Item>


                <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <ImageUploader
            value={fileList}
            onChange={setFileList}
            upload={handleUpload}
            maxCount={1}
            style={{ '--cell-size': '240px' }}
          >
            <div
              style={{
                width: 240,
                height: 240,
                borderRadius: 80,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#999999'
              }}
            >
              <CameraOutline style={{ fontSize: 96 }} />
            </div>
          </ImageUploader>
          {showWarning && <Tag>Only types: {AllowedImageTypes.join(', ')} are allowed</Tag>}
            </div>

            <Button type='submit' color='primary' style={{float: "right"}} >Submit</Button>
                
            </Form>

            </Card>
            
      </div>
    </div>
  );
}
