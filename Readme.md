1) Step One: Ajust file: TestFixtures.json
2) Run a local blockchain test enviroment
3) Run tests with truffle test

================================================================================

Run local test enviroment (Option One):
Ps: It will run on test enviroment and unlock account 0 and 1 and start listening on localhost:8545

$ npm install -g ganache-cli@6.0.3
$ ganache-cli --defaultBalanceEther=13000000

================================================================================

Run local test enviroment (Option Two):
Ps: It will run on test enviroment and unlock account 0 and 1 and start listening on localhost:8545

$ npm install -g ethereumjs-testrpc
$ testrpc -u 0 -u 1

================================================================================

Run on tests on Rinkeby
Ps: Need Ether and password to unlock accounts

geth account list
geth account new (create 10 accounts)
geth account list
touch accounts.txt
geth --rpc --rinkeby --rpcapi="db,eth,net,web3,personal,web3" --unlock="0,1,2,3,4,5" --password="accounts.txt"

================================================================================
