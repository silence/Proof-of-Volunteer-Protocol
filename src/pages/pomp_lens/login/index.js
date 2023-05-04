import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { client, challenge, authenticate } from '../../api/lens_api';
import styles from '@/styles/common.module.css';
import { Card, Result, Button, Space, Toast, Dialog, Form, Input, NoticeBar } from 'antd-mobile';
import { useSetGlobalState, useGlobalState } from '@/hooks/globalContext';
import { LensClient, development } from '@lens-protocol/client';
import { useRouter } from 'next/router';

export default function Home() {
  /* local state variables to hold user's address and access token */
  const [address, setAddress] = useState();
  const [token, setToken] = useState();
  var { lensClient } = useGlobalState();
  const setGlobalState = useSetGlobalState();
  const router = useRouter();
  useEffect(() => {
    /* when the app loads, check to see if the user has already connected their wallet */
    checkConnection();
    checkLogin();
  }, []);
  async function checkConnection() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    if (accounts.length) {
      setAddress(accounts[0]);
    }
  }
  async function connect() {
    /* this allows the user to connect their wallet */
    const account = await window.ethereum.send('eth_requestAccounts');
    if (account.result.length) {
      setAddress(account.result[0]);
    }
  }

  /////// this function didnt work
  async function checkLogin() {
    if (await lensClient?.authentication?.isAuthenticated()) {
      console.log('Already login');
      const res = Dialog.alert({
        onConfirm: () => {
          router.push('/pomp_lens/post');
        }
      });
    } else {
      console.log('didnt login');
    }
  }
  useEffect(() => {
    if (token) {
      const res = Dialog.alert({
        content: 'Login Success!',
        confirmText: 'Got it',
        onConfirm: () => {
          router.push('/pomp_lens/post');
        }
      });
    }
  }, [token, router]);
  // async function login() {
  //   try {
  //     /* first request the challenge from the API server */
  //     const challengeInfo = await client.query({
  //       query: challenge,
  //       variables: { address }
  //     })
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner()
  //     /* ask the user to sign a message with the challenge info returned from the server */
  //     const signature = await signer.signMessage(challengeInfo.data.challenge.text)
  //     /* authenticate the user */
  //     const authData = await client.mutate({
  //       mutation: authenticate,
  //       variables: {
  //         address, signature
  //       }
  //     })
  //     /* if user authentication is successful, you will receive an accessToken and refreshToken */
  //     const { data: { authenticate: { accessToken }}} = authData
  //     console.log({ accessToken })
  //     setToken(accessToken)
  //   } catch (err) {
  //     console.log('Error signing in: ', err)
  //   }
  // }
  async function login() {
    try {
      const lensClient = new LensClient({
        environment: development
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const address = await signer.getAddress();

      const challenge = await lensClient.authentication.generateChallenge(address);
      const signature = await signer.signMessage(challenge);

      await lensClient.authentication.authenticate(address, signature);

      // check the state with
      if (await lensClient.authentication.isAuthenticated()) {
        setGlobalState((pre) => ({ ...pre, lensClient }));
        setToken('Success');
      }
    } catch (err) {
      console.log('Error signing in: ', err);
    }
  }
  return (
    <div className={styles.app}>
      <div className={styles.body}>
        {/* if the user has not yet connected their wallet, show a connect button */}
        {!address && <Button onClick={connect}>Connect</Button>}
        {/* if the user has connected their wallet but has not yet authenticated, show them a login button */}
        {address && !token && (
          <div onClick={login}>
            <Button>Login</Button>
          </div>
        )}
        {/* once the user has authenticated, show them a success message */}
        {address && token && <h2>Successfully signed in!</h2>}
      </div>
    </div>
  );
}
