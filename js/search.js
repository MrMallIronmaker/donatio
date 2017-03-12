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

// Given a string, search all the charity data for particular results.
function search(inputString){
	// ensure we have the charity data
	if (sessionStorage.getItem("charityData") == null) {
		alert("whine whine whine");
	}
	// loop over all charities [N is small, so this is OK]

	// if it's in the name, give it 10 credits
	// if it's in the category or cause, give it three credits
	// if it's in the mission, give it one credit.
}