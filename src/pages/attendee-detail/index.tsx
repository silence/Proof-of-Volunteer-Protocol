import React, { useEffect, useState } from 'react'
import { Card, NoticeBar, Space, Tag } from 'antd-mobile'
import styles from '@/styles/common.module.css'
import { useRouter } from 'next/router'
import { ATTENDEES } from '@/json/attendees'
import { Attendee } from '@/types/attendee'
import { convertBase64, postData } from '@/util'
import { Button } from '@mui/material'

export interface AttendeeDetailProps {}

const AttendeeDetail: React.FC<AttendeeDetailProps> = (props) => {
  const router = useRouter()

  const [attendee, setAttendee] = useState<Attendee>()

  const [uploadErr, setUploadErr] = useState<boolean>(false)
  const [fileName, setFileName] = useState<string>()

  const { email } = router.query

  useEffect(() => {
    setAttendee(ATTENDEES.find((item) => item.email === email))
  }, [email])

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadErr(false)
    if (event.target.files) {
      const file = event.target.files[0]
      const base64 = (await convertBase64(file)) as string
      if (base64.match(/data:image\/(jpeg|jpg|png);base64/g)) {
        try {
          setFileName(file.name)
          postData('/api/upload-image', { base64, fileName: file.name }).then((res) => {
            console.log('res', res)
          })
        } catch (error) {
          console.log('error: ', error)
        }
      } else {
        setUploadErr(true)
      }
    }
  }

  return (
    <div className={styles.app}>
      <div className={styles.body}>
        <Space
          direction="vertical"
          style={{ '--gap': '20px' }}
        >
          <Card
            title={attendee?.name}
            style={{ width: '100%', fontSize: '18px' }}
          >
            <div>
              <b>DAO role:</b>
              <p>{attendee?.role}</p>
            </div>
            <br />
            <div>
              <b>Self introduction:</b>
              <p>{attendee?.introduction}</p>
            </div>
          </Card>

          <Button
            variant="contained"
            component="label"
          >
            Upload File
            <input
              type="file"
              hidden
              onChange={(e) => uploadImage(e)}
            />
          </Button>
          {fileName && <Tag>File: {fileName}</Tag>}
          {uploadErr && (
            <NoticeBar
              content="Only Image type: jgeg, jpg, png"
              color="error"
            />
          )}
        </Space>
      </div>
    </div>
  )
}

export default AttendeeDetail
