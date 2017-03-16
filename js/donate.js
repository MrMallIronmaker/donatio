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

$('img').click(function(){
   $('.selected').removeClass('selected'); // removes the previous selected class
   $(this).addClass('selected'); // adds the class to the clicked image
});

function sent(){
    var modal = document.getElementById("submitModal");

    var header = document.getElementById('sum')
    header.style.display = "none";

    var modal_msg = document.getElementById('donation_summary')
    modal_msg.style.display = "none";

    var sent_but = document.getElementById('but1')
    sent_but.style.display = "none";

    var edit_but = document.getElementById('but2')
    edit_but.style.display = "none";

    var msg = document.getElementById("sent-msg");
    msg.style.display = "block";

    var modalCloseButton = document.getElementById("subCloseButton");
    modalCloseButton.onclick = function(){
    modal.style.display = "none";
    var obj = getSessionObject()
    obj['allocationAmounts'] = {}
    obj['percentAllocated'] = 0
    setSessionObject(obj)
  };

    window.onclick = function(event){
    if (event.target == modal){
      modal.style.display = "none";
      obj = getSessionObject()
      obj['allocationAmounts'] = {}
      obj['percentAllocated'] = 0
      setSessionObject(obj)
      window.location.href = "./index.html";
    }
  }
}

function edit(){
    var modal = document.getElementById("submitModal");
    modal.style.display = "none";
}

function submit(){
    var obj = getSessionObject()
    if(obj['percentAllocated']==0){
        document.getElementById('no_donation').style.display='block';

    } else{
        var donation = obj['allocationAmounts']
        var charities = Object.keys(donation).sort()
        var modal_msg = document.getElementById('donation_summary')
        modal_msg.innerHTML = ""
        var sub_list = document.createElement('ul')
        sub_list.style.listStyleType= 'none'
        sub_list.style.paddingLeft = '0px';
        var total = document.createElement('li')
        total.innerHTML = "TOTAL DONATION: $" + (obj['totalFunds']*obj['percentAllocated'])/100.0.toFixed(2)
        sub_list.appendChild(total)
        for (var i=0; i<charities.length; i++){
            if (donation[charities[i]] > 0){
            var ul = document.createElement('li')
            ul.innerHTML = charities[i] + ": $" + donation[charities[i]]*60/100.0.toFixed(2)
            sub_list.appendChild(ul)
            }
        }
        modal_msg.appendChild(sub_list)

        var modal = document.getElementById("submitModal");
        modal.style.display = "block";

      var modalCloseButton = document.getElementById("subCloseButton");
      modalCloseButton.onclick = function(){
        modal.style.display = "none";
      };

      // Click anywhere outside of modal causes it to close
      window.onclick = function(event){
        if (event.target == modal){
          modal.style.display = "none";
        }
      }
  }
}

