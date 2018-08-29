function validateForm(form){
	var constraints = null;
	
	var code = form.getValue('categoryCode');	
	var c1 = DatasetFactory.createConstraint('categoryCode', code, code, ConstraintType.MUST);
	
	var version = form.getVersion();	 
	if(version > 1000){
		var c2 = DatasetFactory.createConstraint('metadata#version', version, version, ConstraintType.MUST);
		constraints = new Array(c1, c2);
	} else{
		constraints = new Array(c1);
	}
	
	var dataset = DatasetFactory.getDataset('form-category', null, constraints, null);	
	var d = dataset.getRowsCount();
	if(d > 0){
		throw " J\u00E1 existe uma categoria com o c\u00F3digo: " + code;
	}
}