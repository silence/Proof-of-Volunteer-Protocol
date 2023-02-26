// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { submitByApikey } from "arseeding-js";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

type Data = {
  name: string;
};

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   const arseedingUrl = "https://arseed.web3infra.dev";
//   const apikey = "18a850a9-28b6-4abc-abbd-1b8c2aad9b5e";
//   const data = Buffer.from("........<need upload data, such as a picture>");
//   const contentType = "image/png";
//   const tags = { a: "aa", b: "bb" };
//   // const resp = await submitByApikey(
//   //   arseedingUrl,
//   //   apikey,
//   //   data,
//   //   contentType,
//   //   tags
//   // );

//   console.log("RESQUEST:", req);
//   // console.log("RESPPPPP", resp);

//   res.status(200).json(JSON.stringify(req));
// }

const post = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { base64, fileName } = req.body;
    console.log(base64, fileName);
    const fileContents = base64.replace(/^data:image\/png;base64,/, "");

    console.log("file content: ", fileContents);

    fs.mkdirSync("./public/uploads", { recursive: true });

    const newFileName = `./public/uploads/${Date.now().toString() + fileName}`;

    fs.writeFile(newFileName, fileContents, "base64", function (err) {
      console.log(err);
    });

    res.status(200).send({ name: "success" });
  } catch (err) {
    res.status(500).send({ name: "error" });
  }
};

export default function upload(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  req.method === "POST"
    ? post(req, res)
    : res.status(404).send({ name: "only post" });
}
