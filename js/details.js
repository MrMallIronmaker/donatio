function initializeDetails(){
    var sessObj = getSessionObject();
    var charityDetails = getCharityDetails(); 
    var detailsCharity = sessObj["detailsCharity"];

    // Get Charity Name and Image
    var imageDiv = document.getElementById("charity-image");
    imageDiv.innerHTML = "";

    var imageView = document.createElement("img");
    imageDiv.appendChild(imageView);
    imageView.src = charityDetails[detailsCharity]["photoUrl"];
    console.log(imageView.src);

    var nameDiv = document.getElementById("charity-name");
    nameDiv.innerHTML = "<h3>" + charityDetails[detailsCharity]["name"] +"<h3>";

    var addCharityButton = document.getElementById("addCharityButton");
    if (sessObj["savedCharities"].indexOf(sessObj["detailsCharity"]) > -1){
        addCharityButton.innerHTML = "Remove Charity";
    } else {
        addCharityButton.innerHTML = "Add Charity";
    }

    console.log(charityDetails[detailsCharity]["name"])

    addCharityButton.addEventListener("click", function(elem){
        return function(){
            var sessObj = getSessionObject();
            if (elem.innerHTML == "Add Charity"){
                sessObj["savedCharities"].push(sessObj["detailsCharity"]);
                elem.innerHTML = "Remove Charity";
            }else{
                var removeIndex = sessObj["savedCharities"].indexOf(sessObj["detailsCharity"]);
                sessObj["savedCharities"].splice(removeIndex, 1);

                elem.innerHTML = "Add Charity";
            }
            setSessionObject(sessObj);
        };
    }(addCharityButton));
}
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

  var sessObj = getSessionObject();
  var charityId = sessObj["detailsCharity"];
  var charityDetails = getCharityDetails();
  var charityDetail = charityDetails[charityId];

  var contentView = document.getElementById("mainContentView");
  contentView.innerHTML = "";

  var impactHeader = document.createElement("h2");
  impactHeader.innerHTML = "Impact";
  contentView.appendChild(impactHeader);

  var impactList = charityDetail["impact"];

  for (var i=0; i < impactList.length; i++){
    var title = impactList[i]["title"];
    var description = impactList[i]["description"];
    var photoUrl = impactList[i]["photoUrl"];

    var impactRow = document.createElement("div");
    impactRow.className = "row impact-elem";
    contentView.appendChild(impactRow);

    var leftSide = document.createElement("div");
    leftSide.className = "col-md-4";
    impactRow.appendChild(leftSide);

    var rightSide = document.createElement("div");
    rightSide.className = "col-md-8";
    impactRow.appendChild(rightSide);

    var imageView = document.createElement("img");
    imageView.className = "impact-image"
    imageView.src = photoUrl;
    leftSide.appendChild(imageView);

    var titleView = document.createElement("h3");
    titleView.innerHTML = title;
    rightSide.appendChild(titleView);

    var descriptionView = document.createElement("p");
    descriptionView.innerHTML = description;
    rightSide.appendChild(descriptionView);
  }

}

function showFinancialsView(){

  var sessObj = getSessionObject();
  var charityId = sessObj["detailsCharity"];
  var charityDetails = getCharityDetails();
  var charityDetail = charityDetails[charityId];

  var contentView = document.getElementById("mainContentView");
  contentView.innerHTML = "";

  var financialsHeader = document.createElement("h2");
  financialsHeader.innerHTML = "Financials";
  contentView.appendChild(financialsHeader);
}

function showLeadershipView(){

  var sessObj = getSessionObject();
  var charityId = sessObj["detailsCharity"];
  var charityDetails = getCharityDetails();
  var charityDetail = charityDetails[charityId];

  var contentView = document.getElementById("mainContentView");
  contentView.innerHTML = "";

  var genPeopleRow = function(peopleList){
    var rowContent = document.createElement("div");
    rowContent.className = "row people-row";
    var maxDisplay = Math.min(peopleList.length, 3);
    for (var i=0; i < maxDisplay; i++){
      var column = document.createElement("div");
      column.className = "col-md-4";
      rowContent.appendChild(column);

      var name = peopleList[i]["name"];
      var photoUrl = peopleList[i]["photoUrl"];

      var image = document.createElement("img");
      image.className = "person-image";
      image.src = photoUrl;
      column.appendChild(image);
      var text = document.createElement("h4");
      text.innerHTML = name;
      column.appendChild(text);

      var position = peopleList[i]["position"];
      var tenure = peopleList[i]["tenure"];
      if (position != null && tenure != null){
        var additionalText = document.createElement("h4");
        additionalText.innerHTML = position + ": " + tenure;
        column.appendChild(additionalText);
      }
    }

    return rowContent;
  };

  var leadershipData = charityDetail["leadershipTeam"];
  var founderData = charityDetail["founders"];

  var leadershipHeader = document.createElement("h2");
  leadershipHeader.innerHTML = "Current Leadership:";
  contentView.appendChild(leadershipHeader);

  var leadershipRow = genPeopleRow(leadershipData);
  contentView.appendChild(leadershipRow);

  var founderHeader = document.createElement("h2");
  founderHeader.innerHTML = "Founders";
  contentView.appendChild(founderHeader);

  var founderRow = genPeopleRow(founderData);
  contentView.appendChild(founderRow);
}
