/** This is where we create a record
 * Whatever you have in here needs to mirror exactly what is in `schema.graphql`
 * type Mutation {
     createDog(name: String!): Dog
    }

    const Mutations = {
      createDog()
    };

 */

const Mutations = {
  /** The API for interfacing with the database, you can search in `prisma.graphql` file eg
   *   type Mutation {
   *     ...
   *     createUser(data: UserCreateInput!): User!
   *     createItem(data: ItemCreateInput!): Item!
   *     updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
   *     ...
   *   }
   */

  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in
    // Access the DB and the `Mutation type` and it's method 'createItem' in prisma.graphql and it returns a promise so need async await
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info // Ensures item is actually returned to the DB when we've created it
    );
    return item;
  }
};

module.exports = Mutations;
