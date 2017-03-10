function loadSelectionMenu(){
  var obj = getSessionObject();
  var savedCharities = obj["savedCharities"];
  var charityDetails = getCharityDetails();
  savedCharities = [0,1,2,3,4,5];

  var elemList = document.getElementById("myCharitiesList");

  for (var i = 0; i < savedCharities.length; i++){
    text = charityDetails[savedCharities[i]].name;
    var elem = document.createElement("div");
    var para = document.createElement("p");
    var node = document.createTextNode(text);
    elem.appendChild(para);
    para.appendChild(node);
    elemList.appendChild(elem);
    elem.className = "charity-element";
    var clickHandler = function(elem){
      return function(){
        if (elem.className.split(" ").length == 1){
          // Charity is not currently selected
          elem.className = "charity-element charity-element-selected";
        } else{
          // Charity is already selected
          elem.className = "charity-element";
        }
      }}(elem);
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
      charityId = charityIds[i];
      var charityMetricValue = charityDetails[charityId][comparisonMetric];
      column.innerHTML = charityMetricValue;
      row.appendChild(column);
    }
  }
}
