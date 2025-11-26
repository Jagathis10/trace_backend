const express = require("express");
const fs = require("fs");
const path = require("path");
const DatabaseModel = require("../models/schema.js");
const { runPhyloScript} = require("../phylo/phylo");
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


//phylo_nt
router.post("/phylo/nt", async (req, res) => {

  console.log("Received POST /phylo/nt");
  console.log("Request body:", req.body);
  console.log ("req.query:", req.query);

  const { gene, type, segment, year, tissue, age, state,country } = req.body;
  const query = {};
  addIfExists(query, "gene", gene);
  addIfExists(query, "type", type);
  addIfExists(query, "segment", segment);
  addIfExists(query, "tissue", tissue);
  addIfExists(query, "age_days", age);
  addIfExists(query, "state", state);
  addIfExists(query, "country", country);

   if (year !== undefined && year !== null && year !== "") {
    const [start, end] = year.toString().split("-").map(Number);

    if (!isNaN(start) && !isNaN(end)) {
      query.year = { $gte: start, $lte: end };
    } else if (!isNaN(start)) {
      query.year = start;
    }
  }

  console.log("post query parameters query:", query);

  const records = await DatabaseModel.find(query).select(
    "trace_id nt_sequence aa_sequence"
  );

  console.log(` tracedb returned ${records.length} records`);

  if (!records.length) {
    console.log("No records found");
    return res.status(404).json({
      message: "No records found modify your filters.",
    });
  }

  
//temp directory and fasta file
  const tempDir = path.join(__dirname, "../../tmp");
  const timestamp = Date.now();
  const baseName = `phylo_nt_${timestamp}`;
  const fastaPath = path.join(tempDir, `${baseName}.fasta`);
  console.log(" Writing FASTA ", fastaPath);

  const fastaLines = [];
   //fasta content
  records.forEach((rec) => {
    const header = rec.trace_id;
    const seq = rec.nt_sequence;
    //const seq = (rec.nt_sequence || "").replace(/\s+/g, "");
    fastaLines.push(`>${header}`);
    fastaLines.push(seq);
  });

  fs.writeFileSync(fastaPath, fastaLines.join("\n"), "utf-8");

  console.log(" FASTA file created successfully.");
  console.log(" running phylo.py...");


  const threads = 8; 
  runPhyloScript(fastaPath, threads)
    .then((result) => {
      console.log(" Python job finished.");
      console.log("Exit code:", result.code);
      console.log("stdout:", result.stdout);
      console.log("stderr:", result.stderr);
      console.log("Generated files:", result.files);

      return res.json({
        message: "Phylogeny job completed",
        count: records.length,
        files: result.files,
        stdout: result.stdout,
        stderr: result.stderr,
      });
    })
    .catch((result) => {
      console.log(" Python error");
      console.log("Exit code:", result.code);
      console.log("stderr:", result.stderr);

      return res.status(500).json({
        message: "phylo.py failed",
        exitCode: result.code,
        stderr: result.stderr,
      });
    });

});




module.exports = router;
