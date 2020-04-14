const Config = require("../config.json");
const Faucet = artifacts.require("Faucet");

module.exports = function(deployer, network, accounts) {
  return deployer.deploy(Faucet,Config.canRequestByUser,Config.requestPeriod,web3.utils.toWei(Config.requestAmount))
  .then(instance => {
    web3.eth.sendTransaction({from: accounts[0], to: instance.address, value: web3.utils.toWei(Config.totalAmount)});
  });
};