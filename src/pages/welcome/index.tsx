import React from 'react';
import { NoticeBar, Button, Space} from 'antd-mobile';


export interface WelcomePageProps {}


const WelcomePage: React.FC<WelcomePageProps> = (props) => {
  return <Space direction="vertical" justify="center" style={{height:'100vh',"--gap":'48px'}}>
    <NoticeBar color="info" wrap content="Welcome to SeeDAO 1st offline DAO member meetup at Singapore"></NoticeBar>

    <Space direction="vertical" style={{"--gap":'20px', width:'100%'}}>
      <Button block size="large" disabled>Claim POAP NFT</Button>
      <Button block size="large" color="primary">View Attendee List</Button>
      <Button block size="large" disabled>Event Images & Videos</Button>
    </Space>

  </Space>
}


export default WelcomePage;