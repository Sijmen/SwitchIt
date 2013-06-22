CC=g++
KAKUFILE=kaku.cpp
ACTIONFILE=action.cpp
ELROFILE=elro.cpp
BLOKKERFILE=blokker.cpp
kaku: $(KAKUFILE)
	$(CC) -o kaku.o $(KAKUFILE) -I/usr/local/include -L/usr/local/lib -lwiringPi

action: $(ACTIONFILE)
	$(CC) -o action.o $(ACTIONFILE) -I/usr/local/include -L/usr/local/lib -lwiringPi

blokker: $(BLOKKERFILE)
	$(CC) -o blokker.o $(BLOKKERFILE) -I/usr/local/include -L/usr/local/lib -lwiringPi

elro: $(ELROFILE)
	$(CC)  -o elro.o $(ELROFILE) -I/usr/local/include -L/usr/local/lib -lwiringPi

all: kaku action blokker elro
	@echo "Made all"

make: all

clean: 
	rm -f elro.o blokker.o action.o kaku.o

rebuild: clean all

