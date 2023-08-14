import React, { useEffect, useState } from "react";
import {
  Card,
  Result,
  ImageUploader,
  ImageUploadItem,
  Dialog,
  Tag,
  Button,
} from "antd-mobile";
import { SmileOutline, CameraOutline } from "antd-mobile-icons";
import styles from "@/styles/common.module.css";
import Link from "next/link";
import { Web3StorageApi } from "@/constants";
import { Web3Storage } from "web3.storage";
import { useSetGlobalState } from "@/hooks/globalContext";

export interface TakePhotoPageProps {}

const AllowedImageTypes = ["jpeg", "png", "gif"];

const TakePhotoPage: React.FC<TakePhotoPageProps> = () => {
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [client, setClient] = useState<Web3Storage>();
  const setGlobalState = useSetGlobalState();

  useEffect(() => {
    setClient(new Web3Storage({ token: Web3StorageApi }));
  }, []);

  const handleUpload = async (file: File): Promise<ImageUploadItem> => {
    setShowWarning(false);
    if (AllowedImageTypes.map((t) => "image/" + t).includes(file.type)) {
      console.log("Upload Started");
      if (client) {
        const rootCid = await client.put([file]);
        var ipfsImageUrl = `https://${rootCid}.ipfs.w3s.link/${file.name}`;
        setGlobalState((pre) => ({ ...pre, ipfsImageUrl }));
        console.log("Image " + ipfsImageUrl);
      }
    } else {
      setShowWarning(true);
    }
    return {
      url: URL.createObjectURL(file),
    };
  };

  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <Card style={{ width: "100%" }}>
          <Result
            icon={<SmileOutline />}
            status="success"
            title="Thank you for volunteering at Digital Literacy Help Event"
          />

          {Boolean(fileList?.length) ? (
            <Link href="/povp/connect-wallet">
              <Button block color="primary">
                Next
              </Button>
            </Link>
          ) : (
            <></>
          )}
        </Card>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <ImageUploader
            value={fileList}
            onChange={setFileList}
            upload={handleUpload}
            maxCount={1}
            style={{ "--cell-size": "240px" }}
          >
            <div
              style={{
                width: 240,
                height: 240,
                borderRadius: 80,
                backgroundColor: "#f5f5f5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#999999",
              }}
            >
              <CameraOutline style={{ fontSize: 96 }} />
            </div>
          </ImageUploader>
          {showWarning && (
            <Tag>Only types: {AllowedImageTypes.join(", ")} are allowed</Tag>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakePhotoPage;
