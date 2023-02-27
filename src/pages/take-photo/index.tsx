import React from 'react';
import { Card, Result, ImageUploader, ImageUploadItem, Dialog } from 'antd-mobile';
import { SmileOutline, CameraOutline } from 'antd-mobile-icons';
import styles from '@/styles/common.module.css';
import Link from 'next/link';
import { convertBase64, postData } from '@/util';

export interface TakePhotoPageProps {}

const TakePhotoPage: React.FC<TakePhotoPageProps> = (props) => {
  // const handleUpload = (file: File) => {
  //   console.log('file', file);

  //   return Promise.resolve({
  //     key: '',
  //     url: 'string',
  //     thumbnailUrl: 'string',
  //     extra: ''
  //   });
  // };

  const handleUpload = async (file: File): Promise<ImageUploadItem> => {
    const base64 = (await convertBase64(file)) as string;
    if (base64.match(/data:image\/(jpeg|jpg|png);base64/g)) {
      try {
        postData('/api/upload-image', { base64, fileName: file.name }).then((res) => {
          console.log('res', res);
        });
      } catch (error) {
        console.log('error: ', error);
      }
    } else {
    }
    return {
      url: URL.createObjectURL(file)
    };
  };

  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <Card style={{ width: '100%' }}>
          <Result
            icon={<SmileOutline />}
            status="success"
            title="You two met in 'OGBC Raffle Place'"
          />
        </Card>

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <ImageUploader
            upload={handleUpload}
            capture
            maxCount={1}
            style={{ '--cell-size': '120px' }}
            onDelete={() => {
              return Dialog.confirm({
                content: 'Are you sure to remove this photo?'
              });
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 40,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#999999'
              }}
            >
              <CameraOutline style={{ fontSize: 48 }} />
            </div>
          </ImageUploader>
        </div>

        <Link
          href="/mint"
          style={{ fontSize: '18px', textDecorationLine: 'underline' }}
        >
          Skip first
        </Link>
      </div>
    </div>
  );
};

export default TakePhotoPage;
