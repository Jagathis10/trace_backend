const express = require("express");
const fs = require("fs");
const path = require("path");
const DatabaseModel = require("../models/schema.js");

//const multer = require("multer");

const router = express.Router();

//function
const addIfExists = (obj, key, value) => {
  if (value !== undefined && value !== null && value !== "") {
    if (typeof value === "string") {
      obj[key] = value.trim();
    } else {
      obj[key] = value;
    }
  }
};


router.get("/search", async (req, res) => {
  const { gene, type, segment, year, tissue, age, state, country } = req.query;

  const query = {};
  addIfExists(query, "gene", gene);
  addIfExists(query, "type", type);
  addIfExists(query, "segment", segment);
  addIfExists(query, "tissue", tissue);
  addIfExists(query, "age_days", age);
  addIfExists(query, "state", state);
  addIfExists(query, "country", country);

  console.log("GET raw query:", req.query);

  // Handle year range 
  if (year !== undefined && year !== null && year !== "") {
    const [start, end] = year.split("-").map(Number);

    if (!isNaN(start) && !isNaN(end)) {
      query.year = { $gte: start, $lte: end };
    } else if (!isNaN(start)) {
      query.year = start;
    }
  }

  console.log("Final query:", query);

  const results = await DatabaseModel.find(query)
    .select("-original_id -internal_id -accession");

  console.log(`tracedb returned ${results.length} records`);

  if (!results.length) {
    return res.status(404).json({
      message: "No records found! Please modify your search parameters",
    });
  }

  res.json({
    count: results.length,
    results,
  });
});



module.exports = router;
