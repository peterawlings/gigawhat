import fetch from "unfetch";
import buildUrl from "./tools";

const API_URL = "http://localhost:3004/data";
type Path = string;

async function fetcher(path: Path) {
  // console.log({ url });
  const url = buildUrl(path, API_URL);
  console.log({ url, path });
  const res = await fetch(url);
  console.log({ res });
  const json = await res.json();
  console.log({ json });
  return json;
}
export default fetcher;
