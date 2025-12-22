

const { MergedFasta } = require("../../utils/mergeFasta");
const { RunMafft } = require("../mafft/runMafft");
const { RunClustalW } = require("../clustalw/runclustalw");
const { RunIqtree } = require("./runIqtree");


async function iqtree(
  gene, type, segment, year, tissue, age, state, country, seqType, query,
  aligner = "mafft"
)
 {
 
  const built = await MergedFasta(
    "iqtree",
    gene, type, segment, year, tissue, age, state, country,
    seqType, query
  );

  if (built.db_count === 0) {
    return {
      message: "No sequences found",
      db_count: 0
    };
  }

 
  let alignmentFile = "";
  let alignmentInfo = {};

  if (aligner === "clustalw") {
    const clustalResult = await RunClustalW(built.mergedFasta, seqType);
    alignmentFile = clustalResult.output_phy; 
    alignmentInfo.aligner = "clustalw";
    alignmentInfo.output_aln = clustalResult.output_aln;
    alignmentInfo.output_phy = clustalResult.output_phy;
    alignmentInfo.stdout = clustalResult.stdout;
    alignmentInfo.stderr = clustalResult.stderr;

  } else { 
    const msaFile = built.base + ".msa";
    const mafftResult = await RunMafft(built.mergedFasta, msaFile);
    alignmentFile = mafftResult.output_msa;    
    alignmentInfo = { aligner, ...mafftResult };
  }


  const iqtreePrefix = built.base + ".iqtree"; 
  const treeResult = await RunIqtree(alignmentFile, seqType, iqtreePrefix);


  return {
    tool: "iqtree",
    seqType: seqType,
    db_count: built.db_count,
    input_fasta: built.mergedFasta,
    alignment: alignmentInfo,
    iqtree: treeResult
  };
}

module.exports = { iqtree };






















