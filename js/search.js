
function getSubstringCount(needle, haystack) {
    var m = haystack.match(new RegExp(needle.toString().replace(/(?=[.\\+*?[^\]$(){}\|])/g, "\\"), "g"));
    return m ? m.length:0;
}

function wordLimit(string, wordCount) {
	return string.split(/\s+/).slice(0,wordCount).join(" ");
}


function initializeSearchButton(){
    // Attach onclick handler to submit button
    var button = document.getElementById("search-button");
    button.addEventListener("click", onSearchClick);


    // give the search bar a submit on enter functionality
    $("#searchBar").keyup(function(event){
        if(event.keyCode == 13){ // enter key
            onSearchClick();
        }
    });
}

// Given a string, search all the charity data for particular results.
function getPointsMap(charityDetails){
	// ensure we have the charity data
	var pointsMap = {}; // pointsMap[points] -> [index, index, index]

	// get all the filters.
	var sessionObject = getSessionObject();
	var filters = sessionObject["searchFilters"];

	//filters = {"cause": ["Museums", "Social Services"]};

	// loop over all charities [N is small, so this is OK]
	for (var i = 0; i < charityDetails.length; i++) {

		// ensure it passes all filters
		var passedFilters = true;
		for (var filterKey in filters) {
			if (filterKey === "rating") {
				passedFilters &= (+charityDetails[i]["rating"] >= +filters["rating"] );
			} else {
				passedFilters &= (-1 !== filters[filterKey].indexOf(charityDetails[i][filterKey]));
			}
		}
		if (!passedFilters) {
			continue;
		}

		var points = 0;
		for (j in sessionObject["searchStrings"]) {
			var inputString = sessionObject["searchStrings"][j].toLowerCase();
			// if it's in the name, give it 10 credits
			points += getSubstringCount(inputString, charityDetails[i].name.toLowerCase()) * 5;
			// if it's in the category or cause, give it three credits
			points += getSubstringCount(inputString, charityDetails[i].cause.toLowerCase()) * 3;
			points += getSubstringCount(inputString, charityDetails[i].category.toLowerCase()) * 3;
			// if it's in the mission, give it one credit.
			points += getSubstringCount(inputString, charityDetails[i].mission.toLowerCase()) * 1;

		}

		if (points > 0) {
			if (pointsMap[points]) {
				pointsMap[points] = pointsMap[points].concat(i);
			}
			else {
				pointsMap[points] = [i];
			}
		}
	}
	return pointsMap;
}

function addSubstringFilter(filterText) {
	var sessionObject = getSessionObject();
	sessionObject["searchStrings"].push(filterText);
	setSessionObject(sessionObject);
}

function removeSubstringFilter(element) {
	var sessionObject = getSessionObject();
	var currentSearchStrings = sessionObject["searchStrings"];
	var filterValue = $(element).siblings(".filter-substring-text")[0].innerHTML;

	currentSearchStrings = currentSearchStrings.filter(function(e) { return e !== filterValue });

	sessionObject["searchStrings"] = currentSearchStrings;
	setSessionObject(sessionObject);

	updateSearch();
}

function onSearchClick() {
	// add the current searchbar contents to the filter list
	var searchbar = $("#searchBar").val();
	addSubstringFilter(searchbar);
	updateSearch();
}

