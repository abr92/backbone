// btoa('code')
// atob('decode')
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: Models :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Probe = Backbone.Model.extend({
	idAttribute : '_id',
	url : 'http://localhost:3000/api?cat=source&key=_id&value=213',
	defaults : {
		name : 'Name',
		lastname : 'Lastname',
		years : 0,
		type : 'User'
	},
	initialize : function(){
		console.log('New model')
	}
});

probeOne = new Probe({
	name : 'Abr',
	lastname : 'Diaz',
	years : 21,
	type : 'Admin',
});

probeTwo = new Probe({
	name : 'Jhon',
	lastname : 'Smiths',
	years : 30,
	type : 'User',
	html : '<h3>The content html render of data</h3>',
});

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: Collections ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

ProbeCollection = Backbone.Collection.extend({
	model : Probe,
});

probecollection = new ProbeCollection([probeOne,probeTwo]);

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: Views ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

View = Backbone.View.extend({
	events : {
		'click #upload' : 'Upload',
		'click #set' : 'Setcookie',
		'click #delete' : 'DeleteCookie',
	},
	initialize : function(){
		console.log('New view');
	},
	render : function(file){
		self = this;
		$.get(file, function(crude){
			template = Handlebars.compile(crude),
			content = template({'data': self.collection.toJSON()});
			self.$el.html(content);
		});
		return this;
	},
	Upload : function(){
		// Read file
		file    = document.querySelector('input[type=file]').files[0];
		reader  = new FileReader();
		reader.readAsDataURL(file);
		// reader.readAsText(file);
		reader.onloadend = function () {
			img = reader.result;
			$('#image').attr('src', img);
		}
	},
	Setcookie : function(){
		setCookie('thecookie', btoa('Abr'));
		routes.navigate("#/")
	},
	DeleteCookie : function(){
		deleteCookie('thecookie');
		routes.navigate("#/")
	},
});

SingularView = Backbone.View.extend({
	events : {
		'click h1' : 'saveModel'
	},
	initialize : function(){
		console.log('New view');
	},
	render : function(file){
		self = this;
		$.get(file, function(crude){
			template = Handlebars.compile(crude);
			content = template(self.model.toJSON());
			self.$el.html(content);
    	});
		console.log(this.model.attributes);
		return this;
	},
	saveModel : function(){
		// this.model.set({_id:123}); PUT
		this.model.save(); // POST
		console.log(this.model.attributes);
	}
});

startView = new SingularView({
	el: '#content',
});

defaultView = new View({
	el : '#content',
	collection : probecollection,
});

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: Routes :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function auth(args){
	if (getCookie(args)){
		$("#login").html('<h3 style="color:rgb(0, 173, 255)">Login: '+atob(getCookie(args))+' <a href="#">Go! to admin</a></h3>');
	}else{
		$('#login').html('<h3><a href="#/content" style="color:rgb(0, 173, 255)">Please login</a></h3>')
	}
}

Routes = Backbone.Router.extend({
	routes : {
		'' : 'start',
		'content' : 'Content',
		'other' : 'Other'
	},
	initialize : function(model){
		console.log('New Route go to /#hello');
		// this.model = model.model;
	},
	start : function(){
		startView.model = probeTwo;
		startView.render("start.html");

		auth('thecookie');
	},
	Other : function(){
		startView.model = probeOne
		startView.render("other.html");

		auth('thecookie');
	},
	Content : function(){
		defaultView.render("content.html");

		auth('thecookie');
	}
});

var routes = new Routes();

Backbone.history.start();