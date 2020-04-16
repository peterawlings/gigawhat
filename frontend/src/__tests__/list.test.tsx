import React from "react";
import renderer from "react-test-renderer";
import { render, fireEvent, waitForElement } from "@testing-library/react";
import List from "../components/list";

const defaultProps = {
  list: [],
};

describe("<List/>", () => {
  it("renders correctly", () => {
    const tree = render(<List {...defaultProps} />);
    expect(tree).toMatchSnapshot();
  });
});
