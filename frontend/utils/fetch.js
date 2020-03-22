import fetch from "unfetch";

const API_URL = "http://localhost:3004/";

async function fetcher(path) {
  console.log({ API_URL, path });
  const res = await fetch(API_URL + path);
  const json = await res.json();
  console.log({ json });
  return json;
}
export default fetcher;
