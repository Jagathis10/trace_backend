const path = require("path");
const fs = require("fs");

const {SearchDatabase} = require("./search");
const {GenerateFasta} = require ("./buildFasta");

async function MergedFasta(
    toolName,
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
    const results = await SearchDatabase ( gene,type, segment, year, tissue, age, state, country);


  const tmpDir = path.join(__dirname, `../../tmp/${toolName}-results`);
  const timestamp = Date.now();
  const base = path.join(tmpDir, `${seqType}_${timestamp}`);
  const mergedFasta = `${base}.fasta`;


  fs.writeFileSync(mergedFasta, GenerateFasta(results, seqType) + "\n", "utf8");


  if (query && query.trim()) {
    fs.appendFileSync(mergedFasta, query.trim() + "\n", "utf8");
  }

  return {
    mergedFasta,         
    tmpDir,               
    base,                 
    db_count: results.length, 
  };

}

module.exports = { MergedFasta};







