const axios = require("axios");

const axiosData = async (url) => {
  try {
    const response = await axios(url);
    return response;
  } catch (error) {
    return {
      status: error?.response?.status || 500,
      message:
        error?.response?.data?.message ||
        error?.response?.statusText ||
        "Error",
    };
  }
};

module.exports = {
  axiosData,
};
