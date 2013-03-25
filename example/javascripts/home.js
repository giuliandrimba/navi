Home = function()
{
	this.intro = function(callback)
	{
		console.log("intro home");

		if(callback)
			callback()
	}

	this.load = function(callback)
	{
		callback();
	}

	this.outro = function(callback)
	{
		console.log("outro home");

		if(callback)
			callback()
	}

	this.render = function()
	{
		console.log("render home");
		return "<p>Home</p><br /><div id='content'></div>";
	}
}