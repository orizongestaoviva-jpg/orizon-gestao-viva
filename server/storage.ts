import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ENV } from "./_core/env";

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: ENV.awsAccessKeyId,
    secretAccessKey: ENV.awsSecretAccessKey,
  },
});

export async function storagePut(
  key: string,
  data: Buffer | Uint8Array | string,
  contentType?: string
): Promise<{ url: string; key: string }> {
  const command = new PutObjectCommand({
    Bucket: ENV.s3Bucket,
    Key: key,
    Body: data,
    ContentType: contentType || "application/octet-stream",
  });

  await s3Client.send(command);

  const url = `https://${ENV.s3Bucket}.s3.amazonaws.com/${key}`;
  return { url, key };
}

export async function storageGet(
  key: string,
  expiresIn?: number
): Promise<{ url: string; key: string }> {
  const command = new GetObjectCommand({
    Bucket: ENV.s3Bucket,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: expiresIn || 3600,
  });

  return { url, key };
}
