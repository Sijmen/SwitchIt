var idList = {};
var allSwitches = {};
var switchesView = '/switches/_design/switches/_view/switches';

function vPost(sState,oCaller){
	var id = $(oCaller).parent().prevAll('h3').html();
	oData = {
		ids:idList[id],
		state:sState
	};
	console.log(oData);
	$.post('/_nodejs',JSON.stringify(oData),function(data){
//		console.log('result:') ;
		// console.log(data);
	});
}


//register listeners
$(function(){
	$.getJSON(switchesView,function(data){
		$.each(data.rows,function(key,_switch){
			idList[_switch.id] = _switch.value;
			allSwitches[_switch.id] = _switch;
		});
		vAddButtons(allSwitches);
		$('.btn-warning').on('click',function(){
			vPost('on',this);
		});
		$('.btn-inverse').on('click',function(){
			vPost('off',this);
		});
	});
});

function vAddButtons(aSwitches){
	var iCounter = 0;
	var sResult = '';
	$.each(aSwitches,function(sId,oSwitch){
		if(iCounter % 2 === 0){
			sResult +=
			'<div class="row">'+
				'<div class="block span4 offset2 text-center" >'+
					'<h3>'+sId+'</h3>'+
					'<p class="muted">'+oSwitch.key[0]+'</p>'+
					'<p class="btn-group">'+
						'<a href="#" class="btn btn-large btn-warning"><i class="icon-white icon-ok-circle"></i> On</a>'+
						'<a href="#" class="btn btn-large btn-inverse"><i class="icon-white icon-ban-circle"></i> Off</a>'+
					'</p>'+
				'</div>';
		}
		else{
			sResult +=
				'<div class="block span4 text-center" >'+
					'<h3>'+sId+'</h3>'+
					'<p class="muted">'+oSwitch.key[0]+'</p>'+
					'<p class="btn-group">'+
						'<a href="#" class="btn btn-large btn-warning"><i class="icon-white icon-ok-circle"></i> On</a>'+
						'<a href="#" class="btn btn-large btn-inverse"><i class="icon-white icon-ban-circle"></i> Off</a>'+
					'</p>'+
				'</div>'+
			'</div>';
		}
		iCounter++;
	});
	$('.container').append(sResult);
}
