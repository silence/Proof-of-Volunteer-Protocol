export const convertBase64 = (file: Blob) =>
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

export async function postData(url: string, data: FormData) {
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: data
  });

  const json = await response.json();
  return json;
}
