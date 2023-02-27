import React, { useState } from 'react';
import { Card, Result, ImageUploader, ImageUploadItem, Dialog, Tag } from 'antd-mobile';
import { SmileOutline, CameraOutline } from 'antd-mobile-icons';
import styles from '@/styles/common.module.css';
import Link from 'next/link';
import { postData } from '@/util';

export interface TakePhotoPageProps {}

const AllowedImageTypes = ['jpeg', 'png', 'gif'];

const TakePhotoPage: React.FC<TakePhotoPageProps> = () => {
  const [err, setErr] = useState<string>();
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const handleUpload = async (file: File): Promise<ImageUploadItem> => {
    setShowWarning(false);
    if (AllowedImageTypes.map((t) => 'image/' + t).includes(file.type)) {
      const formData = new FormData();
      formData.append('imageFile', file, file.name);
      await postData('/api/upload-image', formData)
        .then((res) => {
          console.log('res', res);
        })
        .catch((error) => {
          console.log('error: ', error);
          setErr(error.message);
        });
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
        <Card style={{ width: '100%' }}>
          <Result
            icon={<SmileOutline />}
            status="success"
            title="You two met in 'OGBC Raffle Place'"
          />
        </Card>

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
            upload={handleUpload}
            capture
            maxCount={1}
            style={{ '--cell-size': '240px' }}
            onDelete={() => {
              return Dialog.confirm({
                content: 'Are you sure to remove this photo?',
                cancelText: 'Cancel',
                confirmText: 'Confirm'
              });
            }}
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
        <Link href="/mint" style={{ fontSize: '18px', textDecorationLine: 'underline' }}>
          Skip first
        </Link>
      </div>
    </div>
  );
};

export default TakePhotoPage;
