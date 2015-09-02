$(document).ready( function() { //waits until page is fully loaded and then runs JS
	$('.unanswered-getter').submit( function(event){ //target uanswered class, on submit funtion and passes two parameters; function and event. So event handler(.submit) is bound to the form. Every time something is submited the follwing will happen:
		// zero out results if previous search has run
		$('.results').html(''); //not sure
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags); //run the getUnanswered function using the tags variable
	});

	$('.inspiration-getter').submit( function(event){// same thing to find the top-answerers
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='answerers']").val();
		getAnswered(tags);
	});


});


// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) { //assigning an empty function with parameter question to variable showQuestion. How is this different from writing: function showQuestion(question) { ?
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker'); //search through descendants of $('.template .questions') to .asker and print:
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>' //search api for this data and print
	);
	console.log(question); //console log the question. 
	return result;
};

var showAnswer = function(answerer) {
	
	// clone our result template code
	var result = $('.template .question').clone();
	
	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html(
		'<p>Name: ' + answerer.user.display_name + '</p>\n' +
		'<p> \n' +
			'User ID: \n' +
	 		'<a target="_blank" href= "http://stackoverflow.com/users/' + answerer.user.user_id + '"> \n' +
	 			answerer.user.user_id + '\n' +
			'</a> \n' +
		'</p>\n' +
 		'<p>Reputation: ' + answerer.user.reputation + '</p>\n' +
 		'<img src="' + answerer.user.profile_image + '">\n' 
	);
 	console.log(asker.html());						  
	return result;
};



// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results; //function to identify 3 of results and tag. Where is query defined?
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText); 
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	//ajax request to stackOverflow's API
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){ //success callback after ajax method returns info. 
		var searchResults = showSearchResults(request.tagged, result.items.length);
		//assign the searched item (tag) and # of items to variable SearchResult

		$('.search-results').html(searchResults); //prints the results of the showSearchResult function which was assigned to the searchResults variable. 

		$.each(result.items, function(i, item) { //loop through each "result" object and run function i and item. 
			var question = showQuestion(item); //assign the showQuestion function to question vaiable. Passes item parameter. Where does item come from? is item informing quesion?

			$('.results').append(question); //append the results
		});
	})
	.fail(function(jqXHR, error, errorThrown){ //looked at api- not sure what these parametere refer to?
		var errorElem = showError(error);
		$('.search-results').append(errorElem);// if error, call showError function. error message created above
	});
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getAnswered = function(tag) {

	//the parameters we need want to access from StackOverflow's API
	var request = {
					site: 'StackOverflow',
					page: '1',
					pagesize: '10',
					period: 'all_time'};

	//ajax request 				
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + tag + "/top-answerers/all_time",
		data: request,
		dataType: "jsonp",
		type: "GET",
	})

	.done(function(result){ //success callback after ajax method returns info. Is this what give us the number? 200,300 400?
		var searchResults = showSearchResults(tag, result.items.length); //assigning ShowSearchResults function to searchResults

		$('.search-results').html(searchResults); //print # of answerers and tag in bold

		$.each(result.items, function(i, item) { //loop through each result and run function with parameters i and item. ?
			var question = showAnswer(item); 
			$('.results').append(question); //append the answerers
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});

};



