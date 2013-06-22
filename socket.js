net = require('net');
socket = net.connect('/var/run/lirc/lircd',connected);
socket.setEncoding('utf8');
function connected(){ 
  socket.on('data',function(data){
    if(data.indexOf('KEY_POWER2') > -1)
      console.log('off');
    else
      console.log('on');
  });
  console.log("Now listening...");
};
