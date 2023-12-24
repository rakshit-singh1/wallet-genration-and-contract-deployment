const fs = require("fs").promises;
const solc = require("solc");

async function main() {
  try {
    // Load the contract source code
    const sourceCode = await fs.readFile("demo.sol", "utf8");
    // Compile the source code and retrieve the ABI and Bytecode
    const { abi, bytecode } = compile(sourceCode, "Storage");
    // Store the ABI and Bytecode into a JSON file
    const artifact = JSON.stringify({ abi, bytecode }, null, 2);
    await fs.writeFile("demo.json", artifact);
    console.log("Compilation successful. Artifacts stored in demo.json");
  } catch (error) {
    console.error("Error during compilation:", error);
  }
}

function compile(sourceCode, contractName) {
  // console.log("sourcecode is", sourceCode," and contract name is", contractName);
  const input = {
    language: "Solidity",
    sources: { main: { content: sourceCode } },
    settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
  };

  try {
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    if (output.errors) {
      // Log compilation errors
      console.error("Compilation errors:", output.errors);
      throw new Error("Compilation failed with errors.");
    }

    const artifact = output.contracts.main[contractName];
    return {
      abi: output.contracts.main.Storage.abi,
      bytecode: artifact.evm.bytecode.object,
    };
  } catch (error) {
    console.error("Error during compilation:", error);
    throw error;
  }
}

main();
