
function getSubstringCount(needle, haystack) {
    var m = haystack.match(new RegExp(needle.toString().replace(/(?=[.\\+*?[^\]$(){}\|])/g, "\\"), "g"));
    return m ? m.length:0;
}

// Given a string, search all the charity data for particular results.
function getPointsMap(charityDetails, inputString){
	// ignore capitals
	inputString = inputString.toLowerCase();
	// ensure we have the charity data
	var pointsMap = {}; // pointsMap[points] -> [index, index, index]

	// get all the filters.
	var sessionObject = getSessionObject();
	var filters = sessionObject["searchFilters"];

	console.log(filters);

	//filters = {"cause": "Museums"};

	// loop over all charities [N is small, so this is OK]
	for (var i = 0; i < charityDetails.length; i++) {

		// ensure it passes all filters
		var passedFilters = true;
		for (var filterKey in filters) {
			passedFilters &= (charityDetails[i][filterKey] === filters[filterKey])
		}
		if (!passedFilters) {
			continue;
		}

		var points = 0;
		// if it's in the name, give it 10 credits
		points += getSubstringCount(inputString, charityDetails[i].name.toLowerCase()) * 5;
		// if it's in the category or cause, give it three credits
		points += getSubstringCount(inputString, charityDetails[i].cause.toLowerCase()) * 3;
		points += getSubstringCount(inputString, charityDetails[i].category.toLowerCase()) * 3;
		// if it's in the mission, give it one credit.
		points += getSubstringCount(inputString, charityDetails[i].mission.toLowerCase()) * 1;

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

function onSearchClick() {
	var charityDetails = getCharityDetails();
	var searchbar = $("#searchBar").val();
	var pointsMap = getPointsMap(charityDetails, searchbar);

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
				<p class="search-result-body" onclick="toggleDetailsTable(this)">' 
					+ charityDetails[result_indeces[i]].mission + ' </p>\
				<table class="details-table-hidden" class="details-table">\
					<tr>\
						<td class="details-table-label">Rating:</td> \
						<td class="details-table-data">starzzz...</td>\
						<td class="details-table-label">Headquarters:</td> \
						<td class="details-table-data">Seattle, Washington</td>\
						<td class="details-table-label">Cause:</td> \
						<td class="details-table-data">'
						+ charityDetails[result_indeces[i]].cause + '</td>\
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
}

function loadDetailsPage(pageIndex) {
	var q = getSessionObject();
	q.detailsCharity = pageIndex;
	setSessionObject(q);

	window.location.href = 'details.html';
}

function toggleDetailsTable(detailsP) {
	$(detailsP).siblings().filter(".details-table-visible").removeClass("details-table-visible").addClass("details-table-temp");
	$(detailsP).siblings().filter(".details-table-hidden").removeClass("details-table-hidden").addClass("details-table-visible");
	$(detailsP).siblings().filter(".details-table-temp").removeClass("details-table-temp").addClass("details-table-hidden");
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
		onSearchClick();
	}
}