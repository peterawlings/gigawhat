import fetch from "unfetch";

const API_URL = "http://localhost:3004/data";

async function fetcher(path) {
  const res = await fetch(API_URL + path);
  const json = await res.json();
  return json;
}
export default fetcher;
