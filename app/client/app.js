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
    return true; //(Movies.find().count() === 0);
}

Template.movieEntryForm.genresList = function(){
    return Genres.find();
}

Template.movieTable.movies = function(){
    return Movies.find({}, {sort: {title:1}});
}
