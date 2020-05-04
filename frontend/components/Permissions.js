import { Query, Mutation } from "react-apollo";
import Error from "./ErrorMessage";
import gql from "graphql-tag";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";
import PropTypes from "prop-types";

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERSMISSIONUPDATE"
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  # args passed in just just like expected in schema 'updatePermissions' function
  # here we are naming the query. This is written just like in the graphql playground. This can really be anything
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    # run the actual function in the schema passing in the args. This must match the name of the function in the schema
    updatePermissions(permissions: $permissions, id: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) =>
      console.log(data) || (
        <div>
          <Error error={error} />
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(permission => (
                  <th key={permission}>{permission}</th>
                ))}
                <th>></th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => (
                <UserPermissions user={user} key={user.id} />
              ))}
            </tbody>
          </Table>
          <p>Permissions bla</p>
        </div>
      )
    }
  </Query>
);

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array
    }).isRequired
  };

  state = {
    permissions: this.props.user.permissions
  };

  handlePermissionChange = e => {
    const checkbox = e.target;
    // Take a copy of the current permissions
    let updatedPermissions = [...this.state.permissions];
    // figure out if we need to add or remove this permission
    if (checkbox.checked) {
      // if checked, add it
      updatedPermissions.push(checkbox.value);
    } else {
      // if not, return a new array without the value
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value
      );
    }
    this.setState({
      permissions: updatedPermissions
    });
    console.log(updatedPermissions);
  };

  render() {
    const user = this.props.user;
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: this.props.user.id
        }}
      >
        {(updatePermissions, { loading, error }) => (
          <>
            {error && (
              <tr colSpan="8">
                <td>
                  <Error error={error} />
                </td>
              </tr>
            )}
            <tr>
              <th>{user.name}</th>
              <th>{user.email}</th>
              {possiblePermissions.map(permission => (
                <th key={permission}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      id={`${user.id}-permission-${permission}`}
                      type="checkbox"
                      checked={this.state.permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange}
                    ></input>
                  </label>
                </th>
              ))}
              <th>
                <SickButton
                  type="button"
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Updat{loading ? "ing" : "e"}
                </SickButton>
              </th>
            </tr>
          </>
        )}
      </Mutation>
    );
  }
}

export default Permissions;
