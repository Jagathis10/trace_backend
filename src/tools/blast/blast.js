const path = require("path");
const fs = require("fs");

const {SearchDatabase} = require("../../utils/search.js");   
const {GenerateFasta} = require("../../utils/buildFasta.js");
const {RunBlast} = require("./runBlast.js")
const {MakeBlastDatabase} = require("./makeBlastdb.js")


async function blast(
    gene,
    type,
    segment,
    year,
    tissue,
    age,
    state,
    country,
    seqType,
    query,
)
 {
    const searchResults = await SearchDatabase(gene, type, segment, year, tissue, age, state, country);

    if (!searchResults.length) {
        return { 
            db_count: 0,
            db_filters: { gene, type, segment, year, tissue, age, state, country },
            hits: [],
            message: "No sequences found for the given search filters"  
        };
    }

    const tmpDir = path.join(__dirname, "../../../tmp/blast-results");
    const timestamp = Date.now();
    const base = path.join(tmpDir, `${seqType}_${timestamp}`);
    const dbFasta    = `${base}_db.fasta`;
    const queryFasta = `${base}_query.fasta`;
    const out    = `${base}_blast.json`;   
    const db      = `${base}_db`


  
  GenerateFasta(searchResults, seqType, dbFasta);

    let cleanquery;
    const trimmed = (query || "").trim();
    if (trimmed.startsWith(">")) {
       
        cleanquery = trimmed + "\n";
    }

    else {
        const cleanSeq = trimmed.replace(/\s+/g, "").toUpperCase();
        cleanquery = `>query\n${cleanSeq}\n`;
    }

    fs.writeFileSync(queryFasta, cleanquery);


    const dbType = seqType === "nt" ? "nucl" : "prot";
    const program = seqType === "nt" ? "blastn" : "blastp";
    const word_size = seqType === "nt" ? 28 : 7;

    //casll to make balst db
    await MakeBlastDatabase(dbFasta, db, dbType);
    


  const blastOutput = await RunBlast(
  program,
  queryFasta,
  out,
  db,
  word_size
);


const results = JSON.parse(blastOutput);
return results;

}   

module.exports = {
  blast,
};




   