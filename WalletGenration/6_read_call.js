const express = require("express");
const { Web3 } = require("web3");
const fs = require("fs");
const { abi } = JSON.parse(fs.readFileSync("demo.json"));
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.post("/retrieve", async (req, res) => {
  try {

    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://${process.env.network}.infura.io/v3/${process.env.INFURA_API_KEY}`,
      ),
    );
    
    const contract = new web3.eth.Contract(
      abi,
      req.body.contractAddress,
    );

    let value = await contract.methods.retrieve().call();
    value=value.toString();
    res.json({ value });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
