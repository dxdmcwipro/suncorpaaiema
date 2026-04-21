# Fix Git Push — AEM Code Sync & Connector Configuration

## Root Cause

This environment uses **AEM Code Sync** (via the AEM Code Connector GitHub App) to push code changes to GitHub. The standard `git push` over HTTPS fails because no personal credentials are configured — **by design**. The AEM Code Connector handles pushes through its own mechanism.

The issue is that local `git commit` + `git push` bypasses the AEM Code Sync pipeline. Changes must go through the connector's workflow.

## How AEM Code Sync Works

1. **AEM Code Connector** is a GitHub App installed on the `dxdmcwipro/suncorpaaiema` repo
2. It syncs code between the DA workspace and GitHub automatically
3. When you edit files in `aemcoder.adobe.io`, the connector pushes to GitHub on save
4. When you edit locally in this workspace, the changes are **NOT** automatically synced — they only exist as local git commits
5. The `git push origin main` fails because this environment has no GitHub credentials (the connector doesn't inject tokens into the shell)

## Why "No Code Changes" in AEMCoder

When you opened files in aemcoder but the editor showed "No code changes":
- AEMCoder compares against the **GitHub remote**, not this local workspace
- If you opened a file but didn't modify it in the editor, it correctly shows no changes
- The local commits in this workspace are invisible to aemcoder

## Evidence

| Check | Result |
|---|---|
| Local commits ahead of remote | 1 commit (`3a4ddd5` — header CSS fix) |
| Remote HEAD | `6d4e68b` (your earlier aemcoder push worked) |
| `git push` result | `fatal: could not read Username` — no credentials |
| GitHub credentials | None (no PAT, no SSH, no .netrc, no credential helper) |
| AEM Code Connector | Installed on repo but doesn't inject shell tokens |

## Fix Options

### Option A: Edit via AEMCoder (Correct Workflow)
The proper way to push changes through AEM Code Sync:
1. Open `https://aemcoder.adobe.io/dxdmcwipro/suncorpaaiema`
2. Navigate to the file (e.g. `blocks/header/header.css`)
3. **Actually modify the content** — select all (Ctrl+A), delete, paste new content from this workspace
4. Save (Ctrl+S) — the connector pushes to GitHub automatically
5. The file content must differ from what's on GitHub for the "changes" indicator to appear

### Option B: Edit Directly on GitHub Web
1. Go to `https://github.com/dxdmcwipro/suncorpaaiema/edit/main/blocks/header/header.css`
2. Select all, paste new content
3. Commit — AEM Code Sync picks up the change automatically

### Option C: Configure a PAT for Direct Push (One-Time Setup)
1. Generate a GitHub PAT at `https://github.com/settings/tokens/new` (scope: `repo`)
2. Run: `git remote set-url origin https://<TOKEN>@github.com/dxdmcwipro/suncorpaaiema.git`
3. Run: `git push origin main`
4. All local commits push at once

## Files Pending Push

Only 1 file remains unpushed (your earlier aemcoder saves pushed the other files successfully):

| File | Change | Status |
|---|---|---|
| `blocks/header/header.css` | Shadow gradient, 18px nav font, 20px gap, 24px icons | **Not on GitHub** |

## Checklist

- [x] Diagnose why `git push` fails (no credentials — by design for AEM Code Sync)
- [x] Confirm AEM Code Connector is the intended push mechanism
- [x] Identify that earlier aemcoder pushes DID work (remote moved to `6d4e68b`)
- [x] Identify remaining unpushed file (`blocks/header/header.css`)
- [ ] Push `blocks/header/header.css` via Option A (aemcoder), B (GitHub web), or C (PAT)
- [ ] Verify header renders correctly on preview after push

> **To proceed:** Switch to Execute mode. If using Option C, provide a GitHub PAT. For Options A/B, I'll provide the exact file content to paste.
