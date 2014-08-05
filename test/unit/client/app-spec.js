(function(){
    "use stirct";

    jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmine.getEnv().defaultTimeoutInterval = 20000;

    Template.stub('appBody');
    Template.stub('movieEntryForm');
    Template.stub('movieTable');
    Template.stub('moviesTableHeader');

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
        beforeEach(function(){
            Session.set('title-sort-direction', null);
            Session.set('year-sort-direction', null);
            Session.set('genre-sort-direction', null);
        });

        it('should return a list of movies with empty sort options', function(){
            spyOn(Movies, 'find').andCallThrough();            
            Template.movieTable.movies();
            expect(Movies.find).toHaveBeenCalledWith({}, {sort: {}});
        });

        var testSort = function(sessionKey, columnName, sortKey){
            describe('sort with Session("' + sessionKey + '")', function(){
                it('should return a list of movies sorted by ' + columnName + ' in ascending order', function(){
                    Session.set(sessionKey, 1);
                    spyOn(Movies, 'find').andCallThrough();            
                    Template.movieTable.movies();
                    expectedSortObject = {};
                    expectedSortObject[sortKey] = 1;
                    expect(Movies.find).toHaveBeenCalledWith({}, {sort: expectedSortObject});
                });

                it('should return a list of movies sorted by ' + columnName + ' in descending order', function(){
                    Session.set(sessionKey, -1);
                    spyOn(Movies, 'find').andCallThrough();            
                    Template.movieTable.movies();
                    expectedSortObject = {};
                    expectedSortObject[sortKey] = -1;
                    expect(Movies.find).toHaveBeenCalledWith({}, {sort: expectedSortObject});
                });
            });    
        };
        
        testSort('title-sort-direction', 'title', 'title_low_case');
        testSort('year-sort-direction', 'year', 'release_year');
        testSort('genre-sort-direction', 'genre', 'genre_low_case');
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

    describe('Template.movieEntryForm.titleValidationMessage', function(){
        it('should return Session.title-validation-error-message', function(){
            Session.set('title-validation-error-message', 'abc');
            expect(Template.movieEntryForm.titleValidationMessage()).toEqual('abc');
        });
    });

    describe('Template.movieEntryForm.yearValidationMessage', function(){
        it('should return Session.year-validation-error-message', function(){
            Session.set('year-validation-error-message', '1920');
            expect(Template.movieEntryForm.yearValidationMessage()).toEqual('1920');
        });
    });

    describe('Template.movieEntryForm.events', function(){
        describe('click #add-update-button', function(){

            var mockTemplateInstance;
            var eventHandler;

            beforeEach(function(){
                mockTemplateInstance = {
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

                eventHandler = Template.movieEntryForm.eventMap['click #add-update-button'];
                spyOn(Meteor, 'call');
            });


            it('should set Sesison.title-validation-error-message when title is missing', function(){
                Session.set('title-validation-error-message', '');
                var result = eventHandler({}, mockTemplateInstance);                
                mockTemplateInstance.find = function(what){
                    if(what === '#movie-title') { 
                        return {value: ''};
                    }
                    else {
                        return {value: ''};
                    }
                };
                var result = eventHandler({}, mockTemplateInstance);
                expect(Session.get('title-validation-error-message')).toEqual('* Required field');
            });


            it('should set Sesison.year-validation-error-message when year < 1890', function(){
                Session.set('year-validation-error-message', '');
                var result = eventHandler({}, mockTemplateInstance);                
                mockTemplateInstance.find = function(what){
                    if(what === '#movie-title') { 
                            return {value:'Hackers'};
                    } else if(what === '#movie-release-year') { 
                        return {value: '1000'};
                    }
                    else {
                        return {value: 'DEADBEFF'};
                    }
                };
                var result = eventHandler({}, mockTemplateInstance);
                expect(Session.get('year-validation-error-message')).toEqual('Must be >= 1890');
            });


            it('should set Sesison.year-validation-error-message when year > currentYear', function(){
                Session.set('year-validation-error-message', '');
                var result = eventHandler({}, mockTemplateInstance);    
                var currentYear = (new Date().getFullYear());
                mockTemplateInstance.find = function(what){
                    if(what === '#movie-title') { 
                            return {value:'Hackers'};
                    } else if(what === '#movie-release-year') { 
                        return {value:  currentYear + 100};
                    }
                    else {
                        return {value: 'DEADBEFF'};
                    }
                };
                var result = eventHandler({}, mockTemplateInstance);
                expect(Session.get('year-validation-error-message')).toEqual('Must be <= ' + currentYear);
            });

            it('should set Sesison.year-validation-error-message when year is not a number', function(){
                Session.set('year-validation-error-message', '');
                var result = eventHandler({}, mockTemplateInstance);    
                mockTemplateInstance.find = function(what){
                    if(what === '#movie-title') { 
                            return {value:'Hackers'};
                    } else if(what === '#movie-release-year') { 
                        return {value:  'zzz'};
                    }
                    else {
                        return {value: 'DEADBEFF'};
                    }
                };
                var result = eventHandler({}, mockTemplateInstance);
                expect(Session.get('year-validation-error-message')).toEqual('Not a number');
            });


            it('should invoke "createMovie" Meteor method when selected_movie is null', function(){
                Session.set('selected_movie', null);                
                var result = eventHandler({}, mockTemplateInstance);
                expect(result).toBe(false);
                expect(Meteor.call).toHaveBeenCalledWith(
                    'createMovie', 
                    {
                        title: 'Hackers',
                        release_year: 1995,
                        genre: 'DEADBEFF'
                    }
                );
            });

            it('should invoke "updateMovie" Meteor method when selected_movie is NOT null', function(){
                Session.set('selected_movie', {_id:'AABBCC'});                                
                var result = eventHandler({}, mockTemplateInstance);
                expect(result).toBe(false);
                expect(Meteor.call).toHaveBeenCalledWith(
                    'updateMovie', 
                    {
                        _id: 'AABBCC',
                        title: 'Hackers',
                        release_year: 1995,
                        genre: 'DEADBEFF'
                    }
                );
            }); 
        });
    })

    describe('Template.movieTable.events', function(){
        describe('click .edit-icon', function(){
            var mockMovie;            

            beforeEach(function(){
                mockMovie = {title:'foobar', _id:'12345', release_year: 1985, genre:{_id:'aaa'}};                
            });

            it('should save movie instance to session', function(){                
                spyOn(Session, 'set');
                var eventHandler = Template.movieTable.eventMap['click .edit-icon'];
                eventHandler.apply(mockMovie);
                expect(Session.set).toHaveBeenCalledWith('selected_movie', mockMovie);
            });
        });

        describe('click .trash-icon', function(){
            it('should call Movies.remove', function(){
                spyOn(Movies, 'remove');
                var eventHandler = Template.movieTable.eventMap['click .trash-icon'];
                eventHandler.apply({title:'foobar', _id:'12345'});
                expect(Movies.remove).toHaveBeenCalledWith('12345');
            })
        });
    });

    describe('moviesTableHeader', function(){
        beforeEach(function(){
            Session.set('title-sort-direction', null);
            Session.set('year-sort-direction', null);
            Session.set('genre-sort-direction', null);
        });

        var testSortIcon = function(sessionKey, testFunctionName) {
            describe(testFunctionName, function(){
                it('shoud return fa-sort when Session("' + sessionKey + '") is null', function(){
                    expect(Template.moviesTableHeader[testFunctionName]()).toEqual('fa-sort');
                });
                it('should return fa-sort-asc when Session("' + sessionKey + '") is 1', function(){
                    Session.set(sessionKey, 1);
                    expect(Template.moviesTableHeader[testFunctionName]()).toEqual('fa-sort-asc'); 
                });
                it('should return fa-sort-desc when Session("' + sessionKey + '") is -1', function(){
                    Session.set(sessionKey, -1);
                    expect(Template.moviesTableHeader[testFunctionName]()).toEqual('fa-sort-desc'); 
                });           
            });
        };

        testSortIcon('title-sort-direction', 'titleSortIcon');
        testSortIcon('year-sort-direction', 'yearSortIcon');
        testSortIcon('genre-sort-direction', 'genreSortIcon');

        describe('events', function(){

            testEvent = function(sessionKey, eventKey, otherSortSessionKeys) {
                describe(eventKey, function(){                
                    it('should cycle Sesstion("' + sessionKey + '") values', function(){
                        var eventHandler = Template.moviesTableHeader.eventMap[eventKey];
                        eventHandler();
                        expect(Session.get(sessionKey)).toBe(1);
                        eventHandler();
                        expect(Session.get(sessionKey)).toBe(-1);
                        eventHandler();
                        expect(Session.get(sessionKey)).toBe(null);
                        eventHandler();
                        expect(Session.get(sessionKey)).toBe(1);
                    });

                    it('should clear other session sort variables', function(){
                        Session.set(sessionKey, null);
                        Session.set(otherSortSessionKeys[0], 42);
                        Session.set(otherSortSessionKeys[1], 42);
                        var eventHandler = Template.moviesTableHeader.eventMap[eventKey];
                        eventHandler();
                        expect(Session.get(sessionKey)).toBe(1);
                        expect(Session.get(otherSortSessionKeys[0])).toBe(null);
                        expect(Session.get(otherSortSessionKeys[1])).toBe(null);
                    });

                    it('should set Session("' + sessionKey + '") to null when its value is invalid', function(){
                        Session.set(sessionKey, 4242);
                        var eventHandler = Template.moviesTableHeader.eventMap[eventKey];
                        eventHandler();
                        expect(Session.get(sessionKey)).toBe(null);
                    });
                });
            };

            testEvent('title-sort-direction', 'click .sort-icon-title', [
                'year-sort-direction', 'genre-sort-direction']);

            testEvent('year-sort-direction', 'click .sort-icon-year', [
                'title-sort-direction', 'genre-sort-direction']);

            testEvent('genre-sort-direction', 'click .sort-icon-genre', [
                'title-sort-direction', 'year-sort-direction']);           
        });
    });
})();