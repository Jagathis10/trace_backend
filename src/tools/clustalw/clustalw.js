const path = require("path");
const { runCmd } = require("../../utils/runCmd.js");

const CLUSTALW_BIN = process.env.CLUSTALW_BIN || "/home/jaga/anaconda3/envs/jaga/bin/clustalw";

async function runClustalw({ inputFasta, cwd, outputFile, extraArgs }) {
  if (!inputFasta) {
    throw new Error("inputFasta is required");
  }

  const outFile = outputFile || path.join(
    cwd || path.dirname(inputFasta),
    `clustalw_alignment_${Date.now()}.aln`
  );

  const args = [];
  args.push(`-INFILE=${inputFasta}`);
  args.push(`-OUTFILE=${outFile}`);
  args.push("-OUTPUT=FASTA");
  args.push("-TYPE=DNA");

  if (Array.isArray(extraArgs) && extraArgs.length > 0) {
    args.push(...extraArgs);
  }

  const cmd = `${CLUSTALW_BIN} ${args.join(" ")}`;
  console.log("Running ClustalW command:", cmd);

  const { code, stdout, stderr } = await runCmd(CLUSTALW_BIN, args, {
    cwd: cwd || path.dirname(inputFasta),
  });

  return {
    code,
    stdout,
    stderr,
    cmd,
    files: { input: inputFasta, output: outFile },
  };
}

module.exports = { runClustalw };
