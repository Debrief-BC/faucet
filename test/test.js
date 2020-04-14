const Config = require("../config.json");
const Faucet = artifacts.require("Faucet");
const Sleep = require('sleep-promise');


function sleepSec(sec){
    if(sec < 0){
        sec = 0;
    }
    console.log("Sleep :" + sec + " Sec");
    return Sleep(sec * 1000); // sleep use ms
}

contract('Faucet', function(accounts) {
    var instance = null;

    it("Contract Faucet will deployed", () => {
        return Faucet.deployed()
        .then(_instance => {
            instance = _instance;
            assert.notEqual(instance, null);
        });
    });

    it("Contract info will be correct", ()=>{
        return instance.canRequestByUser()
        .then(data=>{
            assert.equal(data, Config.canRequestByUser);
            return  instance.requestPeriod();
        })
        .then(data=>{
            assert.equal(data, Config.requestPeriod);
            return  instance.requestAmount();
        })
        .then(data=>{
            assert.equal(web3.utils.fromWei(data), Config.requestAmount);
        })
    })

    it("Contract function will be correct", ()=>{

        // test for by user self request;
        return instance.setCanRequestByUser(false).then(()=>{
            return web3.eth.sendTransaction({from: accounts[1], to: instance.address, value: 0}).then(()=>{
                assert(false,"The Transaction will failure, because can't request by user");
            }).catch(ex=>{
                return instance.setCanRequestByUser(true).then(()=>{
                    return web3.eth.sendTransaction({from: accounts[1], to: instance.address, value: 0});
                });
            })
        })
        .then(()=>{
            return web3.eth.sendTransaction({from: accounts[1], to: instance.address, value: 0}).then(()=>{
                assert(false,"The Transaction will failure, because one cycle just can request one time");
            }).catch(ex=>{
                return sleepSec(Config.requestPeriod)
            })
        })
        .then(()=>{
            return web3.eth.sendTransaction({from: accounts[1], to: instance.address, value: 0})
        }).then(()=>{
            
        })
    });
});