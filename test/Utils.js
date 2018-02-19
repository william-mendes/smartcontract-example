module.exports.increaseTime = function(deltaTime){
    if(deltaTime > 0){
        console.log("\n>>> TIME INCREASED +" + deltaTime, "\n")
        web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [deltaTime],
            id: 0
        })
        web3.currentProvider.send({
            jsonrpc: "2.0",
            method: "evm_mine",
            params: [],
            id: 0
        })
    }
},
module.exports.epochToHuman = function(epoch){
    return "("+epoch+") " + new Date(epoch*1000).toGMTString()
}