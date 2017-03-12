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
  var sessObj = getSessionObject();
  var charityId = sessObj["detailsCharity"];
  var charityDetails = getCharityDetails();
  var charityDetail = charityDetails[charityId];

  var contentView = document.getElementById("mainContentView");
  contentView.innerHTML = "";

  var glanceHeader = document.createElement("h2");
  glanceHeader.innerHTML = "At a Glance";
  contentView.appendChild(glanceHeader);

  var missionHeader = document.createElement("h2");
  missionHeader.innerHTML = "Mission";
  contentView.appendChild(missionHeader);

  var missionContent = document.createElement("p");
  missionContent.innerHTML = charityDetail["mission"];
  contentView.appendChild(missionContent);

  var newsHeader = document.createElement("h2");
  newsHeader.innerHTML = "Recent Updates";
  contentView.appendChild(newsHeader);

  for (var i=0; i < charityDetail["news"].length; i++){
    var date = charityDetail["news"][i].date;
    var headline = charityDetail["news"][i].headline;
    console.log(headline);
    var row = document.createElement("div");
    row.className = "row news-row";
    contentView.appendChild(row);
    var leftSide = document.createElement("div");
    leftSide.className = "col-md-2";
    leftSide.innerHTML = date;
    row.appendChild(leftSide);
    var rightSide = document.createElement("div");
    rightSide.className = "col-md-10";
    rightSide.innerHTML = "<a>" + headline + "<\a>";
    row.appendChild(rightSide);
  }
}

function showImpactView(){

}

function showFinancialsView(){

}

function showLeadershipView(){

}
