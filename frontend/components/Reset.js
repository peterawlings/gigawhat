import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Form from "./styles/Form";
import Error from "./ErrorMessage";
import PropTypes from "prop-types";
import { CURRENT_USER_QUERY } from "./User";

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $password: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      email
      name
    }
  }
`;

class Reset extends Component {
  static proptypes = {
    resetToken: PropTypes.string.isRequired
  };
  state = {
    password: "",
    confirmPassword: ""
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken, // Comes from the URL passed down from page
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        }}
        // Once mutation is complete, current user is refetched, meaning they are logged in straight away
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
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
              this.setState({ password: "", confirmPassword: "" });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset your password</h2>
              <Error error={error} />

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
              <label htmlFor="confirmPassword">
                Confirm Your Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="confirmPassword"
                  value={this.state.confirmPassword}
                  onChange={this.saveToState}
                />
              </label>
            </fieldset>
            <button type="submit">Reset your password</button>
          </Form>
        )}
      </Mutation>
    );
  }
}
export default Reset;
