import { GetObjectCommand } from '@aws-sdk/client-s3';
import { NextFunction, Request, Response } from 'express';
import { AWS_BUCKET_NAME } from '../../config/config';
import { s3Client } from '../../config/aws.config';
import s3Service from '../../servicesAndHelpers/s3Service';
import logger from '../../config/logger';

async function getProfileImage(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logger.debug('Fetching image for profileId:', req.params.profileId);
    const profileId = req.params.profileId;
    console.debug('Fetching image for profileId:', profileId);

    const { buffer, contentType } = await s3Service.getProfileImage(profileId);
    console.debug('Image fetched, content type:', contentType);
    console.debug('Buffer length:', buffer.length);

    res.setHeader('Content-Type', contentType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Accept-Ranges', 'bytes');
    res.send(buffer);
    return;

    //res.status(200);
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}

const ProfileImageController = {
  getProfileImage,
};

export default ProfileImageController;
