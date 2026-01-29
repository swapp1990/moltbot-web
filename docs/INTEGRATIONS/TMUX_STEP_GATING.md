# Tmux Step-Gating for Coding Agents

**Purpose:** Monitor Claude Code / Codex agents in tmux, detect when steps complete or blockers occur, and notify before advancing.

**Philosophy:** Always ask before advancing to the next step. No auto-pilot.

---

## Prerequisites

### macOS

```bash
# Install terminal-notifier (for macOS notifications)
brew install terminal-notifier

# Verify installation
terminal-notifier -title "Test" -message "Notifications work!"
```

### Scripts Location

Scripts are installed at: `~/.moltbot/scripts/`

- `watchdog.sh` - Monitor a pane for completion/blockers
- `send-step.sh` - Safely send a command to a pane
- `status.sh` - Print pane content and detected state

---

## Script Usage

### watchdog.sh

Monitors a tmux pane and sends notifications when:
- **Step Complete:** Shell prompt returns (idle state)
- **Blocker Detected:** Login, password, CAPTCHA, rate limit, etc.

```bash
# Start watchdog for a pane
~/.moltbot/scripts/watchdog.sh <session:window> [interval_seconds]

# Examples:
~/.moltbot/scripts/watchdog.sh claude-lmafy:plan 5
~/.moltbot/scripts/watchdog.sh claude-lmafy:twitter 10

# Run in background
~/.moltbot/scripts/watchdog.sh claude-lmafy:plan &
```

**Detected States:**
| State | Meaning | Notification |
|-------|---------|--------------|
| `idle` | Prompt returned, ready for next step | "Step Complete" (Glass sound) |
| `running` | Command still executing | (no notification) |
| `blocker:*` | Login/auth/CAPTCHA detected | "Blocker Detected" (Basso sound) |

### send-step.sh

Safely sends a command to a tmux pane with safeguards:
- Verifies pane exists
- Warns if pane not at prompt
- Adds delay before Enter (prevents race conditions)

```bash
~/.moltbot/scripts/send-step.sh <session:window> "command text"

# Examples:
~/.moltbot/scripts/send-step.sh claude-lmafy:plan "Run the unit tests"
~/.moltbot/scripts/send-step.sh claude-lmafy:twitter "Post the tweet draft"
```

### status.sh

Prints the current state of a pane for inspection.

```bash
~/.moltbot/scripts/status.sh <session:window> [lines]

# Examples:
~/.moltbot/scripts/status.sh claude-lmafy:plan 60
~/.moltbot/scripts/status.sh claude-lmafy:twitter 40
```

**Output includes:**
- Last N lines of pane content
- Detected state (IDLE / RUNNING / BLOCKER)
- Timestamp and pane info

---

## Workflow: claude-lmafy Windows

### Session Setup

```bash
# Create session with named windows
tmux new-session -d -s claude-lmafy -n plan
tmux new-window -t claude-lmafy -n twitter
tmux new-window -t claude-lmafy -n main

# Attach to session
tmux attach -t claude-lmafy
```

### Running Watchdogs

In separate terminal tabs/panes, run watchdogs for each agent window:

```bash
# Terminal 1: Watch the plan window
~/.moltbot/scripts/watchdog.sh claude-lmafy:plan 5

# Terminal 2: Watch the twitter window
~/.moltbot/scripts/watchdog.sh claude-lmafy:twitter 5
```

Or run both in background:

```bash
~/.moltbot/scripts/watchdog.sh claude-lmafy:plan 5 &
~/.moltbot/scripts/watchdog.sh claude-lmafy:twitter 5 &

# Check running watchdogs
jobs -l

# Stop all watchdogs
pkill -f "watchdog.sh"
```

---

## Approval Flow (Always Ask)

### Principle

**Never auto-advance.** When a step completes:
1. Watchdog sends notification to Swap
2. Swap reviews the output via `status.sh`
3. Swap decides whether to proceed
4. Swap sends next step via `send-step.sh`

