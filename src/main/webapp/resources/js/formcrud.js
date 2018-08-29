var Formcrud = SuperWidget.extend({

	instanceId: null,
	fileBase64: null,
	folderId: null,	
	installed: false,
	loading: false,	
	
	datatableCategory: null,
	datatableProduct: null,
	
	tempCategoryCode: null,
	tempCategoryName: null,
	tempCategoryDescription: null,
	tempCategoryDocumentId: null,
	tempCategoryDocumentVersion: null,	
	
	tempProductCode: null,
	tempProductName: null,
	tempProductDescription: null,
	tempProductCategory: null,
	tempProductDocumentId: null,
	tempProductDocumentVersion: null,
	
	parentDocumentIds: {},
	
	// dataset para armazenar as informações dos formulários
	dsCrudComponent: 'dsCrudComponent000',
	
	// formulários a serem instalados
	forms: [{
				'fileName': 'form-category.html',
	        	'datasetName': 'form-category',
	        	'url-html': '/form-crud/resources/form-category/form-category.html',
	        	'url-event-validate': '/form-crud/resources/form-category/events/validateForm.js',
	        	'formId': ''
	        },{
	        	'fileName': 'form-product.html',
	        	'datasetName': 'form-product',
	        	'url-html': '/form-crud/resources/form-product/form-product.html',
	        	'url-event-validate': '/form-crud/resources/form-product/events/validateForm.js',
	        	'formId': ''
	        }],
	        
	// pasta para o formulário
	folderName: 'MyApp_ForlderForCRUD',	
	
	/**
	 * Verificações iniciais para o componente
	 */
	init: function() {
		var that = this;
		// verifica se o dataset existe
		var dt = DatasetFactory.getDataset(this.dsCrudComponent, null,null,null);

		// não permitindo maiusculas e espaços
		$('#categoryCode, #productCode').on('change keyup paste',function(){		
			this.value = this.value.toLowerCase();
			this.value = this.value.replace(/\s/g,'');
		});
		
		// caso não, exibe a aŕea de upload dos formulários 
		if(dt.values == undefined){
			$('#installArea').show();
		// caso contrário, exibe a tela para CRUD das entidades
		} else{
			var values = dt.values;
			for (var i = 0; i < values.length; i++) {
				var item = values[i];
				that.parentDocumentIds[item['dataset-name']] = item['folder-id']; 
			}			
			that.buildFormsAndListsCategories();
			that.buildFormsAndListsProducts();			
			$('#crudArea').show();					
		}
	},
	
	/**
	 * Processa os templates e retorna o html
	 */
	processTemplate: function(template, data) {
		var html = Mustache.render(template, data);
		return html;
	},

	bindings: {
		local: {
			'install': ['click_createFolder'],
			
			'save-category': ['click_saveCategory'],
			'edit-category': ['click_editCategory'],
			'update-category': ['click_updateCategory'],
			'cancel-update-category': ['click_cancelUpdateCategory'],
			'remove-category': ['click_removeCategory'],
	
			'save-product': ['click_saveProduct'],
			'edit-product': ['click_editProduct'],
			'update-product': ['click_updateProduct'],
			'cancel-update-product': ['click_cancelUpdateProduct'],
			'remove-product': ['click_removeProduct']
		}
	},
	
	/************************************************/
	/******* CRIA PASTA e INICIA INSTALAÇÃO *********/
	/************************************************/
	createFolder: function(){
		var that = this;
		this.createFolderService(this.folderName, function(err, data){
			if(!err){
				$('#up-folder-icon').removeClass('fluigicon-remove-sign').addClass('fluigicon-check-circle-on');
				that.folderId = data.content.id;
				that.doInstall();
			}
		});
	},
	
	doInstall: function(){		
		var that = this;
		this.loading = FLUIGC.loading(window);
		this.loading.show();
		// percorre a lista de formulários a serem criados
		for (var i = 0; i < that.forms.length; i++) {			
			var obj = that.forms[i];
			that.getCreateCardXML(obj);
		};
		
		// aguarda um tempo até finalizar o upload dos formulários		
		setTimeout(function(){
			// cria o dataset para armazenar o parentDocumentId
			that.criarDataset();
		}, 5000);
		
	},
	
	/*********** CREATE CARD: WS para criar o formulario ************/	
	
	/**
	 * Arquivo XML(ECMCardIndexService_createCard.xml) do WebService
	 */
	getCreateCardXML: function(obj){
		var that = this;
		$.ajax({
			  url: '/form-crud/resources/xml/ECMCardIndexService_createCard.xml',
			  type: 'GET',
			  dataType: 'xml',
			  headers:{'Content-Type':'text/xml','X-Requested-With':'XMLHttpRequest'},
			  processData: false,
			  success: function(xml){	  
				  that.extractFormToBase64($(xml), obj);
			  }
		});		
	},
	
	/**
	 * Tranasforma o formulario HTML em Base64
	 */
	extractFormToBase64: function(xml, obj){
		var that = this;		
		$.ajax({
			url: obj['url-html'],
			type: 'GET',
			dataType: 'binary',
			headers:{'Content-Type':'text/html','X-Requested-With':'XMLHttpRequest'},
			processData: false,
			success: function(html){				
				var reader = new window.FileReader();		        
		        reader.readAsDataURL(html);
		        reader.onloadend = function () {
		            that.extractJsToBase64(xml, reader.result.split(';base64,')[1], obj);
		        }
			}, error: function (xhr, ajaxOptions, thrownError) {
		  	}
		});
	},

	/**
	 * Recupera o evento validateForm JS(validateForm.js). Apenas o texto, nao é necessário transformar em Base64
	 */
	extractJsToBase64: function(xml, html, obj){
		var that = this;
		$.ajax({
			url: obj['url-event-validate'],
			type: 'GET',
			dataType: 'text',
			headers:{'Content-Type':'text/html','X-Requested-With':'XMLHttpRequest'},
			processData: false,
			success: function(js){
		        that.buildXmltoWS(xml, html, js, obj);
			}, error: function (xhr, ajaxOptions, thrownError) {}
		});
	},
	 
	/**
	 * Monta o XML do WS(ECMCardIndexService_createCard.xml) com o HTML convertido para Base64 e o JS
	 */
	buildXmltoWS: function(xml, html, validateForm, obj){
		xml.find('username').text(WCMAPI.userLogin);
		xml.find('companyId').text(WCMAPI.getTenantId());
		xml.find('parentDocumentId').text(this.folderId);
		xml.find('datasetName').text(obj['datasetName']);
		xml.find('publisherId').text(WCMAPI.userLogin);	
		
		var attachmentItem = '<item><attach>true</attach><fileName>' + obj['fileName'] + '</fileName><filecontent>' + html + '</filecontent><principal>true</principal></item>';
		xml.find('Attachments').append(attachmentItem);
		
		var customEvents = '<item><eventId>validateForm</eventId><eventDescription>' + validateForm + '</eventDescription></item>';
		xml.find('customEvents').append(customEvents);
        
		this.uploadFormWS(xml, obj);
	},
	
	
	/*** CRUD CATEGORIAS ***/
	
	// monta um form para cada entidade e cria um datatable 
	buildFormsAndListsCategories: function(){
		var that = this;		
		that.datatableCategory = FLUIGC.datatable('#listCategories', {
		    dataRequest: [],
		    renderContent: '.template-category-tr',
		    classSelected: 'active',
		    actions: {enabled: false},
		    search: {enabled: false},
		    navButtons: {enabled: false},					    
		    header: [
		        {'title': 'Código'},
		        {'title': 'Nome'},
		        {'title': 'Descrição'},
		        {'title': 'Ações'}
		    ]
		}, function(err, data) {});		
		that.listCategories();
	},
	
	// lista as categorias e já apenda no datable e no select de produtos
	listCategories: function(){
		var that = this;
		var dataset = DatasetFactory.getDataset('form-category', null, null, null);		
		if(dataset.values){
			var categories = dataset.values;
			for (var i = 0; i < categories.length; i++) {
				var cat = categories[i];				
				that.datatableCategory.addRow(i, cat);				
				$('#productCategory')
					.append(that.processTemplate(that.templates['template-category-option'], {
						'categoryCode': cat.categoryCode,
						'categoryName': cat.categoryName
				}));
			}
		}
	},	

	// cria um novo registro de formulário
	saveCategory: function(){
		var that = this,
			data = [],
			validated = true;
		$('form#categoryForm input[type=text]').each(function(){
			var input = $(this);
			var category = {};
			category['name'] = input.attr('name');
			var value = input.val();
			if(value == ''){
				var label = input.attr('title');
				FLUIGC.toast({
					message: '${i18n.getTranslationP1("msg.alert.field.required", "' + label + '")}',
					type: 'danger'
				});
				validated = false;
				return;
			}
			category['value'] = value;
			data.push(category);
		});
		
		// caso algum campo esteja vazio, não continua.
		if(!validated) return false;
		
		// cria um registro de fomulário. Necessário o parentDocumentId
		var parentDocumentId = this.parentDocumentIds['form-category']
		this.createFormRegister(data, parentDocumentId, function(err, data){
			if(!err){
				FLUIGC.toast({
					message: '${i18n.getTranslation("msg.alert.category.saved")}',
					type: 'success'
				});
				// limpa o formulário
				$('form#categoryForm input[type=text]').each(function(){
					$(this).val('');					
				});
				// recarrega o datatable com o registro recem criado
				that.datatableCategory.destroy();
				that.buildFormsAndListsCategories();
			} else{
				FLUIGC.toast({
					message: err.responseJSON.message.message,
					type: 'danger'
				});				
			}
		});		
	},
	
	// edita, no próprio datatable, um registro de formulário. Nesse caso, é necessário o documentId e o version
	editCategory: function(el, ev) {
		var that = this,
			row = that.datatableCategory.selectedRows()[0],
			data = that.datatableCategory.getRow(row);
		this.tempCategoryCode = data.categoryCode;
		this.tempCategoryName = data.categoryName;
		this.tempCategoryDescription = data.categoryDescription;
		this.tempCategoryDocumentId = data['metadata#id'];
		this.tempCategoryDocumentVersion = data['metadata#version'];				
		if(row >= 0) {
			// altera a linha da tabela para um input com os dados e os botões de salvar e cancelar
		    that.datatableCategory.updateRow(row, data, '.template-category-edit');
		    
		    // inativa os outros botões de edit e remove
		    $('[data-edit-category]').prop('disabled', true);
		    $('[data-remove-category]').prop('disabled', true);
		}
	},
	
	// atualize um registro de formulário
	updateCategory: function(el, ev){
		var that = this,
			row = that.datatableCategory.selectedRows()[0],
			data = that.datatableCategory.getRow(row),
			documentId = $(el).data('document-id'),
			documentVersion = $(el).data('document-version'),
			list = [];
		
		// percorre os campos a serem atualizados
		$('tr#' + data.categoryCode + '_itemCategory input[type=text]').each(function(){
			var input = $(this);
			var category = {};
			category['name'] = input.attr('name');
			category['value'] = input.val();
			list.push(category);
		});
		that.updateForm(list, documentId, documentVersion, function(err, data){
			if(!err){
				// monta a linha do datatable com os novos valores. O code sempre permanece o mesmo
				var newRow = {};
				for (var i = 0; i < list.length; i++) {
					var obj = list[i];
					newRow[obj.name] = obj.value;
				}
				newRow['metadata#id'] = data.documentId;
				newRow['metadata#version'] = data.version;
				that.datatableCategory.updateRow(row, newRow);				
				FLUIGC.toast({
					message: '${i18n.getTranslation("msg.alert.category.updated")}',
					type: 'success'
				});
			    // ativa novamente os outros botoes de edit e remove
				$('[data-edit-category]').prop('disabled', false);
				$('[data-remove-category]').prop('disabled', false);
			}
		});		
	},
	
	// botão de cancelar, retornando os valores originais
	cancelUpdateCategory: function(el, ev) {
		var originalRow = {
			'categoryCode': this.tempCategoryCode,
	        'categoryName': this.tempCategoryName,
	        'categoryDescription': this.tempCategoryDescription,
	        'metadata#id': this.tempCategoryDocumentId,
			'metadata#version': this.tempCategoryDocumentVersion
	    };
		this.datatableCategory.updateRow(this.datatableCategory.selectedRows()[0], originalRow);
		
	    // ativa novamente os outros botoes de edit e remove
		$('[data-edit-category]').prop('disabled', false);
		$('[data-remove-category]').prop('disabled', false);
	},
	
	// remove um registro do formulário de categoria
	removeCategory: function(el, ev) {
		var that = this,
			row = that.datatableCategory.selectedRows()[0],
			data = that.datatableCategory.getRow(row);
		if(row >= 0) {
			FLUIGC.message.confirm({
			    message: '${i18n.getTranslation("msg.remove.category")}' + ' ' + data.categoryName + '?',
			    title: '${i18n.getTranslation("label.remove.category")}',
			    labelYes: '${i18n.getTranslation("label.remove")}',
			    labelNo: '${i18n.getTranslation("label.cancel")}',
			}, function(result, el, ev) {
				if(result) {
					// antes de excluir uma categoria, verifica se não existe nenhum produto associado a esse registro
					var c1 = DatasetFactory.createConstraint('productCategory', data.categoryCode, data.categoryCode, ConstraintType.MUST);
					var constraints = new Array(c1);
					var dataset = DatasetFactory.getDataset('form-product', null, constraints, null);
					// caso sim, exibe um toast informando o erro
					if(dataset.values.length > 0){
						FLUIGC.toast({
							message: '${i18n.getTranslationP1("msg.alert.remove.category.not.allowed", "' + data.categoryName + '")}',								     
							type: 'danger'
						});
						return false;
					// caso não, remove o registro da categoria
					} else{
						var documentId = data['metadata#id'];
						that.removeDocumentById(documentId, function(err, data){
							if(!err){
								that.datatableCategory.removeRow(row);
								that.datatableCategory.reload();
								FLUIGC.toast({
									message: '${i18n.getTranslationP1("msg.alert.category.removed", "' + data.categoryName + '")}',									
									type: 'success'
								});							
							}
						});						
					}
				}
			});
		}
	},
	
	/*** CRUD PRODUTOS ***/
	
	// monta um form para cada entidade e cria um datatable 
	buildFormsAndListsProducts: function(){
		var that = this;		
		that.datatableProduct = FLUIGC.datatable('#listProducts', {
		    dataRequest: [],
		    renderContent: '.template-product-tr',
		    classSelected: 'active',
		    actions: {enabled: false},
		    search: {enabled: false},
		    navButtons: {enabled: false},					    
		    header: [
		        {'title': 'Código'},
		        {'title': 'Nome'},
		        {'title': 'Descrição'},
		        {'title': 'Categoria'},
		        {'title': 'Ações'}
		    ]
		}, function(err, data) {});
		that.listProducts();
	},
	
	// lista os produtos
	listProducts: function(){
		var that = this;
		// lista os produtos através do dataset
		var dataset = DatasetFactory.getDataset('form-product', null, null, null);		
		if(dataset.values){
			var products = dataset.values;
			for (var i = 0; i < products.length; i++) {
				var prod = products[i];
				var productCategory = prod['productCategory']; 
				prod['productCategory'] = productCategory;
				that.datatableProduct.addRow(i, prod);
			}
		}
	},

	// cria um novo registro de formulário para produtos
	saveProduct: function(){
		var that = this,
			data = [],
			validated = true;
		// percorre os campos
		$('form#productForm input[type=text], form#productForm option:checked').each(function(){
			var product = {};
			var field = $(this);			
			product['name'] = field.attr('name');
			var value = field.val();			
			if(value == ''){
				var label = field.attr('title');
				FLUIGC.toast({
					message: '${i18n.getTranslationP1("msg.alert.field.required", "' + label + '")}',
					type: 'danger'
				});
				validated = false;
			}
			product['value'] = value;			
			data.push(product);
		});
		// caso algum campo esteja vazio, não continua.
		if(!validated) return false;
		
		// recupera o parentId do form-product para criar um registro de formulario
		var parentDocumentId = this.parentDocumentIds['form-product']
		// cria um registro de fomulário. Necessário o parentDocumentId
		this.createFormRegister(data, parentDocumentId, function(err, data){
			if(!err){
				FLUIGC.toast({
					message: '${i18n.getTranslation("msg.alert.product.saved")}',
					type: 'success'
				});				
				// limpa o formulário
				$('form#productForm input[type=text], form#productForm select').each(function(){
					$(this).val('');					
				});
				// recarrega o datatable com o registro recem criado
				that.datatableProduct.destroy();
				that.buildFormsAndListsProducts();
			} else{
				FLUIGC.toast({
					message: err.responseJSON.message.message,
					type: 'danger'
				});				
			}
		});
	},
	
	// edita, no próprio datatable, um registro de formulário. Nesse caso, é necessário o documentId e o version
	editProduct: function(el, ev) {
		var that = this,
			row = that.datatableProduct.selectedRows()[0],
			data = that.datatableProduct.getRow(row);
		this.tempProductCode = data.productCode;
		this.tempProductName = data.productName;
		this.tempProductDescription = data.productDescription;
		this.tempProductCategory = data.productCategory;
		this.tempProductDocumentId = data['metadata#id'];
		this.tempProductDocumentVersion = data['metadata#version'];				
		if(row >= 0) {
			// altera a linha da tabela para um input com os dados e os botões de salvar e cancelar
		    that.datatableProduct.updateRow(row, data, '.template-product-edit');
		    
		    // inativa os outros botões de edit e remove
		    $('[data-edit-product]').prop('disabled', true);
		    $('[data-remove-product]').prop('disabled', true);
		}
	},
	
	// atualize um registro de formulário
	updateProduct: function(el, ev){
		var that = this,
			row = that.datatableProduct.selectedRows()[0],
			data = that.datatableProduct.getRow(row),
			documentId = $(el).data('document-id'),
			documentVersion = $(el).data('document-version'),
			list = [];
		// percorre os campos a serem atualizados
		$('tr#' + data.productCode + '_itemProduct input').each(function(){
			var input = $(this);
			var product = {};
			product['name'] = input.attr('name');
			product['value'] = input.val();
			list.push(product);
		});
		that.updateForm(list, documentId, documentVersion, function(err, data){
			if(!err){
				// monta a linha do datatable com os novos valores. O code sempre permanece o mesmo
				var newRow = {};
				for (var i = 0; i < list.length; i++) {
					var obj = list[i];
					newRow[obj.name] = obj.value;
				}
				newRow['metadata#id'] = data.documentId;
				newRow['metadata#version'] = data.version;
				that.datatableProduct.updateRow(row, newRow);				
				FLUIGC.toast({
					message: '${i18n.getTranslation("msg.alert.product.updated")}',
					type: 'success'
				});
			    // ativa novamente os outros botoes de edit e remove
				$('[data-edit-product]').prop('disabled', false);
				$('[data-remove-product]').prop('disabled', false);					
			}
		});		
	},
	
	// botão de cancelar, retornando os valores originais
	cancelUpdateProduct: function(el, ev) {
		var originalRow = {
			'productCode': this.tempProductCode,
	        'productName': this.tempProductName,
	        'productDescription': this.tempProductDescription,
	        'productCategory': this.tempProductCategory,
	        'metadata#id': this.tempProductDocumentId,
			'metadata#version': this.tempProductDocumentVersion
	    };
		this.datatableProduct.updateRow(this.datatableProduct.selectedRows()[0], originalRow);
		
	    // ativa novamente os outros botoes de edit e remove
		$('[data-edit-product]').prop('disabled', false);
		$('[data-remove-product]').prop('disabled', false);
	},

	// remove um registro do formulário de produto
	removeProduct: function(el, ev) {
		var that = this,
			row = that.datatableProduct.selectedRows()[0],
			data = that.datatableProduct.getRow(row);
		if(row >= 0) {
			FLUIGC.message.confirm({
			    message: '${i18n.getTranslation("msg.remove.product")}' + ' ' + data.productName + '?',
			    title: '${i18n.getTranslation("label.remove.product")}',
			    labelYes: '${i18n.getTranslation("label.remove")}',
			    labelNo: '${i18n.getTranslation("label.cancel")}',
			}, function(result, el, ev) {
				if(result) {					
					var documentId = data['metadata#id'];
					that.removeDocumentById(documentId, function(err, data){
						if(!err){
							that.datatableProduct.removeRow(row);
							that.datatableProduct.reload();
							FLUIGC.toast({
								message: '${i18n.getTranslation("msg.alert.product.removed")}',
								type: 'success'
							});							
						}
					});
				}
			});
		}
	},
	
	
	/******* WS SOAP E API'S *************/
	
	/**
	 * WebService SOAP para criar um formulário no fluig
	 */
	uploadFormWS: function(xml, obj){
		var that = this;
		WCMAPI.Create({
		    async: false,
		    url: WCMAPI.serverURL + '/webdesk/ECMCardIndexService?wsdl',
		    contentType: 'text/xml; charset=utf-8',
		    dataType: 'xml',
		    data: xml[0],
		    success: function(data) {
		    	if($(data.getElementsByTagName('documentId')[0])){		    		
		    		// o response do WS é o id do formulário. 
		    		var formId = $(data.getElementsByTagName('documentId')[0]).text();
		    		obj['formId'] = formId;
		    		if(formId){		    			
		    			$('.up-form-icon').html('<span class="fluigicon fluigicon-check-circle-on fluigicon-md">');
						$('#up-btn-area-' + that.instanceId).html(that.processTemplate(that.templates['template-btn-installed'], {}));
		    			FLUIGC.toast({
		    		        title: '',
		    		        message: '${i18n.getTranslation("toast.form.installed")}',
		    		        type: 'success'
		    		    });
		    		}
		    	}
		    },
		    error: function(jqXHR, textStatus, errorThrown) {
		    }
		});
	},
	
	/**
	 * WebService SOAP para criar o dataset
	 */
	 criarDataset: function(){
		var that = this,
			impl = that.buildDataSetFunction();
    	$.ajax({
    		url : "/form-crud/resources/xml/ECMDatasetService_addDataset.xml",
    		type: "GET",
    		datatype: "xml",
			headers:{'Content-Type':'text/xml','X-Requested-With':'XMLHttpRequest'},
			processData: false,
    		success: function(xml){
    			that._xml = $(xml);
    	    	that._xml.find("companyId").text(WCMAPI.getTenantId());
    	    	that._xml.find("username").text(WCMAPI.userLogin);
    	    	that._xml.find("name").text(that.dsCrudComponent);
    	    	that._xml.find("description").text(that.dsCrudComponent);
    	    	that._xml.find("impl").text(impl);
    	    	var xml = that._xml[0];
    	    	WCMAPI.Create({
    	    		url : WCMAPI.serverURL + "/webdesk/ECMDatasetService?wsdl",
    	    		contentType: "text/xml; charset=utf-8",
    	    		dataType: "xml",
    	    		data: that._xml[0],
    	    		success: function(data){   	    			
    	    			FLUIGC.toast({
		    		        title: '',
		    		        message: '${i18n.getTranslation("toast.dataset.installed")}',
		    		        type: 'success'
		    		    });
    	    			that.loading.hide();
    	    		},
    	    		error: function(err){
    	    			console.log(err);
    	    		}
    	    	});
    		},
    		error: function(){
    		}
    	});    	
    },
	
	// Monta a função do dataset
	buildDataSetFunction: function(){
		var that = this;
		var impl = 'function createDataset(fields, constraints, sortFields){var dataset = DatasetBuilder.newDataset(); dataset.addColumn("dataset-name"); dataset.addColumn("folder-id");';
		
		for (var i = 0; i < that.forms.length; i++) {
			var form = that.forms[i];			
			impl += ' dataset.addRow(new Array("' + form['datasetName'] + '","' + form['formId'] + '"));';
		}
		impl += ' return dataset};';		

		return impl;
	},
	
	
	/**
	 * API Rest para criar a pasta para o formulario
	 */	
	createFolderService: function(folderName, cb){
		var options, url = '/api/public/ecm/document/createFolder';
		var params = {
				description: folderName,
				parentId: '0'
		};
		options = {
			url: url,
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(params), 
			type: 'POST',
			loading: false
		};
		FLUIGC.ajax(options, cb);
	},
	
	/**
	 * API Rest para buscar uma pasta
	 */	
	searchFolder: function(folderName, cb){
		var options, url = '/api/public/2.0/search/';
		var params = {
			"searchType" : "FOLDER",
			"pattern" : folderName,   
			"ordering" : "RELEVANT",
			"limit" : "10",
			"offset" : "0"
		};
		options = {
			url: url,
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(params), 
			type: 'POST',
			loading: false
		};
		FLUIGC.ajax(options, cb);
	},
	
	/**
	 * API Rest para remover documento
	 */	
	removeDocumentById: function(documentId, cb){
		var options, url = '/api/public/2.0/documents/deleteDocument/' + documentId;		
		options = {
			url: url,
			contentType: 'application/json',
			dataType: 'json',			 
			type: 'POST',
			loading: false
		};
		FLUIGC.ajax(options, cb);
	},
	
	/**
	 * API Rest para criar um registro de formulario
	 */	
	createFormRegister: function(formData, parentDocumentId, cb){		
		var options, url = '/api/public/2.0/cards/create';
		var params = {
				'documentDescription': new Date().getTime(),
				'parentDocumentId': parentDocumentId,
				'version': 1000,
				'inheritSecurity': false,
				'attachments': [],
				'formData': formData
			};
		options = {
			url: url,
			contentType: 'application/json',
			data: JSON.stringify(params),
			dataType: 'json',			 
			type: 'POST',
			loading: false
		};
		FLUIGC.ajax(options, cb);
	},
	
	/**
	 * API Rest para criar um registro de formulario: API NÃO PÚBLICA
	 */	
	updateForm: function(list, documentId, documentVersion, cb){
		var options, url = '/ecm/api/rest/ecm/cardView/editCard/' + documentId + '/' + documentVersion;		
		options = {
			url: url,
			contentType: 'application/json',
			data: JSON.stringify(list),
			dataType: 'json',			 
			type: 'POST',
			loading: false
		};
		FLUIGC.ajax(options, cb);
	}
	
})