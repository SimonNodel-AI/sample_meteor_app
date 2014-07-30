(function(){
	"use strict";
	
	Meteor.publish("genres", function(){
		return Genres.find();
	});

	
	Meteor.publish("movies", function(){
		return Movies.find();
	});

}());
