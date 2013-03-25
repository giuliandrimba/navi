#<< navi/pubsub

class navi.Page extends navi.PubSub

	removing:false
	animating_in:false
	animating_out:false

	constructor:(object)->
		@target = object.target
		@route = object.route
		@object = object.page
		@modal = object.modal

	load:(callback)=>
		@object.load callback

	intro:(params, callback)=>

		@animating_in = true
		@el = @object.render.apply(null, params)
		if @modal
			$(@target).append @el
		else
			$(@target).html @el
			
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
			callback()
