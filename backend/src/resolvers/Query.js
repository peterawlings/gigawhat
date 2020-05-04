/**  This is where you tell the app where to get the data from.
 *   In this case we are just returning raw data but we could also hit an endpoint.
 *   This is where the DB calls go, regardless of where that is
 *   We will be interfacing with Prisma.
 *   const Query = {
 *     dogs(parent, args, ctx, info) {
 *         Shorthand for dogs: function() {}
 *       return [{ name: "Snickers" }, { name: "Sunny" }, { name: "Albert" }];
 *     }
 *   };
 */
const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");
/**
 * If you don't need any logic in this resolver (like permissions or other stuff required before the query) then you can just use 'forwardTo' to get the data into the db
 */
// const Query = {
//   async items(parent, args, ctx, info) {
//     const items = await ctx.db.query.items();
//     return items;
//   }
// };

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  // Syntax equiv to `me: function()` - new ES6
  me(parent, args, ctx, info) {
    // This has been set in the middleware
    // console.log({ ctx });
    if (!ctx.request.userId) {
      // Check if someone logged in
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },
  async users(parent, args, ctx, info) {
    // 1. Check if user logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in");
    }
    // 2. Check if user has persmissions to query all users
    // We need to add a middleware to put permissions on `user` so the `hasPermission` function can make use of it
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
    // 3, If the do, query all the users
    return ctx.db.query.users({}, info); // Pass in empty object to query all of the users. Info constains the gql query with all the fields that we are requesting from the front end
  }
};

module.exports = Query;
