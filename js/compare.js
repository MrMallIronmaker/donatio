function loadSelectionMenu(){
    var obj = getSessionObject();
    var savedCharities = obj["savedCharities"];
    var charityDetails = getCharityDetails();
    savedCharities = [0,1,2,3];
    charityDetails = [{"name":"apple"},{"name":"banana"},
    {"name":"carrot"},{"name":"desk"}];

    var elemList = document.getElementById("myCharitiesList");

    for (i = 0; i < savedCharities.length; i++){
        text = charityDetails[savedCharities[i]].name;
        var elem = document.createElement("div");
        var para = document.createElement("p");
        var node = document.createTextNode(text);
        elem.appendChild(para);
        para.appendChild(node);
        elemList.appendChild(elem);
        elem.className = "charity-element"
    }
}
