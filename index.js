#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const meow = require('meow');
const puppeteer = require('puppeteer');
const liveServer = require('live-server');

const cli = meow({
	description: false,
	help: `
		Usage
			$ one-punch

		Options
			--init, -i  Initialize a init project
			--export, -e  Export a PDF file
	`,
	flags: {
		init: {
			type: 'boolean',
			default: false,
			alias: 'i',
		},
		print: {
			type: 'boolean',
			default: false,
			alias: 'p',
		},
		start: {
			type: 'boolean',
			default: false,
		},
		width: {
			type: 'number',
			default: 960,
			alias: 'w',
		},
		height: {
			type: 'number',
			default: 600,
			alias: 'h',
		},
	},
});

if (cli.flags.init && !cli.flags.print && !cli.flags.start) {
	init(cli.input[0]);
} else if (cli.flags.print && !cli.flags.init && !cli.flags.start) {
	print();
} else if (cli.flags.start && !cli.flags.print && !cli.flags.init) {
	start();
} else {
	abort('Too many flags used, please double check the command.');
}

function start() {
	liveServer.start({
		port: 8180,
		root: process.cwd(),
		open: true,
		logLevel: 1,
	});
}

function init(input) {
	const presentationPath = path.resolve(input);
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

	const {width, height} = cli.flags;

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
