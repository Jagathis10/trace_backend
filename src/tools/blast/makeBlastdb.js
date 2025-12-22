const { RunCommand } = require("../../utils/runCmd");
async function MakeBlastDatabase(dbFasta, db, dbType) {
    const args = [
        "-in", dbFasta,
        "-out", db,
        "-dbtype", dbType
    ];
    
    await RunCommand("makeblastdb", args).then(({ stderr}) => {
        if (stderr) console.log("makeblastdb stderr:", stderr);
        else {
            return db
        }
    });
}

module.exports = {
  MakeBlastDatabase,
};

