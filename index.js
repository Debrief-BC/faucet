const DBFFaucet  = require("./debrief-faucet");


var options = {
    web3Url:"https://testnet-dev.debrief.co:8545", //  Provider 
    fromAddress:"0xa9....9", // coin token holder address
    privateKey: Buffer.from(
        '77c3122....901b',
        'hex',
    ), // coin holder privateKey
    gasLimit:80000,
    gasPrice:"1"  // gwei
};


var  faucet = new DBFFaucet(options);


faucet.balanceOf("0xa.....09").then(x=>{
    console.log("before", x)
    return faucet.transfer("0xcB.....ec", "1");  // transfer  1 coin to 0xcB...ec
}).then(()=>{
    return faucet.balanceOf("0xa92.....9");   // get balance return wei not ether
}).then(x=>console.log("after", x));