import { UUID } from 'crypto';
import { EpisodeSurvey } from './EpisodeSurvey';
import { Episode } from '../season/episode/Episode';

export class LeagueSurvey extends EpisodeSurvey {
  protected leagueId: UUID;

  constructor(surveyDefinitionId: UUID, episode: Episode, leagueId: UUID) {
    super(surveyDefinitionId, episode);
    this.leagueId = leagueId;
  }
}
