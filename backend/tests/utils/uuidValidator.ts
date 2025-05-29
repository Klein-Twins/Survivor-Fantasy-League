import validator from 'validator';

export function expectUUID(uuid: string): void {
  if (!validator.isUUID(uuid)) {
    throw new Error(`Expected a valid UUID, but received: ${uuid}`);
  }
}
