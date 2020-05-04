import ItemComponent from "../components/Item";
import { shallow } from "enzyme";
import PriceTag from "../components/styles/PriceTag";

const fakeItem = {
  id: "abc123",
  title: "a cool item",
  price: 5000,
  description: "this item is cool",
  image: "dog.jpg",
  largeImage: "largedog.jpg"
};

describe("<Item/>", () => {
  it("redners the images correctly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const img = wrapper.find("img");
    expect(img.props().src).toBe(fakeItem.image);
    expect(img.props().alt).toBe(fakeItem.title);
  });
  it("renders and displays properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    // console.log(wrapper.debug()); // Prints out the HTML that is found
    const priceTag = wrapper.find("PriceTag");
    // console.log(priceTag.dive().text()); // .dive will shallow render one level deeper. Useful if you don't want to mount the entire component
    // console.log(priceTag.children().text()); // .children also works, will give you the text node
    expect(priceTag.children().text()).toBe("$50");
    expect(wrapper.find("Title a").text()).toBe(fakeItem.title);
  });
  it("renders out the button correctly", () => {
    console.log();
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    console.log(wrapper);
    const buttonList = wrapper.find(".buttonList");
    expect(buttonList).toHaveLength(4);
    console.log(buttonList.children());
  });
});
