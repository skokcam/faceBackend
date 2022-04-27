const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const { handleRegister } = require('./controllers/register');
const { handleSignin, handleSignout } = require('./controllers/signin');
const image = require('./controllers/image');
const { handleProfileGet, handleProfiles } = require('./controllers/profile');

//Configuration - Heroku supplies DATABASE_URL & PORT env variables
const port = process.env.PORT ? process.env.PORT:3000;
const staticDir = __dirname + '/../public';
//Database config 
const db_host = process.env.DATABASE_URL ? process.env.DATABASE_URL:'localhost';
const db_conf = db_host !== 'localhost' ? {
  connectionString: db_host,
  ssl: {rejectUnauthorized: false}
}:{
  host: db_host,
  user: '',
  pass: '',
  database: 'smart-brain'
};

const db = knex({
	client: 'pg',
	connection: db_conf
});

const app = express();

//express middleware "my cors"
app.use( (req, res, next) => {
	res.append('Access-Control-Allow-Origin', ['http://localhost:3001']);
    //res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
    next();
});

app.use(express.urlencoded({extended: false}));
app.use(express.json());
//serve static file with express
//__dirname is current dir
app.use(express.static(staticDir));
//serves files in public subdir

//app.post('/signin', (req, res) => {handleSignin(req, res, db, bcrypt);});
app.post('/signin', handleSignin(db, bcrypt));

app.get('/signout', handleSignout);

app.post('/register', (req, res) => {handleRegister(req, res, db, bcrypt);});

app.get('/profile', (req, res) => {handleProfiles(req, res, db);});

app.get('/profile/:id', (req, res) => {handleProfileGet(req, res, db);});

app.put('/image', (req, res) => {image.handleImage(req, res, db)});


app.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
	console.log('Static files dir:', staticDir);
  console.log('Database host:', db_host);
});

//other methods app.put app.delete
//put for updating record
//delete for deleting record