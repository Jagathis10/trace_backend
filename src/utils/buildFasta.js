const fs = require("fs");
function GenerateFasta(results, type = "nt", outputFile = "") {
    if (type !== "nt" && type !== "aa") {
        throw new Error("provide sequence type:");
    }
  const typeField = type === "nt" ? "nt_sequence" : "aa_sequence";

  const fasta = results
    .filter(item => item[typeField] && item[typeField].trim() !== "")
    .map(item => {
      const trace = item.trace_id;
      const seq = item[typeField].replace(/\s+/g, "").toUpperCase();
      return `>${trace}\n${seq}`;
    })
    .join("\n");
    
    if (outputFile) {
      fs.writeFileSync(outputFile, fasta);
}
 return fasta;
}
module.exports = { GenerateFasta };

