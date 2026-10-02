# ASPAS chat API setup (testing)

The current ASPAS website remains hosted as it is. Vercel will host only the chat API from the repository root; do not attach the ASPAS production domain to this Vercel project.

1. Import `sarthak30902/aspasoffice-website` into Vercel.
2. Leave **Root Directory** at the repository root (`./`).
3. Keep `main` as the Vercel production branch. A push to `testing` creates a Preview deployment.
4. In Project Settings → Environment Variables, add `OPENAI_API_KEY`, choose **Preview** only, and enable **Sensitive**. Do not put the key in GitHub or the website source.
5. Redeploy the `testing` branch. The endpoint will be `https://<your-vercel-project>-git-testing-<your-scope>.vercel.app/api/chat` (Vercel also shows the deployment URL).
6. Connect the homepage chat widget to the Preview endpoint after the project exists.

The API allows requests from `www.aspasoffice.com`, `aspasoffice.com`, and the local preview on port 8002. It limits message/history size and applies a per-instance request throttle for initial testing. That throttle is best-effort; add durable rate limiting or a CAPTCHA before promoting an AI chat endpoint for broader public use.

The default model is `gpt-5.4-mini`. If changing it, set `OPENAI_MODEL` as a Vercel Preview environment variable.

