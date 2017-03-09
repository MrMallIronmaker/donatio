function loadMenu(currentNavItem){
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
