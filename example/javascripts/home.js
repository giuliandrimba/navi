Home = function()
{
	this.intro = function(callback)
	{
		console.log("intro home");

		if(callback)
			callback()
	}

	this.outro = function(callback)
	{
		console.log("outro home");

		setTimeout(function()
		{
			console.log("finising outro home");
			if(callback)
				callback()
		}, 1000)
	}

	this.render = function()
	{
		console.log("render home");
		return "<p>Home</p><br /><div id='content'></div>";
	}
}