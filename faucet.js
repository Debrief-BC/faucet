const Web3 = require("web3");
const EthereumTx = require('ethereumjs-tx').Transaction;

class Faucet {
    constructor(options){
        this.web3 = new Web3(options.web3Url);
        this.contracts = new this.web3.eth.Contract(options.abi,options.contractId);
        this.options = options;
    }
    
    requestFor(to) {
        return this.web3.eth.getTransactionCount(this.options.fromAddress).then((txCount)=>{
            const tx = new EthereumTx({
                nonce:    this.web3.utils.toHex(txCount),
                gasLimit: this.web3.utils.toHex(this.options.gasLimit), 
                gasPrice: this.web3.utils.toHex(this.web3.utils.toWei(this.options.gasPrice, 'gwei')),
                to: this.options.contractId,
                data: this.contracts .methods.requestFor(to).encodeABI()
            });
            tx.sign(this.options.privateKey)
            const serializedTx = tx.serialize()
            const raw = '0x' + serializedTx.toString('hex')
            return this.web3.eth.sendSignedTransaction(raw);
        })
    }

    balanceOf(address){
        return this.web3.eth.getBalance(address).then(balance=>{
            return this.web3.utils.fromWei(balance);
        })
    }
}



module.exports = Faucet;