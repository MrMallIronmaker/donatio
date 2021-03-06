var allCauses = [
  ["Animal Rights, Welfare, and Services", "Animals"],
  ["Wildlife Conservation", "Animals"],
  ["Zoos and Aquariums", "Animals"],
  ["Libraries, Historical Societies and Landmark Preservation", "Arts, Culture, Humanities"],
  ["Museums", "Arts, Culture, Humanities"],
  ["Performing Arts", "Arts, Culture, Humanities"],
  ["Public Broadcasting and Media", "Arts, Culture, Humanities"],
  ["United Ways", "Community Development"],
  ["Jewish Federations", "Community Development"],
  ["Community Foundations", "Community Development"],
  ["Housing and Neighborhood Development", "Community Development"],
  ["Early Childhood Programs and Services", "Education"],
  ["Scholarship and Financial Support", "Education"],
  ["Special Education", "Education"],
  ["Adult Education Programs and Services", "Education"],
  ["Youth Education Programs and Services", "Education"],
  ["Education Policy and Reform", "Education"],
  ["Environmental Protection and Conservation", "Environment"],
  ["Botanical Gardens, Parks, and Nature Centers", "Environment"],
  ["Diseases, Disorders, and Disciplines", "Health"],
  ["Patient and Family Support", "Health"],
  ["Treatment and Prevention Services", "Health"],
  ["Medical Research", "Health"],
  ["Children's and Family Services", "Human Services"],
  ["Youth Development, Shelter, and Crisis Services", "Human Services"],
  ["Food Banks, Food Pantries, and Food Distribution", "Human Services"],
  ["Multipurpose Human Service Organizations", "Human Services"],
  ["Homeless Services", "Human Services"],
  ["Social Services", "Human Services"],
  ["Advocacy", "Human and Civil Rights"],
  ["Voter Education and Reform", "Human and Civil Rights"],
  ["Development and Relief Services", "International"],
  ["International Peace, Security, and Affairs", "International"],
  ["Humanitarian Relief Supplies", "International"],
  ["Non-Medical Science & Technology Research", "Research and Public Policy"],
  ["Social and Public Policy Research", "Research and Public Policy"]
];

allScopes = [
  "International",
  "National",
  "State",
  "Regional",
  "Local"
]


function initializePage(currentNavItem){
  // TODO : race condition if data is not loaded prior to init functions
  // for compare and allocation pages
  loadStaticData();
  loadMenu(currentNavItem);
}

function escapeSpaces(str) {
  return str.replace(/ /g, "_");
}


