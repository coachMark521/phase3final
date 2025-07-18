// server.js file
const express = require('express');
const path = require('path');  // for handling file paths
const da = require("./data-access");
const sec = require("./security");
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;  // use env var or default to 4000

app.use(bodyParser.json());

// Set the static directory to serve files from
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/customers/find", async (req, res) => {
  const keys = Object.keys(req.query);

  if (keys.length === 0) {
    return res.status(400).send("query string is required");
  }

  if (keys.length > 1) {
    return res.status(400).send("only one query parameter allowed");
  }

  const key = keys[0];
  const value = req.query[key];

  const validKeys = ["id", "email", "password"];
  if (!validKeys.includes(key)) {
    return res
      .status(400)
      .send("name must be one of the following (id, email, password)");
  }

  let filter = {};
  filter[key] = key === "id" ? parseInt(value) : value;
  
  const [customers, err] = await da.findCustomers(filter);
  if (customers && customers.length > 0) {
    res.send(customers);
  } else {
    res.status(404).send("no matching customer documents found");
  }
});

app.get("/customers", sec.checkHeaderAuth, async (req, res) => {
    const [cust, err] = await da.getCustomers();
    if(cust){
        res.send(cust);
    }else{
        res.status(500);
        res.send(err);
    }
});

app.get("/reset", sec.checkHeaderAuth, async (req, res) => {
    const [result, err] = await da.resetCustomers();
    if(result){
        res.send(result);
    }else{
        res.status(500);
        res.send(err);
    }   
});

app.post('/customers', sec.checkHeaderAuth, async (req, res) => {
    const newCustomer = req.body;
    if (newCustomer === null) {
        res.status(400);
        res.send("missing request body");    
    }else {
        // return array format [status, id, errMessage]
        const [status, id, errMessage] = await da.addUniqueCustomer(newCustomer);
        //const [status, id, errMessage] = await da.addCustomer(newCustomer);
        if (status === "success") {
            res.status(201);
            let response = { ...newCustomer };
            response["_id"] = id;
            res.send(response);
        } else {
            res.status(400);
            res.send(errMessage);
        }
    }
});

app.get("/customers/:id", sec.checkHeaderAuth, async (req, res) => {
     const id = req.params.id;
     // return array [customer, errMessage]
     const [cust, err] = await da.getCustomerById(id);
     if(cust){
         res.send(cust);
     }else{
         res.status(404);
         res.send(err);
     }   
});

app.put('/customers/:id', sec.checkHeaderAuth, async (req, res) => {
    const id = req.params.id;
    const updatedCustomer = req.body;
    if (updatedCustomer === null) {
        res.status(400);
        res.send("missing request body");
    } else {
        delete updatedCustomer._id;
        // return array format [message, errMessage]
        const [message, errMessage] = await da.updateCustomer(updatedCustomer);
        if (message) {
            res.send(message);
        } else {
            res.status(400);
            res.send(errMessage);
        }
    }
});

app.delete('/customers/:id', sec.checkHeaderAuth, async (req, res) => {
    const id = req.params.id;
    // return array [message, errMessage]
    const [message, errMessage] = await da.deleteCustomerById(id);
    if (message) {
        res.send(message);
    } else {
        res.status(404);
        res.send(errMessage);
    }
});

