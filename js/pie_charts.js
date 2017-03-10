var max_allocs = 60

var my_charities = {'Bill and Melinda Gates Foundation':0, 'Marie Curie':0, 'SOS Children\'s Villages':0, 'United Way':0};

var family_info = {'me':{'funds': max_allocs, 'charities':{}}, 'dad': {'funds': 80, 'charities': {'Friends of Earth': 20, 'David Thomas Foundation': 60}}, 'mom': {'funds': 60, 'charities':{'Rainforest Alliance': 60}}, 'sibling': {'funds': 80, 'charities':{'Homes For Our Troops': 40}}}

var family_data =  [{
    "nodeData": {
        "cause": 240,
        "amount": 240
    }, "subData": [{
        "nodeData": {
            "cause": "HUMAN SERVICES",
            "amount": 100
        },
        "subData": [{
            "nodeData": {
                "cause": "David Thomas Foundation",
                "amount": 60
            } 
        }, {
            "nodeData": {
                "cause": "Homes For Our Troops",
                "amount": 40
             }
        }]    
    }, {
        "nodeData": {
            "cause": "ENVIRONMENT",
            "amount": 80
        },
        "subData": [{
            "nodeData": {
                "cause": "Friends of Earth",
                "amount": 20
            },
        }, {
           "nodeData": {
                "cause": "Rainforest Alliance",
                "amount": 60
            }
        }]
    },  {
        "nodeData": {
            "cause": "Unallocated",
            "amount": 60
        },
        "subData": [{
            "nodeData": {
                "cause": "",
                "amount": max_allocs
            }
        }]
    }]

}]

var dad_data =  [{
    "nodeData": {
        "cause": 80,
        "amount": 80
    }, "subData": [{
        "nodeData": {
            "cause": "HUMAN SERVICES",
            "amount": 60
        },
        "subData": [{
            "nodeData": {
                "cause": "David Thomas Foundation",
                "amount": 60
            } 
        }]    
    }, {
        "nodeData": {
            "cause": "ENVIRONMENT",
            "amount": 20
        },
        "subData": [{
            "nodeData": {
                "cause": "Friends of Earth",
                "amount": 20
            }
        }]
    }]
}]

var mom_data =  [{
    "nodeData": {
        "cause": 60,
        "amount": 60
    }, "subData": [{
        "nodeData": {
            "cause": "ENVIRONMENT",
            "amount": 60
        },
        "subData": [{
           "nodeData": {
                "cause": "Rainforest Alliance",
                "amount": 60
            }
        }]
    }]
}]

var user_data =  [{
    "nodeData": {
        "cause": 'My Donation\n$'+60,
        "amount": 60
    }, "subData": [{
        "nodeData": {
            "cause": "UNALLOCATED",
            "amount": 60
        }    
    },{
        "nodeData": {
            "cause": "HUMAN SERVICES",
            "amount": 0
        },
        "subData": [{
            "nodeData": {
                "cause": "SOS Children's Villages",
                "amount": 0
            } 
        }, {
            "nodeData": {
                "cause": "United Way",
                "amount": 0
            } 
        }]    
    }, {
        "nodeData": {
            "cause": "HEALTH",
            "amount": 0
        },
        "subData": [{
            "nodeData": {
                "cause": "Bill and Melinda Gates Foundation",
                "amount": 0
            }
        },{
            "nodeData": {
                "cause": "Maire Cuire",
                "amount": 0
            } 
        }]
    }]
}]

var sibling_data =  [{
    "nodeData": {
        "cause": 40,
        "amount": 40
    }, "subData": [{
        "nodeData": {
            "cause": "HUMAN SERVICES",
            "amount": 40
        },
        "subData": [{
            "nodeData": {
                "cause": "Homes For Our Troops",
                "amount": 40
             }
        }]    
    }]

}]

var width = 600,
    height = width,
    maxRadius = Math.min(width, height) / 2;

var setMultiLevelData = function(data) {
    if (data == null)
        return;
    var level = data.length,
        counter = 0,
        index = 0,
        currentLevelData = [],
        queue = [];
        keys = Object.keys(data)
    for (var i = 0; i < keys.length; i++) {
        queue.push(data[i]);
    };
    while (!queue.length == 0) {
        var node = queue.shift();
        currentLevelData.push(node);
        level--;
        if (node.subData) {
            for (var i = 0; i < node.subData.length; i++) {
                queue.push(node.subData[i]);
                counter++;
            };
        }
        if (level == 0) {
            level = counter;
            counter = 0;            
            multiLevelData.push(currentLevelData);
            currentLevelData = [];
        }
    }
}

var drawPieChart = function(_data, index) {
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.nodeData.amount;
        });
    var arc = d3.svg.arc()
        .outerRadius((index + 1) * pieWidth - 1)
        .innerRadius(index * pieWidth);

    var g = svg.selectAll(".arc" + index).data(pie(_data)).enter().append("g")
        .attr("class", "arc" + index);

    g.append("path").attr("d", arc)
        .style("fill", function(d) {
            return color(d.data.nodeData.cause);
        });

    g.append("text").attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("dy", ".35em").style("text-anchor", "middle")
        .text(function(d) {
            if (d.data.nodeData.amount > 0){
                return d.data.nodeData.cause;
            }else{
                return ""
            }
        });
}
/*
var svg = d3.select("#pie").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var multiLevelData = [];
setMultiLevelData(family_data);

var pieWidth = parseInt(maxRadius / multiLevelData.length) - multiLevelData.length;

var color = d3.scale.category20();

for (var i = 0; i < multiLevelData.length; i++) {
    var _cData = multiLevelData[i];
    drawPieChart(_cData, i);
}
*/
data = [family_data, dad_data, mom_data, user_data, sibling_data]
for (var d = 0; d < data.length; d++){
    var svg = d3.select("#pie").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "pie"+d)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var multiLevelData = [];
    setMultiLevelData(data[d]);

    var pieWidth = parseInt(maxRadius / multiLevelData.length) - multiLevelData.length;

    var color = d3.scale.category20();

    for (var i = 0; i < multiLevelData.length; i++) {
        var _cData = multiLevelData[i];
        drawPieChart(_cData, i);
    }
}

pie = document.getElementById('pie').childNodes
for (var p=0; p<pie.length; p++){
    if (p > 0){
        pie[p].setAttribute('display', 'none')
    }
}

function change_pie(i) {
    
    pie = document.getElementById('pie').childNodes
    for (var p=0; p<pie.length; p++){
        pie[p].setAttribute('display', 'none')
    }

    pie[i].setAttribute('display', 'inline')

}
