import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

class Signin extends Component {
  state = {
    email: "",
    password: ""
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signin, { loading, error }) => (
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
              await signin();
              this.setState({ email: "", password: "" });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign in to your account</h2>
              <Error error={error} />
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
            <button type="submit">Sign In!</button>
          </Form>
        )}
      </Mutation>
    );
  }
}
export default Signin;
