import React from 'react';
import { Space, Result, Form, Input, List, Card, InfiniteScroll, Button } from 'antd-mobile';
import { useRouter } from 'next/router';
import { SmileOutline, UserContactOutline } from 'antd-mobile-icons';
import { Attendee } from '@/types/attendee';
import { ATTENDEES } from '@/json/attendees';
import styles from '@/styles/common.module.css';

export interface AttendeesListProps {}

const AttendeesList: React.FC<AttendeesListProps> = (props) => {
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSelectAttendee = (item: Attendee) => {
    const { email } = item;
    form.setFieldValue('email', email);
  };

  const handleClickConfirm = async () => {
    const { email } = await form.validateFields();
    router.push({
      pathname: '/attendee-detail',
      query: { email }
    });
  };

  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <div>
          <Card>
            <Result
              icon={<SmileOutline />}
              title={
                <p>
                  To Meet other attendees and mint <b>Proof of Meet Protocol SBT</b> to remember
                  each other
                </p>
              }
            />

            <Form form={form}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true }, { type: 'email', message: 'Invalid email' }]}
              >
                <Input placeholder="Input email or select attendee from below"></Input>
              </Form.Item>
            </Form>
          </Card>

          <List
            header="Attendees list"
            mode="card"
            style={{ margin: '12px 0px 36px 0px' }}
          >
            {ATTENDEES.map((item) => {
              return (
                <List.Item
                  prefix={
                    <UserContactOutline
                      width={32}
                      height={32}
                      color="var(--adm-color-primary)"
                    />
                  }
                  key={item.email}
                  description={item.role}
                  onClick={() => handleSelectAttendee(item)}
                >
                  {item.name}
                </List.Item>
              );
            })}
            <InfiniteScroll
              loadMore={async () => {}}
              hasMore={false}
            >
              <span>--- No more ---</span>
            </InfiniteScroll>
          </List>

          <Button
            block
            color="primary"
            size="large"
            onClick={handleClickConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttendeesList;
