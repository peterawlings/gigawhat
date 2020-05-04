import React, { Component } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import Form from "./styles/Form";
import Router from "next/router";
import Error from "./ErrorMessage";
import formatMoney from "../lib/formatMoney";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: "",
    description: "",
    image: "",
    largeImg: "",
    price: 0
  };

  handleChange = e => {
    const { name, value, type } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  uploadfile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]); // We need to append data for cloudinary
    data.append("upload_preset", "sickfits"); // This needs to be the name of the upload preset added in cloudinary

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/prawlings/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const file = await res.json();
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };
  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const res = await createItem();
              Router.push({
                pathname: "/item",
                query: { id: res.data.createItem.id }
              });
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  name="file"
                  id="file"
                  placeholder="Upload an Image"
                  required
                  onChange={this.uploadfile}
                />
              </label>
              {this.state.image && (
                <img src={this.state.image} alt="Upload Preview" />
              )}
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="title"
                  required
                  value={this.state.title}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="Price">
                Price
                <input
                  type="number"
                  name="price"
                  id="Price"
                  placeholder="Price"
                  required
                  value={this.state.price}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  name="description"
                  id="description"
                  placeholder="description"
                  required
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
