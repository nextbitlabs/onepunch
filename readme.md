**onepunch** is a command-line interface to create PDF presentations using web technology.

**onepunch** is designed for designers, it does not provide any default style. Designers can write CSS files and link them in the `index.html`.

### Prerequisites

To use **onepunch**, you should have installed **node** and **npm** in your system. Please follow the [official instructions](https://www.npmjs.com/get-npm).

### Install

Install **onepunch** globally with the following command:

```sh
$ npm install -g @nextbitlabs/onepunch
```

Please note that onepunch makes use of [puppeteer](https://github.com/puppeteer/puppeteer/), which will download chromium. This is necessary to print the PDF file.

Update **onepunch** to the latest release with:

```sh
$ npm update -g @nextbitlabs/onepunch
```

### Create a project

```sh
$ onepunch init [-n directory-name]
```

The command above creates the directory `directory-name` with all the files needed to bootstrap the presentation. The configuration file `onepunch.json` contains configuration parameters, for the moment only the presentation *width* and *height* (in pixels) are available.

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

Update files in the `src` directory according to the latest release of **onepunch**, please note that any custom change inside directory `src` will be overwritten:

```sh
$ onepunch update
```

The above command assumes you have installed the latest release of **onepunch**.
If this is not the case, update **onepunch** to the latest release with:

```sh
$ npm update -g @nextbitlabs/onepunch
```

### Create custom styles

Each slide is created by means of tag `article`, for example:

```html
<main>

  <!-- Slides 1 -->
  <article>
    <header>
      <h1>My Presentation Title</h1>
    </header>
  </article>

  <!-- Slides 2 -->
  <article>
    <header>
      <h1>My Presentation Title</h1>
      <p>We use web technology to create PDF presentations.</p>
    </header>
  </article>

  ...

</main>
```

As usual, designers can define CSS classes to apply custom style. For example, the following class defines a specific grid layout:

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
