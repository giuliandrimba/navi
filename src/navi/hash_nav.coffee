class HashNav

	constructor:->

		@states = []

		$(window).hashchange (e)=>
			@change_route window.location.hash.toString()

		return (hash, callback)=>
			@states.push {hash:hash, callback:callback} if callback
			window.location.hash = ("/" + hash) unless callback

	change_route:(hash)->
		hash = hash.substring(2)
		for route in @states
			route.callback({params:hash}) if route.hash == hash