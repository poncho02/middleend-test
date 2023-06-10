const axios = require("axios");

const TIMEOUT_MS = 2500;
const MAX_RETRIES = 3;

const disallowedRetryCodes = [401, 404, 400, 429, 403];

const retry = (error) => {
  let retry = true;
  let statusCode = error?.response.status;

  if (disallowedRetryCodes.includes(statusCode)) {
    retry = false;
  }

  return retry;
};

const getMessage = (error) => {
  return (
    error?.response?.data?.error ||
    error?.response?.message ||
    error?.response?.name ||
    error?.response?.data ||
    error?.message ||
    error?.name ||
    undefined
  );
};

const axiosData = async (url) => {
  const instance = axios.create({ timeout: TIMEOUT_MS });
  let retries = 0;

  const failResponse = {
    status: 500,
    message: "Internal Server Error",
  };

  while (retries < MAX_RETRIES) {
    try {
      return await instance.request(url);
    } catch (error) {
      if (!retry(error)) {
        // The request should no longer be retried
        const message = error?.response?.data?.message || undefined;
        return {
          status: error?.response?.status,
          message: message || getMessage(error) || failResponse.message,
        };
      }

      failResponse.status = error?.response?.status || failResponse.status;
      failResponse.message = getMessage(error) || failResponse.message;

      retries++;
    }
  }

  return failResponse;
};

module.exports = {
  axiosData,
};
