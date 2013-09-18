function(doc){
	if(doc.doctype.indexOf('switch') > -1){
		toSend = {};
		toSend.doc = doc;
		if(doc.type.indexOf('group') == -1)
			toSend.idlist = [doc._id];
		else
			toSend.idlist = doc.list;
		emit([doc.type,doc._id],toSend) ;
	}
}