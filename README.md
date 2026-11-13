# Snake II · Nokia 3310

A Nokia 3310-inspired Snake II web game with a monochrome LCD, a working phone keypad, three mazes, and four speeds. Your browser saves your best score locally.

## Play locally

Open `index.html` in a browser. The game uses plain HTML, CSS, and JavaScript and needs no installation or build.

- Start, pause, or resume with **Space** or the phone’s blue button.
- Steer with the arrow keys, **WASD**, **2 / 4 / 6 / 8**, or the on-screen keypad.
- Classic wraps at the edges. Box adds outer walls. Cross adds outer walls and interior obstacles.
- Eat food for 10 points. Hitting a wall or your own body ends the game.

## Publish on GitHub Pages

1. Create an empty public repository named `YOUR-USERNAME.github.io` under the account that will host the site. Leave GitHub’s README, license, and gitignore options unchecked.
2. Push this repository’s `main` branch. From this folder, replace `YOUR-USERNAME` and run:

   ```sh
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
   git push -u origin main
   ```

3. On GitHub, open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, choose **main** and **/ (root)**, then save.
4. When deployment completes, open `https://YOUR-USERNAME.github.io/`.

To publish as a project site instead, use any repository name and the same Pages settings. The game will be served at `https://YOUR-USERNAME.github.io/REPOSITORY/`.
