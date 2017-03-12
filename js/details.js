function initNavMenu(){
   var aboutNavButton = document.getElementById("aboutNavButton");
   var impactNavButton = document.getElementById("impactNavButton");
   var financialsNavButton = document.getElementById("financialsNavButton");
   var leadershipNavButton = document.getElementById("leadershipNavButton");

  aboutNavButton.addEventListener("click", function(){
    toggleSideSelection("aboutNavButton");
    showAboutView();
  });
  impactNavButton.addEventListener("click", function(){
    toggleSideSelection("impactNavButton");
    showImpactView();
  });
  financialsNavButton.addEventListener("click", function(){
    toggleSideSelection("financialsNavButton");
    showFinancialsView();
  });
  leadershipNavButton.addEventListener("click", function(){
    toggleSideSelection("leadershipNavButton");
    showLeadershipView();
  });
   // Functionality for add to charities button

   // initialize at about page
   toggleSideSelection("aboutNavButton");
   showAboutView();
}

function toggleSideSelection(elemId){
  var selected = document.getElementsByClassName("side-nav-elem-selected");
  for (var i=0; i < selected.length; i++){
    selected[i].className = "row side-nav-elem"
  }
  var selectElem = document.getElementById(elemId);
  selectElem.className = "row side-nav-elem side-nav-elem-selected";
}

function showAboutView(){

}

function showImpactView(){

}

function showFinancialsView(){

}

function showLeadershipView(){

}
