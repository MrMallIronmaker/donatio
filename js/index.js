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