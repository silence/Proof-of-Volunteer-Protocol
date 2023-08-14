import React, { useEffect, useState } from "react";
import { Card, Result, Button, Dialog } from "antd-mobile";
import { SmileOutline } from "antd-mobile-icons";
import styles from "@/styles/common.module.css";
import { Web3NetworkSwitch } from "@web3modal/react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import abiJson from "@/povp_abi.json";
import { useRouter } from "next/router";
import { useGlobalState } from "@/hooks/globalContext";
import { povp_Contract_Address, Web3StorageApi } from "@/constants";
import LoginButton from "@/components/LoginButton";
import { Web3Storage } from "web3.storage";
import Web3 from "web3";
import {
  ContentFocus,
  ReferencePolicyType,
  useCreatePost,
} from "@lens-protocol/react-web";
import {
  useActiveProfile,
  useWalletLogin,
  useFeed,
} from "@lens-protocol/react-web";
import uploadToIPFS from "@/utils.ts/uploadToIpfs";

export interface ConnectWalletPageProps {}

const ConnectWalletPage: React.FC<ConnectWalletPageProps> = () => {
  const { isConnected } = useAccount();
  const router = useRouter();
  const { ipfsImageUrl, email } = useGlobalState();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [metaData, setmetaData] = useState<string>();
  const { data: activeProfile, loading: profileLoading } = useActiveProfile();
  const {
    execute: create,
    error,
    isPending,
  } = useCreatePost({
    publisher: activeProfile!,
    upload: async () => ipfsImageUrl!,
  });

  const [client, setClient] = useState<Web3Storage>();

  console.log("isConnected", isConnected);
  console.log("activeProfile", activeProfile);

  useEffect(() => {
    setClient(new Web3Storage({ token: Web3StorageApi }));
  }, []);

  const { config } = usePrepareContractWrite({
    addressOrName: povp_Contract_Address,
    contractInterface: abiJson,
    functionName: "mint",
    args: [walletAddress, metaData],
  });
  const { isLoading, isSuccess, write } = useContractWrite(config);

  const handleMint = async () => {
    const metaData = {
      description: "Jerry Volunteered at Digital Literacy Help",
      external_url: "",
      image: ipfsImageUrl,
      name: "Volunteering Moment",
      attributes: [
        {
          display_type: "date",
          trait_type: "POVP Date",
          value: Math.round(Date.now() / 1000),
        },
        {
          trait_type: "Organizer",
          value: "Help & Grow",
        },
        {
          trait_type: "Event Name",
          value: "Digital Literacy Help",
        },
        {
          trait_type: "PIC to Claim From",
          value: "Katrina",
        },
        {
          trait_type: "Volunteer Name",
          value: "Jerry",
        },
        {
          trait_type: "Volunteer Email",
          value: email,
        },
      ],
    };

    await create({
      content: JSON.stringify(metaData),
      contentFocus: ContentFocus.TEXT,
      locale: "en",
      reference: { type: ReferencePolicyType.ANYONE },
    });
  };

  useEffect(() => {
    if (isSuccess) {
      const res = Dialog.alert({
        content: "Mint Success!",
        confirmText: "Got it",
        onConfirm: () => {
          router.push("/povp/done");
        },
      });
    }
  }, [isSuccess, router]);

  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <Card style={{ width: "100%" }}>
          <Result
            icon={<SmileOutline />}
            status="success"
            title="Connect Wallet!"
          />

          <div style={{ textAlign: "center", margin: "32px 0px" }}>
            <Web3NetworkSwitch />
          </div>

          {isConnected ? (
            <Button
              style={{ margin: "12px 0px" }}
              block
              color="primary"
              onClick={handleMint}
              loading={isLoading}
              disabled={isSuccess}
            >
              Mint now
            </Button>
          ) : (
            <LoginButton />
          )}
        </Card>
      </div>
    </div>
  );
};

export default ConnectWalletPage;
