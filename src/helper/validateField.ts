import validation from 'validate.js';
import { validationDictionary } from '../constants/validationDictionary';

export const validateField = (fieldName: string, value: any) => {
  const formValues: { [key: string]: any } = {};
  formValues[fieldName] = value;

  const formFields: { [key: string]: any } = {};

  formFields[fieldName] = validationDictionary[fieldName];

  const result = validation(formValues, formFields);
  if (result) {
    return result[fieldName][0];
  }
  return null;
};
