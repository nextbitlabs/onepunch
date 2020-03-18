#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const meow = require('meow');
const puppeteer = require('puppeteer');
const liveServer = require('live-server');
const chalk = require('chalk');
const ora = require('ora');

const cli = meow({
	description: false,
	help: `
		${chalk.bold('NAME')}

			${chalk.bold('onepunch')} -- create presentations with web technology

		${chalk.bold('SYNOPSIS')}

			${chalk.bold('onepunch init')} [${chalk.bold('-n')} ${chalk.italic('directory_name')}]
				Initialize a presentation.

			${chalk.bold('onepunch serve')}
				Open the presentation in the browser.

			${chalk.bold('onepunch print')} [${chalk.bold('-i')} ${chalk.italic('htmlfile')}] [${chalk.bold('-o')} ${chalk.italic('pdffile')}]
				Print the presentation in a PDF file.

			${chalk.bold('onepunch update')}
				Update files in the src directory according to the latest release.
				Please note that any custom change inside directory src will be overwritten

		${chalk.bold('OPTIONS')}

			${chalk.bold('-n')} or ${chalk.bold('--name')} ${chalk.italic('directory_name')}
				Specify the name of the directory where the project is initialized. Defaults to onepunch-presentation.

			${chalk.bold('-i')} or ${chalk.bold('--input')} ${chalk.italic('htmlfile')}
				Specify the HTML file to print, defaults to ${chalk.italic('index.html')}.

			${chalk.bold('-o')} or ${chalk.bold('--output')} ${chalk.italic('pdffile')}
				Specify the name of the PDF file in output, defaults to ${chalk.italic('index.pdf')}.

			${chalk.bold('--version')}
				Display the version number.

			${chalk.bold('--help')}
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
	const spinner = ora('Initializing ...').start();
	const {name} = flags;
	const presentationPath = path.resolve(name);

	if (fs.existsSync(presentationPath)) {
		abort(`The directory ${chalk.underline(name)} is already existing.`, spinner);
	}

	fs.mkdirSync(presentationPath);
	fs.copySync(path.resolve(__dirname, 'template'), presentationPath);
	spinner.succeed(`Directory ${chalk.underline(name)} has been initialized.`);
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

function abort(message, spinner = null) {
	if (spinner) {
		spinner.fail(message);
	} else {
		console.error(message);
	}

	console.error('Aborting.');
	process.exit(1);
}
