import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { AWS_BUCKET_NAME } from '../../config/config';
import { CustomError, NotFoundError } from '../../utils/errors/errors';
import { s3Client } from '../../config/aws.config';

const imageService = {
  getProfileImage,
  getLeagueImage,
  getSeasonLogoImage,
  uploadSeasonLogo,
  getEpisodeImage,
  getSurvivorImage,
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

async function getSurvivorImage(
  seasonId: string,
  survivorId: string
): Promise<{ buffer: any; contentType?: string }> {
  const survivorImageUrl = `images/survivors/${seasonId}/${survivorId}.jpeg`;
  return await getImage(survivorImageUrl);
}

async function getImage(
  key: string,
  formats: string[] = ['jpeg', 'webp', 'png', 'jpg']
): Promise<{ buffer: any; contentType?: string }> {
  let lastError: Error | null = null;

  for (const format of formats) {
    try {
      const formattedKey = key.replace(/\.\w+$/, `.${format}`); // Replace the extension dynamically
      const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: formattedKey,
      });

      // Request the image from S3
      const response = await s3Client.send(command);
      if (!response.Body) {
        throw new NotFoundError('Image not found');
      }

      // Collect chunks of binary data
      const chunks: Uint8Array[] = [];
      for await (const chunk of response.Body as any) {
        chunks.push(chunk);
      }

      // Combine chunks into a single Buffer
      const buffer = Buffer.concat(chunks);
      return { buffer, contentType: response.ContentType };
    } catch (error) {
      // Log the error and continue to the next format
      console.warn(`Image not found for format ${format}:`, error);
      lastError = error as Error; // Store the last error
    }
  }

  // If no formats are found, throw a NotFoundError
  throw new NotFoundError('Image not found in any supported format');
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

export default imageService;
