import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import bodyParser from 'body-parser';

const app = express();

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

app.use(compression({ threshold: 0 }));
app.use(sirv('static', { dev }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(sapper.middleware());

app.listen(PORT, err => {
	if (err) console.log('error', err);
});