WorkDetail = function()
{
	this.intro = function(callback)
	{
		console.log("Intro Work Detail");
		if(callback)
			callback()
	}

	this.load = function(callback)
	{
		callback();
	}

	this.outro = function(callback)
	{
		console.log("Outro Work Detail");
		setTimeout(function()
		{
			console.log("finising outro work detail");
			if(callback)
				callback()
		}, 1000)
	}

	this.render = function(id, id2, id3)
	{
		console.log("Render Work Detail");
		return "<p>Work "+id+"</p>";
	}
}