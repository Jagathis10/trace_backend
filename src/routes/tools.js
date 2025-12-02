const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");


const {runBlast} = require("../tools/blast/blast.js");
const {runMafft} = require("../tools/mafft/mafft.js");
const { runClustalw } = require("../tools/clustalw/clustalw.js");
//const { runIqtree } = require("../tools/iqtree/iqtree.js");



const router = express.Router();


//base dir
const tmpBaseDir = path.join(__dirname, "../../tmp");

// setting up dir for blast
const blastTmpDir = path.join(tmpBaseDir, "blast-results");
const mafftTmpDir = path.join(tmpBaseDir, "mafft-results");
const clustalwTmpDir = path.join(tmpBaseDir, "clustalw-results");
//const iqtreeTmpDir = path.join(tmpBaseDir, "iqtree-results");

const uploadBlast = multer({ dest:blastTmpDir});
const uploadMafft = multer({ dest:mafftTmpDir});
const uploadClustalw = multer({ dest:clustalwTmpDir});
//const uploadIqtree = multer({ dest:iqtreeTmpDir});

//function

//1. get a FASTA file path from either upload or body

function getFastaFile({ file, gdata,outDir,prefix }) {
  if (file && file.path) {
    console.log("Using uploaded file:", file.path);
    return file.path;
  }

  if (gdata && gdata.trim() !== "") {
    const filePath = path.join(
      outDir,
      `${prefix || "query"}_${Date.now()}.fasta`
    );
    let text = gdata.trim();
    if (!text.startsWith(">")) {
    text = `>query\n${text}`;
    }
    fs.writeFileSync(filePath, text + "\n", "utf-8");
    console.log("Using gdata written to file:", filePath);
    return filePath;
  }

  return null;
}

//2.take first 10 sequences from our  DB FASTA nt or aa
// function getDbFasta(fastapath,n){
//   const data = fs.readFileSync(fastapath,"utf-8").trim();
//   if (!data) return "";





//BLAST route post /api/tools/blast
/**
 *Accepts:
 *  file   : uploaded FASTA (multipart/form-data)
 *  gdata: FASTA text (string)
 * Optional body fields:
 *  - program       : "blastn" or "blastp" (default "blastn")
 *  - db            : "trace-ntdb" or "trace-aadb" (default "trace-ntdb")
 */


 router.post("/blast", uploadBlast.single("file"), async (req, res) => {
  const {
    gdata,
    program = "blastn",
    db,
    word,
    evalue,
    maxTargetSeqs,
  } = req.body;

  const queryPath = getFastaFile({ 
    file: req.file, 
    gdata, 
    outDir: blastTmpDir, 
    prefix: "blast_input" 
  });

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

//maftt
router.post("/mafft", uploadMafft.single("file"), async (req, res) => {
  const{ gdata} = req.body;

  const fastapath = getFastaFile({
    file: req.file,
    gdata,
    outDir: mafftTmpDir,
    prefix: "mafft_input"
  });

  if (!fastapath) {
    return res
      .status(400)
      .json({ message: "No FASTA file or gdata provided" });
  }

  console.log("MAFFT request body:", req.body);
  
  //run mafft
  const results = await runMafft({
    inputFasta: fastapath,
    cwd: mafftTmpDir,
    extraArgs: ["--auto"],
  });

  console.log("MAFFT completed with code:", results.code);

  //write stdout to a file in mafft-results
  const outFile = path.join(
    mafftTmpDir,
   `mafft_alignment_${Date.now()}.fasta`
  );
  fs.writeFileSync(outFile, results.stdout || "", "utf-8");
  console.log("MAFFT output written to:", outFile);
  
  return res.json({
    tool: "MAFFT",  
    message: "MAFFT completed successfully",
    results: {
      command: results.cmd,
      outputFile: outFile,
      stdout: results.stdout,
      stderr: results.stderr,
    },
  });
});


//clustalw
router.post("/clustal", uploadClustalw.single("file"), async (req, res) => {
  const{gdata} = req.body;

  const fastapath = getFastaFile({
    file: req.file,
    gdata,
    outDir: clustalwTmpDir,
    prefix: "clustalw_input"
  });
  if (!fastapath) {
    return res
      .status(400)
      .json({ message: "Need input fasta file" });
  }
  console.log("ClustalW request body:", req.body);
  
  //outpur file type 
  const outFile = path.join(
    clustalwTmpDir,
    `clustalw_alignment_${Date.now()}.aln`
  );

  //run clustalw
  const results = await runClustalw({
    inputFasta: fastapath,
    cwd: clustalwTmpDir,
    outputFile: outFile,
    extraArgs: [],
  });
  
  console.log("ClustalW completed with code:", results.code);   
  console.log("ClustalW output written to:", outFile);
  
  return res.json({
    tool: "ClustalW",  
    message: "ClustalW completed successfully",
    results: {
      command: results.cmd,
      outputFile: outFile,
      stdout: results.stdout,
      stderr: results.stderr,
    },
  });
});



module.exports = router;






        