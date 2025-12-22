
const { RunCommand } = require("../../utils/runCmd");

const MAFFT_BIN =
 process.env.MAFFT_BIN || "/home/jaga/anaconda3/envs/jaga/bin/mafft";

async function RunMafft(inputFasta, outputMsa) {
  const logFile = outputMsa + ".log";
  const args = ["--auto", inputFasta];

  await RunCommand(MAFFT_BIN, args, 
    {
    stdoutFile: outputMsa,
    stderrFile: logFile,
  });

  return {
     input_fasta: inputFasta,
      output_msa: outputMsa, 
      log_file: logFile 
    };
}

module.exports = { RunMafft };


//test
//   RunMafft(
//     "/home/jaga/reo_virusdb/backend/tmp/mafft-results/query.fasta",
//     "/home/jaga/reo_virusdb/backend/tmp/mafft-results/query.msa"
//   )
