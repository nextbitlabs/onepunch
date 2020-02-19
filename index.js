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
		serve: {
			type: 'boolean',
			default: false,
		},
	},
});

if (cli.flags.init && !cli.flags.print && !cli.flags.serve) {
	init(cli.input[0]);
} else if (cli.flags.print && !cli.flags.init && !cli.flags.serve) {
	print();
} else if (cli.flags.serve && !cli.flags.print && !cli.flags.init) {
	serve();
} else {
	abort('Too many flags used, please double check the command.');
}

function serve() {
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
