function loadMenu(currentNavItem){
  /**
   * Load menu to div with id "menu" and highlight tab denoted by currentNavItem
   * @param {String} currentNavItem - either search, compare, or donate
   */
  var xhr= new XMLHttpRequest();
  xhr.open('GET', 'menu.html', true);
  xhr.onreadystatechange= function() {
      if (this.readyState!==4) return;
      if (this.status!==200) return; // or whatever error handling you want
      document.getElementById('menu').innerHTML= this.responseText;
      // Highlight current page nav text after menu bar is loaded
      highlightNavItem(currentNavItem)
  };
  xhr.send();

}

function highlightNavItem(itemName){
  switch(itemName){
    case "search":
      document.getElementById("nav_search").className = "topbar-text-highlighted";
      break;
    case "compare":
      document.getElementById("nav_compare").className = "topbar-text-highlighted";
      break;
    case "donate":
      document.getElementById("nav_donate").className = "topbar-text-highlighted";
      break;
  }
}

function getSessionObject(){
  /**
   * Return session object if it exists - otherwise return an empty initialized object
   */
  var obj = JSON.parse(sessionStorage.getItem("state"));
  if (obj == null){
    obj = {
      "searchString":"",
      "searchFilters":{},
      "savedCharities":[0,1,2,3,4,5],
      "comparisonMetrics":["BBB Rating", "Years of Operation", "Score of Impact", "Fundraising Efficiency"],
      "comparisonCharities":[],
      "allocationAmounts":{}
    }
  }
  return obj;
}

function setSessionObject(object){
  /**
   * Set session object to the given object
   */
  sessionStorage.setItem("state", JSON.stringify(object));
}

function getCharityDetails(){
  /**
   * Returns a flattened version of all charities details as a list
   */
  var allDetailsData = generateRandomCharityDetails(100);

  for (var i = 0; i < allDetailsData.length; i++){
    var detail = allDetailsData[i]
    detail["founders"] = getPeopleDetail(detail["founders"]);
    detail["news"] = getNewsDetail(detail["news"]);
    allDetailsData[i] = detail;
  }
  return allDetailsData;
}

/** ------------------ Helper Functions ---------------------------- 
 * Should not be called outside of this file*/

function searchCharities(searchText, filters){
  /**
   * Redirect user to search charities page with results given by query
   * @param {String} searchText - text in the main charity search box
   * @param {Array} filters - dictionary mapping filters with their toggled values
   */
}

function randomChoice(arr){
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
}

function generateRandomCharityDetails(numCharities){
  var detailsList = [];
  for (i = 0; i < numCharities; i++){
    detailsList.push(generateRandomCharity(i, "Charity_" + i));
  }
  return detailsList;
}

function generateRandomCharity(charityId, charityName){
  var charityDetail = {"id":charityId, "name":charityName};
  charityDetail["website"] = "www.google.com";
  charityDetail["rating"] = Math.floor((Math.random()*6));
  charityDetail["headquarters"] = "Seattle, Washington";
  charityDetail["regionOfOperation"] = "Worldwide";
  charityDetail["typeOfWork"] = "Philanthropy";
  charityDetail["charitableCommitment"] = "$2.19B";
  charityDetail["mission"] = "Fillter mission text";
  charityDetail["leadershipTeam"] = [3,4,5];
  charityDetail["founders"] = [1,2];
  charityDetail["news"] = [1,2,3];

  // Comparison metrics
  charityDetail["BBB Rating"] = randomChoice(["A","B","C"]) + randomChoice(["+","","-"]);
  charityDetail["Years of Operation"] = Math.floor(Math.random()*100);
  charityDetail["Score of Impact"] = randomChoice(["International", "National", "Local"]);
  charityDetail["Fundraising Efficiency"] = Math.floor(Math.random()*100) + "%";
  return charityDetail;
}

function getPeopleDetail(idList){
/**
 * Returns list of json like object associated with leader for
 * leadership tab in details page.
 * @param {Array} idList - list of leaderIds
 */
}

function getNewsDetail(idList){
  /**
   * Return news detail given list of input ids
   * @param {Array} isList list of newsIds
   */
}

function getUserDetail(idList){
/**
 * Return the details of a list of given users
 * Used to get the details of family members
 * @param {Array} userId list of userIds
 */
}
