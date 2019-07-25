import * as express from 'express';
import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import { authMiddleware } from '../middlewares';
import { PopulateModel } from '../models';
import { ValidateId } from '../helpers';

export const rootRouter = express.Router();


const rootHandler = (req: Request, res: Response) => {
  res.send({ message: 'Welcome to my API' });
};
rootRouter.get('/', rootHandler);

if (process.env.NODE_END !== 'production') {

  const privateHandler = (req: Request, res: Response) => {
    res.send({ message: 'Welcome to private API' });
  };
  rootRouter.get('/private', authMiddleware, privateHandler);


  const debugHandler = (req: Request, res: Response) => {
    // tslint:disable-next-line:no-debugger
    debugger;
    res.send({});
  };
  rootRouter.get('/debug', debugHandler);

  const testHandler = (req: Request, res: Response) => {
    // 1. Add new populate
    const pop = new PopulateModel({ title: '' + Date.now(), user_id: new mongoose.Types.ObjectId('5d381a3b13b992218438143d') });
    pop.save().then(pop =>  {


      PopulateModel.findById(pop._id).populate('user_id').exec().then(pop2 => {

        console.log(pop2);

      }).catch(err => console.log(err));


    });

    res.send({});
  };
  rootRouter.get('/test', testHandler);

  const withParamHandler = (req: Request, res: Response) => {
    const paramId = req.param('id');
    // validate param value
    if (!ValidateId(paramId))
      res.status(400).send({error: true, message: 'Invalid :id path params'});
    else
      res.send({ param: paramId });
  };
  rootRouter.get('/mon/chemin/:id/test', withParamHandler);
}
