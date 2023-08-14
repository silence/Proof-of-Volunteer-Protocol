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
import { Web3Storage } from "web3.storage";
import Web3 from "web3";
import Image from "next/image";
export interface ConnectWalletPageProps {}

const ConnectWalletPage: React.FC<ConnectWalletPageProps> = () => {
  const { isConnected } = useAccount();
  const router = useRouter();
  const { ipfsImageUrl, email } = useGlobalState();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [metaData, setmetaData] = useState<string>();

  const [client, setClient] = useState<Web3Storage>();

  useEffect(() => {
    setClient(new Web3Storage({ token: Web3StorageApi }));
  }, []);

  const { config } = usePrepareContractWrite({
    address: povp_Contract_Address,
    abi: abiJson,
    functionName: "mint",
    args: [walletAddress, metaData],
  });
  const { isLoading, isSuccess, write } = useContractWrite(config);

  const handleMint = async () => {
    var web3 = new Web3(Web3.givenProvider);
    if (web3) {
      var accounts = await web3.eth.getAccounts();
      setWalletAddress(accounts[0]);
      console.log(accounts[0]);
    } else {
      console.log("Please connect wallet");
    }
    var rawData = {
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
    if (client) {
      const blob = new Blob([JSON.stringify(rawData)], {
        type: "application/json",
      });
      const rootCid = await client?.put([new File([blob], "povpsbt.json")]);
      console.log("mint now");
      setmetaData(rootCid);
      write?.();
    }
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

          {isConnected && (
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
          )}
        </Card>
      </div>
    </div>
  );
};

export default ConnectWalletPage;
