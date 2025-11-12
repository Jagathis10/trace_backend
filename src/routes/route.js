import express from "express";
import DatabaseModel from "../models/schema.js";
const router = express.Router();

// getting records by using gene using req.query
// router.get("/", async (req,res) => {
//     const {gene} = req.query;
//     const filter = {};
//     if (gene) filter.gene = gene;
//     const results = await DatabaseModel.find(filter);
//     res.json({count: results.length,results,});

// });

// updated req.params
// router.get("/:gene", async (req, res) => {
//   const { gene } = req.params;
//   console.log("parameter for gene from client:",gene);
//   const results = await DatabaseModel.find({ gene });
//   if (results.length ===0){
//     console.log("No data found for gene:", gene);
//     return res.status(404).json({message:"data not found",});
// }
//   console.log("Found", results.length, "records for gene:", gene);
//   res.json({ count: results.length, results });
// });


//  for multiple query filters points 

router.get("/search", async (req, res) => {
  const { gene, type, segment, year } = req.query;
  console.log("parameter for gene from client:", gene);
  console.log("parameter for type from client:", type);
  console.log("parameter for segment from client:", segment);
  console.log("parameter for year from client:", year);
  const query = {};

  if (gene) query.gene = gene;
  if (type) query.virus_type = type;
  if (segment) query.segment = segment;
  //if (year) filter.year = Number(year);
  //trying year range:
  if (year) {
    if (year.includes("-")) {
      //array destructring
      const [start_year, end_year] = year.split("-").map(Number);
      query.year = { $gte: start_year, $lte: end_year };
    } else {
      query.year = Number(year);
    }
  }

  console.log("Query:", query);
  const results = await DatabaseModel.find(query);
  console.log(`Found ${results.length} records for Query:`, query);

    if (results.length === 0) {
      console.log("No matching records found.");
      return res.status(404).json({ message: "No matching data found" });
    }

    res.json({ count: results.length, results });
  
});

export default router;































