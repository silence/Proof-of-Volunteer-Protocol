import { useState } from "react";
// Import React FilePond
// import { FilePond } from "react-filepond";

// Import FilePond styles
// import "filepond/dist/filepond.min.css";
import { Button } from "@mui/material";

const convertBase64 = (file: Blob) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  });

  const json = await response.json();
  return json;
}

function Upload() {
  const [files, setFiles] = useState([]);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const base64 = (await convertBase64(file)) as string;
      try {
        postData("/api/upload-image", { base64, fileName: file.name }).then(
          (res) => {
            console.log("res", res);
          }
        );
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  return (
    <div className="App">
      <Button variant="contained" component="label">
        Upload File
        <input type="file" hidden onChange={uploadImage} />
      </Button>
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
