#!/bin/bash
sudo apt-get install -y python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs git-core npm
sudo apt-get install -y ruby1.9.1 rubygems
git clone https://github.com/caske33/AutoRefereeNode.git
sudo npm install -g grunt-cli
cd AutoRefereeNode/
sudo npm install -d
sudo gem install compass
cp config/env/development.json.default config/env/development.json
cp config/env/production.json.default config/env/production.json
cp config/env/test.json.default config/env/test.json
