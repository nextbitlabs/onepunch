# **onepunch** presentation

### Configuration
The configuration file `onepunch.json` contains configuration parameters, with the following available:
- `width` and `height`, numeric: slide width and height in pixels;
- `progress`, string: available `line`, to show a progress line at the bottom of the page, or `none`, to suppress it;
- `date`, string: presentation date, used by tags `<span data-onepunch="date"></span>` along the presentation;
- `slideNumber`, bool: whether to visualize the slide number in tags `<span data-onepunch="slide-number"></span>`.

### View the presentation

Inside the project directory, run:

```sh
$ onepunch serve [-i htmlfile]
```

The command above starts a local server and opens the browser, use the arrow keys to see the next and previous slides.
Flag `-i` (or `--input`) specifies the HTML file to open, it defaults to "index.html".

### Print the PDF

Inside the project directory, run:

```sh
$ onepunch print [-i htmlfile] [-o pdffile]
```

Flag `-i` (or `--input`) specifies the HTML file to print, it defaults to "index.html".
Flag `-o` (or `--output`) specifies the name of the PDF file in output, it defaults to "index.pdf".

### Update

To align the `src` directory of a past presentation to the latest release of **onepunch**,
first update **onepunch** itself, then use:

```sh
$ onepunch update
```
This will make any new feature available to the current presentation.
Please note that any custom change inside directory `src` will be overwritten.
