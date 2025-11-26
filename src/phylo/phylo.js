const path = require("path");
const { spawn } = require("child_process");

function runPhyloScript(inputfasta, thread = 8) {
    return new Promise((resolve, reject) => {

        const scriptpath = path.join(__dirname, "phylo.py");

        const dir = path.dirname(inputfasta);
        const baseName = path.parse(inputfasta).name;

        
        const py = spawn(
            "/home/jaga/anaconda3/envs/jaga/bin/python3",
            [scriptpath, "-i", inputfasta, "-t", String(thread)],
            { cwd: dir }
        );

        let stdoutData = "";
        let stderrData = "";

        py.stdout.on("data", (data) => {
            stdoutData += data.toString();
        });

        py.stderr.on("data", (data) => {
            stderrData += data.toString();
        });

        py.on("close", (code) => {

            
            const msa = path.join(dir, `${baseName}.msa`);
            const phylip = path.join(dir, `${baseName}.phy`);
            const treefile = `${phylip}.treefile`;
            const identityExcel = path.join(dir, `${baseName}_identity.xlsx`);

            const result = {
                code,
                stdout: stdoutData,
                stderr: stderrData,
                files: {
                    fasta: inputfasta,
                    msa,
                    phylip,
                    treefile,
                    identityExcel
                },
            };

            if (code === 0) {
                return resolve(result);
            }

            reject(result);
        });
    });
}

module.exports = { runPhyloScript };
