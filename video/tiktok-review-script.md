# TikTok Developer Review Video — SocialQ

**Target:** TikTok Developer portal app review for the **Content Posting API** (and Login Kit) on `socialq.cloud`.
**Format:** 16:9 landscape, 1920×1080, MP4 (H.264), 30 fps, ~75 seconds.
**Audio:** silent + on-screen captions (TikTok review accepts silent video; voiceover is optional).
**Recording tool:** macOS QuickTime *or* Loom. I drive the Chrome browser; you press record.

---

## Pre-flight checklist

Before we hit record, confirm all of the following:

- [ ] Chrome window resized to **1920×1080** (or close). On a 14"/16" MacBook, use Chrome's built-in window controls + this snippet in DevTools to verify: `({w: window.innerWidth, h: window.innerHeight})`
- [ ] Chrome zoom is **100%** (Cmd-0)
- [ ] Dark theme active on `socialq.cloud` (SocialQ should look the same as the screenshots we captured earlier)
- [ ] Logged **OUT** of SocialQ (so we can demo the full login flow). If still logged in, hit `/settings` → Logout from SocialQ → Yes logout.
- [ ] A test SocialQ account ready (email + password remembered)
- [ ] A separate **TikTok test account** logged in to `tiktok.com` in another tab (or be ready to log in mid-recording — but pre-logging is cleaner)
- [ ] **Sample video file ready** at `~/Desktop/socialq-demo.mp4` — a 10–30 second MP4, under 50 MB, with no copyrighted music or sensitive content. A simple plain-color clip or product B-roll is best.
- [ ] Chrome window only — no other apps visible, no notifications. Turn on macOS "Do Not Disturb" (Cmd-F6 or via Control Center).
- [ ] Bookmark bar **hidden** (Cmd-Shift-B if it's showing)
- [ ] Browser extensions hidden — clean toolbar
- [ ] QuickTime ready: **File → New Screen Recording** → set the capture region to the Chrome window (or full screen if recording the whole monitor)

---

## Script (75 seconds, scene-by-scene)

> **Convention:** `[t]` = elapsed seconds. Captions in **bold** appear in the top-center pill (driven by `body.sq-demo` overlay we added in `mobile.css` COMMIT 61.16). I drive the browser via the Chrome MCP tools while you record.

### Scene 1 — Brand intro (0:00 → 0:05)

- **Action:** Browser sits on `https://socialq.cloud/auth` for ~3 seconds, then I scroll down 1 page to show the testimonial panel briefly.
- **Caption:** *"SocialQ — schedule posts across TikTok, Instagram, X & more"*
- **Pacing:** Slow. Let the reviewer see the URL bar (`socialq.cloud`) clearly.

### Scene 2 — Sign in to SocialQ (0:05 → 0:13)

- **Action:** Navigate to `/auth/login`. Type email slowly (~5 chars/sec). Tab to password. Type password. Click *"Sign In"*.
- **Caption:** *"Sign in to SocialQ"*
- **Note:** Postiz/SocialQ uses a regular email+password flow — no email verification step in the demo. After login, the user lands on `/launches` (Calendar view).

### Scene 3 — Land on dashboard (0:13 → 0:18)

- **Action:** Hover the sidebar to highlight nav items, but stay on Calendar view. Move cursor across the app shell.
- **Caption:** *"Your social media dashboard"*
- **Pacing:** Let the dashboard breathe — 4 seconds is enough.

### Scene 4 — Connect TikTok account (0:18 → 0:38)

This is **the most important scene** for review approval. Show the full OAuth handshake.

- **Action (0:18):** Click sidebar → "Integrations" (`/integrations` or `/launches?integrations`)
- **Action (0:20):** Click "**Add channel**" → in the modal, click the **TikTok** tile
- **Action (0:23):** Browser redirects to `https://www.tiktok.com/v2/auth/authorize/?...` — the TikTok consent screen. Wait for it to render (~2 sec).
- **Action (0:27):** On the TikTok screen, the reviewer sees the requested scopes:
  - `user.info.basic`
  - `video.upload`
  - `video.publish`
- **Action (0:30):** Click **"Allow"** / **"Authorize"** on the TikTok screen.
- **Action (0:33):** Redirected back to `socialq.cloud/integrations` — TikTok now appears as a connected channel with the user's TikTok avatar + display name.
- **Caption (entire scene):** *"Connect TikTok via official OAuth"*
- **Note:** **Do not skip the consent screen.** TikTok reviewers want to verify users explicitly authorize the scopes.

### Scene 5 — Compose a post (0:38 → 0:58)

- **Action (0:38):** Click "**New Post**" / the FAB (`+` button in the corner). The composer modal opens.
- **Action (0:41):** Click the **TikTok channel chip** to select it as the destination.
- **Action (0:43):** Click "**Upload media**" → file picker opens → select `~/Desktop/socialq-demo.mp4`. Wait for the upload progress bar (~3 sec on a small file).
- **Action (0:49):** Click the caption textarea. Type slowly: `Testing SocialQ scheduling 🚀 #socialq #scheduler`
- **Action (0:54):** Select the TikTok-specific settings: privacy = **Public** (or whichever the reviewer needs to see), allow comments = on.
- **Caption:** *"Compose & schedule to TikTok"*

### Scene 6 — Publish & confirmation (0:58 → 1:08)

- **Action (0:58):** Click "**Post now**" (or "**Schedule**" with a near-future time if instant posting is rate-limited).
- **Action (1:00):** Toast appears: *"Post scheduled"* / *"Posted successfully"*. The post tile appears on the Calendar view.
- **Action (1:03):** Wait ~3 sec, switch to the TikTok tab (already logged in to the test account), refresh the profile page. The new video appears in the user's profile.
- **Caption (0:58–1:03):** *"Publish to TikTok via the Content Posting API"*
- **Caption (1:03–1:08):** *"Live on TikTok ✓"*

### Scene 7 — Outro (1:08 → 1:15)

- **Action:** Switch back to `socialq.cloud`. Briefly hover sidebar items (Calendar, Analytics, Media) to show that posting is one part of a full scheduling product.
- **Caption:** *"SocialQ — socialq.cloud"*
- **Cut.**

**Total duration:** ~1:15 (75 seconds). If you go over to 1:30, that's fine — TikTok review prefers complete > short.

---

## On-screen captions overlay (optional)

To overlay the captions automatically as I drive the demo, before recording starts I will:

```javascript
document.body.classList.add('sq-demo');
document.body.dataset.sqStep = 'SocialQ — schedule posts across TikTok, Instagram, X & more';
```

Then update `data-sq-step` before each scene. The pill renders via the CSS rule in `mobile.css` 61.16 (`body.sq-demo::before`).

The TikTok consent screen and your TikTok profile tab won't have the overlay — those are on `tiktok.com`. That's fine; the reviewer benefits from seeing the real TikTok pages unmodified.

---

## Voiceover (optional)

If you want a voiceover instead of captions, here's the script (~75 seconds at ~150 words/min):

> *"This is SocialQ, a social media scheduling tool I've built at socialq.cloud. Let me show you how a user connects their TikTok account and publishes a post through the official Content Posting API.*
>
> *I'll sign in to my SocialQ account. From the dashboard, I open the Integrations page and add a new channel. I select TikTok, and SocialQ redirects me to TikTok's OAuth screen. TikTok shows the scopes the app is requesting: basic profile info, video upload, and video publish. I authorize the app.*
>
> *Back in SocialQ, my TikTok account is now connected. I click New Post, select my TikTok channel, upload a video, write a caption with hashtags, and choose Public visibility. I click Post Now. SocialQ uses the Content Posting API to upload and publish the video. Within a few seconds, the post is live on my TikTok profile — verified right here in the browser."*

Hand this script to ElevenLabs / Apple's built-in `say` command / your preferred TTS for a clean voiceover track that you sync in post.

---

## Post-production

After QuickTime saves the `.mov`:

1. Open in QuickTime → **File → Export As → 1080p**. Save as `.mp4`.
2. (Optional) Trim dead air at start/end.
3. (Optional) Add a fade-to-black at the very end (e.g., in iMovie — 2 sec fade).
4. File size target: **< 100 MB** (TikTok Developer portal often caps uploads).

## Upload to TikTok Developer portal

1. Go to `https://developers.tiktok.com/apps/<your-app-id>`
2. Open the app's submission page
3. Scroll to **"Demo video"** or **"App review video"**
4. Upload the MP4
5. In the reviewer notes, link to: `https://socialq.cloud` and mention "Live demo of the OAuth + Content Posting API flow"

---

## Driving sequence (when we record)

When you say **"go"**, I will run this sequence via the Chrome MCP tools. You hit record in QuickTime ~2 seconds before saying go.

| Step | Tool call | Wait after |
|---|---|---|
| 1 | `navigate` → `https://socialq.cloud/auth` | 4s |
| 2 | scroll right column down 400px | 1s |
| 3 | `navigate` → `/auth/login` | 2s |
| 4 | type email at human speed | 1s |
| 5 | Tab → type password | 1s |
| 6 | click "Sign In" | 4s |
| 7 | click sidebar "Integrations" | 2s |
| 8 | click "Add channel" → TikTok tile | 3s |
| 9 | wait for TikTok OAuth page | 3s |
| 10 | (manual) click "Authorize" on TikTok | 4s |
| 11 | back on `/integrations`, click "New Post" FAB | 2s |
| 12 | select TikTok channel chip | 1s |
| 13 | click upload media → pick `socialq-demo.mp4` | 4s |
| 14 | click caption box → type caption | 3s |
| 15 | select privacy: Public | 1s |
| 16 | click "Post now" | 2s |
| 17 | wait for confirmation toast | 3s |
| 18 | switch tab to `tiktok.com/@<testuser>` | 2s |
| 19 | hard-refresh | 3s |
| 20 | back to `socialq.cloud`, hover Calendar | 3s |

Steps marked **(manual)** require you to click — I can't authorize on `tiktok.com` from this session because it's a different origin requiring your real TikTok credentials.

---

## Known caveats

- **TikTok account must be a "test user" or verified user** — TikTok in unaudited mode often refuses to publish or returns "you are not eligible" errors. If you hit that, add your TikTok account as a **test user** in the TikTok Developer portal under the app's "Sandbox" section.
- **Video must meet TikTok constraints**: MP4/MOV, ≤ 60s (for unverified accounts), ≤ 500 MB, no copyrighted audio, vertical aspect ratio strongly preferred (9:16) but landscape works for unverified posting.
- **Rate limits** — TikTok's Content Posting API has strict per-user rate limits. Don't dry-run the publish step more than 2–3 times before the real recording.
- **Redirect URI** — the TikTok app on `socialq.cloud` must have **exactly** `https://socialq.cloud/integrations/social/tiktok` (or whatever Postiz uses) listed as a registered redirect URI in the TikTok Developer portal. If you haven't updated this since the domain switch from `postiz.scenarix.online`, do it before recording.
