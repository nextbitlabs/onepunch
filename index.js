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

		${chalk.bold('DESCRIPTION')}

			${chalk.bold('onepunch')} is a command-line interface useful to create presentations with web technology.
			Moreover, thanks to puppeteer, ${chalk.bold('onepunch')} can print the presentation in a PDF file.

			${chalk.bold('onepunch')} is designed for designers, it does not provide any default style.
			Designers can define custom styles by writing CSS files and linking them in the ${chalk.underline('index.html')}.

			${chalk.bold('onepunch')} is open source software licensed under the MIT License,
			please visit https://github.com/nextbitlabs/onepunch for further details.

		${chalk.bold('SYNOPSIS')}

			${chalk.bold('onepunch init')} [${chalk.bold('-n')} ${chalk.italic('directory_name')}]
				Initialize a presentation.

			${chalk.bold('onepunch serve')} [${chalk.bold('-i')} ${chalk.italic('htmlfile')}]
				Open the presentation in the browser.

			${chalk.bold('onepunch print')} [${chalk.bold('-i')} ${chalk.italic('htmlfile')}] [${chalk.bold('-o')} ${chalk.italic('pdffile')}]
				Print the presentation in a PDF file.

			${chalk.bold('onepunch update')}
				Update files in the ${chalk.underline('src')} directory according to the latest release.
				Please note that any custom change inside directory ${chalk.underline('src')} will be overwritten.

		${chalk.bold('OPTIONS')}

			${chalk.bold('-n')} or ${chalk.bold('--name')} ${chalk.italic('directory_name')}
				Specify the name of the directory where the project is initialized. 
				Defaults to ${chalk.underline('onepunch-presentation')}.

			${chalk.bold('-i')} or ${chalk.bold('--input')} ${chalk.italic('htmlfile')}
				Specify the HTML file to serve or print, defaults to ${chalk.underline('index.html')}.

			${chalk.bold('-o')} or ${chalk.bold('--output')} ${chalk.italic('pdffile')}
				Specify the name of the PDF file in output, defaults to ${chalk.underline('index.pdf')}.

			${chalk.bold('--version')}
				Display the version number.

			${chalk.bold('--help')}
				Display the documentation.

		${chalk.bold('FILES')}

			File ${chalk.underline('onepunch.json')} defines config settings as key-value pairs in JSON format.
			The following keys are provided:

			${chalk.bold('width')}: <Number>
				Describe the slide width in pixels, defaults to 960.

			${chalk.bold('height')}: <Number>
				Describe the slide height in pixels, defaults to 600.

			${chalk.bold('progress')}: <String>
				Describe the presentation progress. At the moment only values "line"
				and "none" are supported.

			${chalk.bold('date')}: <String>
				Define the text content of HTML elements with data attribute 
				data-onepunch="date", such as <span data-onepunch="date"></span>.

			${chalk.bold('slideNumber')}: <Boolean>
				If true, show the slide number in HTML elements with data attribute 
				data-onepunch="slide-number", such as <span data-onepunch="slide-number"></span>.

		${chalk.bold('LICENSE')}

			Copyright 2020 Nextbit <contact@nextbit.it> (https://nextbit.it/)

			Permission is hereby granted, free of charge, to any person obtaining a copy
			of this software and associated documentation files (the "Software"), to deal
			in the Software without restriction, including without limitation the rights
			to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
			copies of the Software, and to permit persons to whom the Software is
			furnished to do so, subject to the following conditions:

			The above copyright notice and this permission notice shall be included in
			all copies or substantial portions of the Software.

			THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
			IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
			FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
			AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
			LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
			OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
			THE SOFTWARE.
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
		serve(cli.flags);
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

function serve(flags) {
	liveServer.start({
		port: 8180,
		root: process.cwd(),
		open: `/${flags.input}`,
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
	const spinner = ora('Updating ...').start();
	const file = 'onepunch.json';

	if (!fs.existsSync(file)) {
		abort(`File ${chalk.underline('onepunch.json')} is not present. Are you sure this is the right directory?`, spinner);
	}

	fs.copySync(
		path.resolve(__dirname, 'template/src'),
		'src',
		{overwrite: true},
	);
	spinner.succeed(`Directory ${chalk.underline('src')} has been updated to release ${cli.pkg.version}.`);
}

function print(flags) {
	const spinner = ora('Printing ...').start();
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
		spinner.succeed(`File ${chalk.underline(output)} has been successfully created.`);
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
