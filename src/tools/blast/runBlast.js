
const {RunCommand} = require("../../utils/runCmd")
const fs = require('fs')

async function RunBlast(
  program = "blastn",
  query,
  out,
  db,
  word_size = 28,
  evalue = 1e-5,
  outfmt = 15,
  max_target_seqs = 10,
) 

{
  const args = [
    "-query",
    query,
    "-db",
    db,
    // "-out",
    // out,
    "-word_size",
    word_size.toString(),
    "-evalue",
    evalue.toString(),
    "-outfmt",
    outfmt.toString(),
    "-max_target_seqs",
    max_target_seqs.toString(),
  ];

  console.log("Running BLAST command:", program, args.join(" "));
  
  const { stdout, stderr } = await RunCommand(program, args);


 if (stderr && stderr.trim().length > 0) {
    console.log("BLAST stderr:", stderr);
  }

  if (!stdout || stdout.trim() === "") {
    throw new Error("BLAST returned no output");
  }

  const json = stdout.trim();
  fs.writeFileSync(out, json, "utf-8");
  console.log("blast saved as json" ,out);
  return json;
}
 

module.exports = {
  RunBlast,
};

//test case
// RunBlast(program= "blastn", query="/home/jaga/reo_virusdb/backend/tmp/blast-results/nt_1765391850997_query.fasta", out="/home/jaga/reo_virusdb/backend/tmp/blast-results/test_query.json", db="/home/jaga/reo_virusdb/backend/tmp/blast-results/nt_1765391850997_db"
// )