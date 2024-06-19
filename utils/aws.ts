import process from "process";

import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { Hash } from "@smithy/hash-node";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { parseUrl } from "@smithy/url-parser";
import { formatUrl } from "@aws-sdk/util-format-url";
import { AWSPrefix } from "src/schema/file";

export const clientParams = {
  region: process.env.AWS_REGION_NAME,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
  },
};

export const s3client = new S3Client(clientParams);

export const presignS3Url = async (imageUrl) => {
  const s3ObjectUrl = parseUrl(imageUrl);

  const presigner = new S3RequestPresigner({
    ...clientParams,
    sha256: Hash.bind(null, "sha256"),
  });

  const url = await presigner.presign(new HttpRequest(s3ObjectUrl));
  return formatUrl(url);
};

export const deleteS3Objects = async (
  prefix: AWSPrefix,
  fileNames: String[]
) => {
  const Objects = fileNames.map((fileName) => {
    return {
      Key: prefix + fileName,
    };
  });
  return await s3client.send(
    new DeleteObjectsCommand({
      Bucket: process.env.AWS_BUCKET,
      Delete: {
        Objects,
      },
    })
  );
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};
