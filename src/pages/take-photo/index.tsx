import React, { useState } from 'react';
import { Card, Result, ImageUploader, ImageUploadItem, Dialog, Tag, Button } from 'antd-mobile';
import { SmileOutline, CameraOutline } from 'antd-mobile-icons';
import styles from '@/styles/common.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

export interface TakePhotoPageProps {}

const AllowedImageTypes = ['jpeg', 'png', 'gif'];

const TakePhotoPage: React.FC<TakePhotoPageProps> = () => {
  const [err, setErr] = useState<string>();
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

  const [blobUrl, setBlobUrl] = useState<string>('');

  const router = useRouter();

  const handleUpload = async (file: File): Promise<ImageUploadItem> => {
    setShowWarning(false);
    if (AllowedImageTypes.map((t) => 'image/' + t).includes(file.type)) {
      const url = URL.createObjectURL(file);
      setBlobUrl(url);
      localStorage.setItem('imageBlobUrl', url);
      localStorage.setItem('imageFileName', file.name);
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
            title="You two met in “Alibaba Cloud (Singapore)”"
          />

          {Boolean(fileList?.length && blobUrl.length) ? (
            <Button
              block
              color="primary"
              onClick={() =>
                router.push({
                  pathname: '/mint',
                  query: router.query
                })
              }
            >
              Next
            </Button>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <Link href="/mint" style={{ fontSize: '18px', textDecorationLine: 'underline' }}>
                Skip first
              </Link>
            </div>
          )}
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
            value={fileList}
            onChange={setFileList}
            upload={handleUpload}
            maxCount={1}
            style={{ '--cell-size': '240px' }}
            onDelete={() =>
              Dialog.confirm({
                content: 'Are you sure to remove this photo?',
                cancelText: 'Cancel',
                confirmText: 'Confirm',
                onConfirm: () => {
                  if (blobUrl) URL.revokeObjectURL(blobUrl);
                }
              })
            }
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
      </div>
    </div>
  );
};

export default TakePhotoPage;
