export interface TribeFormData {
  name: string;
  color: string;
  episodeStarted: number;
  isMergeTribe: boolean;
}

export const validateTribeFormData = (
  data: TribeFormData
): Partial<Record<keyof TribeFormData, string>> => {
  const errors: Partial<Record<keyof TribeFormData, string>> = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  }
  if (!isAlpha(data.name)) {
    errors.name = 'Name must be alpha only';
  }

  if (!data.color || data.color.trim() === '') {
    errors.color = 'Color is required';
  }
  if (!isHexColor(data.color)) {
    errors.color = 'Color must be alpha only';
  }

  if (!data.episodeStarted) {
    errors.episodeStarted = 'Episode started is required';
  } else if (isNaN(data.episodeStarted)) {
    errors.episodeStarted = 'Episode started must be a number';
  } else if (data.episodeStarted < 1) {
    errors.episodeStarted = 'Episode started must be greater than 0';
  }

  return errors;
};

const isHexColor = (color: string): boolean => {
  const regex = /^#[0-9A-F]{6}$/i;
  return regex.test(color);
};

const isAlpha = (description: string): boolean => {
  const regex = /^[a-zA-Z]*$/;
  return regex.test(description);
};
