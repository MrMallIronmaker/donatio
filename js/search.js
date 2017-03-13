/*
<div class="search-result"> 
	<h3 class="search-result-title"> Starlight Children's Foundation - Global Office </h3>
	<p class="search-result-body"> Brightening the lives of seriously ill children.... </p>
</div>
<div class="search-result"> 
	<h3 class="search-result-title"> Bill and Melinda Gates Foundation </h3>
	<p class="search-result-body"> We seek to unlock the possibilitiy inside every individual.... </p>
	<table>
		<tr>
			<td class="details-table-label">Rating:</td> 
			<td class="details-table-data">starzzz...</td>
			<td class="details-table-label">Headquarters:</td> 
			<td class="details-table-data">Seattle, Washington</td>
			<td class="details-table-label">Type of Work:</td> 
			<td class="details-table-data">Philanthrophy</td>
		</tr>
		<tr>
			<td class="details-table-label">Org. Type:</td> 
			<td class="details-table-data">Private Foundation</td>
			<td class="details-table-label">Regions of Operation:</td> 
			<td class="details-table-data">Worldwide</td>
			<td class="details-table-label">Charitable Commitment:</td>
			<td class="details-table-data">$2.19B</td>
		<tr>
			<td class="details-table-label">Founded:</td>
			<td class="details-table-data">Jan 1, 1997</td>
		</tr>
	</table>
</div>
*/

function onSearchClick() {
	var charityDetails = getCharityDetails();
	var pointsMap = search(charityDetails, "Foundation");

	var search_results = $("#search-results");
	for (i in pointsMap) {

		search_results.append(
			'<div class="search-result"> \
				<h3 class="search-result-title"> ' + charityDetails[i].name + '</h3>\
				<p class="search-result-body"> ' + charityDetails[i].mission + ' </p>\
				<table class="details-table">\
					<tr>\
						<td class="details-table-label">Rating:</td> \
						<td class="details-table-data">starzzz...</td>\
						<td class="details-table-label">Headquarters:</td> \
						<td class="details-table-data">Seattle, Washington</td>\
						<td class="details-table-label">Type of Work:</td> \
						<td class="details-table-data">Philanthrophy</td>\
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

// Given a string, search all the charity data for particular results.
function search(charityDetails, inputString){
	// ensure we have the charity data
	var pointsMap = {}; // pointsMap[indexInCharityDetails] -> points
	// loop over all charities [N is small, so this is OK]
	for (var i = 0; i < charityDetails.length; i++) {
		var points = 0;
		// if it's in the name, give it 10 credits
		if (charityDetails[i].name.indexOf(inputString) !== -1) {
			points += 10;
		}
		// if it's in the category or cause, give it three credits
		if (charityDetails[i].category.indexOf(inputString) !== -1) {
			points += 3;
		}
		if (charityDetails[i].cause.indexOf(inputString) !== -1) {
			points += 3;
		}
		// if it's in the mission, give it one credit.
		if (charityDetails[i].mission.indexOf(inputString) !== -1) {
			points += 1;
		}
		if (points > 0) {
			pointsMap[i] = points;
		}
	}
	return pointsMap;
}