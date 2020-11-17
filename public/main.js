
/* main.js */

window.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	if(document.querySelector('aside')) {
		document.querySelector('aside').addEventListener('click', () => {
			document.getElementById('notification').remove()
		})
		const delay = 2500
		document.querySelector('aside').hidden = false
		window.setTimeout( () => {
			document.querySelector('aside').hidden = true
		}, delay)
	}
})

window.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	if(document.querySelector('input')) {//if one input field on page
		document.querySelectorAll('input').forEach(element => {//go through each object
			element.addEventListener('invalid', event => {
				if(!event.target.validity.valid) {
					const message = event.target.dataset.message || 'invalid data'
					event.target.setCustomValidity(message)
				}
			})
			element.addEventListener('input', event => {//reset message
				event.target.setCustomValidity('')
			})
		}, false)
	}
})
