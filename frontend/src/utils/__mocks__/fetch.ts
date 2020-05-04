import fetch from "unfetch";
import buildUrl from "../tools";

const API_URL = "http://testUrl/data";

const fakeAPI = [
  {
    id: 0,
    genre: ["acoustic"],
    artistName: "Duan and only",
    address: {
      street: "124 Seigel Street",
      suburb: "CBD",
      postCode: 2487,
    },
    price: 30,
    venue: "Ivanhoe",
  },
];

type Path = string;

async function fetcher(path: Path) {
  const url = buildUrl(path, API_URL);
  const res = await fetch(url);
  const json = await res.json();
  return [
    {
      id: 0,
      genre: ["acoustic"],
      artistName: "Duan and only",
      address: {
        street: "124 Seigel Street",
        suburb: "CBD",
        postCode: 2487,
      },
      price: 30,
      venue: "Ivanhoe",
    },
  ];
}
export default fetcher;
