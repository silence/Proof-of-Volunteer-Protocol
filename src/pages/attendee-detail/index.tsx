import React, { useEffect, useState } from 'react';
import { Card, ImageUploadItem, Space, Button } from 'antd-mobile';
import styles from '@/styles/common.module.css';
import { useRouter } from 'next/router';
import { ATTENDEES } from '@/json/attendees';
import { Attendee } from '@/types/attendee';
import { convertBase64, postData } from '@/util';

export interface AttendeeDetailProps {}

const AttendeeDetail: React.FC<AttendeeDetailProps> = (props) => {
  const router = useRouter();

  const [attendee, setAttendee] = useState<Attendee>();

  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [uploadErr, setUploadErr] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>();

  const { email } = router.query;

  useEffect(() => {
    setAttendee(ATTENDEES.find((item) => item.email === email));
  }, [email]);

  const uploadImage = async (file: File) => {
    setUploadErr(false);
    const base64 = (await convertBase64(file)) as string;
    if (base64.match(/data:image\/(jpeg|jpg|png);base64/g)) {
      try {
        setFileName(file.name);
        postData('/api/upload-image', { base64, fileName: file.name }).then((res) => {
          console.log('res', res);
        });
      } catch (error) {
        console.log('error: ', error);
      }
    } else {
      setUploadErr(true);
    }
    return {
      url: URL.createObjectURL(file)
    };
  };

  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <Space direction="vertical" style={{ '--gap': '20px' }}>
          <Card title={attendee?.name} style={{ width: '100%', fontSize: '18px' }}>
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
