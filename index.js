const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5550;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zsxxm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db(`${process.env.DB_NAME}`).collection("products");
  const purchasesCollection = client.db(`${process.env.DB_NAME}`).collection("purchases");

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    productsCollection.insertOne(newProduct)
      .then(result => {
        console.log('insertedCount: ', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/checkout', (req, res) => {
    const newPurchase = req.body;
    purchasesCollection.insertOne(newPurchase)
      .then(result => {
        console.log('insertedCount: ', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/products', (req, res) => {
    productsCollection.find()
      .toArray((err, items) => {
        res.send(items)
        err && console.log(err)
      })
  })

  app.get('/purchases/:email', (req, res) => {
    const email = req.params.email;
    purchasesCollection.find({ userEmail: email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/product/id/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productsCollection.find({ _id: id })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.delete('/deleteProduct/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    productsCollection.deleteOne({ _id: id })
      .then((result) => {
        res.send(result.deletedCount > 0)
      })
  })
});

app.get('/', (req, res) => {
  res.send('Hello World! You are at the right place for books bunny! Books bunny Database in connected')
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
