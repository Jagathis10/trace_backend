const mongoose = require('mongoose');

const databaseSchema = new mongoose.Schema(
   {
    internal_id:{type:String},
    original_id:{type:String},
    type:{type:String},
    Specimen:{type:String},
    Age:{type:String},
    State:{type:String},
    segment:{type:String},
    gene:{type:String},
    Year:{type:Number},
    nt_length:{type:Number},
    aa_length:{type:Number},
    nt_sequence:{type:String},
    aa_sequence:{type:String}
    },

    {timestamps:true}
);

const DatabaseModel =
  mongoose.models.Database || mongoose.model("Database", databaseSchema, "trace_data");

module.exports = DatabaseModel;

