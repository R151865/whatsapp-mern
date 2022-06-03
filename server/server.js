const express = require("express");
const app = express();
app.use(express.json());

app.get("/api", (request, response) => {
  response.send({ users: ["user 1", "user 2", "user 3", "user 4", "user 4t"] });
});

app.listen(5000, () => {
  console.log("server running at 5000");
});
