const express = require("express");
const fs = require("fs").promises;
const solc = require("solc");
const multer = require("multer");

const app = express();
const port = 3000;

app.use(express.json());

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/compile", upload.single("solidityFile"), async (req, res) => {
  try {
    const sourceCode = req.file.buffer.toString(); // Assuming the file is uploaded as "solidityFile"
    const contractName = req.body.contractName || "Storage";

    const { abi, bytecode } = compile(sourceCode, contractName);

    const artifact = JSON.stringify({ abi, bytecode }, null, 2);
    await fs.writeFile("demo.json", artifact);

    res.status(200).json({ message: "Compilation successful. Artifacts stored in demo.json" });
  } catch (error) {
    console.error("Error during compilation:", error);
    res.status(500).json({ error: "Compilation failed", message: error.message });
  }
});

function compile(sourceCode, contractName) {
  const input = {
    language: "Solidity",
    sources: { main: { content: sourceCode } },
    settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
  };

  try {
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    if (output.errors) {
      console.error("Compilation errors:", output.errors);
      throw new Error("Compilation failed with errors.");
    }

    const artifact = output.contracts.main[contractName];
    return {
      abi: output.contracts.main[contractName].abi,
      bytecode: artifact.evm.bytecode.object,
    };
  } catch (error) {
    console.error("Error during compilation:", error);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});
