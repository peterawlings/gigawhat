module.exports = function() {
  const faker = require("faker");
  const _ = require("lodash");
  return {
    data: _.times(50, function(n) {
      return {
        id: n,
        name: faker.name.findName(),
        avatar: faker.internet.avatar(),
        venue: faker.name.firstName()
      };
    })
  };
};