function updateSearch() {
	var charityDetails = getCharityDetails();
	var pointsMap = getPointsMap(charityDetails);

	var search_results = $("#search-results");
	search_results.empty();

	var keys = Object.keys(pointsMap);
	keys.sort(function (a, b) {return b-a;});

	var result_indeces = keys.map(function (i) {return pointsMap[i];});
	// flatten the results.
	result_indeces = [].concat.apply([], result_indeces);

	var start = checkGETfor('start') || 0;
	var end = +start + 10; // the limit is ten per page

	for (var i = start; i < result_indeces.length && i < end; i++) {
		search_results.append(
			'<div class="search-result"> \
				<h3 class="search-result-title" onclick="loadDetailsPage(' + result_indeces[i] + ')">'
					+ charityDetails[result_indeces[i]].name + 
				'</h3>\
				<p class="search-result-body details-table-visible" onclick="toggleDetailsTable(this)">' 
					+ wordLimit(charityDetails[result_indeces[i]].mission, 18) + '... <a>continue</a> </p>\
					<p class="search-result-body details-table-hidden" onclick="toggleDetailsTable(this)">' 
					+ charityDetails[result_indeces[i]].mission + ' </p>\
				<table class="details-table-hidden" class="details-table">\
					<tr>\
						<td class="details-table-label">Rating:</td> \
						<td class="details-table-data">' + buildRating(charityDetails[result_indeces[i]].rating) + '</td>\
						<td class="details-table-label">Headquarters:</td> \
						<td class="details-table-data">Seattle, Washington</td>\
						<td class="details-table-label">Cause:</td> \
						<td class="details-table-data">'
						+ charityDetails[result_indeces[i]].cause + '</td>\
						<td rowspan=3> <a onclick="loadDetailsPage(' + result_indeces[i] + ')"> Learn More...</a> </td> \
					</tr>\
					<tr>\
						<td class="details-table-label">Org. Type:</td> \
						<td class="details-table-data">Private Foundation</td>\
						<td class="details-table-label">Regions of Operation:</td> \
						<td class="details-table-data">Worldwide</td>\
						<td class="details-table-label">Charitable Commitment:</td>\
						<td class="details-table-data">$2.19B</td>\
					<tr>\
						<td class="details-table-label">Founded:</td>\
						<td class="details-table-data">Jan 1, 1997</td>\
					</tr>\
				</table>\
			</div>'
		)
	}

	// add links to other pages of results
	var pagination = $('<div></div>');
	for (var i = 0; i*10 < result_indeces.length; i++) {
		var extraclass = "";
		if (start == i*10) {
			extraclass = " results-page-link-active";
		}
		pagination.append('<div class="results-page-link'+extraclass+'"> <a href="search.html?start='
							 + (i * 10) + '"> '+(i+1)+' </a> </div>');
	}
	search_results.append(pagination);
}

function loadDetailsPage(pageIndex) {
	var q = getSessionObject();
	q.detailsCharity = pageIndex;
	setSessionObject(q);

	window.location.href = 'details.html';
}

function toggleDetailsTable(detailsP) {
	var relevantObjects = $(detailsP).siblings().add($(detailsP));
	relevantObjects.filter(".details-table-visible").removeClass("details-table-visible").addClass("details-table-temp");
	relevantObjects.filter(".details-table-hidden").removeClass("details-table-hidden").addClass("details-table-visible");
	relevantObjects.filter(".details-table-temp").removeClass("details-table-temp").addClass("details-table-hidden");
}

