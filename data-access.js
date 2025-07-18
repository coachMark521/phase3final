// data-access.js file
const MongoClient = require('mongodb').MongoClient;
const dbName = 'custdb';
const baseUrl = "mongodb://127.0.0.1:27017";
const collectionName = "customers"
const connectString = baseUrl + "/" + dbName; 
let collection;

async function dbStartup() {
    const client = new MongoClient(connectString);
    await client.connect();
    collection = client.db(dbName).collection(collectionName);
}

async function isUniqueValue(dbName, collectionName, fieldName, value) {
  const collection = dbName.collection(collectionName);
  const existing = await collection.findOne({ [fieldName]: value });
  return !existing; // true if unique, false if duplicate
}


async function getCustomers() {
    try {
        const customers = await collection.find().toArray();
        return [customers,null];
    } catch (error) {
        console.log(err.message);
        return [null, err.message];
    }
    
}

async function resetCustomers() {
    let data = [
        { "id": 0, "name": "Mary Jackson", "email": "maryj@abc.com", "password": "maryj" },
        { "id": 1, "name": "Karen Addams", "email": "karena@abc.com", "password": "karena" },
        { "id": 2, "name": "Scott Ramsey", "email": "scottr@abc.com", "password": "scottr" }
    ];

    try {
        await collection.deleteMany({});
        await collection.insertMany(data);
        const customers = await collection.find().toArray();
        const message = "data was refreshed. There are now " + customers.length + " customer records!"
        return [message, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

async function addUniqueCustomer(newCustomer) {
    try {
        //bring in the information for new customer
        const email = req.body.email;
        const value = req.body.email.value;
        if (isUniqueValue(dbName, collectionName, email, value)) {
            // return array [status, id, errMessage]
            const insertResult = await collection.insertOne(newCustomer);
            return ["success", insertResult.insertedId, null];
        }else{
            return [null, "Failed insert: email is already in use by a customer"];
        }

    } catch (err) {
        console.log(err.message);
        return ["fail", null, err.message];
    }
}

async function addCustomer(newCustomer) {
    try {
        const insertResult = await collection.insertOne(newCustomer);
        // return array [status, id, errMessage]
        return ["success", insertResult.insertedId, null];
    } catch (err) {
        console.log(err.message);
        return ["fail", null, err.message];
    }
}

async function getCustomerById(id) {
    try {
        const customer = await collection.findOne({"id": +id});
        // return array [customer, errMessage]
        if(!customer){
          return [ null, "invalid customer number"];
        }
        return [customer, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

async function updateCustomer(updatedCustomer) {
    try {
        const filter = { "id": updatedCustomer.id };
        const setData = { $set: updatedCustomer };
        const updateResult = 
        await collection.updateOne(filter, setData);
        // return array [message, errMessage]
        return ["one record updated", null];
    } catch (err) {
        console.log(err.message);
        return [ null, err.message];
    }
}

async function deleteCustomerById(id) {
    try {
        const deleteResult = await collection.deleteOne({ "id": +id});
        if (deleteResult.deletedCount === 0) {
            // return array [message, errMessage]
            return [null, "no record deleted"];
        } else if (deleteResult.deletedCount === 1) {
            return ["one record deleted", null];
        } else {
            return [null, "error deleting records"]
        }
    }
    catch {
        console.log('At Catch', err.message);
        return [null, err.message];
    }
}

async function findCustomers(filterObject){
    try {
        const customers = await collection.find(filterObject).toArray();
        if(!customers || customers.length == 0){
            return[null, "no customers were found"]
        }
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

dbStartup();

module.exports = { 
    getCustomers, 
    resetCustomers,
    addCustomer,
    getCustomerById,
    updateCustomer,
    deleteCustomerById,
    findCustomers,
    addUniqueCustomer
 };