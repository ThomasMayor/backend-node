import * as express from 'express';
import * as bodyParser from 'body-parser';

import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import * as cors from 'cors';
import * as compress from 'compression';
import * as cookieParser from 'cookie-parser';

const PORT = 8080;
const HOST = '0.0.0.0';

// APP
const app = express();

// MIDDLEWARES
   // use bodyParser to parse json
app.use(bodyParser.json())
   // use Helmet to help secure Express apps with various HTTP headers
   .use(helmet())
   // use morgan to log requests to the console
   .use(morgan('dev'))
   // use HPP to protect against HTTP Parameter Pollution attacks
   .use(hpp())
   // enable gzip compression
   .use(compress())
   // cors domaine origin
   .use(cors({optionsSuccessStatus: 200}))
   // parse cookies
   .use(cookieParser());



// ROUTES
const rootHandler = (req, res) => {
  console.log('root route');
  res.send({ message: 'Welcome to my API' });
};
app.get('/', rootHandler);


app.post('/', (req, res) => {
  console.log(req.body);
  res.send(req.body);
});



app.listen(PORT, HOST);

console.log(`Server listening on ${HOST}:${PORT}`);
