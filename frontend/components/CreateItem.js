import React, { Component } from "react";
import gql from "graphql-tag";
import { Mutatation } from "react-apollo";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";

class CreateItem extends Component {
  render() {
    return (
      <Form>
        <fieldset htmlFor="title">
          Title
          <input />
        </fieldset>
      </Form>
    );
  }
}

export default CreateItem;
