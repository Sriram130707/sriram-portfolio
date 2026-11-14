# Palasetti Sriram — Portfolio Website

A responsive portfolio built with HTML, CSS and vanilla JavaScript, with a Python Flask contact-form API.

## Project contents

- `index.html` — portfolio page
- `assets/css/style.css` — responsive styling and themes
- `assets/js/main.js` — navigation, theme toggle, project filters and contact form
- `assets/js/config.js` — backend API URL configuration
- `backend/` — Flask API, SQLite message storage and deployment instructions

## Run the website locally

1. Open this folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Follow `backend/README.md` to start the Flask API in a separate terminal.
5. In `assets/js/config.js`, set `API_URL` to `http://127.0.0.1:5000`.
6. Refresh the website and submit a test contact message.

The contact form will not submit until the API URL is configured and the Flask backend is running. The direct email link remains available as a fallback.

## Deploy

- Frontend: deploy this folder as a static site on Vercel or Netlify. The `index.html` file is at this folder's root.
- Backend: deploy the `backend` folder as a Render Web Service. Build command: `pip install -r requirements.txt`. Start command: `gunicorn app:app`.
- Set `CORS_ORIGINS` in Render to the exact frontend URL, then update `assets/js/config.js` with the Render API URL and redeploy the frontend.

See `backend/README.md` for detailed backend setup, optional email notifications, and database persistence notes.

## Before publishing

- Verify the GitHub and LinkedIn profile URLs and email address in `index.html`.
- Add your own `resume.pdf` only when it is ready; no fabricated resume is included.
- Add the correct GitHub repository URL to each project card when those repositories are public.
- Do not commit SMTP credentials, `.env` files, or private information.

## Project source examples

The `project-source/` folder contains runnable starter code and a separate README for each of the five projects shown on the Projects section. Review and customize these examples before publishing them to GitHub.
