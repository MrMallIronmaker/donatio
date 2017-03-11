function loadSelectionMenu(){
  var obj = getSessionObject();
  var savedCharities = obj["savedCharities"];
  var initialSelectedCharities = obj["comparisonCharities"];
  var charityDetails = getCharityDetails();

  var elemList = document.getElementById("myCharitiesList");

  for (var i = 0; i < savedCharities.length; i++){
    text = charityDetails[savedCharities[i]].name;
    var elem = document.createElement("div");
    var para = document.createElement("p");
    var node = document.createTextNode(text);
    elem.appendChild(para);
    para.appendChild(node);
    elemList.appendChild(elem);
    if (initialSelectedCharities.indexOf(savedCharities[i]) > -1){
      elem.className = "charity-element charity-element-selected";
    } else{
      elem.className = "charity-element";
    }
    var clickHandler = function(elem, charityId){
      return function(){
        if (elem.className.split(" ").length == 1){
          // Charity is not currently selected
          elem.className = "charity-element charity-element-selected";
          var sessObj = getSessionObject();
          sessObj["comparisonCharities"].push(charityId);
          setSessionObject(sessObj);
          console.log(sessObj["comparisonCharities"]);
          updateComparison(sessObj["comparisonCharities"]);

        } else{
          // Charity is already selected
          elem.className = "charity-element";
          var sessObj = getSessionObject();
          var removeIndex = sessObj["comparisonCharities"].indexOf(charityId);
          if (removeIndex > -1){
            sessObj["comparisonCharities"].splice(removeIndex, 1);
          }
          setSessionObject(sessObj);
          updateComparison(sessObj["comparisonCharities"]);
        }
      }}(elem, savedCharities[i]);
    elem.addEventListener("click", clickHandler);
  }
}

function updateComparison(charityIds){
  // Display up to a maxiumum of 4 charities for comparison
  var numComparisons = Math.min(charityIds.length, 4);
  // Out of 12 column grid - 2 columns reserved for metric name - 10 remaining
  var bootstrapColumnSize = Math.floor(10 / numComparisons);
  var obj = getSessionObject();
  var comparisonMetrics = obj["comparisonMetrics"];
  var charityDetails = getCharityDetails();
  var comparisonView = document.getElementById("comparisonList");
  comparisonView.innerHTML = "";

  // first column with charity names and pictures
  var firstRow = document.createElement("div");
  firstRow.className = "row comparison-name-row";
  comparisonView.appendChild(firstRow);

  var editButtonSpace = document.createElement("div");
  editButtonSpace.className = "col-md-2";
  firstRow.appendChild(editButtonSpace);
  var editButton = document.createElement("div");
  editButton.className = "edit-button";
  editButton.innerHTML = "Edit Metrics";
  editButtonSpace.appendChild(editButton);
  editButton.addEventListener("click", editMetricsHandler);
  for (var i = 0; i < numComparisons; i++){
    var charityName = charityDetails[charityIds[i]].name;
    var charityNameColumn = document.createElement("div");
    charityNameColumn.className = "col-md-" + bootstrapColumnSize;
    charityNameColumn.innerHTML = charityName;
    firstRow.appendChild(charityNameColumn);
  }

  // remaining columns of comparison chart
  for (var i = 0; i < comparisonMetrics.length; i ++){
    var comparisonMetric = comparisonMetrics[i];
    var row = document.createElement("div");
    row.className = ((i%2==0) ? "row comparison-row-even" : "row comparison-row-odd");
    comparisonView.appendChild(row);
    var nameColumn = document.createElement("div");
    nameColumn.className = "col-md-2";
    nameColumn.innerHTML = comparisonMetric;
    row.appendChild(nameColumn); 
    for (var j = 0; j < numComparisons; j++){
      var column = document.createElement("div");
      column.className = "col-md-" + bootstrapColumnSize;
      charityId = charityIds[j];
      var charityMetricValue = charityDetails[charityId][comparisonMetric];
      column.innerHTML = charityMetricValue;
      row.appendChild(column);
    }
  }
}

function editMetricsHandler(){
  // Create a model pop-up which prepopulates with the current comparison metrics
  // Have a button to update metrics
}
