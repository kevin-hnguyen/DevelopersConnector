#### Set up initial components: Navbar and Landing
Note: there is a theme zipped in a package called `1.1 devconnector_html_theme.zip`.
We use the themes in this package to style our front-end app.

1. We override the whole `root/client/src/App.css` file with the `1.1 devconnector_html_theme/css/style.css` file.
2. We bring in the images from the theme also. We create a new folder called `img` inside the `root/client/src`. Then we copy the image `showcase.jpg` to that new folder. Finally, we resolve the `url` of the showcase image in the `App.css` file.
3. We create a couple of new folders `root/client/src/components/layouts`.
4. We create 2 classes to represent the `Navbar` and `Landing` elemments.
5. We copy the content from the `1.1 devconnector_html_theme/index.html` file. Particularly, we need 2 elements from that:

```
    <nav class="navbar bg-dark">
      <h1>
        <a href="index.html"><i class="fas fa-code"></i> DevConnector</a>
      </h1>
      <ul>
        <li><a href="profiles.html">Developers</a></li>
        <li><a href="register.html">Register</a></li>
        <li><a href="login.html">Login</a></li>
      </ul>
    </nav>
```
and
```
    <section class="landing">
      <div class="dark-overlay">
        <div class="landing-inner">
          <h1 class="x-large">Developer Connector</h1>
          <p class="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div class="buttons">
            <a href="register.html" class="btn btn-primary">Sign Up</a>
            <a href="login.html" class="btn btn-light">Login</a>
          </div>
        </div>
      </div>
    </section>
```
into 2 new React components `Navbar` and `Landing`.