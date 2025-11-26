const path = require("path");
const { runCmd } = require("../index.js");

async function runBlast({
    program = "blastn",
    queryFasta,
    dbPrefix,
    wordSize = 10,
    evalue = 1e-5,
    outfmt = 6,
    maxTargetSeqs = 10,
    cwd,

}) {
    if (!queryFasta) {
        throw new Error("queryFasta is required");
    }
    if (!dbPrefix) {
        throw new Error("dbPrefix is required");
    }

    const args = [
        "-query", queryFasta,
        "-db", dbPrefix,
        "-word_size", wordSize.toString(),
        "-evalue", evalue.toString(),
        "-outfmt", outfmt.toString(),
        "-max_target_seqs", maxTargetSeqs.toString(),
    ];

    const cmd = `${program} ${args.join(" ")}`;
    console.log("Running BLAST command:", cmd);

    const options = {
        cwd: cwd || path.dirname(queryFasta),  

    };

    const {code, stdout, stderr} = await runCmd( program , args, options);
    // if (code !== 0) {
    //     throw new Error(`BLAST command failed with code ${code}: ${stderr}`);
    // }
    
    return {
        code,
        stdout,
        stderr,
        cmd,
        files: {query: queryFasta, db: dbPrefix},
    };
        


}


module.exports = { runBlast };