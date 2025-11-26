const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const {runBlast} = require("../tools/blast/blast.js");


const router = express.Router();
//base dir
const tmpBaseDir = path.join(__dirname, "../../tmp");

// setting up dir for blast
const blastTmpDir = path.join(tmpBaseDir, "blast-results");



const upload = multer({ dest:blastTmpDir});

//function

//1. get a FASTA file path from either upload or body

function getFastaFile({ file, gdata }) {
  if (file && file.path) {
    console.log("Using uploaded file:", file.path);
    return file.path;
  }

  if (gdata && gdata.trim() !== "") {
    const filePath = path.join(
      blastTmpDir,
      `blast_query_${Date.now()}.fasta`
    );
    fs.writeFileSync(filePath, gdata.trim() + "\n");
    console.log("Using gdata written to file:", filePath);
    return filePath;
  }

  return null;
}









//BLAST route post /api/tools/blast
/**
 *Accepts:
 *  file   : uploaded FASTA (multipart/form-data)
 *  gdata: FASTA text (string)
 * Optional body fields:
 *  - program       : "blastn" or "blastp" (default "blastn")
 *  - db            : "trace-ntdb" or "trace-aadb" (default "trace-ntdb")
 */


 router.post("/blast", upload.single("file"), async (req, res) => {
  const {
    gdata,
    program = "blastn",
    db,
    word,
    evalue,
    maxTargetSeqs,
  } = req.body;

  const queryPath = getFastaFile({ file: req.file, gdata });
  if (!queryPath) {
    return res
      .status(400)
      .json({ message: "No FASTA file or gdata provided" });
  }

  console.log("BLAST request body:", req.body);

  // pick BLAST DB
  const blastDbDir = path.join(__dirname, "../../blastdb");
  const defaultDbName = program === "blastn" ? "trace-ntdb" : "trace-aadb";
  const dbName = db || defaultDbName;
  const dbPrefix = path.join(blastDbDir, dbName);

  // run BLAST 
  const results = await runBlast({
    program,
    queryFasta: queryPath,
    dbPrefix,
    wordSize: Number(word) || 10,
    evalue: evalue !== undefined ? Number(evalue) : 1e-5,
    outfmt: 6,
    maxTargetSeqs: Number(maxTargetSeqs) || 10,
    cwd: blastTmpDir,
  });

  console.log("BLAST completed with code:", results.code);

  // write stdout to a file in blast-results
  const outFile = path.join(
    blastTmpDir,
    `blast_output_${Date.now()}.txt`
  );
  fs.writeFileSync(outFile, results.stdout || "", "utf-8");
  console.log("BLAST output written to:", outFile);

  return res.json({
    tool: "BLAST",
    message: "BLAST completed successfully",
    results: {
      command: results.cmd,
      outputFile: outFile,
      stdout: results.stdout,
      stderr: results.stderr,
    },
  });
});

module.exports = router;






        