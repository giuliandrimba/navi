#<< navi/pubsub
#<< navi/page
#<< navi/hash_nav

class Main

	routes = []
	@events = new navi.PubSub

	current_page = null
	next_page = null

	constructor:->
		

	@map:(hash,object,el_target)->
		navi_page = new navi.Page({route:hash,page:object,target:el_target, params:null})
		routes.push(navi_page)

		window.page hash,(ctx)=>
			navi_page.params = ctx.params
			@process_hash_change navi_page

	@init:->
		hash = window.location.hash.toString().substring(1)

		window.page("/#"+hash)


	@has_valid_hash:->
		hash = window.location.hash.toString().substring(1)
		return true if @get_page(hash)
		return false

	@go:(page_name)->
		window.page page_name

	@process_hash_change:(navi_page)=>
		Main.events.trigger("route_change")
		@change_page(navi_page)

	@change_page:(navi_page)->
		@next_page = navi_page.route
		if @current_page
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
		@current_page = @get_page @next_page
		Main.events.trigger("page_change")
		@current_page.intro navi_page.params , -> 

	@get_page:(route)->
		for e in routes
			if(e.route == route)
				return e

if typeof define == 'function' && define.amd
	define( =>
		if !history.pushState
			window.page = new navi.HashNav()

		return navi.Main
	)
else if 'undefined' == typeof module
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
