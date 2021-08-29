if (process.env.NODE_ENV === "production") {
  //we are in production, return the prod set of keys!
  module.exports = {
    socketPath: process.env.SOCKET_PATH,
  };
} else {
  //we are in development - return the dev keys!!
  //immediately adds dev file to exports
  module.exports = {
    socketPath: "http://localhost:5000",
  };
}
