# => SRC FOLDER
toast 'src'
	# => VENDORS (optional)
	vendors: ['vendors/jquery.hashchange.js']

	# => OPTIONS (optional, default values listed)
	# bare: false
	# packaging: true
	# expose: ''
	# minify: false

	# => HTTPFOLDER (optional), RELEASE / DEBUG (required)
	httpfolder: ''
	release: '../../../workspace/espn/espn-nfl2012/public/javascripts/vendors/navi//navi.js'
	debug: '../../../workspace/espn/espn-nfl2012/public/javascripts/vendors/navi//navi.js'
	# debug: 'lib/navi-debug.js'