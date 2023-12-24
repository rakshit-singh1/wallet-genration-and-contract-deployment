const express = require('express');
const { Web3 } = require('web3');

const app = express();
const port = 3000;

const web3 = new Web3('https://sepolia.infura.io/v3/9ca1af07007a4463b2a3a3bacb7cafc6');

async function checkBalance(accountAddress) {
    try {
        const balanceWei = await web3.eth.getBalance(accountAddress);
        const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
        return balanceEther;
    } catch (error) {
        console.error('Error checking balance:', error);
        throw error;
    }
}

app.get('/createAccount', async (req, res) => {
    try {
        const newAccount = web3.eth.accounts.create();
        const balance = await checkBalance(newAccount.address);

        res.status(200).json({
            message: 'Account created successfully',
            address: newAccount.address,
            privateKey: newAccount.privateKey,
            balance: balance,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create account', message: error.message });
    }
});

app.listen(port, () => {
    console.log(`API server is running on http://localhost:${port}`);
});
