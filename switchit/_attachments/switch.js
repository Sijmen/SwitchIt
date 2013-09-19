var idList = {};
var allSwitches = {};
var switchesView = '/switchit/_design/switchit/_view/switches';

function vPost(sState,oCaller){
	var id = $(oCaller).parent().prevAll('h3[data-id]').data('id');
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

function vSetMood(oCaller){
	var id = $(oCaller).parent().prevAll('h3[data-id]').data('id');
	oData = {
		ids:idList[id]['on'],
		state:'on'
	};
	// console.log(oData);
	$.post('/_nodejs',JSON.stringify(oData));

	oData = {
		ids:idList[id]['off'];
		state:'off';
	}
	$.post('/_nodejs',JSON.stringify(oData));
}


//register listeners
$(function(){
	$.getJSON(switchesView,function(data){
		$.each(data.rows,function(key,_switch){
			if(key[0] == 'mood'){
				idlist[_switch.id]['on'] = _switch.value.idlist_on
				idlist[_switch.id]['off'] = _switch.value.idlist_off
			}
			else
				idList[_switch.id] = _switch.value.idlist;
			allSwitches[_switch.id] = _switch;
		});
		vAddButtons(allSwitches);
		// console.log(allSwitches);
		$('.turn-on').on('click',function(){
			vPost('on',this);
		});
		$('.turn-off').on('click',function(){
			vPost('off',this);
		});

		$('.set-mood').on('click',function()){
			vSetMood(this);
		}
	});
});
function sGetButtonCode(oSwitch){
	if(oSwitch.value.doc.type.indexOf('mood') == -1){
		return 	'<span class="btn btn-large btn-warning turn-on"><i class="icon-white icon-ok-circle"></i> On</span>'+
				'<span class="btn btn-large btn-inverse turn-off"><i class="icon-white icon-ban-circle"></i> Off</span>';
	}
	else{
		return '<span class="btn btn-large btn-warning turn-on"><i class="icon-white icon-ok-circle"></i> Set the mood</span>'
	}

}
function vAddButtons(aSwitches){
	var iCounter = 0;
	var sResult = '';
	$.each(aSwitches,function(sId,oSwitch){
		if(iCounter % 2 === 0){

			sResult +=
			'<div class="row">'+
				'<div class="block span4 offset2 text-center" >'+
					'<h3 data-id="'+sId+'">'+oSwitch.value.doc.name+'</h3>'+
					'<p class="muted">'+oSwitch.key[0]+'</p>'+
					'<p class="btn-group">'+
						sGetButtonCode(oSwitch)+
					'</p>'+
				'</div>';
		}
		else{
			sResult +=
				'<div class="block span4 text-center" >'+
					'<h3 data-id="'+sId+'">'+oSwitch.value.doc.name+'</h3>'+
					'<p class="muted">'+oSwitch.key[0]+'</p>'+
					'<p class="btn-group">'+
						sGetButtonCode(oSwitch)+
					'</p>'+
				'</div>'+
			'</div>';
		}
		iCounter++;
	});
	$('.container').append(sResult);
}
