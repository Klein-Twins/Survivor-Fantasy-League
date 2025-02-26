import {
  CreateSeasonFormData,
  CreateSeasonFormErrors,
} from '../admin/CreateSeasonFormData';

function validateCreateSeasonForm(
  values: CreateSeasonFormData
): CreateSeasonFormErrors {
  const errors: CreateSeasonFormErrors = {};

  // Validate season number
  if (!values.seasonNumber) {
    errors.seasonNumber = 'Required';
  } else if (isNaN(values.seasonNumber)) {
    errors.seasonNumber = 'Season number must be a number';
  } else if (values.seasonNumber < 1) {
    errors.seasonNumber = 'Season number must be greater than 0';
  }

  //Validate name
  if (values.seasonName && !/^[a-zA-Z0-9,. \s]*$/.test(values.seasonName)) {
    errors.seasonName = 'Name must be alphanumeric';
  }

  //Validate Date
  if (!values.startDate) {
    errors.startDate = 'Required';
  }
  if (!values.endDate) {
    errors.endDate = 'Required';
  }
  if (
    values.startDate &&
    values.endDate &&
    values.startDate >= values.endDate
  ) {
    errors.startDate = 'Start date must be before end date';
    errors.endDate = 'End date must be after start date';
  }

  //Validate location
  if (!values.location) {
    errors.location = 'Required';
  }
  if (values.location && !/^[a-zA-Z0-9,. \s]*$/.test(values.location)) {
    errors.seasonName = 'Location must be alphanumeric';
  }

  //Validate number of castaways
  if (!values.numberCastaways) {
    errors.numberCastaways = 'Required';
  } else if (isNaN(values.numberCastaways)) {
    errors.numberCastaways = 'Number of castaways must be a number';
  } else if (values.numberCastaways < 1) {
    errors.numberCastaways = 'Number of castaways must be greater than 0';
  }

  //Validate theme:
  if (values.theme && !/^[a-zA-Z0-9,. \s]*$/.test(values.theme)) {
    errors.theme = 'Theme must be alphanumeric';
  }

  return errors;
}

export default validateCreateSeasonForm;
