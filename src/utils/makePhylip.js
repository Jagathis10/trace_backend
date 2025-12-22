const fs = require("fs");


function makePhylip(msaFile, outFile) {


  const data = fs.readFileSync(msaFile, "utf8");
  const records = data.split(">").filter(Boolean);

  const seen = new Set();
  const seqs = [];

  records.forEach((r, i) => {
    const lines = r.trim().split("\n");


    let id = lines[0].split(/\s+/)[0];

    const seq = lines.slice(1).join("").trim();

    if (seen.has(id))
       id = id + "_" + i;
    seen.add(id);

    seqs.push({ id, seq });
  });

  let out = `${seqs.length} ${seqs[0].seq.length}\n`;
  
  seqs.forEach(s => (out += `${s.id} ${s.seq}\n`));

  
  fs.writeFileSync(outFile, out);

  return outFile;
}


module.exports = { makePhylip };






































