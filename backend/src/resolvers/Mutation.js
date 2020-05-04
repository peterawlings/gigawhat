const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require("../mail");
const { hasPermission } = require("../utils");

/** RESOLVERS
 * This is where we create a record
 * Whatever you have in here needs to mirror exactly what is in `schema.graphql`
 *
 * // schema.graphql
 * type Mutation {
     createDog(name: String!): Dog
    }

  // Mutation.js
    const Mutations = {
      createDog()
    };
 */

/**
 * This acts as a middleware between the query on the front end and the schema.
 * Here we can do things with the data before the query is completed
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
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that");
    }
    // Access the DB and the `Mutation type` and it's method 'createItem' in prisma.graphql and it returns a promise so need async await
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // This is how we create a relationship between the item and the user in Prisma
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info // Ensures item is actually returned to the DB when we've created it
    );
    return item;
  },
  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args };
    // remove the ID from the updates
    // We need to keep the ID the same so we remove the new one from the data and replace it later with the current one that we have taken a copy of, now stored in 'updates.id'
    delete updates.id;
    // run update method
    // console.log({ updates, args, ctx, info, parent });
    // ctx is the context of the request
    // db is how we expose the prisma db to ourselves
    // Mutations - either a 'query' or a 'mutation' which is in our generated prisma.graphql file
    // updateItem - we can check what args this accepts in the prisma.graphql file. In this case:
    //  - updateItem(data: ItemUpdateInput!, where: ItemWhereUniqueInput!): Item
    //  - `where` is which item to update and `data` is the data to update it with
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info // How the updateItem function knows what to return - we pass this in from the front end. `updateItem` in schema.graphql expects `Item`
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. Find the item
    const item = await ctx.db.query.item({ where }, `{id title user { id }}`); // Would normally pass in 'info' here to get everything that is returned from the frontend but you can also ask for specific things like here
    // 2. Check if they own that item or have persmissions
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission =>
      ["ADMIN", "ITEMDELETE"].includes(permission)
    );

    if (!ownsItem || !hasPermissions) {
      throw new Error("You don't have permission to do that");
    }
    // 3. Delete it
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    // lowercase their email
    args.email = args.email.toLowerCase();
    // hash their password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // We set the jwt as a cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
    });
    // Finalllllly we return the user to the browser
    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Check if their password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password!");
    }
    // 3. generate the JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4. Set the cookie with the token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // 5. Return the user
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token"); // These cookie methods are available because of the express middleware we added
    return { message: "Bye" };
  },
  async resetRequest(parent, args, ctx, info) {
    // 1. Check if user is real user
    const user = await ctx.db.query.user({ where: { email: args.email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Set a reset token and expiry on that user
    // We want to turn this into promise so we can use is asychronously
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour
    // Update the user with the above info
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry } // destructured
    });
    // 3. Email it to them
    const mailRes = await transport.sendMail({
      from: "rawlings.pete@gmail.com",
      to: user.email,
      subject: "Your password reset token",
      html: makeANiceEmail(`Your Password Reset Token is here!
      \n\n
      <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset</a>`)
    });

    return { message: "done" };
  },
  async resetPassword(parent, args, ctx, info) {
    // 1. check if passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Passwords don't match");
    }
    // 2. Check if it's a legit password token
    // 3. Check if it's expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000 // greater than equal to (1hours limit). If either of these fail it won't return anything
      }
    }); // users give us many more options and ways to find users. Destructured

    if (!user) {
      throw new Error("This token is either valid or expired");
    }
    // 4. Hash their new password
    const password = await bcrypt.hash(args.password, 10);
    // 5. Save the new password and remove old reset token fields
    const updateUser = await ctx.db.mutation.updateUser({
      where: {
        email: user.email
      },
      data: { password, resetToken: null, resetTokenExpiry: null }
    });
    // 6. Generate JWT
    const token = jwt.sign({ userId: updateUser.id }, process.env.APP_SECRET);
    // 7. Set the JWT cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // 8. Return the user
    return updateUser;
  },
  async updatePermissions(parent, args, ctx, info) {
    // Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in to do that");
    }
    // Query current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );
    // Check if they have permissions to do this
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);
    // Update the permissions
    console.log(args);
    return await ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions // instead of setting permissions value directly we have to use 'set' because its an ENUM
          }
        },
        where: {
          id: args.id // Not using 'ctx.request.userId' here because we might be updating someone elses ID. This one refers to ours (currently logged in)
        }
      },
      info
    );
  }
  // async updatePermissions(parent, args, ctx, info) {
  //   // 1. Check if they are logged in
  //   if (!ctx.request.userId) {
  //     throw new Error('You must be logged in!');
  //   }
  //   // 2. Query the current user
  //   const currentUser = await ctx.db.query.user(
  //     {
  //       where: {
  //         id: ctx.request.userId,
  //       },
  //     },
  //     info
  //   );
  //   // 3. Check if they have permissions to do this
  //   hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
  //   // 4. Update the permissions
  //   return ctx.db.mutation.updateUser(
  //     {
  //       data: {
  //         permissions: {
  //           set: args.permissions,
  //         },
  //       },
  //       where: {
  //         id: args.userId,
  //       },
  //     },
  //     info
  //   );
  // },
};

module.exports = Mutations;
