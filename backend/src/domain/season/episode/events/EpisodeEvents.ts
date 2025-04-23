import { TribalCouncilAttributes } from '../../../../models/season/tribalCouncil/TribalCouncil';
import { TribalCouncil } from './TribalCouncil';
import { TribeStart } from './TribeStart';

export class EpisodeEvents {
  private tribalCouncils: TribalCouncil[];
  private tribeStarts: TribeStart[];

  constructor() {
    this.tribalCouncils = [];
    this.tribeStarts = [];
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
