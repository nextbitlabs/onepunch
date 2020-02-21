#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const meow = require('meow');
const puppeteer = require('puppeteer');
const liveServer = require('live-server');

const cli = meow({
	description: false,
	help: `
		NAME
			onepunch -- create presentation with web technology

		SYNOPSIS
			onepunch init [-n directory_name]
				Initialize a presentation.

			onepunch serve
				Open the presentation in the browser.

			onepunch print
				Print the presentation in a PDF file.

		OPTIONS
			-n or --name directory_name
				Specify the name of the directory where the project is initialized. Defaults to onepunch-presentation.

			--version
				Display the version number.

			--help
				Display the documentation.
	`,
	flags: {
		name: {
			type: 'string',
			default: 'onepunch-presentation',
			alias: 'n',
		},
	},
});

switch (cli.input[0]) {
	case 'init':
		init(cli.flags);
		break;
	case 'serve':
		serve();
		break;
	case 'print':
		print();
		break;
	default:
		cli.showHelp();
		break;
}

function serve() {
	liveServer.start({
		port: 8180,
		root: process.cwd(),
		open: true,
		logLevel: 1,
	});
}

function init(flags) {
	const {name} = flags;
	const presentationPath = path.resolve(name);
	const presentationName = path.basename(presentationPath);

	if (fs.existsSync(presentationPath)) {
		abort(`The directory '${presentationName}' is already existing.`);
	}

	fs.mkdirSync(presentationPath);
	fs.copySync(path.resolve(__dirname, 'template'), presentationPath);
}

function print() {
	liveServer.start({
		port: 8181,
		root: process.cwd(),
		open: false,
		logLevel: 0,
	});

	const config = JSON.parse(fs.readFileSync('onepunch.json'));
	const width = config.width || 960;
	const height = config.height || 600;

	(async () => {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto('http://127.0.0.1:8181/index.html');
		await page.pdf({
			path: 'index.pdf',
			width,
			height,
			printBackground: true,
		});
		await browser.close();
		liveServer.shutdown();
	})();
}

function abort(message) {
	console.error(message);
	console.error('Aborting.');
	process.exit(1);
}
