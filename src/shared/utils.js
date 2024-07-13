const _get = require('lodash/get');
const Sentry = require('@sentry/node');

const errorCatch = (error, res) => {
  Sentry.captureException(error);
  if (error && error.message) {
    console.error(error.response ? error.response : error);
    return res.status(error.response ? error.response.status : 500)
      .json({
        message:
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : error.message,
        tips: {
          url: _get(error, 'config.url', ''),
          method: _get(error, 'config.method', ''),
        },
      });
  }
  console.error(error);
  return res.status(500).json({
    message: 'Server Error',
  });
};

const strongPasswordOptions = {
  minLength: 6,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 0,
  returnScore: false,
  pointsPerUnique: 0,
  pointsPerRepeat: 0,
  pointsForContainingLower: 0,
  pointsForContainingUpper: 0,
  pointsForContainingNumber: 0,
  pointsForContainingSymbol: 0,
};

const formatDate = (date) => {
  const newDate = new Date(date);
  const dateForm = `${newDate.getDate() <= 9
    ? `0${newDate.getDate()}` : newDate.getDate()}/${newDate.getMonth() + 1 <= 9
    ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1}/${newDate.getFullYear()}`;
  return dateForm;
};

const formatTime = (date) => {
  const newDate = new Date(date);
  const dateForm = `${newDate.getHours() <= 9
    ? `0${newDate.getHours()}` : newDate.getHours()}h${newDate.getMinutes() <= 9 ? `0${newDate.getMinutes()}` : newDate.getMinutes()}`;
  return dateForm;
};

const formatDateTime = (date) => {
  const newDate = new Date(date);
  const dateForm = `${newDate.getDate() <= 9
    ? `0${newDate.getDate()}` : newDate.getDate()}/${newDate.getMonth() + 1 <= 9
    ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1}/${newDate.getFullYear()} à ${newDate.getHours() <= 9
    ? `0${newDate.getHours()}` : newDate.getHours()}h${newDate.getMinutes() <= 9 ? `0${newDate.getMinutes()}` : newDate.getMinutes()}`;
  return dateForm;
};

const dateRangeOverlaps = (start1, end1, start2, end2) => (start1 < end2) && (start2 < end1);

const validEmail = (email) => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

module.exports = {
  errorCatch, strongPasswordOptions, formatDate, formatTime, formatDateTime, dateRangeOverlaps, validEmail,
};
