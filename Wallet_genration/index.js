
const { Web3 } = require('web3');
const web3 = new Web3('https://sepolia.infura.io/v3/9ca1af07007a4463b2a3a3bacb7cafc6');
var a=web3.eth.accounts.create();
var b=web3.eth.accounts.create();
async function checkBalance(accountAddress) {
    try {
        // Get the balance in Wei
        const balanceWei = await web3.eth.getBalance(accountAddress);
  
        // Convert Wei to Ether
        const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
  
        console.log(`Balance of ${accountAddress}: ${balanceEther} ETH`);
        return balanceEther;
    } catch (error) {
        console.error('Error checking balance:', error);
        throw error;
    }
}
  
checkBalance(a.address);
checkBalance(b.address);
console.log(a);
console.log(b);