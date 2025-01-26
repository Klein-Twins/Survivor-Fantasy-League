import { GetObjectCommand } from '@aws-sdk/client-s3';
import { bucketName, s3Client } from '../../config/aws.config';

export async function getImageFromS3(imagePath: string): Promise<Blob> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: `images/${imagePath}`,
  });

  try {
    const response = await s3Client.send(command);
    if (!response.Body) {
      throw new Error('No image data received');
    }
    return new Blob([await response.Body.transformToByteArray()]);
  } catch (error) {
    console.error('Error fetching image from S3:', error);
    throw error;
  }
}
