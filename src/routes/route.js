const express = require("express");
const fs = require("fs");
const path = require("path");
const DatabaseModel = require("../models/schema.js");
const {runBlast} = require("../tools/blast/blast.js");
const { buildAndRunSearch } = require("../utils/search.js");




const router = express.Router();


router.get("/search", async (req, res) => {

  
  if (Object.keys(req.query).length > 0) {
    const { gene, type, segment, year, tissue, age, state, country } = req.query;
    const results = await buildAndRunSearch(gene, type, segment, year, tissue, age, state, country);

    if (!results.length) {
      return res.status(404).json({
        message: "No records found! Please modify your search parameters",
      });
    }

    res.json({
      count: results.length,
      results,
    });
  }
  else {
    res.status(400).json({
      message: "Please provide at least one search parameter",
    });
  }
});


//  Blast Route

router.post("/blast", async (req, res) => {


  const { gene, type, segment, year, tissue, age, state, country } = req.body;

  const results = await buildAndRunSearch(gene, type, segment, year, tissue, age, state, country);

  
  
 
 
 const blastResults = await runBlast(
    
  );
  res.json({
    results: blastResults,
  } 
)
}
)


module.exports = router;
