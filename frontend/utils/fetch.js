import fetch from "unfetch";

const API_URL = "http://localhost:3004/data";

function buildUrl(path) {
  return `${API_URL}?genre=${path}`;
}

async function fetcher(path) {
  const url = buildUrl(path);
  console.log({ url });
  const res = await fetch(url);
  const json = await res.json();
  console.log({ json });
  return json;
}
export default fetcher;
