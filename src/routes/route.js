const express = require("express");
const DatabaseModel = require("../models/schema.js");
const router = express.Router();

router.get("/search", async (req, res) => {
  const { gene, type, segment, year , specimen, age, state } = req.query;

  const query = {};

if (gene && gene.trim() !== "") {
  query.gene = gene;
}

if (type && type.trim() !== "") {
      query.type = type.trim();
    }

if (segment && segment.trim() !== "") {
      query.segment = segment.trim();
    }   

if (specimen && specimen.trim() !== "") {
  query.Specimen = specimen.trim();
}

if (age && age.trim() !== "") {
  query.Age = age.trim();
}

if (state && state.trim() !== "") {
  query.State = state.trim();
}

if (year && year.trim() !== "") {
      const [start, end] = year.split("-").map(Number);

      if (!isNaN(start) && !isNaN(end)) {
        query.Year = { $gte: start, $lte: end };
      } else if (!isNaN(start)) {
        query.Year = start;
      }

  
  }


const results = await DatabaseModel.find(query).select("-original_id -internal_id -Accession");



    if (results.length === 0) {
      return res.status(404).json({ message: "No records found ! Please consider modifying your search parameters" });
    }


res.json({ count: results.length, results });
  
});

module.exports = router;
































