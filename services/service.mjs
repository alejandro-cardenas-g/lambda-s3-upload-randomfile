import { v4 } from "uuid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Blob } from "buffer";
import { data } from "../data/data.mjs";

const s3Client = new S3Client({
  region: process.env.BUCKET_REGION,
});

export class Service {
  constructor() {}

  getData() {
    return { data, versionId: v4() };
  }

  async createBlob(inputData) {
    const jsonBlob = new Blob([JSON.stringify(inputData)], {
      type: "application/json",
    });

    const jsonBlobArrayBuffer = await jsonBlob.arrayBuffer();
    const jsonBuffer = Buffer.from(jsonBlobArrayBuffer);

    const blobName = `${inputData.versionId}.json`;
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: blobName,
      Body: jsonBuffer,
      ContentType: jsonBlob.type,
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      return { success: true, pathname: blobName };
    } catch (error) {
      console.error(error);
      return { success: false, pathname: null };
    }
  }
}

export const service = new Service();
