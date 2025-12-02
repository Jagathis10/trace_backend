
const DatabaseModel = require("../models/schema.js");


//function
const addIfExists = (obj, key, value) => {
  if (value !== undefined && value !== null && value !== "") {
    if (typeof value === "string") {
      obj[key] = value.trim();
    } else {
      obj[key] = value;
    }
  }
};

async function buildAndRunSearch( gene, type, segment, year, tissue, age, state, country) {
 
  const query = {};

  addIfExists(query, "gene", gene);
  addIfExists(query, "type", type);
  addIfExists(query, "segment", segment);
  addIfExists(query, "tissue", tissue);
  addIfExists(query, "age_days", age);
  addIfExists(query, "state", state);
  addIfExists(query, "country", country);



  // Handle year range 
  if (typeof year === "string" && year.trim() !== "") {
    const [start, end] = year.split("-").map(Number);

    if (!isNaN(start) && !isNaN(end)) {
      query.year = { $gte: start, $lte: end };
    } else if (!isNaN(start)) {
      query.year = start;
    }
  }

  console.log("Final Mongo Query:", query);

  const results = await DatabaseModel.find(query)
    .select("-original_id -internal_id -accession");

  console.log(`tracedb returned ${results.length} records`);

  return results;
}

module.exports = { buildAndRunSearch };