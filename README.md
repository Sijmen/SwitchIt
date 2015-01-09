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
If you have the hardware, copy and paste the following and the installation will start automatically:
```
wget https://raw.githubusercontent.com/Sijmen/SwitchIt/develop/install -O install && sh install
```
Please follow the instructions on the screen.
