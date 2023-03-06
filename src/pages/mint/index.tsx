import { Card, Result, Button } from 'antd-mobile';
import { SmileOutline } from 'antd-mobile-icons';
import styles from '@/styles/common.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface MintPageProps {}

const MintPage: React.FC<MintPageProps> = () => {
  const router = useRouter();

  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <Card style={{ width: '100%' }}>
          <Result
            icon={<SmileOutline />}
            status="success"
            title="Mint a POMP (Proof of Meet Protocol) SBT which will be stored permanently!"
          />
          <Button
            size="large"
            color="primary"
            block
            onClick={() =>
              router.push({
                pathname: '/connect-wallet',
                query: router.query
              })
            }
          >
            Mint Now
          </Button>
        </Card>

        <Link href="/done" style={{ fontSize: '18px', textDecorationLine: 'underline' }}>
          Mint later
        </Link>
      </div>
    </div>
  );
};

export default MintPage;
