export default function buildUrl(path: any, url: any): string {
  return path === "All" ? url : url + path;
}
