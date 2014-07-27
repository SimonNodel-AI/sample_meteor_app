(function(){
	"use strict";

	Meteor.startup(function(){
		if(Genres.find().count() === 0){
			var typicalGenres = [
				"Action", "Adult", "Adventure", "Avant-garde",
				"Business", "Children's", "Comedy", "Comedy Drama", "Crime", "Culture & Society",
				"Dance", "Documentary", "Drama", "Education", "Epic", "Experimental", "Family",
				"Fantasy", "Film, Tv & Radio", "Health & Fitness", "History", "Horror",
				"Language & Literature", "Leisure Arts", "Martial Arts", "Music", "Musical",
				"Mystery", "Nature", "Romance", "Romantic Comedy", "Science & Technology",
				"Science Fiction", "Spiritual & Philosophy", "Sports & Recreation",
				"Spy Film", "Theater", "Thriller", "Travel", "Visual Arts", "War", "Western"
			];

			Genres.insert({name:"None"});

			_.each(typicalGenres, function(genre){
				Genres.insert({name: genre});
			});
		}
	});

}());