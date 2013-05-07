#<< navi/pubsub
#<< navi/page
#<< navi/router

class navi.Main

	routes = []
	@events = new navi.PubSub

	current_page = null
	next_page = null
	old_page = null
	locked : false

	#options
	modal:false
	target_route:null
	target_dom:null

	dependencies:[]

	constructor:->
		

	@map:(hash, object, options)->
		modal = options?.modal
		target_route = options?.route
		target_dom = options?.dom 

		navi_page = new navi.Page({route:hash,page:object,target_dom:target_dom, target_route:target_route, params:null, modal:modal})

		routes.push(navi_page)

		page_api = window.page hash,(ctx)=>
			navi_page.params = ctx.params
			@process_hash_change navi_page

		navi_page.regexp = page_api.format_hash navi_page.route

	@init:()=>
		hash = window.location.hash.toString().substring(2)
		if @has_valid_hash(hash)
			window.page(hash).init()
		else
			window.page routes[0].route


	@has_valid_hash:->
		hash = window.location.hash.toString().substring(2)
		return true if @get_page(hash)
		return false

	@go:(page_name)->

		page = @get_page(page_name)

		if page.modal and !@locked
			@process_hash_change page
			return

		if(!@locked)
			window.page page_name

	@process_hash_change:(navi_page)=>
		console.log "process_hash_change"
		Main.events.trigger("route_change",{page:navi_page.route})
		@change_page(navi_page)

	@next_page_dependency:(page)=>
		return @get_page(page.dependency)


	@change_page:(navi_page)->

		@next_page = navi_page.route
		next_page_obj = @get_page(@next_page)

		if @current_page and !navi_page.modal

			if @get_page(next_page_obj.dependency) isnt @current_page
				@remove_current_page =>
					@add_next_page(navi_page)
			else
				@add_next_page(navi_page)
		else
			@add_next_page(navi_page)

	@remove_current_page:(callback)->

		if @current_page.animating_in
			if @current_page.animating_out is false
				@current_page.active = false
				@current_page.outro(callback)
		else
			if @current_page.animating_out is false
				@current_page.active = false
				@current_page.outro(callback)

	@add_next_page:(navi_page)=>
		@old_page = @current_page if @current_page
		@current_page = @get_page(@next_page)

		@dependencies = []

		unless @current_page.active
			@add_dependencies @current_page, =>
				@current_page.intro navi_page.params , => 
					Main.events.trigger("page_change", navi_page.route)
		else
			Main.events.trigger("page_change", navi_page.route)


	@add_dependencies:(navi_page, callback)=>

		if navi_page.dependency and @get_page(navi_page.dependency) isnt @old_page
			@dependencies.push @get_page(navi_page.dependency)
			@add_dependencies @get_page(navi_page.dependency), callback
		else
			@load_dependencies(callback)

	@load_dependencies:(callback)->

		if @dependencies.length
			page = @dependencies.pop()
			page.intro page.params , => 
				page.active = true
				@load_dependencies(callback)
		else
			callback()


	@get_page:(route)->
		obj = null
		return obj if !route
		for e in routes
			if(route.match(e.regexp))
				for rxp in route.match(e.regexp)
					if rxp is route
						obj = e
		return obj

if typeof define == 'function' && define.amd
	define( =>
		window.page = new navi.Router()

		return navi.Main
	)
else if 'undefined' == typeof module
	window.page = new navi.Router()
			
	window.Navi = navi.Main
else
	exports.map = (hash,object,el_target)->
		navi.Main.map(hash,object,el_target)

	exports.go = (page_name)->
		navi.Main.go(page_name)

	exports.init = ->
		navi.Main.init()

	exports.bind = (event,callback)->
		navi.Main.events.bind(event,callback)

	exports.unbind = (event,callback)->
		navi.Main.events.unbind(event,callback)
