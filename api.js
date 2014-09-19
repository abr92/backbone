// ---------------------------------------------------------------------------------------------------------------------
														// Models
// ---------------------------------------------------------------------------------------------------------------------

ProbeModel = Backbone.Model.extend({
	idAttribute : '_id',
	initialize : function(){
		console.log('New model');
	},
	//url : '/api/opt?_cat=medic&_k=name&_v=Dr.%20Jhon%20Smith&_each'
});

defaultModel = new ProbeModel({
	name : 'Abrs',
	lastname : 'Diaz',
	html : "<p>This html rendered of model One whit handlebars</p>"
});

// ---------------------------------------------------------------------------------------------------------------------
														// Collections
// ---------------------------------------------------------------------------------------------------------------------

CollectionModels = Backbone.Collection.extend({
	initialize : function(){
		console.log('New Collection');
	},
	url : '/api/opt?_cat=medic'
});

probeCollection = new CollectionModels();

// ---------------------------------------------------------------------------------------------------------------------
														// Views
// ---------------------------------------------------------------------------------------------------------------------

CollectionsView = Backbone.View.extend({
	initialize : function(){
		console.log('New View');
	},
	Get : function(){
		self = this;
		this.collection.fetch().done(function(){
			self.render();
		});
	},
	template : Handlebars.compile($('#collections').html()),
	render : function(){
		content = this.template({ 'data' : this.collection.toJSON()});
		this.$el.html(content);
		console.log(this.collection.toJSON());
		return this;
	},
});


ModelView = Backbone.View.extend({
	initialize : function(){
		console.log('New View');
	},
	Get : function(){
		self = this;
		this.model.fetch().done(function(){
			self.render();
		});
	},
	template : Handlebars.compile($('#model').html()),
	render : function(){
		content = this.template(this.model.attributes);
		this.$el.html(content);
		console.log(this.model.attributes);
		return this;
	},
	events : {
		'click #update' : 'UpdateModel'
	},
	UpdateModel : function(){
		this.model.url = '/api/opt?_cat=medic&_id='+this.model.get('_id').$oid;
		this.model.set({name : 'Thais Daritza', lastname : 'de Diaz', years : 31});
		this.model.save();
		console.log(this.model.url);
	}
});

CreateModel = Backbone.View.extend({
	initialize : function(){
		console.log('New Create View');
	},
	Create : function(){
		console.log('Create Model');
		this.render();
	},
	template : Handlebars.compile($('#create').html()),
	render : function(){
		content = this.template({hi : 'Welcome to create user'});
		this.$el.html(content);
		return this;
	},
});

collectionView = new CollectionsView({
	el : '#content',
	collection : probeCollection
});

modelView = new ModelView({
	el : '#content',
	model : defaultModel
});

createView = new CreateModel({
	el : '#content'
});

// ---------------------------------------------------------------------------------------------------------------------
														// Routes
// ---------------------------------------------------------------------------------------------------------------------

ProbeRoutes = Backbone.Router.extend({
	routes : {
		'' : 'Collections',
		'model/:cat/id/:id' : 'ModelById',
		'create' : 'Create'
	},
	initialize : function(options){
		console.log('New route');
		this.model = options.model;
		//console.log(this.model.attributes)
	},
	Collections : function(){
		collectionView.Get();
	},
	ModelById : function(cat, id){
		defaultModel.url = '/api/opt?_cat='+cat+'&_id='+id
		modelView.Get();
	},
	Create : function(){
		createView.Create();
	}
});

routes = new ProbeRoutes({model:defaultModel});
Backbone.history.start();