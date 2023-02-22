import React from 'react';
import { NoticeBar, Space, Input, Form, Button } from 'antd-mobile';


export interface CheckInPageProps {}


const CheckInPage: React.FC<CheckInPageProps> = (props) => {

  return <div style={{height:'100vh', display:'flex', alignItems:'center'}}>
    <div style={{flex:1, paddingBottom:'60px'}}>
      
      <Space direction="vertical" style={{ '--gap': '48px' }}>

        <NoticeBar wrap content='Use the email you registered to check-in and meet other attendees' color='info' />

        <Form layout='horizontal'>
          <Form.Item label='' name='email'>
            <Input placeholder='Input Email' clearable />
          </Form.Item>
        </Form>

        <Button block color='primary'>
          Check-in
        </Button>
      </Space>

    </div>
  </div>
}


export default CheckInPage;