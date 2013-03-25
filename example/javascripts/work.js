Work = function()
{
	this.intro = function(callback)
	{
		console.log("Intro Work");
		if(callback)
			callback()
	}

	this.load = function(callback)
	{
		callback();
	}

	this.outro = function(callback)
	{
		console.log("Outro Work");
		if(callback)
			callback()
	}

	this.render = function(id)
	{
		console.log("Render Work");
		return "<p>WORK</p><br /><div id='work_content'></div>";
	}
}