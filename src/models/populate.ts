import {
  Schema,
  Model,
  Document,
  model as mongooseModel,
  Types
} from 'mongoose';

export interface IPopulate {
  title: string;
  user_id: Types.ObjectId;
}

// document interface, define custom methods here
export interface IPopulateDoc extends Document, IPopulate {
}

// model interface, define custom static methods here
interface IPopulateModel extends Model<IPopulateDoc> {
}

// schema definition
const populateSchema = new Schema<IPopulateDoc>({
  title: {
    type: String,
    required: true
  },

  user_id: {
    type: Types.ObjectId,
    required: true,
    ref: 'users'
  }

});


// model generation
export const PopulateModel = mongooseModel<IPopulateDoc, IPopulateModel>('populates', populateSchema);

