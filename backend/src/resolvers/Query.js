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

/**
 * If you don't need any logic in this resolver then you can just use 'forwardTo' to get the data into the db
 */
const Query = {
  async items(parent, args, ctx, info) {
    const items = await ctx.db.query.items();
    return items;
  }
};

module.exports = Query;
