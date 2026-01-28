# Moltbot Life Command Center - Roadmap

## Current State (v0.1.0)
- ✅ Frontend-only dashboard with mock data
- ✅ localStorage persistence
- ✅ Dark mode, responsive design
- ✅ Money Command (debts, income, payoff strategies)
- ✅ Calendar/Events (manual entry)
- ✅ Projects overview
- ✅ Export JSON backup

---

## Phase 1: Data Import & Polish (v0.2.0)
**Target: Feb 2026**

### Features
- [ ] CSV import for debts (Mint, bank exports)
- [ ] CSV import for income/transactions
- [ ] Debt payoff calculator with projections
- [ ] Income trend charts (last 6 months)
- [ ] Dark/light mode toggle
- [ ] Mobile-first improvements

### Technical
- [ ] Add date-fns for date formatting
- [ ] Add recharts for visualizations
- [ ] PWA support (offline, install prompt)

---

## Phase 2: Plaid Integration (v0.3.0)
**Target: Mar 2026**

### Features
- [ ] Connect bank accounts via Plaid Link
- [ ] Auto-sync account balances
- [ ] Transaction categorization
- [ ] Spending insights
- [ ] Bill due date reminders

### Technical
- [ ] Backend: FastAPI + Plaid SDK
- [ ] Secure token storage
- [ ] Webhook handlers for balance updates
- [ ] Rate limiting & error handling

### Security
- [ ] OAuth2 authentication
- [ ] Encrypted token storage
- [ ] Audit logging

---

## Phase 3: Calendar Integration (v0.4.0)
**Target: Apr 2026**

### Google Calendar Integration
1. **Setup OAuth2 App**
   - Create project in Google Cloud Console
   - Enable Calendar API
   - Configure OAuth consent screen
   - Create OAuth2 credentials (Web application)

2. **Backend Implementation**
   - Store refresh tokens securely (encrypted)
   - Implement token refresh logic
   - Create calendar sync endpoints:
     - `GET /api/calendar/events` - fetch events
     - `POST /api/calendar/events` - create event
     - `DELETE /api/calendar/events/:id` - remove event

3. **Frontend Integration**
   - "Connect Google Calendar" button
   - OAuth redirect flow
   - Bi-directional sync toggle
   - Conflict resolution UI

### Apple Calendar (CalDAV)
1. **Setup**
   - Use app-specific password (Apple ID)
   - CalDAV endpoint: `https://caldav.icloud.com`

2. **Implementation**
   - Use `caldav` library for Python
   - Store credentials securely
   - Read/write ICS events

### Moltbot (Clawdbot) Integration
See [Calendar Integration Guide](#clawdbot-calendar-integration) below.

---

## Phase 4: AI Assistant (v0.5.0)
**Target: May 2026**

### Features
- [ ] Chat interface for quick commands
- [ ] "Add $500 to Chase debt"
- [ ] "What's my debt-free date?"
- [ ] "Schedule reminder for rent on the 1st"
- [ ] Natural language event creation

### Technical
- [ ] Integrate with Moltbot backend
- [ ] Command parsing with LLM
- [ ] Action confirmation before execution

---

## Phase 5: Multi-user & Sync (v0.6.0)
**Target: Jun 2026**

### Features
- [ ] User accounts (email/password, OAuth)
- [ ] Cloud sync (replace localStorage)
- [ ] Shared households (partner access)
- [ ] Data export/migration tools

### Technical
- [ ] PostgreSQL for user data
- [ ] JWT authentication
- [ ] End-to-end encryption option

---

## Clawdbot Calendar Integration

### Research Summary

**Question:** How can Clawdbot (AI assistant on droplet) add events to user calendar?

### Recommended Approach: Google Calendar API

**Why Google Calendar:**
- Most widely used
- Well-documented API
- OAuth2 for secure access
- Supports programmatic event creation

**Integration Steps:**

1. **Create Google Cloud Project**
   ```
   - Go to console.cloud.google.com
   - Create new project "Moltbot Calendar"
   - Enable "Google Calendar API"
   ```

2. **Configure OAuth2**
   ```
   - Create OAuth consent screen (External)
   - Add scopes: calendar.events, calendar.readonly
   - Create credentials (OAuth 2.0 Client ID)
   - Add redirect URI: https://moltbot.swapp1990.org/auth/callback
   ```

3. **Backend Implementation (Python)**
   ```python
   from google.oauth2.credentials import Credentials
   from googleapiclient.discovery import build

   def create_event(user_tokens, event_data):
       creds = Credentials.from_authorized_user_info(user_tokens)
       service = build('calendar', 'v3', credentials=creds)

       event = {
           'summary': event_data['title'],
           'start': {'dateTime': event_data['start']},
           'end': {'dateTime': event_data['end']},
       }

       return service.events().insert(
           calendarId='primary',
           body=event
       ).execute()
   ```

4. **User Flow**
   ```
   User: "Add dentist appointment tomorrow at 2pm"
   Moltbot: Parses intent → calls create_event()
   Result: Event created, confirmation shown
   ```

### Alternative: Apple Calendar via CalDAV

**For Apple/iCloud users:**

```python
import caldav

client = caldav.DAVClient(
    url='https://caldav.icloud.com',
    username='user@icloud.com',
    password='app-specific-password'
)

calendar = client.principal().calendars()[0]
calendar.save_event("""
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:Dentist Appointment
DTSTART:20260130T140000
DTEND:20260130T150000
END:VEVENT
END:VCALENDAR
""")
```

**Setup Requirements:**
- User generates app-specific password at appleid.apple.com
- Store password securely (encrypted)

### Security Considerations

1. **Token Storage**
   - Never store access tokens in plaintext
   - Use encrypted database fields
   - Implement token refresh before expiry

2. **Scope Limitation**
   - Request only necessary scopes
   - calendar.events (read/write events)
   - Don't request full calendar management

3. **User Consent**
   - Clear explanation of what access is needed
   - Allow disconnect/revoke at any time
   - Show which calendars are connected

4. **Audit Trail**
   - Log all calendar operations
   - Allow users to see action history
   - Support bulk undo if needed

### Built-in Tool Check

**Does Clawdbot have a built-in calendar tool?**

Based on typical Claude/AI assistant configurations:
- No built-in calendar tool by default
- Requires custom MCP server or API integration
- Can be added via:
  1. MCP server with Google Calendar plugin
  2. Custom tool definition calling calendar API
  3. Webhook to calendar service

**Recommended: Create MCP Server**

```typescript
// mcp-calendar-server/index.ts
import { Server } from '@anthropic/mcp-sdk'

const server = new Server({
  tools: [{
    name: 'create_calendar_event',
    description: 'Create event on user Google Calendar',
    parameters: {
      title: { type: 'string' },
      start: { type: 'string', format: 'date-time' },
      end: { type: 'string', format: 'date-time' },
      description: { type: 'string', optional: true }
    }
  }]
})
```

---

## Technical Debt & Improvements

- [ ] Add unit tests (Vitest)
- [ ] Add E2E tests (Playwright)
- [ ] Set up error boundary
- [ ] Add loading states/skeletons
- [ ] Implement undo/redo
- [ ] Add keyboard shortcuts
- [ ] Accessibility audit (a11y)

---

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit PR with description
4. Wait for review

---

*Last updated: January 29, 2026*
