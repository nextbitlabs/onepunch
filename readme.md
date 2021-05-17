# onepunch

**onepunch** is a command-line interface to create PDF presentations using web technology.

**onepunch** is designed for designers, it does not provide any default style.
Designers can write CSS files and link them in the `index.html`.

### Prerequisites

To use **onepunch**, you should have installed **node** and **npm** in your system.
Please follow the [official instructions](https://www.npmjs.com/get-npm).

### Install

Install **onepunch** globally with the following command:

```sh
$ npm install -g @nextbitlabs/onepunch
```

Please note that onepunch makes use of [puppeteer](https://github.com/puppeteer/puppeteer/), which will download chromium.
This is necessary to print the PDF file.

Update **onepunch** to the latest release with:

```sh
$ npm update -g @nextbitlabs/onepunch
```

### Create a project

```sh
$ onepunch init [-n directory-name]
```

The command above creates the directory `directory-name` with all the files needed to bootstrap the presentation.

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
Update **onepunch** to the latest release with:

```sh
$ npm update -g @nextbitlabs/onepunch
```

To align the `src` directory of a past presentation to the latest release of **onepunch**,
first update **onepunch** itself with the command above, then use:

```sh
$ onepunch update
```
This will make any new feature available to the current presentation.
Please note that any custom change inside directory `src` will be overwritten.

### Create custom styles

Each slide is created by means of tag `article`, for example:

```html
<main>

  <!-- Slide 1 -->
  <article>
    <header>
      <h1>My Presentation Title</h1>
    </header>
  </article>

  <!-- Slide 2 -->
  <article>
    <header>
      <h1>My Presentation Title</h1>
      <p>We use web technology to create PDF presentations.</p>
    </header>
  </article>

  ...

</main>
```

As usual, designers can define CSS classes to apply custom style.
For example, the following class defines a specific grid layout:

```css
.layout-1 {
  display: grid;
  grid-template-rows: minmax(50px, max-content) auto 50px;
  grid-template-columns: 100%;
  grid-template-areas:
    "A"
    "B"
    "C";
}
```

and can be used in the following way:

```html
<article class="layout-1">
  <header style="grid-area: A;">
    ...
  </header>
  <section style="grid-area: B;">
    ..
  </section>
  <footer  style="grid-area: C;">
    ...
  </footer>
</article>
```
