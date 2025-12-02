function buildFasta(results, type = "nucleotide") {
  const typeField = type === "nucleotide" ? "nt_sequence" : "aa_sequence";

  return results
    .filter(item => item[typeField] && item[typeField].trim() !== "")
    .map(item => {
      const trace = item.trace_id;
      const seg = item.segment;
      const seq = item[typeField].replace(/\s+/g, "").toUpperCase();
      return `>${trace}_${seg}\n${seq}`;
    })
    .join("\n");
}
module.exports = { buildFasta};

