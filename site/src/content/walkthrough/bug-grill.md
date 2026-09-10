# Bug grill — deleted session reappears after refresh

Captured from a run of `grill-ticket` then `write-bug` on Briefroom. Agent turns are the run; trimmed, not rewritten. Board search did not run (no JIRA in the session). No persona. No root cause.

## Request

**Requester:** Deleted session still appears after refresh.

## Grill

**Agent:** This is something broken, so it is a bug: no persona, and I am not guessing why it breaks. Searching the board first.

Board search did not run: there is no JIRA connector in this session. I am not inventing neighbouring tickets. Relations stays a question.

Trigger here is the reproduction path. Behaviour is expected versus actual.

❓ **Q1** - **Reproduction**: What is the numbered path? Where do you delete, what do you click, and what do you refresh?

➡️ I have nothing to base a preference on.

---

❓ **Q2** - **Expected versus actual**: You said the session is still there after refresh. What should have happened?

➡️ From the report: it should stay gone. Confirming that is the gap, or is something else also wrong?

---

❓ **Q3** - **Impact**: Who is affected, and how often, if you know?

➡️ I have nothing to base a preference on.

---

❓ **Q4** - **Relations**: I could not search the board. Does this follow from anything already filed, or is it just this?

➡️ Lookup failed. I have no keys to cite.

**Requester:**

- Q1: Open a session from the list. On session detail, use the delete control. The session is gone from the list. Refresh. The session is in the list again.
- Q2: It should stay gone after refresh. That is the whole gap.
- Q3: I can get it every time on this project.
- Q4: Nothing. Greenfield.

**Agent:** Every branch is answered or parked. I do not know why it breaks, and the report did not say, so the ticket will not say either.

## Brief: Deleted session reappears after refresh

**Persona:** None — bug.

**Trigger / reproduction:** Open a session from the list → session detail → delete control → session gone from the list → refresh → session is in the list again.

**Behaviour:** Expected: stays gone after refresh. Actual: reappears in the list after refresh.

**Boundary:** That is the whole gap.

**Done:** The reproduction path no longer reproduces.

**Relations:** None known. Board lookup failed; requester says greenfield.

**Parked:** None. Cause unknown; not filled in.

**Requester:** Yes.

## Ticket

**Agent:** Drafting from the brief. There is no JIRA connector in this session, so this is not going to a board — formatted text only.

---

**Deleted session reappears in the list after refresh**

**What happens.** After a session is deleted and has disappeared from the list, a refresh puts it back in the list.

**What should happen.** It should stay gone after refresh.

**Reproduction.**

1. Open a session from the list.
2. On **session detail**, use the **delete** control.
3. The session is gone from the list.
4. Refresh.
5. The session is in the list again.

Reproducible every time on this project. No environment or account details given.

Board lookup did not run in this session. The requester knows of nothing this follows from.

---

- [ ] The reproduction path above no longer reproduces: after delete, the session stays gone from the list across a refresh
