var my_charities = {'Bill and Melinda Gates Foundation':0, 'Marie Curie':0, 'SOS Children\'s Villages':0, 'United Way':0};

var total_alloc = 0

var obj = getSessionObject();
obj['allocationAmounts'] = {'Bill and Melinda Gates Foundation':0, 'Marie Curie':0, 'SOS Children\'s Villages':0, 'United Way':0};
var my_charities = obj["allocationAmounts"];

$("#char-search").on('change keydown paste input', function(){
    search=document.getElementById('char-search').value.toLowerCase()
    if (search == ''){
        chars=document.getElementsByClassName('char_band');
        for (var c =0; c<chars.length; c++){
            chars[c].style.display = 'block'
        }
    }else{
        chars=document.getElementsByClassName('char_band');
        for (var c =0; c<chars.length; c++){
            if (chars[c].childNodes[0].innerHTML.toLowerCase().match(search)==null){
                chars[c].style.display = 'none'
            }else{
                chars[c].style.display = 'block'
            }
        }        
    }


})

function makeCharList(my_charities) {
    // Create the list element:
    charities = Object.keys(my_charities).sort()

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

        var slider = document.createElement('div')
        slider.className="sliders sm-col-2 sm-col-offset-2"
        slider.setAttribute('id', 'slider_'+i)
        char_band.appendChild(slider);

       $('#slider_'+i).slider({
            step: 1,
            min: 0,
            max: 100,
            value: 0,
            slide: function( event, ui ) {
                var amount = ui.value;
                char_name = this.parentNode.childNodes[0].innerHTML
                //total_alloc = 100 - total_alloc - my_charities[char_name]
                my_charities[char_name] = amount
                money = 100 - Object.values(my_charities).reduce(function(a,b){return a+b;},0)
                if (money < 0){
                    my_charities[char_name] += money;
                    obj['allocationAmounts'] = my_charities;
                    setSessionObject(obj);
                    this.parentNode.childNodes[2].innerHTML = my_charities[char_name]+'%';
                    $('#'+this.getAttribute('id')).slider('value', my_charities[char_name]);
                    total_alloc = 100;
                    prog_bar = document.getElementsByClassName('progress-bar')[0]
                    prog_bar.setAttribute('aria-valuenow', total_alloc)
                    prog_bar.setAttribute('style', "width:"+total_alloc+"%")
                    prog_bar.innerHTML = total_alloc+'%'
                    return false;
                }else{
                    my_charities[char_name] = amount
                    obj['allocationAmounts'] = my_charities;
                    setSessionObject(obj);
                    total_alloc = Object.values(my_charities).reduce(function(a,b){return a+b;},0);
                    this.parentNode.childNodes[2].innerHTML = amount+'%';
                    prog_bar = document.getElementsByClassName('progress-bar')[0]
                    prog_bar.setAttribute('aria-valuenow', total_alloc)
                    prog_bar.setAttribute('style', "width:"+total_alloc+"%")
                    prog_bar.innerHTML = total_alloc+'%'
                }
                update_pie(char_name, my_charities[char_name])
                $("#"+this.getAttribute('id') +" .ui-slider-range").css( "background-color", '#C43E00' );

                $( "#"+this.getAttribute('id') +" .ui-state-default, .ui-widget-content .ui-state-default" ).css( "background-color", '#C43E00' );
            }
        });
        /*
        var slider_input = document.createElement('input');

        slider_input.setAttribute('class', 'col-sm-10 col-sm-offset-1 sliders slider_'+i)
        slider_input.setAttribute('type', 'text')
        slider_input.setAttribute('data-slider-id', 'alloc_slider_'+i);
        slider_input.setAttribute('data-slider-min', 0)
        slider_input.setAttribute('data-slider-max', max_alloc)
        slider_input.setAttribute('data-slider-step', 1)
        slider_input.setAttribute('data-slider-value', my_charities[charities[i]])
        slider_input.setAttribute('data-slider-tooltip', 'hide')

        char_band.appendChild(slider_input);*/
        /*
        $('.slider_'+i).slider({
            $('.slider_'+i).on('slide', function(obj){
                console.log(this)
                console.log(obj.value.newValue)
                char_name = this.parentNode.parentNode.childNodes[0].innerHTML
                //total_alloc = 100 - total_alloc - my_charities[char_name]
                my_charities[char_name] = Math.round(parseInt($('#'+this.getAttribute('data-slider-id')).sliderValue())*100/max_alloc)
                money = 100 - Object.values(my_charities).reduce(function(a,b){return a+b;},0)
                if (money < 0){
                    my_charities[char_name] += money;
                    this.parentNode.parentNode.childNodes[2].innerHTML = my_charities[char_name]+'%';
                    $('#'+this.getAttribute('data-slider-id')).slider('setValue', my_charities[char_name]);
                    console.log($('#'+this.getAttribute('data-slider-id')).attr('data-slider-value'))
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
            }
        })*/
            //console.log($('#'+this.getAttribute('data-slider-id')).sliderValue())
        /*
        $('.slider_'+i).slider().on('slide', function(ev){
            console.log($('#'+this.getAttribute('data-slider-id')).sliderValue())
            char_name = this.parentNode.parentNode.childNodes[0].innerHTML
            //total_alloc = 100 - total_alloc - my_charities[char_name]
            my_charities[char_name] = Math.round(parseInt($('#'+this.getAttribute('data-slider-id')).sliderValue())*100/max_alloc)
            money = 100 - Object.values(my_charities).reduce(function(a,b){return a+b;},0)
            if (money < 0){
                my_charities[char_name] += money;
                this.parentNode.parentNode.childNodes[2].innerHTML = my_charities[char_name]+'%';
                $('#'+this.getAttribute('data-slider-id')).slider('setValue', my_charities[char_name]);
                console.log($('#'+this.getAttribute('data-slider-id')).attr('data-slider-value'))
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
            document.getElementById('#pie')
        });*/


        var char_content_value = document.createElement('span');
        char_content_value.className ='alloc_val'
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
            update_pie(parentNode.childNodes[0].childNodes[0].nodeValue, 0);
            delete my_charities[this.parentNode.childNodes[0].childNodes[0].nodeValue]
            obj['allocationAmounts'] = my_charities;
            setSessionObject(obj);
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

function makePieChart(my_charities) {

}

makeCharList(my_charities);