function checkGETfor(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

function checkGETforQuery() {
	var query = checkGETfor("q");
	if (query) {
		$("#searchBar").val(query);
		//TODO: update this lol
		updateSearch();
	}
}

function toggleFilter(element, isChecked, filterType, filterValue) {
	var sessionObject = getSessionObject();
	var currentFilterList = sessionObject["searchFilters"][filterType];
	// if it's checked, add the filter to the current filter list
	if (isChecked) {
		if (currentFilterList) {
			currentFilterList.push(filterValue);
		} else {
			currentFilterList = [filterValue];
		}
		sessionObject["searchFilters"][filterType] = currentFilterList;
	}
	// if it's unchecked, remove the filter from the filter list
	else {
		currentFilterList = currentFilterList.filter(function(e) { return e !== filterValue });
		// and test to see if the filter list should be removed entirely.
		if (currentFilterList.length > 0) {
			sessionObject["searchFilters"][filterType] = currentFilterList;
		} else {
			delete sessionObject["searchFilters"][filterType];
		}
	}

	// if it's a category, hide / show the causes
	if (filterType === "category") {
		var categoryDiv = $(element).parent();
		if (isChecked) {
			categoryDiv.children(".filter-cause-hidden").addClass("filter-cause-visible").removeClass("filter-cause-hidden");
		} else {
			categoryDiv.children(".filter-cause-visible").removeClass("filter-cause-visible").addClass("filter-cause-hidden");
		}
	}
	setSessionObject(sessionObject);
	// trigger another onSearchClick
	updateSearch();
}

function onStarClick(el, val) {
	// set the rating filter
	var sessionObject = getSessionObject();
	var ratingFilter = sessionObject.searchFilters["rating"];
	if (ratingFilter === val) {
		delete sessionObject.searchFilters["rating"];
		val = undefined;
	} else {
		sessionObject.searchFilters["rating"] = val;
	}
	setSessionObject(sessionObject);

	// update the images
	val = val || "0";
	for (var i = 1; i <= 5; i++) {
		var img_src = 'imgs/star_empty.png';
		if (+val >= i) {
			img_src = 'imgs/star_fill.png';
		}
		$(el).siblings().add(el).filter(".filter-rating-star-" + i).attr('src', img_src);
	}

	updateSearch();
}

function buildRating(val) {
	var htmlBuilder = "";
	for (var i = 1; i <= 5; i++) {
		var img_src = "imgs/star_empty.png";
		if (val >= i) {
			img_src = "imgs/star_fill.png";
		}
		htmlBuilder += "<img class='filter-rating-star' src='" + img_src + "'>";
	}
	return htmlBuilder;
}

function loadSidebar() {
	// inside #scopes, #category, 
	// ignore #types, #organization for the moment.

	var allCategoriesDiv = $("#category");
	// for each cause: [#category]
	var currentCategory = "";
	var categoryDiv = null;
	for (i in allCauses) {
		// if it's a new category, make a new big div and checkbox
		if (allCauses[i][1] !== currentCategory) {
			// make a new big div and checkbox
			currentCategory = allCauses[i][1];
			categoryDiv = $('<div class="filter-option"> \
	            				<input type="checkbox" onchange="toggleFilter(this, this.checked, \'category\',\'' + currentCategory + '\')">\
	            				<p class="filter-name">' + currentCategory + '</p>\
	            				<p class="filter-results-count" id="' + escapeSpaces(currentCategory) + '">(--)</p>\
	            			</div>');
			allCategoriesDiv.append(categoryDiv);
		}
		// make a checkbox for the cause
		categoryDiv.append('<div class="filter-option filter-cause-hidden"> \
	            				<input type="checkbox" onchange="toggleFilter(this, this.checked, \'cause\',\'' + allCauses[i][0] + '\')">\
	            				<p class="filter-name">' + allCauses[i][0] + '</p>\
	            				<p class="filter-results-count" id="' + escapeSpaces(allCauses[i][0]) + '">(--)</p>\
	            			</div>')
	}
	// for each scope: [#scopes]
	// make a checkbox for the scope
	var scopesDiv = $("#scopes");
	for (i in allScopes) {
		scopesDiv.append('<div class="filter-option filter-scope"> \
	            				<input type="checkbox" onchange="toggleFilter(this, this.checked, \'Scope of Impact\',\'' + allScopes[i] + '\')">\
	            				<p class="filter-name">' + allScopes[i] + '</p>\
	            				<p class="filter-results-count" id="' + escapeSpaces(allScopes[i]) + '">(--)</p>\
	            			</div>')
		
	}
	
	// for each active filter:
	var sessionObject = getSessionObject();
	var searchFilters = sessionObject["searchFilters"];
	for (i in searchFilters) {
		for (j in searchFilters[i]) {
			var el = $("#" + escapeSpaces(searchFilters[i][j])).siblings("input")[0];
		    el.checked = true;
		    el.onchange();
		}
	}
}
