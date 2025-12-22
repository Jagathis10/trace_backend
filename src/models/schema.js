const mongoose = require('mongoose');

const databaseSchema = new mongoose.Schema(
   {
    trace_id:{type:String},
    original_id:{type:String},
    internal_id:{type:String},
    accession:{type:String},
    type:{type:String},
    tissue:{type:String},
    age_days:{type:Number},
    state:{type:String},
    state_id:{type:String},
    country:{type:String},
    segment:{type:String},
    gene:{type:String},
    year:{type:Number},
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

