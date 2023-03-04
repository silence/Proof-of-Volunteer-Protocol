import React, { useState } from 'react';
import { Card, Result, ImageUploader, ImageUploadItem, Dialog, Tag } from 'antd-mobile';
import { SmileOutline, CameraOutline } from 'antd-mobile-icons';
import styles from '@/styles/common.module.css';
import Link from 'next/link';

export interface TakePhotoPageProps {}

const AllowedImageTypes = ['jpeg', 'png', 'gif'];

const TakePhotoPage: React.FC<TakePhotoPageProps> = () => {
  const [err, setErr] = useState<string>();
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

  const [blobUrl, setBlobUrl] = useState<string>('');

  const handleUpload = async (file: File): Promise<ImageUploadItem> => {
    setShowWarning(false);
    if (AllowedImageTypes.map((t) => 'image/' + t).includes(file.type)) {
      const url = URL.createObjectURL(file);
      setBlobUrl(url);
      localStorage.setItem('imageBlobUrl', url);
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
        <Link href="/mint" style={{ fontSize: '18px', textDecorationLine: 'underline' }}>
          {fileList?.length && blobUrl.length ? 'Completed' : 'Skip first'}
        </Link>
      </div>
    </div>
  );
};

export default TakePhotoPage;
