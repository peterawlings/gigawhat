import React from "react";
import { render, cleanup } from "@testing-library/react";
import List from "../components/list";

const defaultProps = {
  list: [
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
    {
      id: 1,
      genre: ["funk"],
      artistName: "Rolf",
      address: {
        street: "961 Plymouth Street",
        suburb: "Manly",
        postCode: 2185,
      },
      price: 10,
      venue: "Ivanhoe",
    },
  ],
};

afterEach(cleanup);

describe("<List/>", () => {
  it("renders correctly", () => {
    const { asFragment } = render(<List {...defaultProps} />);
    expect(asFragment()).toMatchSnapshot();
  });
  it("should show all gig listings", () => {
    const { getByTestId } = render(<List {...defaultProps} />);
    const gigList = getByTestId("gigList-ul");
    expect(gigList.children.length).toBe(2);
  });
});
