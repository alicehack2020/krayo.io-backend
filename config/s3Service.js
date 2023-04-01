// import { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";
import pkg from 'aws-sdk';                                            
const { S3 } = pkg;

const s3Uploadv2 = async (file) => {
  const s3 = new S3({
    secretAccessKey: process.env.AWS_SECRET_KEYX,
    accessKeyId: process.env.AWS_ACCESS_KEY_IDX,
    region: process.env.AWS_REGIONX,
  });

  const param = {
    Bucket: process.env.AWS_BUKET_NAMEX,
    Key: `uploads/${uuid()}-${file.originalname}`,
    Body: file.buffer,
  };
  
  try {
    const data = await s3.upload(param).promise();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export default s3Uploadv2;