# Pushing to JIRA

Read at push time. Faktion runs JIRA through the Atlassian Rovo connector.

## Tools

| Need | Tool |
|---|---|
| Cloud ID | `getAccessibleAtlassianResources` |
| List projects | `getVisibleJiraProjects` |
| Find existing tickets | `searchJiraIssuesUsingJql` |
| Create | `createJiraIssue` |
| Update | `editJiraIssue` |

Always pass `contentFormat: "markdown"` on create and update, with the description directly in the `fields` object.

**After pushing, share the JIRA link** so the requester can verify.

## Which project

Every search and every push needs a project key. Resolve it once per conversation, cheapest first, and stop at the first rung that answers:

1. **The requester named it** - a key in their message (`SGS-78`, "the SGS board") gives you the project.
2. **The working directory says so** - a `CLAUDE.md` in the repo naming the JIRA project. This is the common case when the conversation is happening inside a codebase.
3. **Already resolved** - established earlier in this conversation. Do not ask twice.
4. **Ask, informed** - run `getVisibleJiraProjects`. One visible project is the answer. Several, and you ask - listing the plausible ones, not making them recall a key.

Once resolved, it holds for the rest of the conversation.

**Offer to write it down** the first time you have to ask. One line in `CLAUDE.md` retires the question permanently:

```markdown
JIRA project: SGS (Speech Grading Service) on faktion.atlassian.net
```

In a repo, that goes in the repo's `CLAUDE.md`, where it also serves everyone else working there. With no repo, `~/.claude/CLAUDE.md` covers every conversation the requester has.

Cloud ID comes from `getAccessibleAtlassianResources` and is per-site, not per-project - resolve it once alongside the project.

## Project configuration is per-project

Issue types, required fields, and create permissions are admin-configured and vary by project. Query them rather than assuming; when a project has no issue type matching the ticket you wrote, map onto what it does have and say which mapping you used.

## Epics and hierarchies

- **Epic** - when the requester groups tickets, create the epic and link children via the `parent` field.
- **Follow-up** - "and then in the next ticket..." means a new ticket that references the previous one in its description.
- **Batch** - a whole flow described in one go: draft them all, present them together, push them together on approval.

## When the connector is unavailable

Suggest connecting it. If the requester declines, output the tickets as formatted text in the conversation or to a file - the bar applies either way.
