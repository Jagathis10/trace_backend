const { spawn } = require("child_process");
const path = require("path");

//const MAFFT_BIN = process.env.MAFFT_BIN || "/usr/bin/mafft";
const MAFFT_BIN = process.env.MAFFT_BIN || "/home/jaga/anaconda3/envs/jaga/bin/mafft";


function runMafft({ inputFasta, cwd, extraArgs }) {
  if (!inputFasta) {
    return Promise.reject(new Error("inputFasta is required"));
  }

  const args =
    Array.isArray(extraArgs) && extraArgs.length > 0
      ? extraArgs.slice()
      : ["--auto"];

  args.push(inputFasta);

  const cmd = `${MAFFT_BIN} ${args.join(" ")} 2>/dev/null`;

  console.log("Running MAFFT command:", cmd);

  return new Promise((resolve, reject) => {
    const child = spawn(cmd, {
      cwd: cwd || path.dirname(inputFasta),
      shell: true,
      env: process.env,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", (err) => reject(err));

    child.on("close", (code) => {
      const result = {
        code,
        stdout,
        stderr,
        cmd,
        files: { input: inputFasta },
      };

      if (code === 0) {
        resolve(result);
      } else {
        reject(new Error(`MAFFT failed (code ${code}): ${stderr || stdout}`));
      }
    });
  });
}

module.exports = { runMafft };

























































// const {runCmd} = require("../index.js");

// const MAFFT_BIN = 
//  process.env.MAFFT_BIN || "/usr/bin/mafft";

//  async function runMafft({
//     inputFasta,
//     cwd,
//     extraArgs}) { 
//     if (!inputFasta) {
//         throw new Error("inputFasta is required");
//     }

//     const args = [];
//     if (Array.isArray(extraArgs) && extraArgs.length > 0) {
//         args.push(...extraArgs);
//     } else {
//         args.push("--auto");
//     }
//     args.push(inputFasta);
    
//     const cmd = `${MAFFT_BIN} ${args.join(" ")}`;
//     console.log("Running MAFFT command:", cmd);

//     const {code , stdout , stderr} = await runCmd(MAFFT_BIN, args, {
//         cwd: cwd || path.dirname(inputFasta),
//     });

//     return {
//         code,
//         stdout,
//         stderr,
//         cmd,
//         files: {input: inputFasta},
//     };
// }  
// module.exports = {runMafft};
