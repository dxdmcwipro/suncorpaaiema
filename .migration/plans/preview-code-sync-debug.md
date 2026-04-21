# Debug: Code Changes Not Appearing in Preview

## Root Cause Found

**Local commits exist but cannot be pushed to GitHub.** This environment has no git credentials configured.

| Item | Value |
|---|---|
| **Local HEAD** | `e623652` (4 unpushed commits) |
| **Remote HEAD** | `d85bacf` (what GitHub/preview currently has) |
| **Commits ahead** | 4 commits stuck locally |
| **Git auth** | No credentials, no SSH keys, no `.gitconfig` with tokens |
| **Push result** | `fatal: could not read Username for 'https://github.com'` |

## Why Preview Doesn't Reflect Changes

The AEM Code Sync only deploys code from the **GitHub remote** (`origin/main`). All our changes are committed locally in this workspace but have never reached GitHub because:

1. The git remote uses HTTPS (`https://github.com/dxdmcwipro/suncorpaaiema.git`)
2. No GitHub credentials (no token, no SSH key, no credential helper) exist in this environment
3. Every `git push` fails with authentication error

The preview at `https://main--suncorpaaiema--dxdmcwipro.aem.page/` still runs the **old code** from the last successful push.

## Unpushed Changes (4 commits)

| # | File | Change |
|---|---|---|
| 1 | `blocks/hero/hero.js` | Handle bare `<img>` (DA strips `<picture>`) |
| 2 | `blocks/hero/hero.css` | Card-overlay grid layout + fallback bg color |
| 3 | `images/hero-prepare.webp` | 44KB optimized hero image |
| 4 | `blocks/columns/columns.css` | Yellow border cards matching reference |
| 5 | `blocks/accordion/accordion.css` | Blue heading, yellow left bar, chevron style |

## Fix Options

### Option A: Use aemcoder.adobe.io (Recommended)
1. Open `https://aemcoder.adobe.io/dxdmcwipro/suncorpaaiema`
2. Edit each of the 4 CSS/JS files listed above — paste the updated contents (provided in previous messages)
3. Save each file (Ctrl+S) — aemcoder commits directly to GitHub
4. For the hero image: upload `images/hero-prepare.webp` via GitHub "Add file" UI

### Option B: Configure git credentials in this environment
1. Generate a GitHub Personal Access Token (PAT) with `repo` scope
2. Run: `git remote set-url origin https://<TOKEN>@github.com/dxdmcwipro/suncorpaaiema.git`
3. Run: `git push origin main`
4. All 4 commits push at once

### Option C: Clone to a local machine that has GitHub access
1. `git clone https://github.com/dxdmcwipro/suncorpaaiema.git`
2. Apply the changes manually (file contents provided above)
3. `git push origin main`

## Checklist

- [x] Identify root cause (no git credentials = can't push)
- [x] Confirm local commits exist (4 ahead of remote)
- [x] Confirm remote is stale (preview shows old code)
- [x] Provide file contents for manual update
- [ ] Push code to GitHub via one of the options above
- [ ] Verify AEM Code Sync picks up changes (check `gh pr checks` or preview URL)
- [ ] Confirm accordion, columns, and hero render correctly on preview

> **To proceed:** Choose Option A (aemcoder), B (PAT token), or C (local clone). Option A requires no setup — just paste and save in the browser editor. Execution requires switching to Execute mode if Option B is chosen.
