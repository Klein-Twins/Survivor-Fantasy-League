import { validate } from 'uuid';
import { BadRequestError } from '../../utils/errors/errors';

const userHelper = {
  validateEmail,
  validateUserName,
  validateUserNameAndExists,
  validateUserId,
};

async function validateEmail(email: string): Promise<void> {
  if (!email || email.length === 0) {
    throw new BadRequestError('Missing email');
  }
  if (!isValidEmail(email)) {
    throw new BadRequestError('Invalid email');
  }
}
function validateUserNameAndExists(username: string): void {
  if (!username || username.length === 0) {
    throw new BadRequestError('Missing username');
  }
  if (!validateUserName(username)) {
    throw new BadRequestError('Invalid username');
  }
}
async function validateUserId(userId: string): Promise<void> {
  if (!userId || userId.length === 0) {
    throw new BadRequestError('Missing userId');
  }
  if (!validate(userId)) {
    throw new BadRequestError('Invalid userId');
  }
}

export function validateUserName(username: string): boolean {
  // Regex matches only letters (uppercase and lowercase) and numbers
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(username);
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) return false;

  const [localPart, domain] = email.split('@');

  if (email.split('@').length !== 2) {
    return false; // Extra '@' detected
  }

  if (/[^a-zA-Z0-9._%+-]/.test(localPart)) {
    return false;
  }

  if (
    localPart.startsWith('.') ||
    domain.startsWith('.') ||
    localPart.endsWith('.') ||
    domain.endsWith('.') ||
    localPart.includes('..') ||
    domain.includes('..')
  ) {
    return false; // Invalid dot placement
  }

  if (/[^a-zA-Z0-9.-]/.test(domain)) {
    return false; // Underscore or invalid characters found in domain
  }

  // Ensure the domain does not start or end with a hyphen
  if (domain.startsWith('-') || domain.endsWith('-')) {
    return false; // Hyphen at the start or end of domain
  }

  const domainParts = domain.split('.');
  for (let part of domainParts) {
    if (part.startsWith('-') || part.endsWith('-')) {
      return false; // Hyphen at the start or end of domain part
    }
  }

  return true;
};
export default userHelper;
