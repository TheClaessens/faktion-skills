---
name: ticket-test-plan
description: Derive a test plan from a JIRA ticket - what to verify, in what order, to prove the Definition of Done is met.
---

# Test plan for a ticket

Turn a ticket into the checks that prove it is done. For a PM signing off work, or a developer deciding what to write tests for.

Read [`ticket-standard`](../ticket-standard/SKILL.md) - the Definition of Done is the spine of the plan, and the scope rule binds here too.

## Get the ticket

From a key, URL, or pasted text. Fetch the full body and comments where it is a key or URL.

## Derive the plan

**The DoD is the plan's skeleton.** Every DoD line becomes at least one check; a DoD line you cannot turn into a check is a finding about the ticket, and you say so rather than inventing a way to verify it.

For each check:

- **What to do** - the steps, in the product, from the user's side.
- **What to expect** - the observable outcome. Concrete enough that two people agree on pass or fail.

Order them so earlier checks set up later ones: a thing has to be created before it can be edited.

## Scope binds here too

**A test plan is a place invented scope hides.** The natural instinct is to add the edge cases a good tester would think of - empty states, permissions, the 10MB file. If the ticket does not cover it, it is not in the plan.

List those instincts separately, under **Not covered by this ticket**, so the PM can decide whether they want a follow-up. That keeps the judgement visible and out of the pass/fail set.

## Report

The ordered checks, then anything the DoD could not produce a check for, then Not covered by this ticket.
