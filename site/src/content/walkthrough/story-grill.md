# Story grill — delete a transcription session

Captured from a run of `grill-ticket` then `write-ticket` on Briefroom. Agent turns are the run; trimmed, not rewritten. Board search did not run (no JIRA in the session). Relations treated as none / lookup failed.

## Request

**Requester:** Create a way to delete a transcription session.

## Grill

**Agent:** Every ticket starts at the grill. Searching the board first for overlap, vocabulary, and anything a ➡️ could cite.

Board search did not run: there is no JIRA connector in this session. I am not inventing neighbouring tickets. Relations stays a question. I have no prior art to source a suggestion from.

"Delete a transcription session" fires the delete smell. Two competent developers would build different things from it, and you would care which shipped.

❓ **Q1** - **Persona**: Who is deleting a transcription session, and what were they doing just before they wanted it gone?

➡️ Could be the person who recorded it, any project member, or an admin. I have nothing to base a preference on.

---

❓ **Q2** - **Trigger**: Where in the product does this start, and what does the user actually click or do?

➡️ Session list, session detail, or somewhere I have not seen. I have nothing to base a preference on.

---

❓ **Q3** - **Delete semantics**: "Delete a transcription session" could mean the row is gone or it is recoverable for a while. A developer has to pick one, and picking wrong is not undoable. Which is it? If it is recoverable: for how long, and who can recover it? When that window ends, does the audio go with the session?

➡️ Could go either way, and I have nothing to base a preference on.

---

❓ **Q4** - **Relations**: I could not search the board. Does this follow from anything already done, or wait on anything?

➡️ Lookup failed. I have no keys to cite.

**Requester:**

- Q1: A consultant who recorded a client workshop. The notes are already in the project.
- Q2: Session detail screen, a delete control.
- Q3: Soft delete. The session disappears from the list. An admin can recover it for 30 days. I don't know whether the audio blob is deleted on day 30.
- Q4: Nothing. Greenfield.

**Agent:** Q3 — whether the audio is deleted on day 30 — is parked. You don't know, so it is not filled in.

Remaining frontier: Boundary, now that this is a single-session soft delete, and Done.

❓ **Q5** - **Boundary**: What is deliberately not in this ticket?

➡️ I have nothing to base a preference on.

---

❓ **Q6** - **Done**: How would you know this works?

➡️ From what you said: the session is gone from the list after delete, and an admin can restore it within 30 days. Confirming that is the bar, or is there more?

**Requester:**

- Q5: Not bulk delete, not deleting the whole project, not GDPR-erasure-as-a-button.
- Q6: Yes. Session gone from the list after delete; admin can restore within 30 days.

## Brief

**Agent:** Every branch is answered or parked. No drafting until you confirm this.

## Brief: Delete a transcription session

**Persona:** A consultant who recorded a client workshop. The notes are already in the project.

**Trigger:** Session detail screen, a delete control.

**Behaviour:** Soft delete. The session disappears from the list. An admin can recover it for 30 days.

**Boundary:** Not bulk delete, not deleting the whole project, not GDPR-erasure-as-a-button.

**Done:** Session gone from the list after delete; admin can restore within 30 days.

**Relations:** None known. Board lookup failed; requester says greenfield.

**Parked:** Whether the audio blob is deleted on day 30.

**Requester:** Yes.

## Ticket

**Agent:** Drafting from the brief. The parked gap stays a named open question. There is no JIRA connector in this session, so this is not going to a board — formatted text only.

---

**As a Consultant I want to delete a transcription session so that it does not stay in the list after the notes are already in the project**

A consultant recorded a client workshop. The notes are already in the project. They want to delete that **transcription session**.

From the **session detail** screen, a **delete** control runs a **soft delete**: the session disappears from the list. An **admin** can restore it for **30 days**.

Not bulk delete, not deleting the whole project, not GDPR-erasure-as-a-button.

Board lookup did not run in this session. The requester knows of nothing this follows from.

**Open question — audio on day 30.** The requester does not know whether the audio is deleted when the 30-day window ends. That is parked here rather than guessed.

---

- [ ] After delete, the session is gone from the list
- [ ] An admin can restore the session within 30 days

**Requester:** Good.
