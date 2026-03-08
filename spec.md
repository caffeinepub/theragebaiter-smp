# TheRagebaiter SMP

## Current State
- Landing page with hero, about, rules sections
- Application page with 40-question form split into 4 sections
- On submit, form data is sent to a Discord webhook
- No persistent storage of applications
- No admin review interface

## Requested Changes (Diff)

### Add
- Backend: store submitted applications (applicant name, Discord username, all 40 answers, timestamp, status: pending/accepted/declined)
- Backend: endpoints to submit application, list all applications, and update application status (accept/decline)
- Frontend: Admin page (`/admin`) accessible via a secret path (no login required, just hidden)
- Admin page shows all submitted applications in a list; each card shows applicant name, Discord username, submission time, and status badge
- Clicking an application expands it to show all 40 answers organized by section
- Accept and Decline buttons on each application; clicking sends a decision notification to the admin Discord webhook and updates status in backend
- Application submission now saves to backend AND posts to Discord webhook
- New Discord webhook URL for admin review decisions: https://discord.com/api/webhooks/1480320849276833967/mEdzanw_hy-KNAzYspaiTQev2E5iMJHKxfL34wnOueYv6qxCpAjYZFHl_GcV7knF2C9l

### Modify
- App.tsx: add "admin" page type and route logic (typing `#admin` in URL or nav button)
- Form submission: also call backend `submitApplication` to persist data
- Discord webhook for submissions: keep existing webhook, add separate admin webhook for decisions

### Remove
- Nothing removed

## Implementation Plan
1. Generate Motoko backend with: `submitApplication(answers: [(Text, Text)]) -> Nat` (returns ID), `listApplications() -> [Application]`, `updateStatus(id: Nat, status: Text) -> Bool`
2. Update `App.tsx`:
   - Add `Page = "landing" | "apply" | "admin"` type
   - Add admin webhook constant
   - On form submit: call backend `submitApplication` + send Discord message
   - Add `AdminPage` component that fetches all applications, shows them in expandable cards with Accept/Decline buttons
   - Add hidden nav route: URL hash `#admin` triggers admin page
3. Admin page features: list of applicants, expand/collapse each, status badges (Pending/Accepted/Declined), Accept/Decline buttons that call backend + post to admin Discord webhook
