import { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { client, challenge, authenticate } from '../../api/lens_api';
import styles from '@/styles/common.module.css';
import {
  Card,
  Result,
  Button,
  Space,
  Toast,
  Dialog,
  Form,
  Input,
  NoticeBar,
  Image
} from 'antd-mobile';
import { useSetGlobalState, useGlobalState } from '@/hooks/globalContext';
import { LensClient, development } from '@lens-protocol/client';
import { useRouter } from 'next/router';
import LocalStorageProvider from '../storage';
import Link from 'next/link';
import {mainProfile} from '../../../constants/index'

// 0x7ebd
export default function Home() {
  /* local state variables to hold user's address and access token */
  const [profile, setProfile] = useState();
  const [publications, setPublications] = useState();
  const [token, setToken] = useState();
  const [address, setAddress]= useState();
  const lensClient = useMemo(
    () =>
      new LensClient({
        environment: development,
        storage: new LocalStorageProvider()
      }),
    []
  );
  const router = useRouter();
  async function fetchAddress(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const addressTmp = accounts[0];
    setAddress(addressTmp);
    return addressTmp
  }
  async function fetchProfile() {
    const addressTmp = await fetchAddress()
    const allOwnedProfiles = await lensClient.profile.fetchAll({
      ownedBy: [addressTmp],
      limit: 1
    });
    setProfile(allOwnedProfiles.items[0]); // cannot access profile directly for next step, it will return undefined
    return allOwnedProfiles.items[0];
  }

  async function fetchPublications() {
    var profileTmp = await fetchProfile();

    const publications = await lensClient.publication.fetchAll({
      profileId: profileTmp.id,
      publicationTypes: ['POST', 'COMMENT', 'MIRROR']
    });
    console.log(publications);
    setPublications(publications.items);
  }

  async function checkFollowing(){
    
    console.log(address);
    const res = await lensClient.profile.doesFollow({
      followInfos:[{
          followerAddress:address,
          profileId:mainProfile
        }
  ]});
  console.log(res)
  if (res.follows==false){
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const followTypedDataResult = await lensClient.profile.createFollowTypedData({
      follow: [
        {
          profile: mainProfile
        },
      ],
    });
    
    // sign and broadcast the typed data
    const data = followTypedDataResult.unwrap();
    
    // sign with the wallet
    const signedTypedData = await signer._signTypedData(
      data.typedData.domain,
      data.typedData.types,
      data.typedData.value
    );
    
    const broadcastResult = await lensClient.transaction.broadcast({
      id: data.id,
      signature: signedTypedData,
    });
    console.log(broadcastResult);
  }
  }
  useEffect(() => {
    fetchPublications();
  }, [lensClient]); 
  useEffect(()=>{
    if (address!==null && profile!=null ){
      checkFollowing();
    }
  },[address,profile])
  async function collectPublication(id){
    console.log("#######")
    console.log(id)
    const typedDataResult = await lensClient.publication.createCollectTypedData({
      publicationId: id
    });
        // sign and broadcast the typed data
        const data = typedDataResult.unwrap();
    
        // sign with the wallet
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signedTypedData = await signer._signTypedData(
          data.typedData.domain,
          data.typedData.types,
          data.typedData.value
        );
        
        const broadcastResult = await lensClient.transaction.broadcast({
          id: data.id,
          signature: signedTypedData,
        });
        console.log(broadcastResult);


  }
  return (
    <div className={styles.app}>
      <div className={styles.body}>
        {profile ? (
          <div className="pt-20">
            <div className="flex flex-col justify-center items-center">
              <Image
                alt=""
                className="w-64 rounded-full"
                style={{ width: '16rem' }}
                src={profile.picture.original.url}
              />
              <p className="text-4xl mt-8 mb-8">{profile.handle}</p>
              <p className="text-center text-xl font-bold mt-2 mb-2 w-1/2">{profile.bio}</p>

              {publications ? (
                publications.map((pub) => (
                  <div key={pub.id} className="shadow p-10 rounded mb-8 w-2/3">
                    
                    <p>{pub.metadata.content}</p>
                    <Image alt="" src={pub.metadata.media[0].original.url}></Image>
                    <Button  style={{float: "right"}}  onClick={()=>collectPublication(pub.id)}>Support Us</Button>
                  </div>
                ))
              ) : (
                <p>Loading Publications</p>
              )}
              <Link href="/pomp_lens/post">
                <Button block color="primary" >
                  Post
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <p>Loading Profile</p>
        )}
        <div className="pt-20"></div>
      </div>
    </div>
  );
}
