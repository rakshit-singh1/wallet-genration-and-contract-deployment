const { Web3 } = require("web3");
const fs = require("fs");
const { abi } = JSON.parse(fs.readFileSync("demo.json"));
async function main() {
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`,
    ),
  );
  const signer = web3.eth.accounts.privateKeyToAccount(
    "0x" + process.env.SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);
  const contract = new web3.eth.Contract(
    abi,
    process.env.DEMO_CONTRACT,
  );
  console.log(contract.methods);
  let value = await contract.methods.retrieve().call();
  console.log(value);

}



require("dotenv").config();
main();