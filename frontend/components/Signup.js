import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String!
    $email: String!
    $password: String!
  ) {
    signup(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

class Signup extends Component {
  state = {
    name: "",
    email: "",
    password: ""
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { loading, error }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              {
                /** Run signup function supplied with the state as the variables
                 *  'data' comes back
                 *  data: {
                 *    signup: {
                 *      name: 'whatever was entered'
                 *      email: 'whatever was entered'
                 *      password: 'whatever was entered'
                 *    }
                 *  }
                 */
              }
              await signup();
              this.setState({ name: "", email: "", password: "" });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign Up for an account</h2>
              <Error error={error} />
              <label htmlFor="name">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="name"
                  onChange={this.saveToState}
                  value={this.state.name}
                />
              </label>
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  onChange={this.saveToState}
                  value={this.state.email}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  onChange={this.saveToState}
                  value={this.state.password}
                />
              </label>
            </fieldset>
            <button type="submit">Sign Up!</button>
          </Form>
        )}
      </Mutation>
    );
  }
}
export default Signup;
