(function () {
	const isAutomated = navigator.webdriver;

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
		addSlideId();
		setHash();
		addEventListeners(config);
		setBorders(config.width, config.height);
		addProgress(config);
		addSlideNumber(config);
		addDate(config);
		if (!isAutomated) {
			addCopyToClipBoardButton(config);
		}
	}

	/*
		Set location hash
	*/

	function setHash() {
		window.location.hash = window.location.hash || getSlides()[0].id;
	}

	/*
		Add event listeners.
	*/

	function addEventListeners(config) {
		window.addEventListener('keydown', handleOnkeydown);
		window.addEventListener('resize', () => {
			setBorders(config.width, config.height);
			if (!isAutomated) {
				setCopyToClipBoardButtonPosition(config);
			}

			updateLocationHash(getSlideId());
		});
	}

	/*
	 Set article borders.
	*/

	function setBorders(width, height) {
		const articles = getSlides();
		const borderLeft = Math.max(0, (window.innerWidth - width) / 2);
		const borderTop = Math.max(0, (window.innerHeight - height) / 2);
		for (const elt of articles) {
			elt.style.borderWidth = `${borderTop}px ${borderLeft}px`;
		}
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
				goToNextPage();
				break;
			case UP:
			case LEFT:
				goToPreviousPage();
				break;
			// No default
		}
	}

	function goToNextPage() {
		updateUrl(+1);
	}

	function goToPreviousPage() {
		updateUrl(-1);
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
		Update location hash.
	*/

	function updateLocationHash(pageId) {
		window.location.hash = `#${pageId}`;
	}

	/*
		Get the id of the current slide
	*/

	function getSlideId() {
		return window.location.hash.slice(1);
	}

	/*
		Update url.
	*/

	function updateUrl(increment) {
		const index = getPageIndex();
		if ((increment === +1 && index < numberOfSlides() - 1) || (increment === -1 && index > 0)) {
			const slideId = getSlides()[index + increment].id;
			updateLocationHash(slideId);
		}
	}

	/*
		Return the number of slides.
	*/

	function numberOfSlides() {
		return getSlides().length;
	}

	/*
		Get page index location hash.
	*/

	function getPageIndex() {
		return getSlides()
			.map(page => page.id)
			.findIndex(id => id === getSlideId());
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
		for (const slide of slides) {
			const element = slide.querySelector('[data-onepunch="date"]');
			if (element) {
				if (config.date) {
					element.textContent = config.date;
				} else {
					element.style.display = 'none';
				}
			}
		}
	}

	/*
		Add slide id
	*/

	function addSlideId() {
		const slides = getSlides();
		slides.forEach((slide, index) => {
			slide.id = slide.id || `${index + 1}`;
		});
	}

	/*
		Add copy-to-clipboard button
	*/
	function addCopyToClipBoardButton(config) {
		appendCopyToClipBoardButton();
		setCopyToClipBoardButtonPosition(config);
	}

	function copyToClipBoard() {
		fetch(window.location.href)
			.then(response => response.text())
			.then(text => {
				const element = document.createElement('html');
				element.innerHTML = text;
				const articles = element.querySelectorAll('main > article');
				const htmlSnippet = articles[getPageIndex()].outerHTML;
				navigator.clipboard.writeText(htmlSnippet).then(
					() => {
						// Console.log('Copied to clipboard.');
					},
					() => {
						// Console.log('Error, not copied.');
					},
				);
			});
	}

	function appendCopyToClipBoardButton() {
		const button = document.createElement('button');
		button.className = 'copy-to-clipboard';
		button.textContent = 'copy to clipboard';
		button.addEventListener('click', copyToClipBoard);
		document.body.append(button);
	}

	function setCopyToClipBoardButtonPosition(config) {
		const button = document.querySelectorAll('.copy-to-clipboard')[0];
		const bottom = Math.max(0, (window.innerHeight - config.height) / 2);
		const right = Math.max(0, (window.innerWidth - config.width) / 2);
		button.style.bottom = `calc(${bottom}px - 2.5vw)`;
		button.style.right = `${right}px`;
	}
})();
