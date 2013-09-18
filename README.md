# Home automation with a Raspberry Pi B rev2
## Connecting the RF transmitter
Connect a RF tranmitter with a frequency of 433MHz or 434MHz with its:

* Vcc to pin 4 (Vcc 5V)
* GND to pin 6 (GND)
* Data to pin 8 (TX)

If you have an ANT connection, it is the antenna. To improve performance it should be connected to a wire of around 10cm.

## Connecting the IR receiver

* VCC to pin 1 (3.3V)
* GND to pin 14 (GND)
* OUT to pin 16

The pin numbering runs from 1 to 26, how this numbering runs can be found at [a RPi Low-level peripherals wiki][src] or by searching Google for [raspberry pi pin layout][src2] .

  [src]: http://elinux.org/RPi_Low-level_peripherals
  [src2]: https://www.google.nl/search?tbm=isch&q=raspberry+pi+pin+layout&oq=raspberry+pi+pin+layout

## Getting and installing the software
sudo apt-get update

sudo apt-get upgrade

sudo apt-get install git-core

sudo apt-get install couchdb

sudo apt-get install nodejs

//in a folder you want to install wiringPi

git clone git://git.drogon.net/wiringPi

cd wiringPi

./build

//in a folder you want to install the switch control

git clone git://github.com/Sijmen/switchit.git

cd SwitchIt

cd lights

make rebuild

	rm -f elro.o blokker.o action.o kaku.o
	g++ -o kaku.o kaku.cpp -I/usr/local/include -L/usr/local/lib -lwiringPi
	g++ -o action.o action.cpp -I/usr/local/include -L/usr/local/lib -lwiringPi
	g++ -o blokker.o blokker.cpp -I/usr/local/include -L/usr/local/lib -lwiringPi
	g++  -o elro.o elro.cpp -I/usr/local/include -L/usr/local/lib -lwiringPi
	Made all


//making files executable for non-root users and preventing all users from editing the files.

sudo chown root *.o && sudo chmod =x *.o && sudo chmod +s *.o

//if you want to test if it works and if you wired everything correctly.
-----
For kaku with current remote:
./testKaku.sh A P 1 16
for kaku without remote, first plug in reciever and then do
./kaku.o A 1 on
For the rest
./action.o 18 B on (dipchannel socket state)
./blokker.o 7 on (device state)
./elro.o 5 D on (systemcode socket state)
-----

cd ..

cd www

// erica push the www folder (asuming admin-party on couchdb, otherwise edit .couchapprc to http://adminname:adminpass@localhost/etc...)

erica push

cd ..

nodejs server.js



//... not finished yet! might be missing stuff.

// you need to create a daemon for nodejs server.js
