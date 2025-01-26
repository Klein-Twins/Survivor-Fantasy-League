import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, bucketName } from '../../config/aws.config';

export async function getImageFromS3(imagePath: string): Promise<Blob> {
  console.log('getImageFromS3 imagePath:', imagePath);
  console.log('getImageFromS3 bucketName:', bucketName);
  console.log('getImageFromS3 s3Client:', s3Client);

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
