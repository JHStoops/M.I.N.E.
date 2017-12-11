I effectively created a game save in the gameSave.json file.

It contains all the variables the page needs to continue from that point.
	- theGame object
		- gridRows 2D array set containing all the tile values.
		- width of the grid.
		- height of the grid.
		- mines on the grid.
		- wins
	- playerMap	2D array set containing all the player's tile statuses (mine1, unexplored, etc.)
	
Both the theGame and the playerMap data are loaded on the Sweeper.html page.
	- The theGame data is all copied into the Model, so we don't directly see that information.
		- I let the amount of wins print on the game page in <div id="player_stats">.
	- However, the playerMap data is visible right after you load it into the game grid. You can load the gameSave.json
	data by clicking the button that says "Load Game" (id="bLoadGame"). The data is loaded into the
	<div id="game"> just like any other game of M.I.N.E. you start.

Once you load the game data, it's ready to continue from where you left off.