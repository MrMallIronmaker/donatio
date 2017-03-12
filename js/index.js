function preview(e){
	e.childNodes[1].childNodes[5].style.opacity = '0.5'
	e.childNodes[1].childNodes[3].style.display = 'none'
	e.childNodes[1].childNodes[1].style.opacity = '1'
	e.childNodes[1].childNodes[1].style.visibility = 'visible'
}

function close_preview(e){
	e.childNodes[1].childNodes[5].style.opacity = '1'
	e.childNodes[1].childNodes[3].style.display = 'block'
	e.childNodes[1].childNodes[1].style.opacity = '0'
	e.childNodes[1].childNodes[1].style.visibility = 'visible'
}

$(window).on("load",function() {
	console.log('hi')
  function fade(pageLoad) {
  	var windowBottom = $(window).scrollTop() + $(window).innerHeight();
    var min = 0.3;
    var max = 0.7;
    var threshold = 0.01;
    
    $(".wrapper").each(function() {
      /* Check the location of each desired element */
      var objectBottom = $(this).offset().top + $(this).outerHeight();
      
      /* If the element is completely within bounds of the window, fade it in */
      if (objectBottom < windowBottom) { //object comes into view (scrolling down)
        if ($(this).css("opacity")<=min+threshold || pageLoad) {$(this).fadeTo(500,max);}
      } else { //object goes out of view (scrolling up)
        if ($(this).css("opacity")>=max-threshold || pageLoad) {$(this).fadeTo(500,min);}
      }
    });
  } fade(true); //fade elements on page-load
  $(window).scroll(function(){fade(false);}); //fade elements on scroll
});