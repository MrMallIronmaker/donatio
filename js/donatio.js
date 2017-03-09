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

function searchCharities(searchText, filters){
  /**
   * Redirect user to search charities page with results given by query
   * @param {String} searchText - text in the main charity search box
   * @param {Array} filters - dictionary mapping filters with their toggled values
   */
}

function getCharityDetail(charityId){
/**
 * Returns json like object of details of associate charityId
 * @param {Number} charityId - charity id
 */
}

function getPersonDetail(leadershipId){
/**
 * Returns json like object associated with leader for
 * leadership tab in details page.
 * @param {Number} leadershipId - id of leader to look for
 */
}

function getNewsDetail(newsId){
  /**
   * Return news detail given input id
   * @param {Number} newsId
   */
}

function getCurrentUserDetail(){
/**
 * Return the details of the current user
 * Used to get the ids of fmily members to be displayed in the family sections
 */
}

function getUserDetail(userId){
/**
 * Return the details of a given user
 * Used to get the details of family members
 * @param {Number} userId
 */
}
