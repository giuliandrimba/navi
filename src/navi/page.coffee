class Page

	removing:false
	animating_in:false
	animating_out:false

	constructor:(object)->
		@target = object.target
		@route = object.route
		@object = object.page

	intro:(params, callback)=>

		@animating_in = true
		@el = @object.render(params)
		$(@target).html @el
		@object.intro =>
			if @removing == false
				@animating_in = false
				callback()

	outro:(callback)=>
		@animating_out = true
		@removing = true
		@animating_in = false
		@object.outro =>
			@animating_out = false
			callback()
