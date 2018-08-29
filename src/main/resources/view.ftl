<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>
<div id="formcrud_${instanceId}" class="wcm-widget-class super-widget" data-params="Formcrud.instance()">    
    <div class="fluig-style-guide">
    
    	<!-- AREA DE INSTALAÇÃO(UPLOAD) DOS FORMULÁRIOS -->
		<div id="installArea" style="display: none">
			<h4>${i18n.getTranslation('help.text1')}</h4>
			<hr>
			<p class="text-info">${i18n.getTranslation('help.text2')}</p>
			<table class="table table-hover" id="up-area-${instanceId}">
				<thead>
					<tr>
						<th>#</th>
						<th>${i18n.getTranslation('label.info.item')}</th>
						<th>${i18n.getTranslation('label.info.installed')}</th>
					</tr>
				<thead>
				<tr>
					<td><span class="fluigicon fluigicon-folder-close fluigicon-md"></span></td>
					<td>${i18n.getTranslation('label.info.folder')}</td>
					<td class="up-form-icon"><span class="fluigicon fluigicon-remove-sign fluigicon-md"></td>
				</tr>
				<tr>
					<td><span class="fluigicon fluigicon-form fluigicon-md"></span></td>
					<td>${i18n.getTranslation('label.info.form1')}</td>
					<td class="up-form-icon"><span class="fluigicon fluigicon-remove-sign fluigicon-md"></td>
				</tr>
				<tr>
					<td><span class="fluigicon fluigicon-form fluigicon-md"></span></td>
					<td>${i18n.getTranslation('label.info.form2')}</td>
					<td class="up-form-icon"><span class="fluigicon fluigicon-remove-sign fluigicon-md"></td>
				</tr>
				<tr>
					<td><span class="fluigicon fluigicon-volumes fluigicon-md"></span></td>
					<td>${i18n.getTranslation('label.info.dataset')}</td>
					<td class="up-form-icon"><span class="fluigicon fluigicon-remove-sign fluigicon-md"></td>
				</tr>
			</table>
			<div id="up-btn-area-${instanceId}">
				<button type="button" class="btn btn-info btn-lg" data-install id='button_install_${instanceId}'>${i18n.getTranslation('label.install')}</button></td>
			</div>
		</div>

		<!-- AREA DE CRUD PARA OS REGISTROS -->
		<div id="crudArea" style="display: none">
			<h4>${i18n.getTranslation('help.text3')}</h4>
			
			<div class="panel panel-default">
			    <div class="panel-heading">${i18n.getTranslation('help.text4')}</div>
			    <div class="panel-body">
			        <form name="categoryForm" role="categoryForm" id="categoryForm">
						<div class="form-group">
					        <label for="inputCode">${i18n.getTranslation('form.label.category.code')}:</label>
					        <input type="text" class="form-control" id="categoryCode" name="categoryCode" placeholder="${i18n.getTranslation('form.ph.category.code')}" title="${i18n.getTranslation('form.label.category.code')}">
					    </div>
						<div class="form-group">
					        <label for="inputName">${i18n.getTranslation('form.label.category.name')}: </label>
					        <input type="text" class="form-control" id="categoryName" name="categoryName" placeholder="${i18n.getTranslation('form.ph.category.name')}" title="${i18n.getTranslation('form.label.category.name')}">
					    </div>
					    <div class="form-group">
					        <label for="inputDesc">${i18n.getTranslation('form.label.category.description')}: </label>
					        <input type="text" class="form-control" id="categoryDescription" name="categoryDescription" placeholder="${i18n.getTranslation('form.ph.category.description')}" title="${i18n.getTranslation('form.label.category.description')}">
					    </div>
					    <div class="form-group">					    
					    	<button type="button" class="btn btn-primary" data-save-category>${i18n.getTranslation('form.btn.save.category')}</button>
					    </div>
					    <br>					    
					    <div class="form-group" id="categories">
						    <div class="panel panel-default">
						        <div class="panel-heading">
						            <h4 class="panel-title">
						                <a data-toggle="collapse" data-parent="categories" href="#collapseCategories">
						                	${i18n.getTranslation('label.categories.registred')}
						                </a>
						            </h4>
						        </div>
						        <div id="collapseCategories" class="panel-collapse collapse">
						            <div class="panel-body">
						            	<div id="listCategories"></div>
						            </div>
						        </div>
						    </div>
						</div>					    
					</form>
			    </div>			    
			</div>
			<br>		
			<div class="panel panel-default">
			    <div class="panel-heading">${i18n.getTranslation('help.text5')}</div>
			    <div class="panel-body">			
					<form name="productForm" role="productForm" id="productForm">
						<div class="form-group">
					        <label for="inputCode">${i18n.getTranslation('form.label.product.code')}: </label>
					        <input type="text" class="form-control" id="productCode" name="productCode" placeholder="${i18n.getTranslation('form.ph.product.code')}" title="${i18n.getTranslation('form.label.product.code')}">
					    </div>
						<div class="form-group">
					        <label for="inputName">${i18n.getTranslation('form.label.product.name')}: </label>
					        <input type="text" class="form-control" id="productName" name="productName" placeholder="${i18n.getTranslation('form.ph.product.name')}" title="${i18n.getTranslation('form.label.product.name')}">
					    </div>
					    <div class="form-group">
					        <label for="inputDesc">${i18n.getTranslation('form.label.product.description')}: </label>
					        <input type="text" class="form-control" id="productDescription" name="productDescription" placeholder="${i18n.getTranslation('form.ph.product.description')}" title="${i18n.getTranslation('form.label.product.description')}">
					    </div>
					    <div class="form-group">
							<label for="inputCategoryCode">${i18n.getTranslation('form.label.product.category')}: </label>
							<select class="form-control" name="productCategory" id="productCategory" title="${i18n.getTranslation('form.label.product.category')}">
								<option value="" title="${i18n.getTranslation('form.label.product.category')}" selected>- ${i18n.getTranslation('form.label.select.category')} -</option>
							</select>					
						</div>
						<div class="form-group">
							<button type="button" class="btn btn-primary" data-save-product>${i18n.getTranslation('form.btn.save.product')}</button>
						</div>
						<br>
						<div class="form-group" id="products">
						    <div class="panel panel-default">
						        <div class="panel-heading">
						            <h4 class="panel-title">
						                <a data-toggle="collapse" data-parent="products" href="#collapseProducts">
						                	${i18n.getTranslation('label.products.registred')}
						                </a>
						            </h4>
						        </div>
						        <div id="collapseProducts" class="panel-collapse collapse">
						            <div class="panel-body">
						            	<div id="listProducts"></div>
						            </div>
						        </div>
						    </div>
						</div>
					</form>
			    </div>
			</div>
			
		</div>
    	
	</div>
	
	<!-- templates html -->

	<script type="text/template" class="template-btn-installed">
		<button type="button" class="btn btn-success btn-lg" disabled="disabled">${i18n.getTranslation('label.info.installed')}</button>
	</script>
	
	<script type="text/template" class="template-category-option">	
		<option value="{{categoryCode}}" name="productCategory">{{categoryCode}} - {{categoryName}}</option>
	</script>
	
	<script type="text/template" class="template-category-tr">
		<tr>
            <td class="col-md-1" title="{{categoryCode}}">{{categoryCode}}</td>
            <td class="col-md-2" title="{{categoryName}}">{{categoryName}}</td>
            <td class="col-md-3" title="{{categoryDescription}}">{{categoryDescription}}</td>
            <td class="col-md-2">
	            <button title="Edit" class="btn btn-warning btn-sm" data-title="Edit" data-edit-category data-category-id="{{categoryCode}}" data-toggle="modal" data-target="#edit">
	                <span class="fluigicon fluigicon-fileedit"></span>
	            </button>
	            <button title="Delete" class="btn btn-danger btn-sm" data-title="Delete" data-remove-category data-category-id="{{categoryCode}}" data-toggle="modal" data-target="#delete">
	                <span class="fluigicon fluigicon-trash"></span>
	            </button>                
            </td>
        </tr>
	</script>
	
	<script type="text/template" class="template-category-edit">
	    <tr id="{{categoryCode}}_itemCategory">
	        <td class="col-md-1">
	            <input type="text" value="{{categoryCode}}" name="categoryCode" class="datatable-edit form-control" disabled="disabled">
	        </td>
	        <td class="col-md-2">
	            <input type="text" value="{{categoryName}}" name="categoryName" class="datatable-edit form-control">
	        </td>	        
	        <td class="col-md-3">
	            <input type="text" value="{{categoryDescription}}" name="categoryDescription" class="datatable-edit form-control">
	        </td>
	        <td class="col-md-2">
	            <button class="btn btn-warning" data-update-category data-document-id="{{metadata#id}}" data-document-version="{{metadata#version}}">Salvar</button>
	            <button class="btn btn-default" data-cancel-update-category>Cancelar</button>
	        </td>
	    </tr>
	</script>
	
	<script type="text/template" class="template-product-tr">
		<tr>
            <td class="col-md-1" title="{{productCode}}">{{productCode}}</td>
            <td class="col-md-2" title="{{productName}}">{{productName}}</td>
            <td class="col-md-3" title="{{productDescription}}">{{productDescription}}</td>
            <td class="col-md-2" title="{{productCategory}}">{{productCategory}}</td>
            <td class="col-md-2">
	            <button title="Edit" class="btn btn-warning btn-sm" data-title="Edit" data-edit-product data-product-code="{{productCode}}" data-toggle="modal" data-target="#edit">
	                <span class="fluigicon fluigicon-fileedit"></span>
	            </button>
	            <button title="Delete" class="btn btn-danger btn-sm" data-title="Delete" data-remove-product data-product-code="{{productCode}}" data-toggle="modal" data-target="#delete">
	                <span class="fluigicon fluigicon-trash"></span>
	            </button>
            </td>
        </tr>
	</script>
	
	<script type="text/template" class="template-product-edit">
	    <tr id="{{productCode}}_itemProduct">
	        <td class="col-md-1">
	            <input type="text" value="{{productCode}}" name="productCode" class="datatable-edit form-control" disabled="disabled">
	        </td>
	        <td class="col-md-2">
	            <input type="text" value="{{productName}}" name="productName" class="datatable-edit form-control">
	        </td>	        
	        <td class="col-md-3">
	            <input type="text" value="{{productDescription}}" name="productDescription" class="datatable-edit form-control">
	        </td>
	        <td class="col-md-2">
	            <input type="text" value="{{productCategory}}" name="productCategory" class="datatable-edit form-control" disabled="disabled">
	        </td>
	        <td class="col-md-2">
	            <button class="btn btn-warning" data-update-product data-document-id="{{metadata#id}}" data-document-version="{{metadata#version}}">Salvar</button>
	            <button class="btn btn-default" data-cancel-update-product>Cancelar</button>
	        </td>
	    </tr>
	</script>
		
</div>