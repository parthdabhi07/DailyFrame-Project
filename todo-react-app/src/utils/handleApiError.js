
// example - don't use
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.message || "Something went wrong!";
  } else if (error.request) {
    return "No response from server. Please try again.";
  } else {
    return "Request failed. Please check your connection.";
  }
};