### Example Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Claude Code finishes a step                              │
│    └─> Prompt returns to $                                  │
│                                                             │
│ 2. watchdog.sh detects idle state                          │
│    └─> terminal-notifier: "Step Complete - plan"           │
│                                                             │
│ 3. Swap receives notification (macOS/phone)                │
│    └─> Reviews: status.sh claude-lmafy:plan               │
│                                                             │
│ 4. Swap approves next step                                  │
│    └─> send-step.sh claude-lmafy:plan "Next instruction"   │
│                                                             │
│ 5. Repeat                                                   │
└─────────────────────────────────────────────────────────────┘
```

### Blocker Handling

When a blocker is detected:

```bash
# 1. Notification received: "Blocker Detected: login"

# 2. Check what happened
~/.moltbot/scripts/status.sh claude-lmafy:plan

# 3. Manually intervene in tmux
tmux attach -t claude-lmafy:plan
# (handle the login/auth/CAPTCHA manually)
# Detach: Ctrl+b d

# 4. Watchdog will detect when prompt returns
```

---

## Integration with Moltbot (WhatsApp)

### Future: WhatsApp Notifications

The watchdog can be extended to send WhatsApp messages via Moltbot:

```bash
# In watchdog.sh, replace terminal-notifier with:
clawdbot message send --target +13852297404 \
    --message "Step Complete: $PANE ready for next step"
```

### Future: WhatsApp Commands

Moltbot skill to check status and send steps:

```
You: "Status of plan window"
Moltbot: [runs status.sh, returns output]

You: "Send to plan: Run the tests"
Moltbot: [runs send-step.sh]
```

---

## Windows Compatibility

### Approach: WSL2

Windows doesn't have native tmux. Use WSL2:

```powershell
# Install WSL2 (Windows Terminal)
wsl --install -d Ubuntu

# Inside WSL2
sudo apt update
sudo apt install tmux

# Copy scripts to WSL
cp -r ~/.moltbot/scripts ~/
```

### Alternative: Windows Terminal + PowerShell

For Windows-native (no tmux):

```powershell
# Start process and wait
Start-Process -FilePath "claude" -ArgumentList "--task step1" -Wait
# Then start next step
```

Not recommended - loses tmux benefits (persistence, multiplexing).

### Recommended Windows Setup

1. Install WSL2 with Ubuntu
2. Install tmux in WSL2
3. Use same scripts from Mac
4. Use Windows Terminal for WSL2 sessions
5. Notifications via `notify-send` (Linux) or PowerShell toast

---

## Troubleshooting

### "Session not found"

```bash
# List available sessions
tmux list-sessions

# Create if missing
tmux new-session -d -s claude-lmafy -n plan
```

### "Pane not found"

```bash
# List windows in session
tmux list-windows -t claude-lmafy

# Correct format: session:window (not session:window.pane)
~/.moltbot/scripts/status.sh claude-lmafy:plan
```

### Notifications not appearing

```bash
# Test terminal-notifier directly
terminal-notifier -title "Test" -message "Hello"

# Check System Preferences > Notifications > terminal-notifier
# Ensure notifications are enabled

# Check if running in correct terminal (not SSH)
```

### Watchdog using too much CPU

Increase the interval:

```bash
# Default is 5 seconds, try 10
~/.moltbot/scripts/watchdog.sh claude-lmafy:plan 10
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start watchdog | `~/.moltbot/scripts/watchdog.sh claude-lmafy:plan 5 &` |
| Check status | `~/.moltbot/scripts/status.sh claude-lmafy:plan` |
| Send next step | `~/.moltbot/scripts/send-step.sh claude-lmafy:plan "Do X"` |
| Stop watchdogs | `pkill -f watchdog.sh` |
| List sessions | `tmux list-sessions` |
| Attach to window | `tmux attach -t claude-lmafy:plan` |

---

## Version History

| Date | Change |
|------|--------|
| 2026-01-29 | Initial implementation |

---

*Part of the moltbot-web dashboard project.*
