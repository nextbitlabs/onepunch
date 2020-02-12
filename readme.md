**onepunch** is a command-line interface to create PDF presentations using web technology.

**onepunch** is designed for designers, it does not provide any default style. Designers can write their CSS files and link them in the `index.html`.

### Prerequisites

To use **onepunch**, you should have installed **node** and **npm** in your system. Please follow the [official instructions](https://www.npmjs.com/get-npm).

### Install

Install **onepunch** globally with the following command:

```
$ npm install -g @nextbitlabs/onepunch
```

Please note that onepunch makes use of [puppeteer](https://github.com/puppeteer/puppeteer/), which will download chromium. This is necessary to print the PDF file.

### Create a project

```
$ onepunch --init my-presentation
```

The command above creates the directory `my-presentation` with all the files needed to bootstrap the presentation.

### View the presentation

Inside the project directory, run:

```
$ onepunch --start
```

The command above starts a local server and opens the browser.

Please use the **responsive design mode** provided by your browser to select the presentation width and height. You can do that with the following steps:

1. Open the responsive design mode. For example, both Chrome and Firefox use the keyboard shortcut `Ctrl + Shift + M`.
2. Select the width and height of your presentation. You are free in this choice. If in doubt, we suggest 960 pixels for the width and 600 pixels for the height.

Use the arrow keys to see the next and previous slides.

### Print the PDF

Inside the project directory, run:

```
$ onepunch --print -w 960 -h 600
```

Flags `-w` and `-h` set the width and the height of the presentation and they should be the same values chosen in the browser responsive design mode. If omitted, width and height default to 960 and 600 pixels.

### Create custom styles

Each slide is created by means of tag `article`, for example:

```
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

```
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

```
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