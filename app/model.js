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
	update: operationNotAllowed,
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

var getGenre = function(genreId){
	var genre = Genres.findOne(genreId);
	if(!genre) {
		throw new Meteor.error(404, 'No such genre!');
	}
	return genre;
}

Meteor.methods({
	createMovie: function (data){		
		check(data, {			
			title: stringWithValue,
			release_year: validYear,
			genre: stringWithValue
		});
		var genre = getGenre(data.genre);	
		var id = Random.id();
		Movies.insert({
			_id: id,
			title: data.title,
			release_year: data.release_year,
			genre: genre
		});
		return id;
	},

	updateMovie: function(data) {
		check(data, {
			_id: stringWithValue,
			title: stringWithValue,
			release_year: validYear,
			genre: stringWithValue
		});

		var genre = getGenre(data.genre);
		Movies.update({_id: data._id}, 
			{$set: {
				title: data.title,
				release_year: data.release_year,
				genre: genre
			}
		});
	}
});
