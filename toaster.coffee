# => SRC FOLDER
toast 'src'
	# => VENDORS (optional)
	vendors: ['vendors/jquery.ba-hashchange.min.js','vendors/page.js']

	# => OPTIONS (optional, default values listed)
	# bare: false
	# packaging: true
	# expose: ''
	# minify: false

	# => HTTPFOLDER (optional), RELEASE / DEBUG (required)
	httpfolder: ''
	release: 'lib/app.js'
	debug: 'lib/app-debug.js'