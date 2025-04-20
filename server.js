import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = "broly69";

mongoose.connect("mongodb+srv://davon:Broly69@cluster0.qa5j3nm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  serverSelectionTimeoutMS: 5000
}).then(() => console.log("Connecté à MongoDB"))
  .catch(err => console.error("Erreur MongoDB :", err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "broly_secret",
  resave: false,
  saveUninitialized: true,
}));

app.get('/', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.render('index', { products });
});

app.get('/admin', async (req, res) => {
  if (!req.session.loggedIn) return res.render('login');
  const products = await Product.find();
  res.render('admin', { products });
});

app.post('/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    req.session.loggedIn = true;
    res.redirect('/admin');
  } else {
    res.send("Mot de passe incorrect");
  }
});

app.post('/add-product', async (req, res) => {
  if (!req.session.loggedIn) return res.redirect('/admin');
  const { name, description, price, media } = req.body;
  await Product.create({ name, description, price, media });
  res.redirect('/admin');
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});