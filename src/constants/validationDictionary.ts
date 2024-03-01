import moment from 'moment';
import validation from 'validate.js';

validation.extend(validation.validators.datetime, {
  // The value is guaranteed not to be null or undefined but otherwise it
  // could be anything.
  parse: function (value: Date) {
    return moment.utc(value, 'MM/DD/YYYY');
  },
  // Input is a unix timestamp
  format: function (value: Date, options: any) {
    const format = options.dateOnly ? 'MM/DD/YYYY' : 'MM/DD/YYYY hh:mm:ss';
    return moment.utc(value).format(format);
  },
});

export const validationDictionary: { [key: string]: any } = {
  generic: {
    presence: {
      allowEmpty: false,
      message: '^This Field is required',
    },
    length: {
      minimum: 1,
      maximum: 100,
      message: '^must be at least 1 characters and 100 characters maximum',
    },
    format: {
      pattern: /^[a-zA-Z0-9 )ñÑ.-/]*$/,
      message: '^Field has invalid character/s',
    },
  },
  generic_allowEmpty: {
    presence: {
      allowEmpty: true,
    },
    format: {
      pattern: /^[a-zA-Z0-9_&-,.ñÑ ]*$/,
      message: '^Field has invalid character/s',
    },
  },
};
