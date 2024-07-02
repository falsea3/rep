#!/bin/bash

git config --global user.name "falsea3"
git config --global user.email "the4eckone@mail.ru"

PROJECT_DIR="/c/Users/user/Desktop/rep"

cd $PROJECT_DIR
#git init
#git remote add origin https://github.com/falsea3/rep.git
git add .

git commit -m "Auto-update: $(date +'%Y-%m-%d %H:%M:%S')"

git push origin master
