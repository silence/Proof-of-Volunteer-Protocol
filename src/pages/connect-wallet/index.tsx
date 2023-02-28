import React from 'react';
import { Card, Result, Button, Space } from 'antd-mobile';
import { SmileOutline } from 'antd-mobile-icons';
import styles from '@/styles/common.module.css';
import { Web3Button, Web3NetworkSwitch } from '@web3modal/react';
import Link from 'next/link';

export interface ConnectWalletPageProps {}

const ConnectWalletPage: React.FC<ConnectWalletPageProps> = (props) => {
  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <Card style={{ width: '100%' }}>
          <Result icon={<SmileOutline />} status="success" title="Connect Wallet!" />

          <div style={{ textAlign: 'center' }}>
            <Web3Button icon="show" label="Connect Wallet" balance="show"></Web3Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConnectWalletPage;
