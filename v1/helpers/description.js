const processDescription = (apiResponse) => {
  let description = "";
  if (
    apiResponse?.status === "rejected" ||
    apiResponse?.value?.status !== 200
  ) {
    return description;
  }
  return apiResponse?.value?.data?.plain_text || description;
};

module.exports = {
  processDescription,
};
