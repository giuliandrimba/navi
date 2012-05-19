#<< navi/pubsub
#<< navi/page

class Main

	routes = []
	@events = new navi.PubSub

	current_page = null
	next_page = null

	constructor:->

	@map:(hash,object,el_target)->
		decorator = new navi.Page({route:hash,page:object,target:el_target})
		routes.push(decorator)

		window.page "/#" + hash,(ctx)=>
			@process_hash_change decorator.route

	@init:->
		hash = window.location.hash.toString().substring(1)
		window.page("/#"+hash)


	@has_valid_hash:->
		hash = window.location.hash.toString().substring(1)
		return true if @get_page(hash)
		return false

	@go:(page_name)->
		window.page "/#" + page_name

	@process_hash_change:(page_name)=>
		Main.events.trigger("route_change")
		@change_page(page_name)

	@change_page:(page_name)->
		@next_page = page_name
		if @current_page
			@remove_current_page =>
				@add_next_page()
		else
			@add_next_page()


	@remove_current_page:(callback)->
		if @current_page.animating_in
			if @current_page.animating_out is false
				@current_page.out(callback)
		else
			if @current_page.animating_out is false
				@current_page.out(callback)

	@add_next_page:()->
		@current_page = @get_page @next_page
		Main.events.trigger("page_change")
		@current_page.in =>

	@get_page:(route)->
		for e in routes
			if(e.route == route)
				return e

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
