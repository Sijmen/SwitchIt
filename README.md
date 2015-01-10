# Home automation with a Raspberry Pi B rev2

This project aims to automate your home. Well, at least your power sockets. You will need to buy the hardware yourself, but the software to control it is available here. I'm based in the Netherlands and thus all brands supported right now are Dutch. But these brands are probably just rebrands of the product that comes out of a Chinese factory so it might work with your switch as well.

## What do I get?
Once you installed the software correctly you will have a web interface, which is desktop/tablet/mobile friendly. On this interface you can switch on/off a switch. You can name the switch any name you like. It is also possible to create groups and mix different brands together in one group. In the future there will be a possibility to create Moods, turning on some lights and turning off others to create a nice atmosphere in the house.

## What do I need?
You will need a
* $35 [Raspberry Pi](http://www.raspberrypi.org/) B rev 2
* One [433-434MHz RF-transmitter](http://www.ebay.com/sch/i.html?_nkw=433Mhz+rf+transmitter&LH_BIN=1)
* Cables to connect your RF-transmitter to the Raspberry Pi. Using female/female [jumper wires](https://www.google.com/search?q=jumper+wires) may be and easy solution that eliminates the needs for soldering.
* Switches/sockets that can be remotely controlled with an RF remote. [Google](https://www.google.com/search?q=rf+controlled+socket)

## I want it! How do I get started?
If you have the hardware, you can install SwitchIt in two ways.
#### Automatic
NOTE: The automatic install will attempt to reinstall WiringPi. If you do not wish to do this, follow the manual installation.
Copy and paste the following and the installation will start automatically:
```
wget https://raw.githubusercontent.com/Sijmen/SwitchIt/master/install -O install && sh install
```
Please follow the instructions on the screen.
#### Manual
If you do not like the automatic install, you can enter the commands from the ```install``` file yourself. It is however recommended to start the configuration server (the final step), which will configure CouchDB automatically.