function makeCharList() {
  var obj = getSessionObject();
  var savedCharities = obj["savedCharities"];
  var charityDetails = getCharityDetails();
  var idx_name_map = {}
  var new_list = {}

  for (var sc = 0; sc < savedCharities.length; sc++){
    text = charityDetails[savedCharities[sc]].name;
    idx_name_map[text] = sc;
    if (!(text in obj['allocationAmounts'])){
        obj['allocationAmounts'][text] = 0;
        new_list[text] = 0
    }else{
        new_list[text] = obj['allocationAmounts'][text]
    }
  }
    obj['allocationAmounts'] = new_list
    my_charities = obj['allocationAmounts']
    setSessionObject(obj)

    // Create the list element:
    charities = Object.keys(my_charities).sort()
    var colorRange = d3.scale.category20();
    var color = d3.scale.ordinal()
    .range(colorRange.range());
    fam_charities = ['Dave Thomas Foundation', 'Friends of Earth', 'Rainforest Alliance', 'Homes For Our Troops']
    for(var c = 0; c < fam_charities.length; c++) {
        color(fam_charities[c])
    }

    list_header = document.createTextNode('My Charities (' + charities.length + ')')
    document.getElementById('My_Charities').appendChild(list_header)

    var list = document.createElement('div');
    document.getElementById('charity_list').appendChild(list);

    var char_num_chars = document.createElement('span');
    char_num_chars.className ='num_chars'
    var no_char_msg = document.createTextNode('You Have Not Selected Any Charities Yet');
    char_num_chars.appendChild(no_char_msg);
    if (charities.length == 0){
        char_num_chars.style.display = 'block'
    }else{
        char_num_chars.style.display = 'none'
    }
    list.appendChild(char_num_chars);

    

    for(var i = 0; i < charities.length; i++) {
        // Create the list item:
        var char_band = document.createElement('div');
        char_band.className = "char_band";
        char_band.style.background = "linear-gradient(to right,"+color(charities[i])+" 2%,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA,#EAEAEA)";
        var outer_div = document.createElement('div');
        outer_div.className ='outer_div';
        list.appendChild(outer_div);
        var char_content_name = document.createElement('div');
        char_content_name.className ='char_name';
        var char_name = document.createTextNode(charities[i]);
        char_content_name.appendChild(char_name);
        char_band.appendChild(char_content_name);
        outer_div.appendChild(char_band)

        var slider = document.createElement('div')
        slider.className="sliders"
        slider.setAttribute('id', 'slider_'+i)
        char_band.appendChild(slider);
        init_obj = getSessionObject()['allocationAmounts'][charities[i]]
       $('#slider_'+i).slider({
            step: 1,
            min: 0,
            max: 100,
            value: init_obj,
            slide: function( event, ui ) {
                document.getElementById('no_donation').style.display='none';
                var amount = ui.value;
                char_name = this.parentNode.childNodes[0].innerHTML
                my_charities[char_name] = amount
                money = 100 - Object.values(my_charities).reduce(function(a,b){return a+b;},0)
                obj_slide = getSessionObject()
                char_error = document.getElementsByClassName('error_msg')[0]
                if (money < 0){
                    char_error.style.visibility = 'visible'
                    my_charities[char_name] += money;
                    obj_slide['allocationAmounts'] = my_charities;
                    obj_slide['percentAllocated'] = 100;
                    setSessionObject(obj_slide);
                    this.parentNode.childNodes[2].innerHTML = my_charities[char_name]+'%';
                    is.parentNode.childNodes[2].innerHTML = my_charities[char_name]+'%';
                    $('#slider_'+i).slider('value', my_charities[char_name]);//$('#'+this.getAttribute('id')).slider('value', my_charities[char_name]);
                    prog_bar = document.getElementsByClassName('progress-bar')[0]
                    prog_bar.setAttribute('aria-valuenow', obj_slide['percentAllocated'])
                    prog_bar.setAttribute('style', "width:"+obj_slide['percentAllocated']+"%")
                    prog_bar.innerHTML = obj_slide['percentAllocated']+'%'
                    update_pie(char_name, my_charities[char_name])
                    return false;
                }else{
                    char_error.style.visibility = 'hidden'
                    my_charities[char_name] = amount
                    obj_slide['allocationAmounts'] = my_charities;
                    obj_slide['percentAllocated'] = Object.values(my_charities).reduce(function(a,b){return a+b;},0);
                    setSessionObject(obj_slide);
                    this.parentNode.childNodes[2].innerHTML = amount+'%';
                    prog_bar = document.getElementsByClassName('progress-bar')[0]
                    prog_bar.setAttribute('aria-valuenow', obj_slide['percentAllocated'])
                    prog_bar.setAttribute('style', "width:"+obj_slide['percentAllocated']+"%")
                    prog_bar.innerHTML = obj_slide['percentAllocated']+'%'
                    update_pie(char_name, my_charities[char_name])
                }
                

                document.getElementById('funds').innerHTML = '$'+(obj_slide['percentAllocated']/100.0*obj_slide['totalFunds']).toFixed(2)+'/$'+obj_slide['totalFunds']+' allocated'
                $("#"+this.getAttribute('id') +" .ui-slider-range").css( "background-color", '#C43E00' );

                $( "#"+this.getAttribute('id') +" .ui-state-default, .ui-widget-content .ui-state-default" ).css( "background-color", '#C43E00' );
            }
        });

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
            document.getElementById('no_donation').style.display='none';
            obj_del = getSessionObject()
            obj_del['percentAllocated'] -= my_charities[this.parentNode.childNodes[0].childNodes[0].nodeValue]
            delete my_charities[this.parentNode.childNodes[0].childNodes[0].nodeValue]
            var index = obj_del['savedCharities'].indexOf(idx_name_map[this.parentNode.childNodes[0].childNodes[0].nodeValue])
            console.log(index)
            if (index > -1) {
                obj_del['savedCharities'].splice(index, 1);
            }
            obj_del['allocationAmounts'] = my_charities;
            setSessionObject(obj_del);
            update_pie(this.parentNode.childNodes[0].childNodes[0].nodeValue, 0);
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
    /*
    var char_error = document.createElement('span');
    char_error.className ='error_msg'
    var msg = document.createTextNode('You have allocated 100% of your donation budget. Press Donate to proceed with your donation or reallocate your funds by reducing one or more of your current donation amounts.');
    char_error.appendChild(msg);
    char_error.style.visibility = 'hidden'
    char_error.style.color= '#C43E00'
    list.appendChild(char_error);
    */

    // Finally, return the constructed list:
    return list;
}

function makeFamCharList() {
    /*var obj = getSessionObject();
  var savedCharities = obj["savedCharities"];
  var charityDetails = getCharityDetails();

  for (var sc = 0; sc < savedCharities.length; sc++){
    text = charityDetails[savedCharities[sc]].name;
    if (!(text in obj['allocationAmounts'])){
        obj['allocationAmounts'][text] = 0;
    }

    my_charities = obj['allocationAmounts']*/

    // Create the list element:
    charities = ['Dave Thomas Foundation', 'Friends of Earth', 'Rainforest Alliance', 'Homes For Our Troops']

    var colorRange = d3.scale.category20();
    var color = d3.scale.ordinal()
    .range(colorRange.range());


    var list = document.createElement('div');
    document.getElementById('family_charity_list').appendChild(list);

    for(var i = 0; i < charities.length; i++) {
        // Create the list item:
        var char_band = document.createElement('div');
        char_band.className = "char_band";
        char_band.setAttribute('id', 'cb'+i);
        col = color(charities[i]);
        //char_band.style.background = "linear-gradient(to right,"+col+"  0%,#EAEAEA 100%)"
        char_band.style.background = "linear-gradient(to right,"+col+" 2%,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF,#FFFFFF"
        var outer_div = document.createElement('div');
        outer_div.className ='outer_div';
        list.appendChild(outer_div);
        var legend = document.createElement('div');
        legend.className ='legend';
        legend.style.backgroundImage = color(charities[i]);
        //char_band.appendChild(legend);
        var char_content_name = document.createElement('div');
        char_content_name.className ='char_name';
        var char_name = document.createTextNode(charities[i]);
        char_content_name.appendChild(char_name);
        char_band.appendChild(char_content_name);
        outer_div.appendChild(char_band)
        }
    return list;
}
