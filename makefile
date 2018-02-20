GANACHE_EXISTS=$(shell [ -e /usr/bin/ganache-cli ] && echo 1 || echo 0 )
TRUFFLE_EXISTS=$(shell [ -e /usr/bin/truffle ] && echo 1 || echo 0 )

all : before-all check-dependencies close-connections run-blockchain run-tests close-connections

before-all:
	@clear
	@printf ">> Using Ganache for Blockchain envoriment and Truffle for testing\n\n"

check-dependencies:
	@printf ">> Checking Ganache\n"
  ifeq ($(GANACHE_EXISTS), 0)
	  @printf "Ganache not found, installing it\n"
	  sudo npm install -g ganache-cli
  endif

	@printf ">> Checking Truffle\n"
  ifeq ($(TRUFFLE_EXISTS), 0)
    sudo npm install -g truffle
  endif

run-blockchain:
	@printf "\n>> Running Blockchain with Ganache\n"	
	@nohup ganache-cli --defaultBalanceEther=13000000 > /dev/null 2>&1&

run-tests:
	@printf "\n>> Running Tests with Truffle\n"
	truffle test

close-connections:
	@printf "\n>> Closing Connections with the Blockchain\n"
	@if pgrep ganache-cli; then pkill ganache-cli; fi
	@if pgrep node; then pkill node; fi