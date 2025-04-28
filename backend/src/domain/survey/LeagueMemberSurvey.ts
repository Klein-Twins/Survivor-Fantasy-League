import { UUID } from 'crypto';
import { LeagueSurvey } from './LeagueSurvey';
import { Episode } from '../season/episode/Episode';

export class LeagueMemberSurvey extends LeagueSurvey {
  protected leagueProfileId: UUID;

  constructor(
    surveyDefinitionId: UUID,
    episode: Episode,
    leagueId: UUID,
    leagueProfileId: UUID
  ) {
    super(surveyDefinitionId, episode, leagueId);
    this.leagueProfileId = leagueProfileId;
  }
}
