const express = require("express");

const app = express();
const PORT = 3000;

// middleware to read JSON body
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Expense Server is running");
});

// sample expense route
app.get("/expenses", (req, res) => {
  res.json([
    { id: 1, title: "Food", amount: 200 },
    { id: 2, title: "Travel", amount: 500 }
  ]);
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
