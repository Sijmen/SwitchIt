sudo apt-get update
sudo apt-get upgrade
sudo apt-get install git-core
sudo apt-get install couchdb
sudo apt-get install nodejs
//in a folder you want to install wiringPi
git clone git://git.drogon.net/wiringPi
cd wiringPi
./build

//in a folder you want to install the switch controll
git://github.com/Sijmen/switchit.git
cd lights
make all

//making files executable for non-root users and preventing
//all users from editing the files.

sudo chown root *.o && sudo chmod =x *.o && sudo chmod +s *.o

//... not finished yet! might be missing stuff
// you need to create a daemon for nodejs server.js
// erica push the www folder (asuming admin-party on couchdb, otherwise edit .couchapprc to http://adminname:adminpass@localhost/etc...)