class Page

	removing:false
	animating_in:false
	animating_out:false

	constructor:(object)->
		@target = object.target
		@route = object.route
		@object = object.page

	in:(callback)=>
		@animating_in = true
		@el = @object.render()
		$(@target).html @el
		@object.in =>
			if @removing == false
				@animating_in = false
				callback()

	out:(callback)=>
		@animating_out = true
		@removing = true
		@animating_in = false
		@object.out =>
			@animating_out = false
			callback()
