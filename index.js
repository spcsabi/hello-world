import morgan from 'morgan';
import express from 'express';
import path from 'path';

const app = express();

const __dirname = import.meta.dirname;
const staticDir = path.join(__dirname, 'frontend');

app.use(morgan('dev'));
app.use(express.static(staticDir));

app.listen(8080, () => {
  console.log('App is ready on 8080');
});
