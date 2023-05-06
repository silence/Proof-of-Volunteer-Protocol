import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { client, challenge, authenticate } from '../../api/lens_api';
import styles from '@/styles/common.module.css';
import { Card, Result, Button, Space, Toast, Dialog, Form, Input, NoticeBar } from 'antd-mobile';
import { useSetGlobalState, useGlobalState } from '@/hooks/globalContext';
import { LensClient, development } from '@lens-protocol/client';
import { useRouter } from 'next/router';
import { LocalStorageProvider } from '../storage';
import Link from 'next/link';

export default function Home() {
  /* local state variables to hold user's address and access token */
  const [profile, setProfile] = useState();
  const [publications, setPublications] = useState();
  const [token, setToken] = useState();
  const lensClient = new LensClient({
    environment: development,
    storage: new LocalStorageProvider()
  });
  const router = useRouter();

  async function fetchProfile() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const address = accounts[0];
    const allOwnedProfiles = await lensClient.profile.fetchAll({
      ownedBy: [address],
      limit: 1
    });
    setProfile(allOwnedProfiles.items[0]); // cannot access profile directly for next step, it will return undefined
    return allOwnedProfiles.items[0];
  }

  async function fetchPublications() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const address = accounts[0];

    var profileTmp = await fetchProfile();

    const publications = await lensClient.publication.fetchAll({
      profileId: profileTmp.id,
      publicationTypes: ['POST', 'COMMENT', 'MIRROR']
    });
    console.log(publications);
    setPublications(publications.items);
  }
  useEffect(() => {
    fetchPublications();

    // fetchPublications();
  }, []); // default trigger run if any changes

  return (
    <div className={styles.app}>
      <div className={styles.body}>
        {profile ? (
          <div className="pt-20">
            <div className="flex flex-col justify-center items-center">
              <img className="w-64 rounded-full" src={profile.picture.original.url} />
              <p className="text-4xl mt-8 mb-8">{profile.handle}</p>
              <p className="text-center text-xl font-bold mt-2 mb-2 w-1/2">{profile.bio}</p>

              {publications ? (
                publications.map((pub) => (
                  <div key={pub.id} className="shadow p-10 rounded mb-8 w-2/3">
                    <p>{pub.metadata.content}</p>
                  </div>
                ))
              ) : (
                <p>Loading Publications</p>
              )}
              <Link href="/pomp_lens/post">
                <Button block color="primary">
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
