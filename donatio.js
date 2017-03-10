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
      "savedCharities":[],
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
  var allDetailsData = 0;

  for (i = 0; i < allDetails.length; i++){
    var detail = allDetailsData[i]
    detail["founders"] = getPeopleDetail(detail["founders"]);
    detail["news"] = getNewsDetail(detail["news"]);
    allDetailsData[i] = detail;
  }
  return allDetails;
}

/** Helper Functions */

function searchCharities(searchText, filters){
  /**
   * Redirect user to search charities page with results given by query
   * @param {String} searchText - text in the main charity search box
   * @param {Array} filters - dictionary mapping filters with their toggled values
   */
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
