var allCauses = [
  "Medical Research",
  "Patient and Family Support",
  "Children's and Family Servies",
  "Social Services"
];

var allCategories = [
  "Health",
  "Human Services"
];




function initializePage(currentNavItem){
  // TODO : race condition if data is not loaded prior to init functions
  // for compare and allocation pages
  loadStaticData();
  loadMenu(currentNavItem);
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
      "savedCharities":[0,1,2,3],
      "comparisonMetrics":["BBB Rating", "Years of Operation", "Scope of Impact", "Fundraising Efficiency"],
      "comparisonCharities":[],
      "detailsCharity":0,
      "allocationAmounts":{'Bill and Melinda Gates Foundation': 0, 'Marie Curie': 0, 'SOS Children\'s Villages':0, 'United Way': 0},
      'percentAllocated': 0,
      'totalFunds': 60
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
  //var allDetailsData = generateRandomCharityDetails(100);
  var allDetailsData = JSON.parse(sessionStorage.getItem("charityData"));
  for (var i = 0; i < allDetailsData.length; i++){
    allDetailsData[i] = generateRandomCharityDetails(allDetailsData[i]);
  }

  for (var i = 0; i < allDetailsData.length; i++){
    var detail = allDetailsData[i];
    detail["impact"] = getImpactDetail(detail["impact"]);
    detail["leadershipTeam"] = getPeopleDetail(detail["leadershipTeam"]);
    detail["founders"] = getPeopleDetail(detail["founders"]);
    detail["news"] = getNewsDetail(detail["news"]);
    allDetailsData[i] = detail;
  }
  return allDetailsData;
}

/** ------------------ Helper Functions ---------------------------- 
 * Should not be called outside of this file*/


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
      obj = getSessionObject()
      document.getElementById('funds').innerHTML = '$'+(obj['percentAllocated']/100.0*obj['totalFunds']).toFixed(2)+'/$'+obj['totalFunds']+' allocated';
  };
  xhr.send();

}

function loadStaticData(){
  if (sessionStorage.getItem("charityData") == null){
    loadJSON("data/charityData.json",function(response){
      //var jsonData = JSON.parse(response);
      sessionStorage.setItem("charityData", response);
    });
  }
  if (sessionStorage.getItem("peopleData") == null){
    loadJSON("data/peopleData.json", function(response){
      sessionStorage.setItem("peopleData", response);
    });
  }
  if (sessionStorage.getItem("newsData") == null){
    loadJSON("data/newsData.json", function(response){
      sessionStorage.setItem("newsData", response);
    });
  }
  if (sessionStorage.getItem("impactData") == null){
    loadJSON("data/impactData.json", function(response){
      sessionStorage.setItem("impactData", response);
    });
  }

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

function searchCharities(searchText, filters){
  /**
   * Redirect user to search charities page with results given by query
   * @param {String} searchText - text in the main charity search box
   * @param {Array} filters - dictionary mapping filters with their toggled values
   */

   window.location.href = "search.html";
   $(document).ready( function() {
    $("#searchBar").val(searchText);
    alert($("#searchBar").val());
    onSearchClick();
   })
}

function randomChoice(arr){
  var index = Math.floor(Math.random()*arr.length);
  return arr[index];
}

function generateRandomCharities(numCharities){
  var detailsList = [];
  for (i = 0; i < numCharities; i++){
    var charityDetail = {"id":i, "name":"Charity_" + i};
    charityDetail = generateRandomCharityDetails(charityDetail);
    detailsList.push(charityDetail);
  }
  return detailsList;
}

function generateRandomCharityDetails(charityDetail){
  charityDetail = fillIn(charityDetail, "website", "www.google.com");
  charityDetail = fillIn(charityDetail, "rating", Math.floor((Math.random()*6)));
  charityDetail = fillIn(charityDetail, "headquarters", "Seattle, Washington");
  charityDetail = fillIn(charityDetail, "regionOfOperation", "Worldwide");
  charityDetail = fillIn(charityDetail, "typeOfWork", "Philanthropy");
  charityDetail = fillIn(charityDetail, "charitableCommitment", "$2.19B");
  charityDetail = fillIn(charityDetail, "mission", "Fillter mission text");
  charityDetail = fillIn(charityDetail, "impact", [0,1,2]);
  charityDetail = fillIn(charityDetail, "leadershipTeam", [2,3,4]);
  charityDetail = fillIn(charityDetail, "founders", [0,2]);
  charityDetail = fillIn(charityDetail, "news", [0,1,2]);

  // For filtering
  charityDetail = fillIn(charityDetail, "cause",
      randomChoice(allCauses));
  charityDetail = fillIn(charityDetail, "category",
      randomChoice(allCategories));

  // Comparison metrics
  charityDetail = fillIn(charityDetail, "BBB Rating",
      randomChoice(["A","B","C"]) + randomChoice(["+","","-"]));
  charityDetail = fillIn(charityDetail, "Years of Operation",
      Math.floor(Math.random()*100));
  charityDetail = fillIn(charityDetail, "Scope of Impact",
      randomChoice(["International", "National", "Local"]));
  charityDetail = fillIn(charityDetail, "Fundraising Efficiency",
      Math.floor(Math.random()*100) + "%");
  return charityDetail;
}

function fillIn(obj, key, value){
  /**
   * Fills in obj[key] with value if obj[key] is null
   * @params{Array} obj - target associative array to fill
   * @param{String} key - target key
   * @param{Object} - Any type of object to set the value to
   */
  if (obj[key] == null){
    obj[key] = value;
  }
  return obj;
}

function getPeopleDetail(idList){
/**
 * Returns list of json like object associated with leader for
 * leadership tab in details page.
 * @param {Array} idList - list of leaderIds
 */
  var peopleData =  JSON.parse(sessionStorage.getItem("peopleData"));
  var result = [];
  for (var i=0; i < idList.length; i++){
    result.push(peopleData[idList[i]]);
  }
  return result;
}

function getNewsDetail(idList){
  /**
   * Return news detail given list of input ids
   * @param {Array} isList list of newsIds
   */
  var newsData = JSON.parse(sessionStorage.getItem("newsData"));
  var result = [];
  for (var i=0; i < idList.length; i++){
    result.push(newsData[idList[i]]);
  }
  return result;
}

function getUserDetail(idList){
/**
 * Return the details of a list of given users
 * Used to get the details of family members
 * @param {Array} userId list of userIds
 */
  var userData = JSON.parse(sessionStorage.getItem("userData"));
  var result = [];
  for (var i=0; i < idList.length; i++){
    result.push(userData[idList[i]]);
  }
  return result;
}


function getImpactDetail(idList){
  var impactData = JSON.parse(sessionStorage.getItem("impactData"));
  var result = [];
  for (var i=0; i < idList.length; i++){
    result.push(impactData[idList[i]]);
  }
  return result;
}

function loadJSON(jsonUrl, callback) {   

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', jsonUrl, true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);  
}

