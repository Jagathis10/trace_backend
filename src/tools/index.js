const {spawn} = require("child_process");

function runCmd(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, options);
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
        stdout += data.toString();
        });

    child.stderr.on("data", (data) => {
        stderr += data.toString();
        });

    child.on("close", (code) => {
        const result = { code, stdout, stderr };
        if (code === 0) {
            resolve(result);
        } else {
            reject(new Error(`Command failed with code ${code}: ${stderr}`));
        }
    });
  });
}   

module.exports = {runCmd};