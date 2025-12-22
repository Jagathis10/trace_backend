const { MergedFasta } = require("../../utils/mergeFasta");
const { RunMafft } = require("./runMafft");

async function mafft(
  gene,
  type,
  segment,
  year,
  tissue,
  age,
  state,
  country,
  seqType,
  query
) {
  const built = await MergedFasta(
    "mafft",
    gene,
    type,
    segment,
    year,
    tissue,
    age,
    state,
    country,
    seqType,
    query
  );

  
  const msaOut = built.base + ".msa";
  const mafftout = await RunMafft(built.mergedFasta, msaOut);

  return {
    tool: "mafft",
    seqType,
    db_count: built.db_count,
    input_fasta: mafftout.input_fasta,
    output_msa: mafftout.output_msa,
    log_file: mafftout.log_file,
  };
}

module.exports = { mafft };
