import { Tribe } from '../../generated-api';
import { TribeAttributes } from '../../models/season/Tribes';

const tribeHelper = {
  buildTribe,
};

function buildTribe(tribeAttributes: TribeAttributes): Tribe {
  return {
    id: tribeAttributes.id,
    name: tribeAttributes.name,
    color: tribeAttributes.tribeColor,
    //TODO: Add tribe image
    imageUrl: /* tribeAttributes?.imageUrl || */ '',
  };
}

export default tribeHelper;
