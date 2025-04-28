import { NextFunction, Request, Response } from 'express';
import imageService from '../../servicesBackup/image/imageService';

async function getLeagueImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const leagueId = req.params.leagueId;
    const { buffer, contentType } = await imageService.getLeagueImage(leagueId);
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
    const { buffer, contentType } = await imageService.getProfileImage(
      profileId
    );

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

async function getSeasonLogoImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const seasonId = req.params.seasonId;
    const { buffer, contentType } = await imageService.getSeasonLogoImage(
      seasonId
    );
    setResHeaders(res, contentType);
    res.send(buffer);
    return;
  } catch (error) {
    console.error('Error fetching season logo image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}

async function getEpisodeImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const episodeId = req.params.episodeId;
    const { buffer, contentType } = await imageService.getEpisodeImage(
      episodeId
    );
    setResHeaders(res, contentType);
    res.send(buffer);
    return;
  } catch (error) {
    console.error('Error fetching episode image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}

async function getSurvivorImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { seasonId, survivorId } = req.params;
    const { buffer, contentType } = await imageService.getSurvivorImage(
      seasonId,
      survivorId
    );
    setResHeaders(res, contentType);
    res.send(buffer);
    return;
  } catch (error) {
    console.error('Error fetching survivor image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}

const ProfileImageController = {
  getProfileImage,
  getLeagueImage,
  getSeasonLogoImage,
  getEpisodeImage,
  getSurvivorImage,
};

export default ProfileImageController;
