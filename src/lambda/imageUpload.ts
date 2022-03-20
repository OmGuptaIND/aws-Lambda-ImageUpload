import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { apiResponse } from '../utils/apiResponse';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { accessTokenSchemaType, imageMimeSchema, imageUploadSchema } from '../utils/validators';
import { getKey } from '../utils/apiKey';
import { verify } from 'jsonwebtoken';
import { base64MimeType } from '../utils/getMimeType';

const client = new S3Client({ region: process.env['AWS_REGION'] as string });

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { body } = event;
    if (!body) {
      return apiResponse(400, 'Body is required');
    }
    const values = JSON.parse(body);
    const data = imageUploadSchema.safeParse(values);
    if (!data.success) {
      return apiResponse(400, data.error);
    }
    const { file, accessToken, fileName, type } = data.data;

    if (!file) return apiResponse(400, 'File is required');

    //Valid Image Type
    const mimeType = base64MimeType(file);
    const mimeData = imageMimeSchema.safeParse({ mimeType });
    if (!mimeData.success) {
      return apiResponse(400, mimeData.error);
    }

    //Check Valid User Token
    const key = await getKey();
    const decoded = verify(accessToken, key, { algorithms: ['RS256'] });
    const { address } = decoded as accessTokenSchemaType;

    //Check File Size
    const sanitisedFile = file.replace(/^data:image\/\w+;base64,/, '');
    const decodedFile = Buffer.from(sanitisedFile, 'base64');
    const sizeInBytes = 4 * Math.ceil(sanitisedFile.length / 3) * 0.5624896334383812;
    const sizeInMb = +(sizeInBytes / (1000 * 1024)).toFixed(4);

    if (type === 'profile' && sizeInMb > 2) {
      return apiResponse(400, 'Profile image size should be less than 2MB');
    }

    if (type === 'banner' && sizeInMb > 5) {
      return apiResponse(400, 'Banner image size should be less than 5MB');
    }

    //Upload to s3
    const date = new Date().toISOString();
    const params = {
      Bucket: process.env['FILE_UPLOAD_BUCKET_NAME'],
      Key: `${address}-${fileName}-${date}.${mimeType?.split('/')[1]}`,
      Body: decodedFile,
    };

    const command = new PutObjectCommand(params);
    await client.send(command);

    const hrefLink = `https://${command.input.Bucket}.s3.ap-south-1.amazonaws.com/${command.input.Key}`;
    return apiResponse(200, {
      hrefLink,
      message: 'Image Uploaded Successfully',
    });
  } catch (err) {
    console.log(err);
    return apiResponse(401, err);
  }
};
