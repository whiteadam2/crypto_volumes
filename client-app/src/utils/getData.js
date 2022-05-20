const axios = require("axios").default;

export async function getData() {
  try {
    const response = await axios.get("http://localhost:4000/");
    return response;
  } catch (error) {
    console.error(error);
  }
}
