import * as express from 'express';
import * as bodyParser from 'body-parser';

import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import * as cors from 'cors';
import * as compress from 'compression';
import * as cookieParser from 'cookie-parser';
import { authMiddleware } from './middlewares/auth';
import { authRouter } from './routers/auth';
import * as dotenv from 'dotenv';
import { notFoundMiddleware, errorMiddleware } from './middlewares/error';

// load .env variables into process.env
dotenv.config();


const PORT = +process.env.EXPRESS_PORT;
const HOST = process.env.EXPRESS_HOST;

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
const apiRouter = express.Router();
app.use('/api/v1', apiRouter);

// main routes
const rootHandler = (req, res) => {
  console.log('root route');
  res.send({ message: 'Welcome to my API' });
};
apiRouter.get('/', rootHandler);

const privateHandler = (req, res) => {
  console.log('private route');
  res.send({ message: 'Welcome to private API' });
};
apiRouter.get('/private', authMiddleware, privateHandler);

const debugHandler = (req, res) => {
  // tslint:disable-next-line:no-debugger
  debugger;
  res.send({});
};
apiRouter.get('/debug', debugHandler);


// auth routes
apiRouter.use('/auth', authRouter);

// other routes
// apiRouter.use('/user', userRouter);
// ...


// HTTP REQUEST ERRORS
app.use(errorMiddleware)
   .use(notFoundMiddleware);

// RUN EXPRESS SERVER
const server = app.listen(PORT, HOST);

// EXPRESS SERVER ERRORS
server.on('error', (err: any) => {
  switch (err.code) {
     case 'EACCES':
        console.error(`${HOST}:${PORT} requires elevated privileges`);
        break;
     case 'EADDRINUSE':
        console.error(`${HOST}:${PORT} is already in use`);
        break;
     default:
        console.error('Error connecting ' + err);
        break;
  }
  process.exit(1);
});


// PROCESS EVENTS
// gracefully stop the server in case of SIGINT (Ctrl + C) or SIGTERM (Process stopped)
const closeServer = () => {
  console.log('closeServer');
  server.close();
  // manager database connection
  // ...
};
process.on('SIGTERM', closeServer);
process.on('SIGINT', closeServer);

console.log(`Server listening on ${HOST}:${PORT}`);
