var http = require('http');
var port = 8000;
var sys = require('sys');
var exec = require('child_process').exec;
var child;
var url = require('url');
var ip = '0.0.0.0';

http.createServer(function (req, res) {
    if(req.method == 'POST'){
      var body = '';
      req.on('data',function(data){
        console.log(data);
        body+=data;
      });
      req.on('end',function(){
        res.writeHead(200,{'Content-Type':'application/json'});
        console.log(body);
        res.end(JSON.stringify(oProcessRequest(JSON.parse(body))));  
      });
    }
    else{
      res.writeHead(405);
      res.end('Only post allowed, not '+req.method);
    }
    //console.log(req.headers);
    //console.log(url.parse(req.url,true));
    res.writeHead(200, {'Content-Type': 'application/json'});
    //execBackgroundSomethingAndReturn(res,url.parse(req.url,true));
//    res.end(JSON.stringify(url.parse(req.url,true)));
}).listen(port, ip);
console.log('Server running at http://'+ip+':'+port+'/');

function oProcessRequest(oRequest){
  console.log(oRequest);
  vGetRequest(oRequest.ids,oRequest.state);
  for(var index in oRequest.ids){
//    vGetRequest(oRequest.ids[index],oRequest.state);
  }
  return {succes:true};
}

function vGetRequest(aKeys,sState){
  console.log(sState);
  var getRequestOptions = {
    hostname:'localhost',
    port:8080,
    path:'/switchit/_all_docs?include_docs=true',
    method:'POST',
    headers:{'Content-Type':'application/json'}
  }
  var req = http.request(getRequestOptions,function(response){
    var sBody ='';
    response.setEncoding('utf8');
    response.on('data',function(data){
      sBody += data;
    });
    response.on('end',function(){
      console.log('body');
      console.log(sBody);
      oSwitches = JSON.parse(sBody);
      aFinalCommands = [];
      for(var index in oSwitches.rows){
        aFinalCommands.push(sControlSwitch(oSwitches.rows[index].doc,sState));
      }
      vSendCommand(aFinalCommands.join(' && '));
    });
  });
  req.on('error',function(error){
    console.log('Problem with getting item: '+error.message);
  });
  oRequestDocs ={keys:aKeys};
  req.write(JSON.stringify(oRequestDocs));
  req.end();
}

var oExecutables = {};
oExecutables.action = 'lights/action.o';
oExecutables.elro = 'lights/elro.o';
oExecutables.kaku = 'lights/kaku.o';
oExecutables.blokker = 'lights/blokker.o';

function sControlSwitch(oSwitch,sState){
  state = sState;

  switch(oSwitch.type){
    case 'action':
      return (oExecutables.action+' '+oSwitch.dip+' '+oSwitch.channel+' '+state);
      break;
    case 'elro':
      return (oExecutables.elro+' '+oSwitch.code+' '+oSwitch.socket+' '+state);
      break;
    case 'kaku':
      return (oExecutables.kaku+' '+oSwitch.address+' '+oSwitch.device+' '+state);
      break;
    case 'blokker':
      return (oExecutables.blokker+' '+oSwitch.device+' '+state);
  }
}

function vSendCommand(sCommand){
  console.log('sending command: '+sCommand);
  exec(sCommand,function(error,stdout,stderr){
    console.log(error);
    console.log(stdout);
    console.log(stderr);
  });
}
