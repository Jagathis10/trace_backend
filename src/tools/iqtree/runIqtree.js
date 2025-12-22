
const path = require("path");
const { RunCommand } = require("../../utils/runCmd");



 const IQTREE_BIN = process.env.IQTREE_BIN || "/usr/bin/iqtree2";



async function RunIqtree(alignmentFile, seqType, outPrefix) {
  if (!alignmentFile) throw new Error("alignmentFile is required");

  
  const base = outPrefix || alignmentFile.replace(/\.(fasta|msa|phy|phylip)$/i, "");

  const args = ["-s", alignmentFile, "-pre", base];

 //model
  if (seqType === "aa") {
    args.push("-st", "AA"); 
    args.push("-m", "LG+F+R10"); 
  } else {
    args.push("-st", "DNA"); 
    args.push("-m", "GTR+F+R10");

  }
  args.push("-B", "1000");       
  args.push("--alrt", "1000");   

  console.log("Running IQ-TREE:", IQTREE_BIN, args.join(" "));

  const result = await RunCommand(IQTREE_BIN, args);

  return {
    input_alignment: alignmentFile,
    out_prefix: base,
    treefile: base + ".treefile",
    log: base + ".log",
    iqtree: base + ".iqtree",
    stdout: result.stdout,
    stderr: result.stderr
  };
}

module.exports = { RunIqtree };

//test
// RunIqtree(
//   "/home/jaga/reo_virusdb/backend/tmp/iqtree-results/test.msa", 
//   "nt",                                                        
//   "/home/jaga/reo_virusdb/backend/tmp/iqtree-results/test"     
// )
