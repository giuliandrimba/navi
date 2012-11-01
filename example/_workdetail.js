WorkDetail = function()
{
	this.intro = function(callback)
	{
		console.log("Intro Work Detail");
		if(callback)
			callback()
	}

	this.outro = function(callback)
	{
		console.log("Outro Work Detail");
		if(callback)
			callback()
	}

	this.render = function(id)
	{
		console.log("Render Work Detail");
		return "<p>Work"+id+"</p>";
	}
}