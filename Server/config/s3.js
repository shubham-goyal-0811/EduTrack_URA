import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import dotenv  from "dotenv"
dotenv.config()

// type UploadToS3Bucket = {
//   fileContent: Buffer; // The file content as a Buffer
//   mimetype: string; // The MIME type of the file, e.g., 'image/jpeg'
//   filename: string; // The name of the file to be saved in the S3 bucket
// };
const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_REGION,
  AWS_S3_BUCKET_NAME,
} = process.env;

const s3Client = new S3Client({
  region: AWS_BUCKET_REGION || "us-east-1",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || "",
    secretAccessKey: AWS_SECRET_ACCESS_KEY || "",
  },
});

const UploadToS3Bucket = async ({
  filename,
  fileContent,
  mimetype,
}) => {
  const params = {
    Bucket: AWS_S3_BUCKET_NAME,
    Key: filename, // File name in S3
    Body: fileContent,
    ContentType: mimetype,
  };
  return s3Client.send(new PutObjectCommand(params));
};

export { UploadToS3Bucket, s3Client };