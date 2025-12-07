# Personal CV — Giulio Giusteschi

[![Live demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://T0ls.github.io/CV/)
[![License: MIT](https://img.shields.io/badge/License-MIT-0a66ff?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Made with Bootstrap 5](https://img.shields.io/badge/made%20with-Bootstrap%205-7952b3?style=for-the-badge)](https://getbootstrap.com/)
[![GitHub API](https://img.shields.io/badge/powered%20by-GitHub%20API-181717?style=for-the-badge)](https://docs.github.com/en/rest?apiVersion=2022-11-28)

A **dynamic, api-driven portfolio website**: it automatically fetches your repositories, displays your code activity, and presents your professional profile in a responsive, bilingual interface. The project is designed to be **offline-ready** (with caching) and highly customizable via simple JSON configuration files.

> Just clone, add your token, and let the API build your portfolio.

---

## Why this architecture?

I wanted a CV that **updates itself**. Instead of manually adding every new project to a static HTML file, this site queries the GitHub API to fetch my latest work, stars, and language statistics. It combines the structure of a traditional résumé with the interactivity of a modern web app.

---

## Main features

- **GitHub API Integration**: Automatically fetches repository lists, descriptions, star counts, and language statistics.
- **Smart Caching**: Implements `localStorage` caching logic (1-hour TTL) to prevent API rate-limiting and ensure instant loading on repeat visits.
- **Integrated Code Viewer**: Browse repository files and view code syntax directly within the portfolio modal without leaving the page.
- **Bilingual Engine**: Instant switching between **Italian** and **English** via `translations.js`, persisting user preference, with the possibility to add easly new languages.
- **Dark Mode**: System-aware theme switching with persistent state.
- **Dynamic Filtering**: Filter projects by programming language or search by name/description in real-time.
- **Responsive Design**: Built on **Bootstrap 5**, optimized for mobile, tablet, and desktop.

---

## Quick setup

1.  **Clone** the repository.
2.  **Configuration**:
    The project uses a separate file for authentication to avoid rate limits.
    * Create a file named `api_token.js` in the root folder.
    * Add your GitHub Personal Access Token (Fine-grained or Classic):
    ```javascript
    const gitHubToken = {
        token: "YOUR_GITHUB_TOKEN_HERE"
    };
    ```
    *(Note: The site works without a token via the public API, but you will hit rate limits quickly).*
3.  **Run**: Open `index.html` in your browser.

---

## Interactions & UI

- **Theme Toggle**: Switch between Light/Dark mode via the floating pill menu.
- **Language**: Toggle IT/EN. The site updates the DOM instantly without reloading.
- **Repo Navigation**:
    - Click a **Repository Card** to open the details view.
    - Click **Files** to view source code with basic syntax presentation.
    - Use the **Back** button to return to the grid.
- **Search**: Type in the search bar to filter repositories by name or description instantly.

---

## Customization

**Content & Translations**
All text content is separated from the HTML structure. Edit `translations.js` to modify the bio, experience, education, or add new languages.

**Styling**
The visual identity is controlled via CSS variables in `style.css`. You can easily change the palette:
```css
:root {
    --primary-color: #4f46e5; /* Indigo */
    --secondary-color: #64748b; /* Slate */
    --font-heading: 'Poppins', sans-serif;
    /* ... */
}
```

---

## License

The source code for this project is licensed under the [MIT License](LICENSE).

The content (text, images, and personal data) is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
