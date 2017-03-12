var current_pie = 0

var w = 550;
var h = 550;
var r = h/2;
var color = d3.scale.category20c();

var family_data = [{"label":"Dave Thomas Foundation", "value":60},
              {"label":"Friends of Earth", "value":20}, 
		          {"label":"Rainforest Alliance", "value":60},
              {"label":"Homes For Our Troops", "value":40}] 
var dad_data =[{"label":"Dave Thomas Foundation", "value":60},
              {"label":"Friends of Earth", "value":20},
              {"label":"Rainforest Alliance", "value":0},
              {"label":"Homes For Our Troops", "value":0}];
var mom_data = [{"label":"Dave Thomas Foundation", "value":0},
              {"label":"Friends of Earth", "value":0}, 
              {"label":"Rainforest Alliance", "value":60},
              {"label":"Homes For Our Troops", "value":0}]

var sib_data = [{"label":"Dave Thomas Foundation", "value":0},
              {"label":"Friends of Earth", "value":0}, 
              {"label":"Rainforest Alliance", "value":0},
              {"label":"Homes For Our Troops", "value":40}]

var user_data = [{"label":"Dave Thomas Foundation", "value":0},
              {"label":"Friends of Earth", "value":0}, 
              {"label":"Rainforest Alliance", "value":0},
              {"label":"Homes For Our Troops", "value":0}]


var vis = d3.select('#pie').append("svg:svg").data([family_data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")").attr("class",'slices');
var pie = d3.layout.pie().sort(null).value(function(d){return d.value;});

// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);
//var labelArc = d3.svg.arc().outerRadius(r - 40).innerRadius(r-40);
var arcOver = d3.svg.arc()
        .outerRadius(r + 9);

// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");

var div = d3.select("#pie").append("div").attr("class", "toolTip");

arcs.append("svg:path")

vis.append("g")
  .attr("class", "lines");

var outerArc = d3.svg.arc()
  .innerRadius(r * 0.9)
  .outerRadius(r * 0.9);

make_data();
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
      data[j].push({'label': name, 'value':amount})
    }
  }
  for (var j=0; j<data.length; j++){
      amount =  0
      if(j == 3|| j==0){
        amount = (100 - obj['percentAllocated'])*60/100.0
      }
      data[j].push({'label': 'Unallocated', 'value':amount})
    }
  console.log(data)
}

function update_pie(char_name, amount){
  data = [family_data, user_data]
  for (var i=0; i<data.length; i++){
    for (var j = 0; j<data[i].length; j++){
      if (data[i][j].label == char_name){
        data[i][j].value = amount;
      }else if (data[i][j].label == 'Unallocated'){
        data[i][j].value = 100-getSessionObject()['percentAllocated']
      }
    }
  }
  change_pie(current_pie)
}

function change_pie(idx) {
  current_pie = idx
  data = [family_data, dad_data, mom_data, user_data, sib_data]
  data = data[idx]

  /* ------- PIE SLICES -------*/
  var slice = vis.selectAll("g.slice").selectAll("path.slice")
        .data(pie(data), function(d){ return d.data.label });
    slice.enter()
        .insert("path")
        .style("fill", function(d) { return color(d.data.label); })
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
        });

   /* var label_group = arcs.append("g")
  .attr("transform", function(d) {
    var c = labelArc.centroid(d);
    return "translate(" + c[0] +"," + c[1] + ")";
  })

    label_group.data(pie)
   .transition().duration(750)
    .attr("transform", function(d) {
      var c = labelArc.centroid(d);
      return "translate(" + c[0] +"," + c[1] + ")";
    })

    var line_1 = label_group.append("text") // First line
  .text(function(d) { return d.data.label; })
  .attr("text-anchor", "middle")

    line_1.data(pie)
    .text(function(d) { return d.data.label; })*/
    
  //slice.update().insert("text") .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
  //;

    slice
        .on("mouseenter", function(d) {
            d3.select(this)
               .attr("stroke","white")
               .transition()
               .duration(1000)
               .attr("d", arcOver)             
               .attr("stroke-width",6);
        })
    slice.on("mousemove", function(d){
            div.style("left", d3.event.pageX+10+"px");
            div.style("top", d3.event.pageY-25+"px");
            div.style("display", "inline-block");
            div.html((d.data.label)+"<br>$"+(d.data.value));
        });
    slice
        .on("mouseleave", function(d) {
            d3.select(this).transition()            
               .attr("d", arc)
               .attr("stroke","none");
        });
    slice.on("mouseout", function(d){
            div.style("display", "none");
        });

    slice.exit()
        .remove();

    /* ------- TEXT LABELS -------*/
    var text = vis.select(".labelName").selectAll("text")
        .data(pie(data), function(d){ return d.data.label });

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function(d) {
            return (d.data.label+": "+d.value+"%");
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
                pos[0] = r * (midAngle(d2) < Math.PI ? 1 : -1);
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
            return (d.data.label+": "+d.value+"%");
        });


    text.exit()
        .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/
/*
    var polyline = vis.select(".lines").selectAll("polyline")
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
                pos[0] = r * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
        .remove();*/
};