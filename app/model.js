///////////////////////////////////////////////////////////////////////////////
// Helpers

var operationNotAllowed = function(){
	return false;
}

var operationAllowed = function(){
	return true;
}

var stringWithValue = Match.Where(function(valueToCheck){
	check(valueToCheck, String);
	return valueToCheck.length > 0;
});

var validYear = Match.Where(function(yearToCheck){		
	check(yearToCheck, Number);
	var movieHistoryStartYear = 1890; 
	var currentYear = (new Date().getFullYear());
	return (yearToCheck >= movieHistoryStartYear && yearToCheck <= currentYear);
});


///////////////////////////////////////////////////////////////////////////////
// Movies

Movies = new Meteor.Collection("movies");

Movies.allow({
	insert: operationNotAllowed,
	update: function(movie, fields) {
		var updatableFields = ["title", "release_year", "genre"];
		var disallowedFields = _.difference(fields, updatableFields);
		if(disallowedFields.length > 0) {
			_.each(disallowedFields, function(field){
				console.error("You cannot modify " + field + " this field.");
			})
			return false;
		}
		return true;
	},
	remove: operationAllowed
});


////////////////////////////////////////////////////////////////////////////////
// Genres

Genres = new Meteor.Collection("genres");

Genres.allow({
	insert: operationNotAllowed,
	update: operationNotAllowed,
	remove: operationNotAllowed
});


////////////////////////////////////////////////////////////////////////////////
// Methods

Meteor.methods({
	createMovie: function (data){		
		check(data, {
			title: stringWithValue,
			release_year: validYear,
			genre: stringWithValue
		});

		var genre = Genres.findOne(data.genre);
		if(!genre) {
			throw new Meteor.error(404, 'No such genre!');
		}

		var id = data._id || Random.id();
		Movies.insert({
			_id: id,
			title: data.title,
			release_year: data.release_year,
			genre: data.genere
		});
		return id;
	}	
});
