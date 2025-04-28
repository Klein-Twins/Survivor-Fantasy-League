import { UUID } from 'crypto';
import { Survey } from './Survey';
import { Episode } from '../season/episode/Episode';
import { SurveyAvailabilityStatus } from '../../generated-api';

export class EpisodeSurvey extends Survey {
  protected episode: Episode;
  private closeDate: Date;
  private openDate: Date;
  private surveyAvailablilityStatus: SurveyAvailabilityStatus;

  constructor(surveyDefinitionId: UUID, episode: Episode) {
    super(surveyDefinitionId);
    this.episode = episode;

    this.closeDate = new Date(episode.getAttributes().airDate);
    this.openDate = new Date(this.closeDate.getDate() - 7);

    const currentDate = new Date();
    this.surveyAvailablilityStatus =
      currentDate > this.openDate && currentDate < this.closeDate
        ? SurveyAvailabilityStatus.Available
        : currentDate < this.openDate
        ? SurveyAvailabilityStatus.NotOpenYet
        : SurveyAvailabilityStatus.Closed;
  }

  getEpisode(): Episode {
    return this.episode;
  }

  getCloseDate(): Date {
    return this.closeDate;
  }
  getOpenDate(): Date {
    return this.openDate;
  }
  getSurveyAvailabilityStatus(): SurveyAvailabilityStatus {
    return this.surveyAvailablilityStatus;
  }
}
