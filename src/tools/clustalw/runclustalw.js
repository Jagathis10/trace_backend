const path = require("path"); 

const { RunCommand } = require("../../utils/runCmd");
const { makePhylip}= require("../../utils/makePhylip");
const CLUSTALW_BIN =
  process.env.CLUSTALW_BIN || "/home/jaga/anaconda3/envs/jaga/bin/clustalw2";

async function RunClustalW(inputFasta, seqType) {
  let TYPE;
  if (seqType === "nt") {
    TYPE = "DNA";
  } else {
    TYPE = "PROTEIN";
  }

  const base = inputFasta.replace(/\.fasta$/i, "");

  const alnOut = base + ".aln";
  // const phyOut = base + ".phy";

  // ALN
  const args = [];
  args.push("-INFILE=" + inputFasta);
  args.push("-TYPE=" + TYPE);
  args.push("-OUTFILE=" + alnOut);
  // args.push("-OUTPUT=CLUSTAL");
   args.push("-OUTPUT=FASTA");
  if (seqType === "aa") args.push("-MATRIX=BLOSUM");

  console.log("Running ClustalW (ALN):", CLUSTALW_BIN, args.join(" "));
  const runAln = await RunCommand(CLUSTALW_BIN, args);

  // // PHYLIP
  // const argsPhy = [];
  // argsPhy.push("-INFILE=" + inputFasta);
  // argsPhy.push("-TYPE=" + TYPE);
  // argsPhy.push("-OUTFILE=" + phyOut);
  // argsPhy.push("-OUTPUT=PHYLIP");
  // if (seqType === "aa") argsPhy.push("-MATRIX=BLOSUM");

  // console.log("Running ClustalW (PHYLIP):", CLUSTALW_BIN, argsPhy.join(" "));
  // const runPhy = await RunCommand(CLUSTALW_BIN, argsPhy);

  const outputDir = path.dirname(alnOut);
  // const phyOut = makePhylip(alnOut, outputDir);

    const phyOut = path.join(outputDir, path.basename(base) + ".phy");
    makePhylip(alnOut, phyOut);

    console.log("PHYLIP file created:", phyOut);

  

  return {
    input_fasta: inputFasta,
    output_aln: alnOut,
    stdout_aln: runAln.stdout,
    stderr_aln: runAln.stderr,

        output_phy: phyOut,

    // output_phy: phyOut,
    // stdout_phy: runPhy.stdout,
    // stderr_phy: runPhy.stderr,
  };
}

module.exports = { RunClustalW };

// test case
// RunClustalW(
//   "/home/jaga/reo_virusdb/backend/tmp/clustalw-results/query.fasta",
//   "aa"
// )
