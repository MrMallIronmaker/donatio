var my_charities = {'Bill and Melinda Gates Foundation':0, 'Marie Curie':0, 'SOS Children\'s Villages':0, 'United Way':0};

var family_charities = {'Barak': {'Friends of Earth': 60, 'David Thomas Foundation': 20}, 'Michelle': {'Rainforest Alliance': 60}, 'Sasha': {'Homes For Our Troops': 40}}

var max_alloc = 60
var total_alloc = 0


function makeCharList(my_charities) {
    // Create the list element:
    charities = Object.keys(my_charities)

    list_header = document.createTextNode('My Charities (' + charities.length + ')')
    document.getElementById('My_Charities').appendChild(list_header)

    var list = document.createElement('div');
    document.getElementById('charity_list').appendChild(list);

    for(var i = 0; i < charities.length; i++) {
        // Create the list item:
        var char_band = document.createElement('div');
        char_band.className = "char_band";
        list.appendChild(char_band);
        var char_content_name = document.createElement('span');
        char_content_name.className ='char_name';
        var char_name = document.createTextNode(charities[i]);
        char_content_name.appendChild(char_name);
        char_band.appendChild(char_content_name);

        var slider_input = document.createElement('input');

        slider_input.setAttribute('class', 'col-lg-12 col-lg-offset-12 col-md-offset-12 col-sm-offset-12 sliders slider_'+i)
        slider_input.setAttribute('type', 'text')
        slider_input.setAttribute('data-slider-id', 'alloc_slider_'+i);
        slider_input.setAttribute('data-slider-min', 0)
        slider_input.setAttribute('data-slider-max', max_alloc)
        slider_input.setAttribute('data-slider-step', 1)
        slider_input.setAttribute('data-slider-value', my_charities[charities[i]])
        slider_input.setAttribute('data-slider-tooltip', 'hide')
        
        char_band.appendChild(slider_input);
        $('.slider_'+i).slider().on('slide', function(ev){
            //console.log($('#'+this.getAttribute('data-slider-id')).sliderValue())
            char_name = this.parentNode.parentNode.childNodes[0].innerHTML
            //total_alloc = 100 - total_alloc - my_charities[char_name]
            my_charities[char_name] = Math.round(parseInt($('#'+this.getAttribute('data-slider-id')).sliderValue())*100/max_alloc)
            money = 100 - Object.values(my_charities).reduce(function(a,b){return a+b;},0)
            if (money < 0){
                my_charities[char_name] += money;
                this.parentNode.parentNode.childNodes[2].innerHTML = my_charities[char_name]+'%';
                total_alloc = 100;
                prog_bar = document.getElementsByClassName('progress-bar')[0]
                prog_bar.setAttribute('aria-valuenow', total_alloc)
                prog_bar.setAttribute('style', "width:"+total_alloc+"%")
                prog_bar.innerHTML = total_alloc+'%'
                return false;
            }else{
                my_charities[char_name] = Math.round(parseInt($('#'+this.getAttribute('data-slider-id')).sliderValue())*100/max_alloc);
                total_alloc = Object.values(my_charities).reduce(function(a,b){return a+b;},0);
                this.parentNode.parentNode.childNodes[2].innerHTML = Math.round(parseInt($('#'+this.getAttribute('data-slider-id')).sliderValue())*100/max_alloc)+'%';
                prog_bar = document.getElementsByClassName('progress-bar')[0]
                prog_bar.setAttribute('aria-valuenow', total_alloc)
                prog_bar.setAttribute('style', "width:"+total_alloc+"%")
                prog_bar.innerHTML = total_alloc+'%'
            }
        });


        var char_content_value = document.createElement('span');
        var char_value = document.createTextNode(my_charities[charities[i]]+'%');
        char_content_value.appendChild(char_value);
        char_band.appendChild(char_content_value);

        //creates trash can remove buttons
        var button = document.createElement("button");
        button.setAttribute('class', 'trash');
        var trash = document.createElement("span");
        trash.setAttribute('class', 'glyphicon glyphicon-trash');
        button.appendChild(trash)
        button.onclick = function(){ 
            delete my_charities[this.parentNode.childNodes[0].childNodes[0].nodeValue]
            this.parentNode.parentNode.removeChild(this.parentNode);
            document.getElementById("My_Charities").childNodes[0].nodeValue = 'My Charities (' + Object.keys(my_charities).length + ')'
            total_alloc = Object.values(my_charities).reduce(function(a,b){return a+b;},0);
                
            prog_bar = document.getElementsByClassName('progress-bar')[0]
            prog_bar.setAttribute('aria-valuenow', total_alloc)
            prog_bar.setAttribute('style', "width:"+total_alloc+"%")
            prog_bar.innerHTML = total_alloc+'%'
        }
        char_band.appendChild(button);
        

        // Add it to the list:
        //list.appendChild(char_band);
    }
    

    // Finally, return the constructed list:
    return list;
}


makeCharList(my_charities)
// Add the contents of options[0] to #foo:
//document.getElementById('charity_list').appendChild(makeCharList(my_charities));