const Faucet  = require("./faucet");


var options = {
    web3Url:"http://127.0.0.1:7545", //  Web3 Provider 
    abi:require("./build/contracts/Faucet.json").abi,
    contractId:"0x6A74994eF139A38929229F9dD612e2715F90f9B8", // smart contract address
    fromAddress:"0xa92e7f637f79e27464A4A1d724b5cCD23A694409", // Owner address
    privateKey: Buffer.from(
        '77c3122e245e638a5e4fd54075e4fe4f1e91b9258fb7f2f828d220685f43901b',
        'hex',
    ), // Owner privateKey
    gasLimit:80000,
    gasPrice:"1"
};


var  faucet = new Faucet(options);

var requester = "0xcB383c57cb19dbED0d0eF459eB4b693CDba454ec";

faucet.balanceOf(requester).then(x=>{
    console.log("before", x)
    return faucet.requestFor(requester, 1);
}).then(()=>{
    return faucet.balanceOf(requester);
}).then(x=>console.log("after", x)).catch(ex=>console.log(ex.message));