import React from "react";
import { render, cleanup, waitForElement } from "@testing-library/react";
import Search from "../components/search";
import fetcher from "../utils/fetch";
// import fetchMock from "fetch-mock";
import buildUrl from "../utils/tools";

jest.mock("../utils/fetch", () => ({
  result: [
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
  ],
}));
// jest.mock("fetch");
// jest.mock("buildUrl");

// const fakeAPI = [
//   {
//     id: 0,
//     genre: ["acoustic"],
//     artistName: "Duan and only",
//     address: {
//       street: "124 Seigel Street",
//       suburb: "CBD",
//       postCode: 2487,
//     },
//     price: 30,
//     venue: "Ivanhoe",
//   },
// ];

afterEach(cleanup);

describe("<Search/>", () => {
  it("renders correctly", () => {
    const { container } = render(<Search />);
    expect(container).toMatchSnapshot();
  });
  it("should build URL", () => {
    const url = buildUrl("?genre=house", "http://testUrl/data");
    expect(url).toEqual("http://testUrl/data?genre=house");
  });
  it("should fetch", async () => {
    // const { getByText } = render(<Search />);
    // console.log(container.children);
    // expect(getByText("loading...")).toBeTruthy();
    // await waitForElement(() => expect(getByText("House")).toBeTruthy());
    // fetchMock.mock("http://testUrl/", 200);
    const item = await fetcher("All");

    expect(item.length).toEqual(1);
  });
  // it("should render checkboxes", async () => {
  //   const { getByText } = render(<Search />);
  //   // console.log(container.children);
  //   expect(getByText("loading...")).toBeTruthy();
  //   await waitForElement(() => expect(getByText("House")).toBeTruthy());
  // });
});

// import { queryForm } from '../../../src/services/form';

// jest.mock('../../../src/utils/request', () => ({
//   result: [],
// }));

// describe('formService', () => {
//   it('should query form', () => {
//     const result = queryForm();
//     result.then(data => {
//       expect(data).toMatchSnapshot();
//     });
//   });
// });
