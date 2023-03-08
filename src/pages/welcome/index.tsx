import React from 'react';
import { Button, Space, Result, Card } from 'antd-mobile';
import { SmileOutline } from 'antd-mobile-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/common.module.css';

export interface WelcomePageProps {}

const WelcomePage: React.FC<WelcomePageProps> = (props) => {
  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <Space direction="vertical" style={{ '--gap': '20px' }}>
          <Card>
            <Result
              icon={<SmileOutline />}
              status="success"
              title="Welcome to SeeDAO 1st offline DAO member meetup at Singapore"
            />
          </Card>
          <Space direction="vertical" style={{ '--gap': '10px', width: '100%' }}>
            <Button block size="large" disabled>
              Claim POAP NFT
            </Button>
            <Link href="/attendees-list">
              <Button block size="large" color="primary">
                View Attendee List
              </Button>
            </Link>
            <Button block size="large" disabled>
              Event Images & Videos
            </Button>
          </Space>
        </Space>
      </div>
    </div>
  );
};

export default WelcomePage;
