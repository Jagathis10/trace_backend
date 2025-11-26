const path = require("path");
const { spawn } = require("child_process");

blast = (inputFasta, dbPath, outPath, evalue = 0.001, numThreads = 4) => {
    return new Promise((resolve, reject) => {

        const blastn = spawn(
            "blastn",
            [
                "-query", inputFasta,
                "-db", dbPath,
                "-out", outPath,
                "-evalue", String(evalue),
                "-num_threads", String(numThreads),
                "-outfmt", "6 qseqid sseqid pident length mismatch gapopen qstart qend sstart send evalue bitscore"
            ]
        );

        let stdoutData = "";
        let stderrData = "";

        blastn.stdout.on("data", (data) => {
            stdoutData += data.toString();
        });

        blastn.stderr.on("data", (data) => {
            stderrData += data.toString();
        });

        blastn.on("close", (code) => {

            const result = {
                code,
                stdout: stdoutData,
                stderr: stderrData,
                files: {
                    output: outPath
                },
            };

            if (code === 0) {
                return resolve(result);
            }

            reject(result);
        });
    });
}

module.exports = { blast };