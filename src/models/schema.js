import mongoose,{Schema} from "mongoose";
const databaseSchema=new Schema(
    {
    internal_id:{type:String,required:true,unique:true},
    original_id:{type:String,required:true},
    virus_type:{type:String,required:true},
    segment:{type:String,required:true},
    gene:{type:String,required:true},
    year:{type:Number},
    nt_length:{type:Number},
    aa_length:{type:Number},
    nt_sequence:{type:String},
    aa_sequence:{type:String}
    },

    {timestamps:true}
);
//export const DatabaseModel=mongoose.model("Database",databaseSchema,"data");
const DatabaseModel =
  mongoose.models.Database || mongoose.model("Database", databaseSchema, "data");

export default DatabaseModel;
