import { validate } from 'uuid';
import {
  BadRequestError,
  NotImplementedError,
} from '../../utils/errors/errors';
import { Profile } from '../../generated-api';

const profileHelper = {
  validateName,
  validateProfileId,
  validateProfileIds,
  getProfileNameForMessage,
  buildProfile,
};

async function buildProfile() {
  //TODO: Change profile and user tables
  throw new NotImplementedError('buildProfie not implemented');
}

function getProfileNameForMessage(profile: Profile): string {
  if (profile.firstName && profile.lastName) {
    return `${profile.firstName} ${profile.lastName}`;
  }

  if (profile.firstName) {
    return profile.firstName;
  }

  return profile.userName;
}

function validateName(name: string): void {
  //   if (!name || name.length === 0) {
  //     throw new BadRequestError('Missing name');
  //   }
  if (!isValidName(name)) {
    throw new BadRequestError('Invalid name');
  }
}

/**
 * Validates a name string. The name should contain only letters (both uppercase and lowercase),
 * accented characters, and spaces in between words.
 *
 * @param name - The name string to validate.
 * @returns True if the name is valid, otherwise false.
 */
export function isValidName(name: string): boolean {
  // Regex to check if the name contains only letters (both upper and lower case), accented characters, and spaces in between words.
  const regex = /^(?!.*\s\s)[A-Za-zÀ-ÿ]+(?: [A-Za-zÀ-ÿ]+)*$/;
  return regex.test(name);
}

async function validateProfileId(profileId: string): Promise<void> {
  if (!profileId || profileId.length === 0) {
    throw new BadRequestError('Missing profileId');
  }
  if (!validate(profileId)) {
    throw new BadRequestError('Invalid profileId');
  }
}

async function validateProfileIds(profileIds: string[]): Promise<void> {
  if (profileIds.length === 0) {
    throw new BadRequestError('Missing profileId');
  }
  for (const profileId of profileIds) {
    await validateProfileId(profileId);
  }
}

export default profileHelper;
