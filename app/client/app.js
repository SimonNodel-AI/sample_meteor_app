(function () {
        
	Session.setDefault("selected_movie", null);

	Movies = new Meteor.Collection('movies');
	Genres = new Meteor.Collection('genres');

	var genresHandle = Meteor.subscribe("genres");
	var moviesHandle = Meteor.subscribe("movies");

	Template.appBody.genresLoading = function () {
	    return !genresHandle.ready();
	}; 

	Template.appBody.moviesLoading = function(){
	    return !moviesHandle.ready();
	}

	Template.appBody.noMovies = function(){	
	    return (Movies.find().count() === 0);
	}

	Template.movieEntryForm.genresList = function(){
	    return Genres.find();
	}

	Template.movieTable.movies = function(){
	    return Movies.find({}, {sort: {title:1}});
	}

})();
