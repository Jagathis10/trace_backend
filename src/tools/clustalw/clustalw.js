
const fs = require("fs");
const {MergedFasta} = require("../../utils/mergeFasta");
const { RunClustalW } = require("./runclustalw");


async function clustalw(
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
)

{
  const built = await MergedFasta (
    "clustalw",
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

  if (built.db_count ===0) {
  return { message: "no seq found" };
  }

 

 const clustalout = await RunClustalW(built.mergedFasta, seqType);

  return {
    tool: "clustalw",
    seqType: seqType,
    db_count: built.db_count,

    input_fasta: clustalout.input_fasta,
    output_aln: clustalout.output_aln,
    stdout_aln: clustalout.stdout_aln,
    stderr_aln: clustalout.stderr_aln,

    output_phy: clustalout.output_phy,
    stdout_phy: clustalout.stdout_phy,
    stderr_phy: clustalout.stderr_phy,
  };
}

module.exports = { clustalw };


