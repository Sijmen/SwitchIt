function(doc){
	if(doc.doctype.indexOf('switch') > -1)
		if(doc.type.indexOf('group') == -1)
			emit([doc.type,doc._id],[doc._id]);
		else
			emit([doc.type,doc._id],doc.list);
}