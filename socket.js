var http = require('http');
var net = require('net');
socket = net.connect('/var/run/lirc/lircd',connected);
socket.setEncoding('utf8');
serverPort = 8000;
serverIp = '127.0.0.1';
lastSend = null;
idList = ["Schakelaar C"];
function connected(){ 
  socket.on('data',function(data){
    if(lastSend == null || ((new Date()).getTime() - lastSend.getTime()) > 1200){
    if(data.indexOf('KEY_POWER2') > -1){
	data = {ids:idList,state:"on"};
	console.log('on');
	postRequest(data);
	}
    else{
	data = {ids:idList,state:"off"};
	postRequest(data);
      console.log('off');}
}
lastSend = new Date();
  });
  console.log("Now listening...");
};

function postRequest(a_oData){
	var postParams = {
	hostname:serverIp,
	port:serverPort,
	method:'POST',
	headers:{'Content-Type':'application/json'}
	}

	var req = http.request(postParams,function(response){
		var sBody = '';
		response.setEncoding('utf8');
		response.on('data',function(data){sBody += data;});
		response.on('end',function(){console.log(sBody);});
	});
	console.log(a_oData);
	req.write(JSON.stringify(a_oData));
	req.end();
}
