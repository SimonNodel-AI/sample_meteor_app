(function () {
        
	Session.setDefault("selected_movie", null);

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

	Template.movieEntryForm.buttonTitle = function(){
	    if(!Session.get("selected_movie")) {
	    	return "Add Movie";
	    }
	    return "Update Movie"
	}

	Template.movieEntryForm.events({
  		'click #add-update-button': function (event, template) {
			var movieTitle = template.find("#movie-title").value;
			var releaseYear = template.find("#movie-release-year").value;
			var genre = template.find("#genre-list").value;			
    		Meteor.call("createMovie", {
    			title: movieTitle,
    			release_year: parseInt(releaseYear),
    			genre: genre
    		});
    		console.debug('Movie: %s was added', movieTitle);    		
    		return false;
  		}
  	});

	Template.movieTable.movies = function(){
	    return Movies.find({}, {sort: {title:1}});
	}

})();
