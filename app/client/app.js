(function () {
        
	Session.setDefault("selected_movie", null);
	Session.setDefault("title-sort-direction", null);
	Session.setDefault("year-sort-direction", null);
	Session.setDefault("genre-sort-direction", null);

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
		var titleSort = Session.get("title-sort-direction");
		var yearSort = Session.get("year-sort-direction");
		var genreSort = Session.get("genre-sort-direction");
		var sortParameters = {};
		if(titleSort !== null) {
			sortParameters.title_low_case = titleSort;
		} else if(yearSort !== null){
			sortParameters.release_year = yearSort;
		} else if(genreSort !== null){
			sortParameters.genre_low_case = genreSort;
		}
	    return Movies.find({}, {sort: sortParameters});
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

	var sortDirectionToIconClass = function(direction) {
		if(direction === 1) {
			return 'fa-sort-asc';
		}
		if(direction === -1) {
			return 'fa-sort-desc';
		}
		return 'fa-sort';
	}

	Template.moviesTableHeader.titleSortIcon = function(){
		var sortDirection = Session.get("title-sort-direction");
		return sortDirectionToIconClass(sortDirection);
	}

	Template.moviesTableHeader.yearSortIcon = function(){
		var sortDirection = Session.get("year-sort-direction");
		return sortDirectionToIconClass(sortDirection);
	}

	Template.moviesTableHeader.genreSortIcon = function(){
		var sortDirection = Session.get("genre-sort-direction");
		return sortDirectionToIconClass(sortDirection);
	}

	var setNextSortDirectionFor = function(columSortKey) {
		var sortDirection = Session.get(columSortKey);
		if(sortDirection === 1) {
			sortDirection = -1;
		} else if(sortDirection === -1) {
			sortDirection = null;
		} else if(sortDirection === null) {
			sortDirection = 1;
		} else {
			sortDirection = null;
		}	
		Session.set(columSortKey, sortDirection);
	}

	Template.moviesTableHeader.events({
		"click .sort-icon-title": function(){
			Session.set("year-sort-direction", null);
			Session.set("genre-sort-direction", null);
			setNextSortDirectionFor("title-sort-direction");
		},
		"click .sort-icon-year": function(){
			Session.set("title-sort-direction", null);
			Session.set("genre-sort-direction", null);
			setNextSortDirectionFor("year-sort-direction");
		},
		"click .sort-icon-genre": function(){
			Session.set("title-sort-direction", null);
			Session.set("year-sort-direction", null);			
			setNextSortDirectionFor("genre-sort-direction");
		}	
	});

})();
