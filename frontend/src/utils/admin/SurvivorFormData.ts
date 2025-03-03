export interface SurvivorFormData {
  firstName: string;
  lastName: string;
  fromCity?: string | null;
  fromState: string;
  fromCountry: string;
  nickName?: string | null;
  age: number;
  description: string;
  job: string;
  image: File | null;
}

const isAlphaNumeric = (description: string): boolean => {
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(description);
};

const isAlphaNumericAndBasicPunctuation = (description: string): boolean => {
  const regex = /^[a-zA-Z0-9,. ]*$/;
  return regex.test(description);
};

const isAlpha = (description: string): boolean => {
  const regex = /^[a-zA-Z]*$/;
  return regex.test(description);
};

export const validateSurvivorFormData = (
  data: SurvivorFormData
): Partial<Record<keyof SurvivorFormData, string>> => {
  const errors: Partial<Record<keyof SurvivorFormData, string>> = {};

  if (!data.firstName) {
    errors.firstName = 'First name is required';
  } else if (!isAlpha(data.firstName)) {
    errors.firstName = 'First name must be alpha only';
  }

  if (!data.lastName) {
    errors.lastName = 'Last name is required';
  } else if (!isAlpha(data.lastName)) {
    errors.lastName = 'Last name must be alpha only';
  }

  if (!data.fromState) {
    errors.fromState = 'State is required';
  } else if (!isAlphaNumericAndBasicPunctuation(data.fromState)) {
    errors.fromState = 'State must be alphanumeric and punctuation only';
  }

  if (!data.fromCountry) {
    errors.fromCountry = 'Country is required';
  } else if (!isAlpha(data.fromCountry)) {
    errors.fromCountry = 'Country must be alpha only';
  }

  if (!data.age) {
    errors.age = 'Age is required';
  } else if (isNaN(data.age)) {
    errors.age = 'Age must be a number';
  } else if (data.age < 1) {
    errors.age = 'Age must be greater than 0';
  }

  if (!data.description) {
    errors.description = 'Description is required';
  } else if (!isAlphaNumericAndBasicPunctuation(data.description)) {
    errors.description =
      'Description must be alphanumeric and punctuation only';
  }

  if (!data.job) {
    errors.job = 'Job is required';
  } else if (!isAlphaNumericAndBasicPunctuation(data.job)) {
    errors.job = 'Job must be alphanumeric and punctuation only';
  }

  if (!data.image) {
    errors.image = 'Image is required';
  }

  return errors;
};
