const {spawn} = require("child_process");

function runCmd(command, args = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args);
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
        stdout += data.toString();
        });

    child.stderr.on("data", (data) => {
        stderr += data.toString();
        });

    child.on("close", () => {
        const result = { stdout, stderr };
        console.log(result);
        if (stderr === "") {
            resolve(result);
        } else {
            reject(new Error(`Command failed with  ${stderr}`));
        }
    });
  });
}   



module.exports = {runCmd};