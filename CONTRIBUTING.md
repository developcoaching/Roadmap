🧱 Contributing Guidelines (Developer SOP)

Please read this before contributing to this repository.
The goal is to keep development fast, visible, and easy to track — without adding unnecessary admin work.

⸻

🎯 Purpose

You have full freedom to build and experiment. The only requirement is visibility: small daily commits, clear pull requests, and short Loom demos.

⸻

⚙️ 1. Workflow Summary
	•	All code lives in GitHub. No manual file sharing.
	•	Work only in branches, never directly on main.
	•	Examples: feature/login, feature/roadmap-ui, fix/typo-header
	•	Push updates daily so progress is visible in the commit history.
	•	Open Pull Requests (PRs) when a feature or fix is complete.

⸻

🚀 2. Pull Requests

When a task or feature is done:
	1.	Open a PR titled clearly, e.g.:
Feature – Roadmap CRUD
	2.	Add a short description (2–3 lines):
	•	What changed
	•	Why it matters
	•	How to test it
	3.	Record a 1–2 minute Loom video showing the feature working and paste the link in the PR.

⸻

🔁 3. Weekly Rhythm
	•	Monday: Post a short message (in GitHub Projects or Notion) listing 2–3 key deliverables for the week.
	•	Friday: Post a 3–5 minute Loom walkthrough showing what’s finished, what’s in progress, and what’s next.

That’s it — no meetings or status calls. Commits, PRs, and Looms tell the story.

⸻

👀 4. What Greg Reviews

When reviewing your work, Greg checks for:
	•	Steady daily commits (no large one-time dumps)
	•	Each PR includes a Loom demo
	•	Weekly Loom shows visible output and progress

If those are consistent, you have full autonomy over how you build.

⸻

🧩 5. Example Workflow

# Start a new feature branch
git checkout -b feature/roadmap-ui

# Commit work daily
git add .
git commit -m "Add roadmap UI and table layout"
git push origin feature/roadmap-ui

# When done
# Open a PR in GitHub and include Loom link + summary


⸻

🧭 6. Simple Rules of Thumb
	•	One branch = one task
	•	One PR = one feature
	•	One Loom = proof it works
	•	Push daily
	•	Friday = weekly Loom recap

⸻

This ensures everyone has visibility, accountability, and a clear history of progress — without slowing development down.
