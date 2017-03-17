function buildRating(val) {
  var htmlBuilder = "";
  for (var i = 1; i <= 5; i++) {
    var img_src = "imgs/star_empty.png";
    if (val >= i) {
      img_src = "imgs/star_fill.png";
    }
    htmlBuilder += "<img class='filter-rating-star' src='" + img_src + "'>";
  }
  return htmlBuilder;
}
function initializeDetails(){
    var sessObj = getSessionObject();
    var charityDetails = getCharityDetails(); 
    var detailsCharity = sessObj["detailsCharity"];

    // Get Charity Name and Image
    var imageDiv = document.getElementById("charity-image");
    imageDiv.innerHTML = "";

    var imageView = document.createElement("img");
    imageDiv.appendChild(imageView);
    imageView.className = "charity-image";
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

    addCharityButton.addEventListener("click", function(elem){
        return function(){
            var sessObj = getSessionObject();
            if (elem.innerHTML == "Add Charity"){
                sessObj["savedCharities"].push(sessObj["detailsCharity"]);
                sessObj["allocationAmounts"][charityDetails[detailsCharity]["name"]] = 0
                elem.innerHTML = "Remove Charity";
                elem.className = "added"
            }else{
                var removeIndex = sessObj["savedCharities"].indexOf(sessObj["detailsCharity"]);
                sessObj["savedCharities"].splice(removeIndex, 1);
                alloc = sessObj["allocationAmounts"][charityDetails[detailsCharity]];
                sessObj["percentAllocated"] -= alloc;
                delete sessObj["allocationAmounts"][charityDetails[detailsCharity]];
                elem.innerHTML = "Add Charity";
                elem.className = "unadded"
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

  var glanceRow = document.createElement("div");
  glanceRow.className = "row about-data";
  contentView.appendChild(glanceRow);
  var leftSide = document.createElement("div");
  leftSide.className = "col-md-6";
  //leftSide.innerHTML += "<h4>Rating: " + charityDetail["rating"] + "</h4>";
  leftSide.innerHTML += "<h4>Rating: </h4>" + buildRating(charityDetail["rating"]);
  leftSide.innerHTML += "<h4>Org Type: " + charityDetail["orgType"] + "</h4>";
  leftSide.innerHTML += "<h4>Founded: " + charityDetail["founded"] + "</h4>";
  leftSide.innerHTML += "<h4>Headquarters: " + charityDetail["headquarters"] + "</h4>";

  glanceRow.appendChild(leftSide);
  var rightSide = document.createElement("div");
  rightSide.className = "col-md-6";
  rightSide.innerHTML += "<h4>Region of Operation: " + charityDetail["regionOfOperation"] + "</h4>";
  rightSide.innerHTML += "<h4>Type of Work: " + charityDetail["typeOfWork"] + "</h4>";
  rightSide.innerHTML += "<h4>Charitable Commitment: " + charityDetail["charitableCommitment"] + "</h4>";
  glanceRow.appendChild(rightSide);

  var missionHeader = document.createElement("h2");
  missionHeader.innerHTML = "Mission";
  contentView.appendChild(missionHeader);

  var missionContent = document.createElement("div");
  missionContent.className = "row about-data";
  missionContent.innerHTML = charityDetail["mission"];
  contentView.appendChild(missionContent);

  var newsHeader = document.createElement("h2");
  newsHeader.innerHTML = "Recent Updates";
  contentView.appendChild(newsHeader);

  for (var i=0; i < charityDetail["news"].length; i++){
    var date = charityDetail["news"][i].date;
    var headline = charityDetail["news"][i].headline;
    var row = document.createElement("div");
    row.className = "row about-data news-row";
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

var current_eff_metric = 1;
var current_cap_metric = 5;

function showFinancialsView(){

  /*var sessObj = getSessionObject();
  var charityId = sessObj["detailsCharity"];
  var charityDetails = getCharityDetails();
  var charityDetail = charityDetails[charityId];*/

  var char_commit_data = []
  var fund_eff_data = []
  var op_reliance_data = []

  var vis_ratio_data = []
  var current_ratio_data = []
  var op_reserve_data = []
  var op_margin_data = []
  var net_assets_data = []
  var quick_ratio_data = []

  var years = ['2012', '2013', '2014', '2015', '2016']

  for (var i=0; i<years.length; i++){
    char_commit_data.push({'year': years[i], 'value': Math.random()})
    fund_eff_data.push({'year': years[i], 'value': Math.random()})
    op_reliance_data.push({'year': years[i], 'value': Math.random()})

    vis_ratio_data.push({'year': years[i], 'value': Math.random()})
    current_ratio_data.push({'year': years[i], 'value': Math.random()})
    op_reserve_data.push({'year': years[i], 'value': Math.random()})
    op_margin_data.push({'year': years[i], 'value': Math.random()})
    quick_ratio_data.push({'year': years[i], 'value': Math.random()})
    net_assets_data.push({'year': years[i], 'value': Math.floor((Math.random()*50000) + 500)/10000})
  }

  var map = {1:['#efficiency-chart', char_commit_data, "Charitable Commitment (%)"], 2:['#efficiency-chart', fund_eff_data, "Fundraising Efficiency (%)"], 3:['#efficiency-chart', op_reliance_data, "Operating Reliance (%)"], 4:['#capacity-chart', current_ratio_data, "Current Ratio (%)"], 5:['#capacity-chart', net_assets_data, "Net Assets ($millions)"], 6:['#capacity-chart', op_margin_data, "Operating Margin (%)"], 7:['#capacity-chart', op_reserve_data, "Operating Reserve (%)"], 8:['#capacity-chart', quick_ratio_data, "Quick Ratio (%)"], 9:['#capacity-chart', vis_ratio_data, "Visibility Ratio (%)"]}
  var defs = {1:"Charitable commitment measures how efficient a charity is in fulfilling its mission by comparing total program expenses directed towards the target causes to the total expenses", 2:"Fundraising efficiency measures of the amount of contributions that result from fundraising after accounting for the expenses incurred during the fundraising process.", 3: "Operating reliance measures the ability of a charity to pay for its total expenses exclusively with program revenues", 4: "Current ratio indicates a charity's ability to meet short-term financial obligations by comparing assests to liabilities.", 5:"Net Assets measures the financial performance of the charity", 6:"Operating margin is a forecasting ratio that illustrates a charity's ability to produce potential surplus funds which can be drawn upon in future years", 7:"Operating reserve measures whether a charity's resources are sufficient and flexible enough to support its mission by comparing expendable net assets to total expenses", 8:"Quick ratio gauges financial stability by comparing quick assets to curent liabilities", 9:"Visibility ratio indicates a charity's ability to cover its debt by comparing expendable net assets to long-term debt."}

  var contentView = document.getElementById("mainContentView");
  contentView.innerHTML = "";

  var financialsHeader = document.createElement("h2");
  financialsHeader.innerHTML = "Financials";
  contentView.appendChild(financialsHeader);

  var chartRow = document.createElement("div");
  chartRow.className = "row fin_charts";
  contentView.appendChild(chartRow);
  var leftSide = document.createElement("div");
  leftSide.className = "col-md-6";
  leftSide.setAttribute('id', 'efficiency-chart');
  chartRow.appendChild(leftSide);

  var rightSide = document.createElement("div");
  rightSide.className = "col-md-6";
  rightSide.setAttribute('id', 'capacity-chart');
  chartRow.appendChild(rightSide);

  var togRow = document.createElement("div");
  togRow.className = "row fin_chart_toggles";
  contentView.appendChild(togRow);
  var leftSideToggle = document.createElement("div");
  leftSideToggle.className = "col-md-5";
  leftSideToggle.setAttribute('id', 'efficiency-toggles');
  togRow.appendChild(leftSideToggle);

  var financialsLeftTogHeader = document.createElement("h4");
  financialsLeftTogHeader.innerHTML = "Financial Efficiency Performance Metrics";
  leftSideToggle.appendChild(financialsLeftTogHeader);
  var hr1 = document.createElement("hr");
  leftSideToggle.appendChild(hr1);
  


  var but1 = document.createElement("div");
  but1.className = "col-md-3 tog-button tog-button-selected eft";
  but1.setAttribute('id', 'but1');
  but1.innerHTML = 'Charitable Commitment'
  leftSideToggle.appendChild(but1);
  but1.onclick = function(){
    if (!(this.style.background == '#00C0AC')){
      make_chart(map[1][0], map[1][1], map[1][2])
      document.getElementById('but'+current_eff_metric).className = 'col-md-3 tog-button'
      this.className += ' tog-button-selected'
      current_eff_metric = 1
      document.getElementsByClassName('definition')[0].innerHTML=defs[1]      
    }
  }
  var but2 = document.createElement("div");
  but2.className = "col-md-3 tog-button eft";
  but2.setAttribute('id', 'but2');
  but2.innerHTML = 'Fundraising Efficiency'
  leftSideToggle.appendChild(but2);
  but2.onclick = function(){
    if (!(this.style.background == '#00C0AC')){
      make_chart(map[2][0], map[2][1], map[2][2])
      document.getElementById('but'+current_eff_metric).className = 'col-md-3 tog-button'
      this.className += ' tog-button-selected'
      current_eff_metric = 2      
      document.getElementsByClassName('definition')[0].innerHTML=defs[2] 
    }
  }
  var but3 = document.createElement("div");
  but3.className = "col-md-3 tog-button eft";
  but3.setAttribute('id', 'but3');
  but3.innerHTML = 'Operating Reliance'
  leftSideToggle.appendChild(but3);
  but3.onclick = function(){
    if (!(this.style.background == '#00C0AC')){
      make_chart(map[3][0], map[3][1], map[3][2])
      document.getElementById('but'+current_eff_metric).className = 'col-md-3 tog-button'
      this.className += ' tog-button-selected'
      current_eff_metric = 3      
      document.getElementsByClassName('definition')[0].innerHTML=defs[3] 
    }
  }
  var definition = document.createElement("p");
  definition.className = "definition"
  definition.innerHTML = defs[1]
  leftSideToggle.appendChild(definition)

  var rightSideToggle = document.createElement("div");
  rightSideToggle.className = "col-md-5";
  rightSideToggle.setAttribute('id', 'cap-toggles');
  togRow.appendChild(rightSideToggle);

  var financialsRightTogHeader = document.createElement("h4");
  financialsRightTogHeader.innerHTML = "Financial Capacity Performance Metrics";
  rightSideToggle.appendChild(financialsRightTogHeader);
  var hr2 = document.createElement("hr");
  rightSideToggle.appendChild(hr2);

  var but4 = document.createElement("div");
  but4.className = "col-md-3 tog-button";
  but4.setAttribute('id', 'but4');
  but4.innerHTML = 'Current Ratio'
  rightSideToggle.appendChild(but4);
  but4.onclick = function(){
    if (!(this.style.background == '#00C0AC')){
      make_chart(map[4][0], map[4][1], map[4][2])
      document.getElementById('but'+current_cap_metric).className = 'col-md-3 tog-button'
      this.className += ' tog-button-selected'
      current_cap_metric = 4      
      document.getElementsByClassName('definition2')[0].innerHTML=defs[4] 
    }
  }
  var but5 = document.createElement("div");
  but5.className = "col-md-3 tog-button tog-button-selected";
  but5.setAttribute('id', 'but5');
  but5.innerHTML = 'Net Assets'
  rightSideToggle.appendChild(but5);
  but5.onclick = function(){
    if (!(this.style.background == '#00C0AC')){
      make_chart(map[5][0], map[5][1], map[5][2])
      document.getElementById('but'+current_cap_metric).className = 'col-md-3 tog-button'
      this.className += ' tog-button-selected'
      current_cap_metric = 5   
      document.getElementsByClassName('definition2')[0].innerHTML=defs[5]   
    }
  }
  var but6 = document.createElement("div");
  but6.className = "col-md-3 tog-button";
  but6.setAttribute('id', 'but6');
  but6.innerHTML = 'Operating Margin'
  rightSideToggle.appendChild(but6);
  but6.onclick = function(){
    if (!(this.style.background == '#00C0AC')){
      make_chart(map[6][0], map[6][1], map[6][2])
      document.getElementById('but'+current_cap_metric).className = 'col-md-3 tog-button'
      this.className += ' tog-button-selected'
      current_cap_metric = 6 
      document.getElementsByClassName('definition2')[0].innerHTML=defs[6]     
    }
  }
  var but7 = document.createElement("div");
  but7.className = "col-md-3 tog-button";
  but7.setAttribute('id', 'but7');
  but7.innerHTML = 'Operating Reserve'
  rightSideToggle.appendChild(but7);
  but7.onclick = function(){
    if (!(this.style.background == '#00C0AC')){
      make_chart(map[7][0], map[7][1], map[7][2])
      document.getElementById('but'+current_cap_metric).className = 'col-md-3 tog-button'
      this.className += ' tog-button-selected'
      current_cap_metric = 7 
      document.getElementsByClassName('definition2')[0].innerHTML=defs[7]     
    }
  }
  var but8 = document.createElement("div");
  but8.className = "col-md-3 tog-button";
  but8.setAttribute('id', 'but8');
  but8.innerHTML = 'Quick Ratio'
  rightSideToggle.appendChild(but8);
  but8.onclick = function(){
    if (!(this.style.background == '#00C0AC')){
      make_chart(map[8][0], map[8][1], map[8][2])
      document.getElementById('but'+current_cap_metric).className = 'col-md-3 tog-button'
      this.className += ' tog-button-selected'
      current_cap_metric = 8   
      document.getElementsByClassName('definition2')[0].innerHTML=defs[8]   
    }
  }
  var but9 = document.createElement("div");
  but9.className = "col-md-3 tog-button";
  but9.setAttribute('id', 'but9');
  but9.innerHTML = 'Visibility Ratio'
  rightSideToggle.appendChild(but9);
  but9.onclick = function(){
    if (!(this.style.background == '#00C0AC')){
      make_chart(map[9][0], map[9][1], map[9][2])
      document.getElementById('but'+current_cap_metric).className = 'col-md-3 tog-button'
      this.className += ' tog-button-selected'
      current_cap_metric = 9  
      document.getElementsByClassName('definition2')[0].innerHTML=defs[9]    
    }
  }
  var definition2 = document.createElement("p");
  definition2.className = "definition2"
  definition2.innerHTML = defs[5]
  rightSideToggle.appendChild(definition2)

  var stmtRow = document.createElement("div");
  stmtRow.className = "row fin_stmt";
  contentView.appendChild(stmtRow);

  make_chart('#efficiency-chart', char_commit_data, "Charitable Commitment (%)");
  make_chart('#capacity-chart', net_assets_data, "Net Assets ($millions)");
  
}

  

function make_chart(location, data, label){
  in_loc = location.substring(1)
  console.log(document.getElementById(in_loc))
  document.getElementById(in_loc).innerHTML = "";
  var margin = {top: 40, right: 20, bottom: 30, left: 40},
      width = 300 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  var formatPercent = d3.format(".0%");

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])

  if(label != "Net Assets ($millions)"){
      yAxis.tickFormat(formatPercent);
      tip.html(function(d) {
      return "<strong><span style='color:red'>" + (d.value*100).toFixed(2) + "%</span></strong>";
    })
  }else{
    tip.html(function(d) {
      return "<strong><span style='color:red'>$" + (d.value).toFixed(2) + "</span></strong>";
    })
  }
    

  var svg = d3.select(location).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + (margin.left + 20) + "," + margin.top + ")");

  svg.call(tip);

    x.domain(data.map(function(d) { return d.year; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        //.attr("transform", "rotate(-90)")
        .attr("y", -20)
        .attr("dy", ".71em")
        .style("text-anchor", "left")
        .text(label)
        .style('font-size', '16px');

    classname = "bar"
    if (location == '#capacity-chart'){
      classname = "bar-cap"
    }
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", classname)
        .attr("x", function(d) { return x(d.year); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
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
