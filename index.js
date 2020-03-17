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

			onepunch print [-i htmlfile] [-o pdffile]
				Print the presentation in a PDF file.

			onepunch update
				Update files in the src directory according to the latest release.
				Please note that any custom change inside directory src will be overwritten

		OPTIONS
			-n or --name directory_name
				Specify the name of the directory where the project is initialized. Defaults to onepunch-presentation.

			-i or --input htmlfile
				Specify the HTML file to print, defaults to "index.html".

			-o or --output pdffile
				Specify the name of the PDF file in output, defaults to "index.pdf".

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
		input: {
			type: 'string',
			default: 'index.html',
			alias: 'i',
		},
		output: {
			type: 'string',
			default: 'index.pdf',
			alias: 'o',
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
		print(cli.flags);
		break;
	case 'update':
		update();
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

function update() {
	const file = 'onepunch.json';

	if (!fs.existsSync(file)) {
		abort('File onepunch.json is not present. Are you sure this is the right directory?');
	}

	fs.copySync(
		path.resolve(__dirname, 'template/src'),
		'src',
		{overwrite: true},
	);
}

function print(flags) {
	const {input, output} = flags;

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
		await page.goto(`http://127.0.0.1:8181/${input}`);
		await page.pdf({
			path: output,
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
