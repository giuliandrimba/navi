#<< navi/pubsub
#<< navi/page
#<< navi/router

class navi.Main

	routes = []
	@events = new navi.PubSub

	current_page = null
	next_page = null
	locked : false

	constructor:->
		

	@map:(hash,object,el_target,options)->
		modal = false
		modal = true if options?.modal
		navi_page = new navi.Page({route:hash,page:object,target:el_target, params:null, modal:modal})
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
		Main.events.trigger("route_change",{page:navi_page.route})
		@change_page(navi_page)

	@change_page:(navi_page)->
		@next_page = navi_page.route
		if @current_page
			if navi_page.modal
				@add_next_page(navi_page)
			else
				@remove_current_page =>
					@add_next_page(navi_page)
				
		else
			@add_next_page(navi_page)


	@remove_current_page:(callback)->
		if @current_page.animating_in
			if @current_page.animating_out is false
				@current_page.outro(callback)
		else
			if @current_page.animating_out is false
				@current_page.outro(callback)

	@add_next_page:(navi_page)->
		@current_page = @get_page(@next_page)
		@current_page.load =>
			@current_page.intro navi_page.params , => 
				Main.events.trigger("page_change", navi_page.route)


	@get_page:(route)->
		obj = null
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
