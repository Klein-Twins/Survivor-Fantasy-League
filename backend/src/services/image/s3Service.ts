import { GetObjectCommand } from '@aws-sdk/client-s3';
import { AWS_BUCKET_NAME } from '../../config/config';
import { NotFoundError } from '../../utils/errors/errors';
import { s3Client } from '../../config/aws.config';

const s3Service = {
  getProfileImage,
};

async function getProfileImage(
  profileId: string
): Promise<{ buffer: any; contentType?: string }> {
  try {
    // 1. Request image from S3
    const command = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: `images/profileImages/${profileId}.jpg`,
    });

    // 2. Get stream of data
    const response = await s3Client.send(command);
    if (!response.Body) {
      throw new NotFoundError('Image not found');
    }

    // 3. Collect chunks of binary data
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }

    // 4. Combine chunks into single Buffer
    const buffer = Buffer.concat(chunks);
    return { buffer, contentType: response.ContentType };
  } catch (error) {
    console.error('Error fetching profile image from S3:', error);
    throw error;
  }
}

export default s3Service;
