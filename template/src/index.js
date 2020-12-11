(function () {
	/*
		Describe the app state.
	*/

	const state = {
		pageIndex: guessPageIndex(),
	};

	/*
		Get configuration parameters and initialize the web page.
	*/

	(async function () {
		const fecthResult = await fetch('./onepunch.json');
		const config = await fecthResult.json();
		init(config);
	})();

	/*
		Initialize services.
	*/

	function init(config) {
		addEventListeners(config);
		setBorders(config.width, config.height);
		addProgress(config);
		addSlideNumber(config);
		addDate(config);
	}

	/*
		Add event listeners.
	*/

	function addEventListeners(config) {
		window.addEventListener(
			'keydown',
			handleOnkeydown,
		);
		window.addEventListener(
			'resize',
			() => {
				setBorders(config.width, config.height);
				updateScroll();
			},
		);
	}

	/*
	 Set article borders.
	*/

	function setBorders(width, height) {
		const articles = getSlides();
		const borderLeft = Math.max(0, (window.innerWidth - width) / 2);
		const borderTop = Math.max(0, (window.innerHeight - height) / 2);
		articles.forEach(elt => {
			elt.style.borderWidth = `${borderTop}px ${borderLeft}px`;
		});
	}

	/*
		Change slide with arrow keys.
	*/

	function handleOnkeydown(event) {
		const {keyCode} = event;
		const LEFT = 37;
		const UP = 38;
		const RIGHT = 39;
		const DOWN = 40;
		switch (keyCode) {
			case RIGHT:
			case DOWN:
				state.pageIndex = Math.min(state.pageIndex + 1, numberOfSlides());
				updateScroll();
				break;
			case UP:
			case LEFT:
				state.pageIndex = Math.max(state.pageIndex - 1, 0);
				updateScroll();
				break;
			// No default
		}
	}

	/*
		Add progress to each slide based on config.
	*/

	function addProgress(config) {
		if (!config.progress || config.progress === 'none') {
			return;
		}

		const articles = getSlides();

		if (config.progress === 'line') {
			articles.forEach((article, index) => {
				const line = document.createElement('div');
				line.classList.add('progress-line');
				article.append(line);

				line.style.backgroundColor = 'var(--primary-color, #000)';

				line.style.height = '3px';
				line.style.position = 'absolute';

				line.style.bottom = '0';
				line.style.left = '0';

				const normIndex = index / (articles.length - 1);

				line.style.width = `${config.width * normIndex}px`;
			});
		}
	}

	/*
		Return the correct scroll position.
	*/

	function getScroll() {
		return state.pageIndex * window.innerHeight;
	}

	/*
		Update scroll position on resize events.
	*/

	function updateScroll() {
		window.scroll(0, getScroll());
	}

	/*
		Return the number of slides.
	*/

	function numberOfSlides() {
		return getSlides().length;
	}

	/*
		Guess page index from the scroll position.
	*/

	function guessPageIndex() {
		const index = Math.round(document.documentElement.scrollTop / window.innerHeight);
		return Math.max(0, Math.min(index, numberOfSlides()));
	}

	/*
		Return the list of slides.
	*/

	function getSlides() {
		return [...document.querySelectorAll('main > article')];
	}

	/*
		Add slide numbers.
	*/

	function addSlideNumber(config) {
		const slides = getSlides();
		slides.forEach((slide, index) => {
			const element = slide.querySelector('[data-onepunch="slide-number"]');
			if (element) {
				if (config.slideNumber) {
					element.textContent = index + 1;
				} else {
					element.style.display = 'none';
				}
			}
		});
	}

	/*
		Add date.
	*/

	function addDate(config) {
		const slides = getSlides();
		slides.forEach(slide => {
			const element = slide.querySelector('[data-onepunch="date"]');
			if (element) {
				if (config.date) {
					element.textContent = config.date;
				} else {
					element.style.display = 'none';
				}
			}
		});
	}
})();
