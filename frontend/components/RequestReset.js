import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
// import { CURRENT_USER_QUERY } from "./User";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    resetRequest(email: $email) {
      message
    }
  }
`;

class Signin extends Component {
  state = {
    email: ""
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(resetRequest, { loading, error, called }) => (
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
              await resetRequest();
              this.setState({ email: "" });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request a password reset</h2>
              <Error error={error} />
              {!error && !loading && called && (
                <p>Success! Check your email for a reset link</p>
              )}
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
            </fieldset>
            <button type="submit">Request Reset</button>
          </Form>
        )}
      </Mutation>
    );
  }
}
export default Signin;
