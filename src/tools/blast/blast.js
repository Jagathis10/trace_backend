const path = require("path");
const { runCmd } = require("../../utils/runCmd.js");
const fs = require("fs");

const blastHeaders = [
  "query_id",
  "subject_id",
  "percent_identity",
  "alignment_length",
  "mismatches",
  "gap_opens",
  "q_start",
  "q_end",
  "s_start",
  "s_end",
  "evalue",
  "bit_score"
];

async function runBlast(
    program = "blastn",
    queryFasta,
    outputFile,
    dbPrefix,
    wordSize = 28,
    evalue = 1e-5,
    outfmt = 6,
    maxTargetSeqs = 5,
) {
    
    const args = [
        "-query", queryFasta,
        "-db", dbPrefix,
        "-out", outputFile,
        "-word_size", wordSize.toString(),
        "-evalue", evalue.toString(),
        "-outfmt", outfmt.toString(),
        "-max_target_seqs", maxTargetSeqs.toString(),
    ];

    const cmd = `${program} ${args.join(" ")}`;
    console.log("Running BLAST command:", cmd);



    // const {stdout, stderr} = await runCmd( program , args);

    const blastResult = fs.readFileSync("/home/jaga/reo_virusdb/backend/tmp/blast-results/blast_output_1764198990742.txt", "utf-8");

    const lines = blastResult.trim().split("\n");

    const parsedResults = lines.map(line => {
    const cols = line.trim().split(/\s+/);  // split by whitespace
    const obj = {};

    blastHeaders.forEach((header, i) => {
        obj[header] = cols[i] || null;
    });

    return obj;
    });

    console.log("Parsed BLAST results:", parsedResults);

    
    return {
         parsedResults
    };
        


}


// runBlast()


module.exports = { runBlast };