# => SRC FOLDER
toast 'src'
	# => VENDORS (optional)
	vendors: ['vendors/jquery.hashchange.js']

	# => OPTIONS (optional, default values listed)
	# bare: false
	# packaging: true
	# expose: ''
	minify: false

	# => HTTPFOLDER (optional), RELEASE / DEBUG (required)
	httpfolder: ''
	release: '../../work/rumba/citroen/citroen_ds4_hotsite/public/app/javascripts/vendors/navi/navi.js'
	debug: 'example/navi.js'
	# debug: 'lib/navi-debug.js'