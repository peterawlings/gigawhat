import React, { Component } from "react";
import gql from "graphql-tag";
import { Mutation, Query } from "react-apollo";
import Form from "./styles/Form";
import Router from "next/router";
import Error from "./ErrorMessage";
import formatMoney from "../lib/formatMoney";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

/**
 * UPDATE_ITEM_MUTATION takes in title, description, price, created the item and returns 'id, title, description, price'
 * In this case, the Mutation component sends 'this.state' as an object via 'variables' to 'UPDATE_ITEM_MUTATION'
 * Call 'updateItem' specified in 'schema.graphql' on backend
 * Call UPDATE_ITEM_MUTATION with those five args, then run 'updateItem' with those args
 * */
const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = e => {
    const { name, value, type } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };
  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
  };

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) return <p>...Loading</p>;
          // Handles case for ID not existing that is passed into URL
          if (!data.item) return <p>No item for {this.props.id}</p>;
          return (
            // This Mutation component exposes the 'UPDATE_ITEM_MUTATION'
            // the varibles are sent to the 'UPDATE_ITEM_MUTATION' query
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this.updateItem(e, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="title"
                        required
                        defaultValue={data.item.title} // Allows to set a default value not from state then update on change
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
                        defaultValue={data.item.price}
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
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit">Save Changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
