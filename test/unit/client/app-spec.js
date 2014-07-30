(function(){
    "use stirct";

    jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.getEnv().defaultTimeoutInterval = 20000;

    Template.stub('appBody');
    Template.stub('movieEntryForm');
    Template.stub('movieTable');


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

    describe('Collection instantiation', function(){
        it('should instantiate Genres only once', function(){
            expect(Meteor.instantiationCounts['genres']).toBe(1);
        });

        it('should instantiate Movies only once', function(){
            expect(Meteor.instantiationCounts['movies']).toBe(1);
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

})();