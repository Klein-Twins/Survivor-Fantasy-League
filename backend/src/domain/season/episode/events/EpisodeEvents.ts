import { TribalCouncilAttributes } from '../../../../models/season/tribalCouncil/TribalCouncil';
import { TribalCouncil } from './TribalCouncil';

export class EpisodeEvents {
  private tribalCouncils: TribalCouncil[];

  constructor() {
    this.tribalCouncils = [];
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