function getSessionObject(){
  /**
   * Return session object if it exists - otherwise return an empty initialized object
   */
  var obj = JSON.parse(sessionStorage.getItem("state"));
  if (obj == null){
    obj = {
      "searchStrings":[],
      "searchFilters":{},
      "savedCharities":[0,1,2,3],
      "comparisonMetrics":["BBB Rating", "Years of Operation", "Scope of Impact", "Fundraising Efficiency"],
      "comparisonCharities":[],
      "detailsCharity":0,
      "allocationAmounts":{},//{'Bill and Melinda Gates Foundation': 0, 'Marie Curie': 0, 'SOS Children\'s Villages':0, 'United Way': 0},
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
      console.log(currentNavItem)
      highlightNavItem(currentNavItem)
      obj = getSessionObject()
      document.getElementById('funds').innerHTML = '$'+(obj['percentAllocated']/100.0*obj['totalFunds']).toFixed(2)+'/$'+obj['totalFunds']+' allocated';
      loadCart();
  };
  xhr.send();

}

function loadStaticData(){
  if (sessionStorage.getItem("charityData") == null){
    loadJSON("data/charityData.json",function(response){
      var allDetailsData = JSON.parse(response);
      console.log(allDetailsData);
      for (var i = 0; i < allDetailsData.length; i++){
        allDetailsData[i] = generateRandomCharityDetails(allDetailsData[i]);
      }
      sessionStorage.setItem("charityData", JSON.stringify(allDetailsData));
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
    case "discover":
      document.getElementById("nav_discover").className = "topbar-text-highlighted";
      break;
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

   window.location.href = "search.html?q=" + searchText;
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
    charityDetail = fillIn(charityDetail, "founders", [0,1]);
    charityDetail = fillIn(charityDetail, "news", [0,1,2]);

    // For filtering
    var cause = randomChoice(allCauses);
    charityDetail = fillIn(charityDetail, "cause", cause[0]);
    charityDetail = fillIn(charityDetail, "category", cause[1]);

    // For details page
    charityDetail = fillIn(charityDetail, "orgType", "Private Foundation");
    charityDetail = fillIn(charityDetail, "founded", "Jan 1, 1997");

    // Comparison metrics
    charityDetail = fillIn(charityDetail, "BBB Rating",
            randomChoice(["A","B","C"]) + randomChoice(["+","","-"]));
    charityDetail = fillIn(charityDetail, "Years of Operation",
            Math.floor(Math.random()*100));
    charityDetail = fillIn(charityDetail, "Scope of Impact",
            randomChoice(allScopes));
    charityDetail = fillIn(charityDetail, "Fundraising Efficiency",
            Math.floor(Math.random()*100) + "%");

    charityDetail = fillIn(charityDetail, "Impact Score",
            Math.floor(Math.random()*10));
    charityDetail = fillIn(charityDetail, "Corporate Headquarters",
            "Palo Alto, CA");
    charityDetail = fillIn(charityDetail, "Outreach Offices",
            "Palo Alto, CA");
    charityDetail = fillIn(charityDetail, "Number of Donors",
            Math.floor(Math.random()*100));
    charityDetail = fillIn(charityDetail, "Organization Type",
            randomChoice(["Public", "Private"]));
    charityDetail = fillIn(charityDetail, "Type of Work",
            randomChoice(["Funding"]));
    charityDetail = fillIn(charityDetail, "Administrative Overhead",
            Math.floor(Math.random()*100) + "%");
    charityDetail = fillIn(charityDetail, "Charitable Commitment",
            Math.floor(Math.random()*100) + " M");
    charityDetail = fillIn(charityDetail, "Donor Dependency",
            Math.floor(Math.random()*100) + "%");
    charityDetail = fillIn(charityDetail, "Primary Support",
            "Govt Grants", "Private Donations");
    charityDetail = fillIn(charityDetail, "Tax Status",
            "501(c)(3)");
    charityDetail = fillIn(charityDetail, "Total Expenses",
            Math.floor(Math.random()*10) + "M");
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

function deleteElemFromList(list, elem){
    /** Delete element from list if it exists - otherwise return the original list*/
    var index = list.indexOf(elem);
    if (index > -1){
        list.splice(index, 1);
    }
    return list;
}

function createText(text, class_name){
  /** Return text <p> element with class class_name */
  var elem = document.createElement("p");
  elem.className = class_name;
  var textNode = document.createTextNode(text);
  elem.appendChild(textNode);
  return elem;
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function openCart() {
    document.getElementById("cartDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.matches('.glyphicon-trash')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function loadCart() {
  var sessionObject = getSessionObject();
  var allDetailsData = JSON.parse(sessionStorage.getItem("charityData"));
  $("#cartDropdown").empty();
  for (i in sessionObject["savedCharities"]) {
    var charityIndex = sessionObject["savedCharities"][i];
    //var charityHTML = "<div><div class='cart-img-div'><img class='cart-img' src='" + allDetailsData[charityIndex].photoUrl
    //  + "'></div><p>" + allDetailsData[charityIndex].name + "</p> </div>";

    var charityHTML = "<tr>\
        <td class='cart-img-td'>\
          <img class='cart-img' src='" + allDetailsData[charityIndex].photoUrl + "'>\
        </td>\
        <td class='cart-name-td'>\
          <h3 class='search-result-title' onclick='loadDetailsPage(" 
            + charityIndex + ")'>" + allDetailsData[charityIndex].name + "</h3>\
        </td>\
        <td class='cart-delete-td'> \
          <span class='glyphicon glyphicon-trash' onclick='deleteCharity(this," + charityIndex + ")'> </span>\
        </td>\
      </tr>";
    $("#cartDropdown").append(charityHTML);
  }

  //alert($("#cart-count").html());
  $("#cart-count").html(sessionObject.savedCharities.length);
  //alert(sessionObject.savedCharities.length);
  
}

function deleteCharity(el, charityIndex) {
  $(el).closest("tr").remove();
  var sessionObject = getSessionObject();
  var savedCharities = sessionObject.savedCharities;
  savedCharities = savedCharities.filter(item => item !== charityIndex);
  sessionObject.savedCharities = savedCharities;
  setSessionObject(sessionObject);
}

function loadDetailsPage(pageIndex) {
  var q = getSessionObject();
  q.detailsCharity = pageIndex;
  setSessionObject(q);

  window.location.href = 'details.html';
}

function mouseEnterCart(el) {
  el.src='imgs/cart_white.png';
  $(el).siblings(".cart-number-div").children().addClass("cart-number-invert").removeClass("cart-number-normal");
}

function mouseLeaveCart(el) {
  el.src='imgs/cart.png';
  $(el).siblings(".cart-number-div").children().addClass("cart-number-normal").removeClass("cart-number-invert");
}