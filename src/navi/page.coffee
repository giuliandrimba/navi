#<< navi/pubsub

class navi.Page extends navi.PubSub

	removing:false
	animating_in:false
	animating_out:false
	active:false

	dependency:{}

	constructor:(object)->
		@target_dom = object?.target_dom
		@route = object?.route
		@object = object?.page
		@modal = object?.modal
		@dependency = object?.target_route

	load:(callback)=>

		if @object.load
			@object.load callback
			return
		else
			callback()
			return

	intro:(params, callback)=>

		@animating_in = true
		
		@el = @object.render(params)
		if @modal
			$(@target_dom).append @el
		else
			$(@target_dom).html @el

		# console.log @object

		@load =>
			@object.intro =>
				callback()
				if @removing == false
					@animating_in = false

	outro:(callback)=>
		@animating_out = true
		@removing = true
		@animating_in = false
		@object.outro =>
			@animating_out = false
			$(@target_dom).empty()
			callback()
