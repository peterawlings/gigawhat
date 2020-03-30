import fetch from "unfetch";

const API_URL = "http://localhost:3004/data";

function buildUrl(path) {
  return path === "All" ? API_URL : API_URL + path;
}

async function fetcher(path) {
  // console.log({ url });
  const url = buildUrl(path);
  console.log({ url });
  const res = await fetch(url);
  const json = await res.json();
  console.log({ json });
  return json;
}
export default fetcher;
