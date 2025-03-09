import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { AWS_BUCKET_NAME } from '../../config/config';
import { NotFoundError } from '../../utils/errors/errors';
import { s3Client } from '../../config/aws.config';

const s3Service = {
  getProfileImage,
  getLeagueImage,
  getSeasonLogoImage,
  uploadSeasonLogo,
  getEpisodeImage,
};

async function getSeasonLogoImage(seasonId: string) {
  const seasonLogoImageUrl = `images/season/season${seasonId}logo.jpeg`;
  return await getImage(seasonLogoImageUrl);
}

async function uploadSeasonLogo(seasonId: string, file: Express.Multer.File) {
  const command = new PutObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: `images/season/season${seasonId}logo.jpeg`,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);
}

async function getLeagueImage(
  leagueId: string
): Promise<{ buffer: any; contentType?: string }> {
  const leagueImageUrl = `images/league/${leagueId}.jpg`;
  return await getImage(leagueImageUrl);
}

async function getProfileImage(
  profileId: string
): Promise<{ buffer: any; contentType?: string }> {
  const profileImageUrl = `images/profile/${profileId}.jpg`;
  return await getImage(profileImageUrl);
}

async function getImage(
  key: string
): Promise<{ buffer: any; contentType?: string }> {
  try {
    // 1. Request image from S3
    const command = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
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

async function getEpisodeImage(
  episodeId: string
): Promise<{ buffer: any; contentType?: string }> {
  const episodeImageUrl = `images/episode/${episodeId}.jpg`;
  try {
    return await getImage(episodeImageUrl);
  } catch (error) {
    console.error('Error fetching episode image from S3:', error);
    throw error;
  }
}

export default s3Service;
