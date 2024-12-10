const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json()); // Middleware to parse JSON

// Load JSON data
const dataPath = "./data.json";

const readData = () => JSON.parse(fs.readFileSync(dataPath));

// 1. Get list of users
app.get("/users", (req, res) => {
  const data = readData();
  res.json(data.employees);
});

// 2. Get a single user by ID
app.get("/users/:id", (req, res) => {
  const data = readData();
  const user = data.employees.find(emp => emp.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
});

// 3. Insert a user
app.post("/users", (req, res) => {
  const data = readData();
  const newUser = { id: data.employees.length + 1, ...req.body };
  data.employees.push(newUser);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.status(201).json(newUser);
});

// 4. Delete a user by ID
app.delete("/users/:id", (req, res) => {
  const data = readData();
  const filteredEmployees = data.employees.filter(emp => emp.id !== parseInt(req.params.id));
  if (filteredEmployees.length === data.employees.length) return res.status(404).send("User not found");

  data.employees = filteredEmployees;
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.send("User deleted successfully");
});

// Update a user by ID
app.put("/users/:id", (req, res) => {
    const data = readData(); // Load the existing data
    const userIndex = data.employees.findIndex(emp => emp.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
      return res.status(404).send("User not found");
    }
    
    // Update the user's details
    data.employees[userIndex] = { ...data.employees[userIndex], ...req.body };
    
    // Save the updated data back to the file
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    
    res.json(data.employees[userIndex]); // Respond with the updated user
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
