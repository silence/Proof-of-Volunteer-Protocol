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
import { Web3StorageApi ,MockProfileAddress} from '@/constants';
import { isRelayerResult } from "@lens-protocol/client";
const AllowedImageTypes = ['jpeg', 'png', 'gif','jpg'];
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import profileAbiJson from '@/mockprofileabi.json';

export default function Home() {
  /* local state variables to hold user's address and access token */
  const [address, setAddress] = useState<string>();
  const [token, setToken] = useState<string>();
  // var { lensClient } = useGlobalState();
  const setGlobalState = useSetGlobalState();
  const [contract, setContract] = useState<ethers.Contract>();
  const [handleToWrite, setHandle] = useState<string>();
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
  const encoder = new TextEncoder();
  const toBytes = (text: string | undefined ) => {
  return encoder. encode(text);
  }
  // const { config } = usePrepareContractWrite({
  //   address: MockProfileAddress,
  //   abi: profileAbiJson,
  //   // chainId:80001,
  //   functionName: 'proxyCreateProfile',
  //   args: [address, handleToWrite,imageURL,"0x0000000000000000000000000000000000000000","0x00",imageURL],

  // });

  

//   const { data, isLoading, isSuccess, write } = useContractWrite({...config, 
//     onError(error) {
//     console.log('Error', error)
//   }
// });
  
  async function createContract(){
    const signer = new ethers.providers.Web3Provider((window as any).ethereum).getSigner()
    setContract(new ethers.Contract(MockProfileAddress,profileAbiJson, signer))
  }

  useEffect(() => {

    
    createContract();
    setClient(new Web3Storage({ token: Web3StorageApi }));
        /* when the app loads, check to see if the user has already connected their wallet */
        async function checkConnection() {
          const provider = new ethers.providers.Web3Provider((window as any).ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length) {
            setAddress(accounts[0]);
          }
          else{
            router.push('/pomp_lens/login');
          }
        }
        checkConnection();
    // setClient(s3);
  }, [router]);

  async function finishForm(event :any){

    if (imageURL == null){
      notification({
        type: 'warning',
        message: 'Please upload image',

        position: 'topR'
      });
      return
    }
    console.log({to:ethers.utils.getAddress(address!), handle:handleToWrite,imageURI:imageURL,followModule:ethers.utils.getAddress("0x0000000000000000000000000000000000000000"),followModuleInitData:"0x00",followNFTURI:imageURL})
    var res = await contract!.proxyCreateProfile({to:ethers.utils.getAddress(address!), handle:event.handle,imageURI:imageURL,followModule:ethers.utils.getAddress("0x0000000000000000000000000000000000000000"),followModuleInitData:"0x00",followNFTURI:imageURL});
    if(res.hash){
      notification({
        type: 'success',
        message: 'Profile created, please login',

        position: 'topR'
        
      });
      router.push('/pomp_lens/login');
    }
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
            {/* <Form.Item name='Address' label='Ethereum Address' rules={[{ required: true }]}>
              <Input placeholder='Address' id="Address" type='text' />
            </Form.Item> */}
            <Form.Item name='handle' label='handle' rules={[{ required: true }]}>
                <Input placeholder='handle' id="handle" type='text' />
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
