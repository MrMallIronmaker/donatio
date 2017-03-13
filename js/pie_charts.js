var width = 450
    height = 450,
    radius = Math.min(width, height) / 2;

var svg = d3.select("#pie")
    .append("svg").attr("width", width).attr("height", height)
    .append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var svg2 = d3.select("#legend")
    .append("svg")
    .attr("width", 600)
    .attr("height", 600);
        


svg.append("g")
    .attr("class", "slices");
svg.append("g")
    .attr("class", "labelName");
svg.append("g")
    .attr("class", "labelValue");
svg.append("g")
    .attr("class", "lines");



var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) {
        return d.value;
    });

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(100)

var outerArc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(radius-40);

var legendRectSize = (radius * 0.05);
var legendSpacing = radius * 0.02;


var div = d3.select("body").append("div").attr("class", "toolTip");

var colorRange = d3.scale.category20();
var color = d3.scale.ordinal()
    .range(colorRange.range());


var family_data = [{"label":"Dave Thomas Foundation", "value":60, "person": ["Dad"]},
              {"label":"Friends of Earth", "value":20, "person": ["Dad"]}, 
                  {"label":"Rainforest Alliance", "value":60, "person": ["Mom"]},
              {"label":"Homes For Our Troops", "value":40, "person": ["Sasha"]}] 
var dad_data =[{"label":"Dave Thomas Foundation", "value":60, "person": ["Dad"]},
              {"label":"Friends of Earth", "value":20, "person": ["Dad"]},
              {"label":"Rainforest Alliance", "value":0, "person": ["Mom"]},
              {"label":"Homes For Our Troops", "value":0, "person": ["Sasha"]}];
var mom_data = [{"label":"Dave Thomas Foundation", "value":0, "person": ["Dad"]},
              {"label":"Friends of Earth", "value":0, "person": ["Dad"]}, 
              {"label":"Rainforest Alliance", "value":60, "person": ["Mom"]},
              {"label":"Homes For Our Troops", "value":0, "person": ["Sasha"]}]

var sib_data = [{"label":"Dave Thomas Foundation", "value":0, "person": ["Dad"]},
              {"label":"Friends of Earth", "value":0, "person": ["Dad"]}, 
              {"label":"Rainforest Alliance", "value":0, "person": ["Mom"]},
              {"label":"Homes For Our Troops", "value":40, "person": ["Sasha"]}]

var user_data = [{"label":"Dave Thomas Foundation", "value":0, "person": ["Dad"]},
              {"label":"Friends of Earth", "value":0, "person": ["Dad"]}, 
              {"label":"Rainforest Alliance", "value":0, "person": ["Mom"]},
              {"label":"Homes For Our Troops", "value":0, "person": ["Sasha"]}]

var current_pie = 3

make_data();
var texts = svg.selectAll("text").data(user_data)
                .attr("text-anchor", "middle")
                .attr("id", "title")
                .enter();

    texts.append("text")
         .attr("id", "title_donor")
         .attr('x', -39)
         .attr('y', legendRectSize - legendSpacing-10)
         .text("My Donation:")
         // set position etc.

    texts.append("text")
         .attr("id", "title_amount")
         .attr('x', -32)
        .attr('y', legendRectSize - legendSpacing+10)
         .text("$" + 0 +"/$"+60);
change_pie(current_pie);

function make_data(){
  data = [family_data, dad_data, mom_data, user_data, sib_data]
  var obj = getSessionObject()
  var user_charities = obj['allocationAmounts']
  char_names = Object.keys(user_charities);
  for (var i=0; i<char_names.length; i++){
    name = char_names[i]
    for (var j=0; j<data.length; j++){
      amount =  0
      if(j == 3 || j==0){
        amount = user_charities[name]*60/100.0
      }
      if (data[j]['label']==name){
          data[j]['value'] += amount
          data[j]['person'].push("Me")
      }else{
          data[j].push({'label': name, 'value':amount, "person": ["I"]})
      }
    }
  }
  for (var j=0; j<data.length; j++){
      amount =  0
      if(j == 3|| j==0){
        amount = (100 - obj['percentAllocated'])*60/100.0
      }
      data[j].push({'label': 'Unallocated', 'value':amount, "person": ["I"]})
    }
}

function update_pie(char_name, amount){
  data = [family_data, user_data]
  for (var i=0; i<data.length; i++){
    for (var j = 0; j<data[i].length; j++){
      if (data[i][j].label == char_name){
        data[i][j].value = amount*60/100;
      }else if (data[i][j].label == 'Unallocated'){
        obj = getSessionObject()
        data[i][j].value = (100-obj['percentAllocated'])*60/100
      }
    }
  }
  if(current_pie == 0 || current_pie == 3){
      change_pie(current_pie)
  }
  
}

