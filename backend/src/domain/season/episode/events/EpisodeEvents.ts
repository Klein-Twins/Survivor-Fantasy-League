import { TribalCouncilAttributes } from '../../../../models/season/tribalCouncil/TribalCouncil';
import { Episode } from '../Episode';
import { TribalCouncil } from './TribalCouncil';
import { TribeStart } from './TribeStart';

export class EpisodeEvents {
  private episode: Episode;
  private tribalCouncils: TribalCouncil[];
  private tribeStarts: TribeStart[];
  private tribeSwitch: boolean;

  constructor(episode: Episode) {
    this.tribeSwitch = false;
    this.tribalCouncils = [];
    this.tribeStarts = [];
    this.episode = episode;
  }

  getEpisode(): Episode {
    return this.episode;
  }

  getTribeSwitch(): boolean {
    return this.tribeSwitch;
  }

  setTribeSwitch(tribeSwitch: boolean): void {
    this.tribeSwitch = tribeSwitch;
  }

  getTribesStart(): TribeStart[] {
    return this.tribeStarts;
  }

  addTribeStarts(tribeStarts: TribeStart[]): void {
    tribeStarts.forEach((tribe) => {
      this.addTribeStart(tribe);
    });
  }

  addTribeStart(tribeStart: TribeStart): void {
    const existingTribeStart = this.tribeStarts.find(
      (ts) =>
        ts.getTribe().getAttributes().id ===
          tribeStart.getTribe().getAttributes().id ||
        ts.getTribe().getAttributes().name ===
          tribeStart.getTribe().getAttributes().name
    );
    if (existingTribeStart) {
      throw new Error(
        `Tribe with ID ${tribeStart.getTribe().getAttributes().id} or name ${
          tribeStart.getTribe().getAttributes().name
        } already exists`
      );
    }
    this.tribeStarts.push(tribeStart);
  }

  getTribesStartedOnEpisode() {
    return this.tribeStarts;
  }

  addTribalCouncil(tribalCouncil: TribalCouncil) {
    const existingTribalCouncil = this.tribalCouncils.find(
      (tc) =>
        tc.getAttributes().seq === tribalCouncil.getAttributes().seq ||
        tc.getAttributes().id === tribalCouncil.getAttributes().id
    );
    if (existingTribalCouncil) {
      throw new Error(
        `Tribal Council with sequence ${
          tribalCouncil.getAttributes().seq
        } or ID ${tribalCouncil.getAttributes().id} already exists`
      );
    }
    this.tribalCouncils.push(tribalCouncil);
  }

  getTribalCouncils(): TribalCouncil[] {
    return this.tribalCouncils;
  }

  getTribalCouncilBySequence(
    seq: TribalCouncilAttributes['seq']
  ): TribalCouncil {
    const foundTribalCouncil: TribalCouncil | undefined =
      this.tribalCouncils.find(
        (tribalCouncil) => tribalCouncil.getAttributes().seq === seq
      );
    if (!foundTribalCouncil) {
      throw new Error(`Tribal Council with sequence ${seq} not found`);
    }
    return foundTribalCouncil;
  }
}
