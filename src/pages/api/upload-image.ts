// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { submitByApikey } from 'arseeding-js';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

function submitImage(imageData: string, imageType: string) {
  const arseedingUrl = 'https://arseed.web3infra.dev';
  const apikey = '18a850a9-28b6-4abc-abbd-1b8c2aad9b5e';
  const data = Buffer.from(imageData);
  const contentType = 'image/' + imageType;
  const tags = { fileType: 'image', imageType: imageType };
  return submitByApikey(arseedingUrl, apikey, data, contentType, tags);
}

const post = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { base64, fileName } = req.body;
    const match = base64.match(/(?<=data:image\/)\w+/g);
    const fileContents = base64.replace(/^data:image\/(jpeg|jpg|png);base64,/, '');

    submitImage(fileContents, match[0]).then(
      (resFromArseed) => {
        console.log(resFromArseed);
        res.status(200).send({ name: 'save file ' + fileName + ' success' });
      },
      (error) => {
        res.status(500).send({ name: error });
      }
    );
  } catch (err) {
    res.status(500).send({ name: 'error' });
  }
};

export default function upload(req: NextApiRequest, res: NextApiResponse<Data>) {
  req.method === 'POST' ? post(req, res) : res.status(404).send({ name: 'only post' });
}