function change_pie(idx) {
  users = ["The Family", "Dad\'s", "Mom\'s", 'My', "Sister\'s"]
  document.getElementById("pie_title").innerHTML = users[idx] + " Allocation" 
/*
  document.getElementById('icon'+current_pie).setAttribute("height", '75px');
  document.getElementById('icon'+current_pie).setAttribute("width", "auto")
  document.getElementById('icon'+current_pie).style.marginTop ="-10px"
  document.getElementById('icon'+current_pie).style.marginLeft ="-10px"
  document.getElementById('icon'+idx).setAttribute("height", '90px');
  document.getElementById('icon'+idx).setAttribute("width", "auto")
  document.getElementById('icon'+idx).style.marginTop ="-10px"
  document.getElementById('icon'+idx).style.marginLeft ="-10px"*/

  current_pie = idx
  data = [family_data, dad_data, mom_data, user_data, sib_data]
  data = data[idx]

    /* ------- PIE SLICES -------*/
    var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(data), function(d){ return d.data.label });

    slice.enter()
        .insert("path")
        .style("fill", function(d) { 
          if (d.data.label == "Unallocated"){
            return "grey";
          }else{
            return color(d.data.label); 
          }
        })
        .attr("class", "slice");

    slice
        .transition().duration(1000)
        .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                return arc(interpolate(t));
            };
        })
    slice
        .on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            //div.html((d.data.label)+"<br>$"+(d.data.value));
            if (d.data.label=="Unallocated"){
              div.html((d.data.person).join()+" have $"+(d.data.value).toFixed(2)+"<br>of unallocated funds");
            }else{
              div.html((d.data.person).join()+" donated $"+(d.data.value).toFixed(2)+"<br>to "+(d.data.label));
            }
        });
    slice
        .on("mouseout", function(d){
            div.style("display", "none");
        });

    slice.exit()
        .remove();
    
    d_color = color.domain()

    var legend = svg2.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            var horz = -3 * legendRectSize+50;
            var vert = i * height - offset +100;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing+3)
        .text(function(d) { return d; });

    var names = ["The Family", "Dad\'s", "Mom\'s", 'My', "Sister\'s"]
    var donation = [240, 80, 60, 60, 40]
    my_donation = (getSessionObject()['percentAllocated']/100*60.0).toFixed(2);
    var current_donation = [240, 80, 60, my_donation, 40]
    /*var t = svg.append("text")
   .attr("text-anchor", "middle")
   .attr("id", "title")
   .text(names[current_pie]+" Donation:\n"+"$" + current_donation[current_pie]+"/$"+donation[current_pie])*/

   svg.selectAll("#title_donor").remove();
   svg.selectAll("#title_amount").remove();
   var texts = svg.selectAll("text").data(data)
                .attr("text-anchor", "middle")
                .attr("id", "title")
                .enter();

    texts.append("text")
         .attr("id", "title_donor")
         .attr('x', -39)
         .attr('y', legendRectSize - legendSpacing-10)
         .text(names[current_pie]+" Donation:")
         // set position etc.

    texts.append("text")
         .attr("id", "title_amount")
         .attr('x', -32)
        .attr('y', legendRectSize - legendSpacing+10)
         .text("$" + current_donation[current_pie]+"/$"+donation[current_pie]);


   /*
    console.log(d3.select('#pie svg #title').node().innerHTML)
    d3.select('#pie svg #title').node().innerHTML = names[current_pie]+" Donation:\n"+"$" + current_donation[current_pie]+"/$"+donation[current_pie];*/

    

    /* ------- TEXT LABELS -------*/
    /*
    var text = svg.select(".labelName").selectAll("text")
        .data(pie(data), function(d){ return d.data.label });

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            if(d.data.value > 0){
                return (d.data.label+":\n $"+d.value);
            }else{
                return "";
            }
        });

    function midAngle(d){
        return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text
        .transition().duration(1000)
        .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = (radius-220) * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
            };
        })
        .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
            };
        })
        .text(function(d) {
            if(d.data.value > 0 && Math.abs(d.endAngle - d.startAngle) > .6){
              lab = d.data.label
              if (lab.length > 25){
                lab = lab.substr(0,23)+"... "
              }
              return (lab+":\n $"+d.value);
            }else{
                return ""
            }
        });

    text
        .on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            //div.html((d.data.label)+"<br>$"+(d.data.value));
            div.html((d.data.person).join()+" donated $"+(d.data.value)+"<br>to "+(d.data.label));
        });
    text
        .on("mouseout", function(d){
            div.style("display", "none");
        });


    text.exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/
/*
    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(data), function(d){ return d.data.label });

    polyline.enter()
        .append("polyline");

    polyline.transition().duration(1000)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();*/
};