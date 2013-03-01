class navi.Router

	constructor:->

		@states = []

		$(window).hashchange (e)=>
			@change_route window.location.hash.toString()

		return (hash, callback)=>
			@states.push {hash:hash, callback:callback, regexp:@format_hash(hash)} if callback
			window.location.hash = ("/" + hash) unless callback and (hash.length > 1)
			return @

	format_hash:(hash)->
		rgx = /(:[^\/]*)/g
		str = hash.replace(/(:[^\/]*)/g,"(.*)")
		rgx = new RegExp(str)
		return rgx

	change_route:(hash)->
		hash = hash.substring(2)
		for route in @states
			if route.regexp.test(hash)
				if((params = hash.match(route.regexp))[0] is hash)
					route.callback({params:params.splice(1,4)})

	init:->
		@change_route window.location.hash.toString()
