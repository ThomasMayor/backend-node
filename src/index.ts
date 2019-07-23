import * as express from 'express';
import * as bodyParser from 'body-parser';

import * as morgan from 'morgan';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import * as cors from 'cors';
import * as compress from 'compression';
import * as cookieParser from 'cookie-parser';
import { authRouter, rootRouter } from './routers';
import * as dotenv from 'dotenv';
import { notFoundMiddleware, errorMiddleware } from './middlewares/error';
import { Database } from './database';

// load .env variables into process.env
dotenv.config();

const PORT = +process.env.PORT || +process.env.EXPRESS_PORT;
const HOST = process.env.HOST || process.env.EXPRESS_HOST;

const MONGO_URI = process.env.MONGO_URI;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

const database: Database = new Database(MONGO_URI, MONGO_USER, MONGO_PASSWORD);
database
.connect()
.then(_ => {
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

  // root routes
  apiRouter.use('/', rootRouter);

  // auth routes
  apiRouter.use('/auth', authRouter);


  // HTTP REQUEST ERRORS
  app.use(errorMiddleware)
     .use(notFoundMiddleware);

  // RUN EXPRESS SERVER
  const server = app.listen(PORT, HOST);

  // EXPRESS SERVER ERRORS
  const closeServer = () => {
    console.log('close express server');
    server.close();
    return database.disconnect().then(() => {}).catch(() => {});
  };

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
    closeServer()
      .then(_ => process.exit(1))
      .catch(_ => process.exit(1));
  });
  server.on('listening', () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
  });

  // PROCESS EVENTS
  // gracefully stop the server in case of SIGINT (Ctrl + C) or SIGTERM (Process stopped)
  process.on('SIGTERM', closeServer);
  process.on('SIGINT', closeServer);

})
.catch(err => {
  console.error('Database connection error');
  console.error(err);
  process.exit(1);
});
