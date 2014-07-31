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

	var isEdditingMode = function(){
		return (Session.get("selected_movie") !== null);
	}

	var clearFormFields = function(){
		Session.set("selected_movie", null);		
		$("#movie-title").val("");
		$("#movie-release-year").val("");		
	}

	Template.movieEntryForm.events({
  		"click #add-update-button": function (event, template) {
			var movieTitle = template.find("#movie-title").value;
			var releaseYear = template.find("#movie-release-year").value;
			var genre = template.find("#genre-list").value;	
			if(isEdditingMode()) {				
				console.debug("Updating %s", movieTitle);
				Meteor.call("updateMovie", {
					_id: Session.get("selected_movie")._id,
	    			title: movieTitle,
	    			release_year: parseInt(releaseYear),
	    			genre: genre
	    		});	    		
				
			} else {				
				console.debug("Movie: %s was added", movieTitle);    	
	    		Meteor.call("createMovie", {	    			
	    			title: movieTitle,
	    			release_year: parseInt(releaseYear),
	    			genre: genre
	    		});
	    	}
    		clearFormFields();    		
    		return false;
  		}
  	});

	Template.movieTable.movies = function(){
	    return Movies.find({}, {sort: {title:1}});
	}

	Template.movieTable.events({
		"click .edit-icon": function(){
			console.debug("Editting %s movie.", this.title);
			Session.set("selected_movie", this);
			var movieInput = $("#movie-title");
			movieInput.val(this.title);
			$("#movie-release-year").val(this.release_year);
			$("#genre-list").val(this.genre._id);
			movieInput.focus();
			movieInput.select();
		},
		"click .trash-icon": function(){
			console.debug("Removing %s movie.", this.title);
			Movies.remove(this._id);			
		}
	});

})();
