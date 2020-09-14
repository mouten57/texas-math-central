const bcrypt = require("bcryptjs");

module.exports = {
  comparePass: function (userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);
  },
};
