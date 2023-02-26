import { useState } from 'react';

import { convertBase64, postData } from '@/util';
import { Button } from '@mui/material';
import { Button as ButtonAnt, ImageUploader } from 'antd-mobile';

export async function mockUpload(file: File) {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 3000);
  });
  return {
    url: URL.createObjectURL(file)
  };
}

function Upload() {
  const [files, setFiles] = useState([]);
  const [fileList, setFileList] = useState([]);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const base64 = (await convertBase64(file)) as string;
      try {
        postData('/api/upload-image', { base64, fileName: file.name }).then((res) => {
          console.log('res', res);
        });
      } catch (error) {
        console.log('error: ', error);
      }
    }
  };

  return (
    <div className="App">
      <Button
        variant="contained"
        component="label"
      >
        Upload File
        <input
          type="file"
          hidden
          onChange={uploadImage}
        />
      </Button>
      <ButtonAnt
        color="primary"
        fill="solid"
      >
        Upload File
        <input
          type="file"
          hidden
          onChange={(e) => uploadImage(e)}
        />
      </ButtonAnt>

      <ImageUploader
        value={fileList}
        onChange={setFileList}
        upload={mockUpload}
      />

      {/* <FilePond
        files={files}
        // oninitfile={(file) => {
        //   console.log("init: ", file);
        // }}
        onaddfilestart={(file) => {
          console.log("on start file: ", file);
        }}
        onaddfile={(file) => {
          console.log("on add file: ", file);
        }}
        onupdatefiles={(fs) => {
          console.log("files: ", fs);
          setFiles(fs);
        }}
        allowMultiple={true}
        server="/api/upload-image"
        name="files" 
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      /> */}
    </div>
  );
}

export default Upload;
