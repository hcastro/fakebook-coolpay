#!/bin/bash

# Script to set up repository

# 1. need nvm
if ! hash nvm 2>/dev/null; then
  curl https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | sh
  [[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh
fi

# 2. use this repo's version of node
nvm install

# 3. install dependencies
npm install

# 4. make sure everything works as expected
npm test