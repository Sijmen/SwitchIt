var http = require('http');
var port = 8000;
var sys = require('sys');
var exec = require('child_process').exec;
var url = require('url');
var ip = '0.0.0.0';

http.createServer(function (req, res) {
    if (req.method == 'POST') {
      var body = '';
      req.on('data',function(data){
        console.log(data);
        body+=data;
      });
      req.on('end',function(){
        res.writeHead(200,{'Content-Type':'application/json'});
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
    port:5984,
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

      // repeat 4 times to increase chance that all switches are actually switched
      // since most of the RF switches do not support bidirectional communication there are
      // not many other possibilities to increase reliability of switch behaviour
      var tries = 4;
      for (var i = 0; i < tries; i++) {
        for (var index in oSwitches.rows) {
          // delay
          if (oSwitches.rows[index].doc.delay !== undefined && (index > 0 || i > 0)) {
            aFinalCommands.push('sleep ' + parseInt(oSwitches.rows[index].doc.delay) / 1000);
          }

          // off before on
          if (oSwitches.rows[index].doc.offBeforeOn && i < tries/2 && sState == 'on') {
            aFinalCommands.push(sControlSwitch(oSwitches.rows[index].doc, 'off'));
          }

          // on before off
          if (oSwitches.rows[index].doc.onBeforeOff && i < tries/2 && sState == 'off') {
            aFinalCommands.push(sControlSwitch(oSwitches.rows[index].doc, 'on'));
          }

          // actual action
          if (i >= tries/2 || (sState == 'off' && !oSwitches.rows[index].doc.onBeforeOff) || (sState == 'on' && !oSwitches.rows[index].doc.offBeforeOn)) {
            aFinalCommands.push(sControlSwitch(oSwitches.rows[index].doc, sState));
          }
        }
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
oExecutables.action = __dirname+'/lights/action.o';
oExecutables.elro = __dirname+'/lights/elro.o';
oExecutables.kaku = __dirname+'/lights/kaku.o';
oExecutables.blokker = __dirname+'/lights/blokker.o';

function sControlSwitch(oSwitch,sState){
  state = sState;
  sResult = '';
  switch(oSwitch.brand){
    case 'action':
      sResult = (oExecutables.action+' '+oSwitch.dip+' '+oSwitch.channel+' '+state);
      break;
    case 'elro':
      sResult = (oExecutables.elro+' '+oSwitch.code+' '+oSwitch.socket+' '+state);
      break;
    case 'kaku':
      sResult = (oExecutables.kaku+' '+oSwitch.address+' '+oSwitch.device+' '+state);
      break;
    case 'blokker':
      sResult = (oExecutables.blokker+' '+oSwitch.device+' '+state);
  }
  return sResult;
}

function vSendCommand(sCommand){
  console.log('sending command: '+sCommand);
  exec(sCommand,function(error,stdout,stderr){
    console.log(error);
    console.log(stdout);
    console.log(stderr);
  });
}
