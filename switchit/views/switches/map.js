function(doc){
	if(doc.doctype.indexOf('switch') > -1){
		toSend = {};
		toSend.doc = doc;
		toSend.idlist_on = [];
		toSend.idlist = [];
		toSend.idlist_off = [];
		
		if(doc.type.indexOf('group') == -1 && doc.type.indexOf('mood') == -1)
			toSend.idlist = [doc._id];
		else if(doc.type.indexOf('mood') == -1)
			toSend.idlist = doc.on;
		else{
			toSend.idlist_on = doc.on;
			toSend.idlist_off = doc.off;
		}

		emit([doc.type,doc._id],toSend) ;
	}
}
