import { NextFunction, Request, Response } from 'express';
import s3Service from '../../services/image/s3Service';

async function getLeagueImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const leagueId = req.params.leagueId;
    const { buffer, contentType } = await s3Service.getLeagueImage(leagueId);
    setResHeaders(res, contentType);
    res.send(buffer);
    return;
  } catch (error) {
    console.error('Error fetching league image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}

async function getProfileImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const profileId = req.params.profileId;
    const { buffer, contentType } = await s3Service.getProfileImage(profileId);

    setResHeaders(res, contentType);
    res.send(buffer);
    return;
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}

function setResHeaders(res: Response, contentType?: string): void {
  res.setHeader('Content-Type', contentType || 'image/jpeg');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.setHeader('Accept-Ranges', 'bytes');
}

const ProfileImageController = {
  getProfileImage,
  getLeagueImage,
};

export default ProfileImageController;
