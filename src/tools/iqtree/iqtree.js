const path = require("path");
const { runCmd } = require("../../utils/runCmd.js");

const IQTREE_BIN = process.env.IQTREE_BIN || "/home/jaga/anaconda3/envs/jaga/bin/iqtree2";

async function runIqtree({
    inputFasta,
    cwd,
    datatype = "nt",  // nt or aa
    extraArgs,
}) {
    if (!inputFasta) {
        throw new Error("inputFasta is required");
    }

    const args = [];
    args.push("-s", inputFasta);
    args.push("-nt", "AUTO");
//model selection based on datatype
    if (datatype === "aa") {
        args.push("-st", "AA");
        args.push("-m", "LG+F+R10");   
        args.push("--alrt", "1000");  
        args.push("-B", "1000");      
    } else {
        args.push("-st", "DNA");
        args.push("-m", "GTR+F+R10");
        args.push("--alrt", "1000");
        args.push("-B", "1000");
    }

// Append any extra arguments
    if (Array.isArray(extraArgs) && extraArgs.length > 0) {
        args.push(...extraArgs);
    }

    // Final cmd
    const cmd = `${IQTREE_BIN} ${args.join(" ")}`;
    console.log("Running IQ-TREE command:", cmd);

    const { code, stdout, stderr } = await runCmd(IQTREE_BIN, args, {
        cwd: cwd || path.dirname(inputFasta),
    });

    return {
        code,
        stdout,
        stderr,
        cmd,
        files: { input: inputFasta },
    };
}

module.exports = { runIqtree };