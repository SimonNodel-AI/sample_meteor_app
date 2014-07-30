(function(){
    "use stirct";

    jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.getEnv().defaultTimeoutInterval = 20000;

    Template.stub('appBody');
    Template.stub('movieEntryForm');
    Template.stub('movieTable');

    Movies = new Meteor.Collection('movies');
    Genres = new Meteor.Collection('genres');


    describe('Template.appBody.genresLoading', function() {        
        it('should return true while genres are loading', function() {                      
            Meteor.testSubscibeValues['genres'] = false;
            expect(Template.appBody.genresLoading()).toBe(true);          
        });

        it('should return false when genres are loaded', function() {                      
            Meteor.testSubscibeValues['genres'] = true;
            expect(Template.appBody.genresLoading()).toBe(false);          
        });
    });

    describe('Template.appBody.moviesLoading', function() {        
        it('should return true while genres are loading', function() {                      
            Meteor.testSubscibeValues['movies'] = false;
            expect(Template.appBody.moviesLoading()).toBe(true);          
        });

        it('should return false when movies are loaded', function() {                      
            Meteor.testSubscibeValues['movies'] = true;
            expect(Template.appBody.moviesLoading()).toBe(false);          
        });
    });

    describe('Template.appBody.noMovies', function(){
        it('should return true when Movie count is 0', function(){
            spyOn(Movies, 'find').andReturn({
                count: function(){return 0;}
            });
            expect(Template.appBody.noMovies()).toBe(true);
        });

        it('should return false when Movie count is > 0', function(){
            spyOn(Movies, 'find').andReturn({
                count: function(){return 42;}
            });
            expect(Template.appBody.noMovies()).toBe(false);
        });

    });
   
    describe('Template.movieEntryForm.genresList', function() {
        it('should return a list genres', function(){
            var result = {};
            spyOn(Genres, 'find').andReturn(result);
            expect(Template.movieEntryForm.genresList()).toBe(result);          
        });
    });

    describe('Template.movieTable.movies', function() {
        it('should return a list of movies sorted by title', function(){
            spyOn(Movies, 'find').andCallThrough();            
            Template.movieTable.movies();
            expect(Movies.find).toHaveBeenCalledWith({}, {sort: {title:1}});
        });      
    });

    describe('Template.movieEntryForm.buttonTitle', function(){
        it('should return "Add Movie" when selected_movie is not set', function(){
            Session.set('selected_movie', null);
            expect(Template.movieEntryForm.buttonTitle()).toEqual('Add Movie');
        });

        it('should return "Update Movie" when selected_movie is not set', function(){
            Session.set('selected_movie', {});
            expect(Template.movieEntryForm.buttonTitle()).toEqual('Update Movie');
        });
    });

    describe('Template.movieEntryForm.events', function(){
        describe('click #add-update-button', function(){
            it('should invoke "createMovie" Meteor method', function(){
                var mockTemplateInstance = {
                    find: function(what){
                        if(what === '#movie-title') { 
                            return {value:'Hackers'};
                        } else if (what === '#movie-release-year') {
                            return {value: '1995'};
                        } else if(what === '#genre-list') {
                            return {value: 'DEADBEFF'};
                        } else {
                            throw 'Invalid find parameter';
                        }
                    }
                };
                spyOn(Meteor, 'call');
                var eventHandler = Template.movieEntryForm.eventMap['click #add-update-button'];
                var result = eventHandler({}, mockTemplateInstance);
                expect(result).toBe(false);
                expect(Meteor.call).toHaveBeenCalledWith(
                    'createMovie', {
                        title: 'Hackers',
                        release_year: 1995,
                        genre: 'DEADBEFF'
                    }
                );
            })

        });
    })

})();