const express = require("express");
const fs = require("fs");
const path = require("path");
const DatabaseModel = require("../models/schema.js");


const { SearchDatabase } = require("../utils/search.js");
const { blast } = require("../tools/blast/blast.js");
const { clustalw } = require("../tools/clustalw/clustalw.js");
const { mafft } = require("../tools/mafft/mafft.js");
const { iqtree } = require("../tools/iqtree/iqtree");


const router = express.Router();

//Search Route
router.get("/search", async (req, res) => {


  if (Object.keys(req.query).length > 0) {
    const { gene, type, segment, year, tissue, age, state, country } = req.query;
    const results = await SearchDatabase(gene, type, segment, year, tissue, age, state, country);

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
  const {
    gene, type, segment, year, tissue, age, state, country, seqType, query,
  } = req.body;

  const result = await blast(
    gene, type, segment, year, tissue, age, state, country, seqType, query,
  );

  if (result.db_count === 0) {
    return res.status(404).json(result);
  }

  return res.json(result);
});




router.post("/clustalw", async (req, res) => {
  const { gene, type, segment, year, tissue, age, state, country, seqType, query } = req.body;

  const result = await clustalw(gene, type, segment, year, tissue, age, state, country, seqType, query);

  if (result.db_count === 0) return res.status(404).json(result);
  return res.json(result);
});



router.post("/mafft", async (req, res) => {
  const { gene, type, segment, year, tissue, age, state, country, seqType, query } = req.body;

  const result = await mafft(gene, type, segment, year, tissue, age, state, country, seqType, query);

  if (result.db_count === 0) return res.status(404).json(result);
  return res.json(result);
});



router.post("/iqtree", async (req, res) => {
  const { gene, type, segment, year, tissue, age, state, country, seqType, query, aligner } = req.body;

  const result = await iqtree(gene, type, segment, year, tissue, age, state, country, seqType, query, aligner);

  if (result.db_count === 0) return res.status(404).json(result);
  return res.json(result);
});




module.exports = router;
