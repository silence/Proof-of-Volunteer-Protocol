import React, { useEffect, useState } from 'react';
import { Card, Space, Button } from 'antd-mobile';
import styles from '@/styles/common.module.css';
import { useRouter } from 'next/router';
import { ATTENDEES } from '@/json/attendees';
import { Attendee } from '@/types/attendee';

export interface AttendeeDetailProps {}

const AttendeeDetail: React.FC<AttendeeDetailProps> = (props) => {
  const router = useRouter();

  const [attendee, setAttendee] = useState<Attendee>();

  const { email } = router.query;

  useEffect(() => {
    setAttendee(ATTENDEES.find((item) => item.email === email));
  }, [email]);

  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <Space
          direction="vertical"
          style={{ '--gap': '20px' }}
        >
          <Card
            title={attendee?.name}
            style={{ width: '100%', fontSize: '18px' }}
          >
            <div>
              <b>DAO role:</b>
              <p>{attendee?.role}</p>
            </div>
            <br />
            <div>
              <b>Self introduction:</b>
              <p>{attendee?.introduction}</p>
            </div>
          </Card>

          <Button
            size="large"
            shape="rounded"
            color="primary"
            onClick={() => router.push('/take-photo')}
          >
            Take a joint picture to remember such a moment
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default AttendeeDetail;
