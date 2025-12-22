
const fs = require("fs");
const { spawn } = require("child_process");

function RunCommand(command, args = [], options = {}) {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";

    const stdio = ["ignore", "pipe", "pipe"]; //012
    let outFd = null;
    let errFd = null;

    if (options.stdoutFile) {
      outFd = fs.openSync(options.stdoutFile, "w");
      stdio[1] = outFd;
    }
    if (options.stderrFile) {
      errFd = fs.openSync(options.stderrFile, "w");
      stdio[2] = errFd;
    }

    const child = spawn(command, args, { stdio });

     child.on("error", (err) => {
      if (outFd !== null) fs.closeSync(outFd);
      if (errFd !== null) fs.closeSync(errFd);
      resolve({ stdout: "", stderr: err.message });
    });


    if (!options.stdoutFile) {
      child.stdout.on("data", (d) => (stdout += d.toString()));
    }
    if (!options.stderrFile) {
      child.stderr.on("data", (d) => (stderr += d.toString()));
    }

    child.on("close", () => {
      if (outFd !== null) fs.closeSync(outFd);
      if (errFd !== null) fs.closeSync(errFd);
      resolve({ stdout, stderr });
    });
  });
}

module.exports = { RunCommand };
