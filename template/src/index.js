/*
	Change slide with arrow keys
*/
window.addEventListener('keydown', handleOnkeydown);

function handleOnkeydown(event) {
	const {keyCode} = event;
	const LEFT = 37;
	const UP = 38;
	const RIGHT = 39;
	const DOWN = 40;
	switch (keyCode) {
		case RIGHT:
		case DOWN:
			window.scrollBy(0, window.innerHeight);
			break;
		case UP:
		case LEFT:
			window.scrollBy(0, -window.innerHeight);
			break;
		// No default
	}
}
