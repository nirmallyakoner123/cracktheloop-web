# Interview Assistant User Flow – Screen-by-Screen Specification

## Purpose

This document explains the full product flow screen by screen. The goal is **not to copy the exact design**, but to define the required screens, components, user actions, states, and navigation logic needed to build a similar onboarding-to-live-session experience.

The flow covers:

1. Dashboard home
2. Resume upload and parsing
3. Resume review/edit
4. Free session creation
5. Session creation confirmation
6. Call sessions list
7. Platform selection
8. Browser connection flow
9. Screen/audio permission flow
10. Live session interface
11. Desktop app connection flow

---

# 1. Dashboard Home Screen

## Screen Goal

Give the user a clear starting point after login and explain the main journey:

1. Add resume
2. Try free session
3. Buy credits or upgrade
4. Start real interview/session

## Required Layout

### Main Structure

- Left sidebar navigation
- Top header
- Main content area
- Plan/upgrade card in sidebar
- Tutorial section below the primary flow

## Required Components

### Sidebar

- Logo
- Navigation items:
  - Home
  - Call Sessions
  - CVs / Resumes
  - Documents
- Secondary links:
  - Get Help
  - Video Tutorials
  - Download Desktop App
- Plan card:
  - Current plan name, for example: `Free Plan`
  - Short plan description
  - Upgrade button
- User email/account indicator at the bottom

### Header

- Page title: `Home`
- CTA button: `Start Free Session (10 left)`
- CTA button: `Start Session`

### Main Welcome Section

- Greeting text:
  - Example: `Hi, [User Name]`
- Horizontal step cards:
  - Optional Resume
  - Step 1: Free Session
  - Step 2: Buy Credits
  - Step 3: Real Interview

### Step Card Components

Each card should have:

- Step title
- Short explanation
- Action button
- Optional icon
- Arrow/connector between cards

### Tutorial Section

- Section heading:
  - `In-depth Tutorial`
- Embedded video card or video thumbnail
- Play button
- Video title/description

## User Actions

| Action | Result |
|---|---|
| Click `Upload Resume` | Opens resume upload modal or navigates to CVs / Resumes |
| Click `Try for Free` | Opens free session creation flow |
| Click `Purchase` | Opens pricing/credits/payment page |
| Click `Start` | Opens session creation flow |
| Click tutorial | Opens tutorial video |

## States Needed

- Free session count available
- Free session exhausted
- Resume already uploaded
- No resume uploaded
- Plan active / free / paid
- Loading dashboard
- Failed to load dashboard data

---

# 2. CVs / Resumes Empty State Screen

## Screen Goal

Show the user that no resume exists yet and guide them to upload one.

## Required Layout

- Same app shell:
  - Sidebar
  - Header
  - Main content area

## Required Components

### Header

- Page title: `CVs / Resumes`
- Primary action button: `Upload Resume`

### Empty State

Centered content with:

- Resume/document icon
- Empty state title:
  - `You haven't uploaded any resumes yet`
- Helper text:
  - `Your resumes will give us context about your career`
- CTA button:
  - `Upload Resume`

## User Actions

| Action | Result |
|---|---|
| Click top `Upload Resume` | Opens upload method modal |
| Click empty state `Upload Resume` | Opens upload method modal |

## States Needed

- No resume available
- Loading resume list
- Failed to load resumes
- Resume list available

---

# 3. Upload Resume Method Modal

## Screen Goal

Allow the user to choose how they want to provide resume data.

## Required Components

### Modal Header

- Title: `Upload Resume`
- Close button

### Helper Text

- Explanation:
  - `The contents of the resume will be used to generate interview answers.`

### Method Buttons

- `Upload PDF Resume`
- `Input Manually`

## User Actions

| Action | Result |
|---|---|
| Click `Upload PDF Resume` | Opens PDF upload step inside modal |
| Click `Input Manually` | Opens manual resume form/editor |
| Click close | Closes modal |
| Click outside modal | Optional: close modal or prevent accidental close |

## States Needed

- Default method selection
- Modal open/closed
- Manual input selected
- PDF upload selected

---

# 4. PDF Resume Upload Modal

## Screen Goal

Let the user upload a PDF resume and provide a title before parsing.

## Required Components

### Modal Header

- Title: `Upload Resume`
- Close button

### Instruction Text

- `The contents of the resume will be used to generate interview answers.`

### Upload Area

- Drag-and-drop zone
- Upload icon
- Instruction:
  - `Drop your PDF resume here or click to browse.`
- Button:
  - `Upload Files`

### Title Input

- Label: `Title`
- Default value:
  - `My Resume`
- User should be able to rename it before upload

### Footer Actions

- `Back`
- `Upload Resume`

## User Actions

| Action | Result |
|---|---|
| Drag PDF into upload area | File gets selected |
| Click `Upload Files` | Opens file picker |
| Edit title | Updates resume title |
| Click `Back` | Returns to method selection modal |
| Click `Upload Resume` without file | Show validation error |
| Click `Upload Resume` with file | Starts upload/parsing state |

## Validation Rules

- Only PDF allowed
- File is required
- Title is required
- Optional file size limit, for example 5 MB or 10 MB
- Show error if parsing service fails

## States Needed

- Initial upload state
- File selected
- Invalid file type
- File too large
- Missing title
- Uploading
- Parsing
- Upload failed
- Parsing failed

---

# 5. Selected Resume File Modal

## Screen Goal

Confirm the uploaded file before parsing.

## Required Components

- Uploaded file name display
- Delete/remove file button
- Title input prefilled with file name or user-defined title
- `Back` button
- `Upload Resume` button

## User Actions

| Action | Result |
|---|---|
| Click delete icon | Removes selected file and returns to upload dropzone |
| Edit title | Updates title |
| Click `Back` | Returns to PDF upload screen |
| Click `Upload Resume` | Starts parsing |

## States Needed

- File ready
- Title edited
- File removed
- Upload started

---

# 6. Resume Parsing State Modal

## Screen Goal

Inform the user that the resume is being processed and prevent duplicate submissions.

## Required Components

- Same modal layout
- File name
- Disabled title input
- Disabled `Back` button
- Disabled/loader button:
  - `Parsing...`
- Warning message:
  - `Warning: Parsing may take up to 1 minute. Stay on this page.`

## User Actions

| Action | Result |
|---|---|
| Wait until parsing completes | Navigate to resume editor |
| Close modal during parsing | Prefer blocking close or show confirmation |
| Parsing fails | Show error and allow retry |

## States Needed

- Parsing in progress
- Parsing success
- Parsing failed
- Retry parsing
- Cancel parsing, if supported

---

# 7. Resume Review / Edit Screen

## Screen Goal

Show the parsed resume data and allow the user to correct it before using it as interview context.

## Required Layout

- App shell with sidebar
- Top header with back button
- Auto-save status
- Delete resume button
- Main editor card
- Optional tab switch:
  - Edit
  - Original PDF

## Required Components

### Header

- Back button
- Auto-save status:
  - `Auto Saved`
  - `Saving...`
  - `Unsaved changes`
  - `Save failed`
- Delete button

### Tabs

- `Edit`
- `Original PDF`

### Resume Title Section

- Title input

### Personal Details Section

Fields:

- Name
- Email
- Phone
- Address

### Introduction Section

- Multi-line text area for summary/introduction

### Education Section

- List of education entries
- `Add Education` button
- Delete entry action

Suggested fields per education entry:

- School / College
- Degree
- Field of study
- Start date
- End date
- Description

### Job Experience Section

- List of job entries
- `Add Job` button
- Delete job action

Suggested fields per job entry:

- Company
- Position
- Time Period
- Location
- Description

### Other Experience Section

- List of other experiences/projects/certifications
- `Add Other` button
- Delete item action

Suggested fields:

- Title
- Description

### Original PDF Tab

Should display:

- PDF viewer
- Zoom controls
- Page controls
- Download/open option, if required

## User Actions

| Action | Result |
|---|---|
| Edit fields | Triggers auto-save |
| Add education/job/other | Adds new editable block |
| Delete section item | Removes item after confirmation |
| Switch to Original PDF | Shows uploaded PDF preview |
| Click back | Returns to CVs / Resumes |
| Click delete resume | Opens delete confirmation |

## States Needed

- Parsed data loaded
- Auto-saving
- Auto-save success
- Auto-save failed
- Validation error
- Resume delete confirmation
- Resume deleted
- PDF preview loading
- PDF preview failed

---

# 8. Free Session Creation Modal

## Screen Goal

Let the user configure a 10-minute free session.

## Required Components

### Modal Header

- Title: `Free Session (10 min)`
- Close button

### Session Type Selector

Segmented control:

- Interview
- Regular Call

### Company Field

- Label: `Company`
- Input placeholder:
  - `Microsoft...`
- Optional helper action:
  - `Fill fields from Job Post`

### Job Description Field

- Label: `Job Description`
- Text area placeholder:
  - `Software Engineer versed in Python, SQL, and AWS...`

### Output Settings

- AI model dropdown
  - Example: `GPT-5.5 Mini`
- Language dropdown
  - Example: `English`

### Context Section

- Resume/context dropdown
  - Selected resume name
- `Add Documents`
- `Add Extra Context`

### Behavior Section

Checkboxes:

- `Auto Generate (Beta)`
- `Save Transcript`

### Footer Actions

- `Close`
- `Next`

## User Actions

| Action | Result |
|---|---|
| Select session type | Updates form mode |
| Enter company | Saves company input |
| Enter job description | Saves job context |
| Select model | Updates AI model |
| Select language | Updates response language |
| Select resume | Attaches resume context |
| Add documents | Opens document picker/upload |
| Add extra context | Opens extra context input modal |
| Click `Next` | Validates form and goes to confirmation |
| Click `Close` | Closes modal |

## Validation Rules

- Company required for interview mode
- Job description required for interview mode
- Model required
- Language required
- Resume/context optional, but recommended
- Disable `Next` until required fields are completed

## States Needed

- Form empty
- Form partially filled
- Required field missing
- Valid form
- Loading job post autofill
- Job post autofill failed
- Documents attached
- Extra context attached

---

# 9. Free Session Form Validation State

## Screen Goal

Show clear validation when required fields are not completed.

## Required Components

- Required field indication
- Inline validation message
- Disabled `Next` button
- Tooltip or small message:
  - `Please fill out this field.`

## User Actions

| Action | Result |
|---|---|
| Try to proceed without required fields | Validation appears |
| Fill required fields | Validation clears and `Next` becomes active |

## States Needed

- Missing company
- Missing job description
- Missing model
- Missing language
- Form valid

---

# 10. Ready to Create Confirmation Modal

## Screen Goal

Confirm the limitations and conditions of the free session before creating it.

## Required Components

### Modal Header

- Title: `Ready to Create`
- Close button

### Confirmation Text

Include:

- This is a 10-minute free session.
- Timer will not start until screen sharing is connected.
- User cannot create another free session for the next 12 minutes.

### Footer Actions

- `Back`
- `Create Free Session`

## User Actions

| Action | Result |
|---|---|
| Click `Back` | Returns to free session form |
| Click `Create Free Session` | Creates session and navigates to call sessions list or platform selection |
| Click close | Closes confirmation |

## States Needed

- Creating session
- Session created
- Session creation failed
- Free session cooldown active
- Free session limit reached

---

# 11. Call Sessions List Screen

## Screen Goal

Show all user-created call sessions and allow the user to open, edit, delete, or connect.

## Required Components

### Header

- Page title: `Call Sessions`
- Button: `Start Free Session (10 left)`
- Button: `Start Session`

### Table

Columns:

- Title
- Description
- Mode
- Ends In / Status
- AI Usage
- Created At
- Actions

### Row Actions

- Open/connect session
- Edit session
- Delete session
- More menu

### Empty State

If no sessions exist:

- Message:
  - `No call sessions created.`
- Button:
  - `Start Session` or `Start Free Session`

### Pagination

- Page number
- Showing count
- Previous / Next buttons

## User Actions

| Action | Result |
|---|---|
| Click `Start Free Session` | Opens free session creation modal |
| Click `Start Session` | Opens paid/normal session creation modal |
| Click row open/connect | Opens platform selection |
| Click edit | Opens session edit modal/page |
| Click delete | Opens delete confirmation |
| Click pagination | Loads next/previous page |

## States Needed

- Loading sessions
- Session list loaded
- Empty session list
- Session deleted
- Delete failed
- Pagination loading
- Session not activated
- Active session
- Expired session

---

# 12. Choose Platform Modal

## Screen Goal

Let the user decide whether to connect using the desktop app or browser.

## Required Components

### Modal Header

- Title: `Choose Platform`
- Close button

### Helper Text

- `How would you like to connect to your call session?`

### Primary Option

- Button:
  - `Desktop App`
- Recommended badge:
  - `Recommended`

### Secondary Option

- Link/button:
  - `Open in Browser`

### Help Link

- `Browser vs Desktop App`

## User Actions

| Action | Result |
|---|---|
| Click `Desktop App` | Opens desktop app deep-link flow |
| Click `Open in Browser` | Opens browser connection screen/modal |
| Click `Browser vs Desktop App` | Opens comparison/tutorial |
| Click close | Closes modal |

## States Needed

- Desktop app selected
- Browser selected
- Deep link failed
- Desktop app not installed
- Browser supported
- Browser unsupported

---

# 13. Browser Connect Modal

## Screen Goal

Prepare the user to connect microphone, screen/tab audio, and AI model/language settings before starting the browser session.

## Required Components

### Modal Header

- Title: `Connect`
- Close button

### Session Summary

Show:

- Session type
- Position/title
- Company
- Mention that resume and extra context will be used

### Language Dropdown

- Selected language
- Language list

### AI Model Dropdown

- Selected model
- Recommended badge if applicable

### Instruction Alert

Message:

- `Make sure to select the "Also share tab audio" option when sharing the screen.`

### Platform Help Icons

Icons/links for:

- Zoom
- Google Meet
- Microsoft Teams
- Webex
- Phone/other call option
- Video tutorial

### Mock Interview Help Card

- Video thumbnail
- Short help text
- Example video link

### Footer Actions

- `Back`
- `Activate and Connect`

## User Actions

| Action | Result |
|---|---|
| Change language | Updates session language |
| Change AI model | Updates model |
| Click video tutorial | Opens tutorial |
| Click `Back` | Returns to platform modal |
| Click `Activate and Connect` | Requests microphone and screen sharing permissions |

## States Needed

- Modal loaded
- Language changed
- Model changed
- Activation loading
- Activation failed
- Browser permission prompt opened

---

# 14. Browser Permission + Screen Share Flow

## Screen Goal

Collect browser-level microphone and screen/tab audio permissions.

## Required Browser Prompts

### Microphone Permission

The browser asks for microphone access.

Required user choices:

- Allow while visiting the site
- Allow this time
- Never allow

### Screen Sharing Picker

The browser asks what to share.

Required options:

- Chrome Tab
- Window
- Entire Screen, if supported

Important instruction:

- User should select the meeting/call tab
- User should enable `Also share tab audio`

## User Actions

| Action | Result |
|---|---|
| Allow microphone | Microphone stream is available |
| Deny microphone | Show permission error and retry instructions |
| Select tab/window | Screen stream is available |
| Enable tab audio | Audio can be captured from shared tab |
| Click Share | Activates session |
| Click Cancel | Return to connect modal with error/help message |

## States Needed

- Waiting for microphone permission
- Microphone allowed
- Microphone denied
- Waiting for screen share
- Screen share started
- Screen share cancelled
- Tab audio enabled
- Tab audio missing
- Unsupported browser

---

# 15. Live Browser Session Screen

## Screen Goal

Provide the active interview/call assistance workspace after the user connects.

## Required Layout

Two-panel layout:

### Left Panel

Used for connection/capture/transcript information.

Components:

- Shared screen preview
- Fullscreen button
- Change tab button
- Connect/Stop button
- Clear button
- Language selector
- Transcript/chat messages from captured conversation
- Microphone status
- Recording/listening indicator

### Right Panel

Used for AI responses.

Components:

- Header with logo
- Timer:
  - Example: `9 mins (Free)`
- Reset/reconnect menu
- Exit button
- Empty state:
  - `No messages yet.`
  - `Click "AI Answer" to start!`
- AI answer area
- Manual message input
- Send button
- AI Answer button
- Screenshot button
- Collapsible side/panel handle if needed

## User Actions

| Action | Result |
|---|---|
| Click `AI Answer` | Generates answer based on current transcript/context |
| Type manual message | Sends manual prompt/context |
| Click `Send` | Sends manual message |
| Click `Screenshot` | Captures visible/shared screen context |
| Click `Stop` | Stops capture/listening |
| Click `Clear` | Clears transcript/messages |
| Change language | Updates output language |
| Click `Change Tab` | Reopens screen share picker |
| Click `Exit` | Ends/leaves session after confirmation |
| Timer ends | Free session stops or prompts upgrade |

## States Needed

- Connected
- Not connected
- Listening
- Muted
- Capturing screen
- Screen share stopped
- Transcript incoming
- AI answer loading
- AI answer generated
- AI answer failed
- Manual message sending
- Screenshot processing
- Session ending
- Session ended
- Timer expired
- Upgrade prompt

---

# 16. Desktop App Launch Page

## Screen Goal

Guide the user to open the native desktop application through a browser deep link.

## Required Components

### Centered Page Layout

- Logo
- Information alert:
  - Ensure latest OS and video calling software versions
  - Link to video tutorial

### Compatibility Success Alert

Message showing supported platforms/services, for example:

- Microsoft Teams
- Google Meet
- Webex
- Amazon Chime
- HackerRank
- CodeSignal
- CoderPad
- Browser-based video calling services

### Zoom-Specific Warning Alert

Message:

- If using Zoom, update to the latest version and enable the required advanced capture/window filtering setting.

### Main Instruction

- Tell the user to click `Open [App Name]` in the browser dialog.
- If the dialog does not appear, click `Open in Desktop App`.

### Primary CTA

- `Open in Desktop App`

### Download Option

- Text:
  - `Don't have the desktop app?`
- Dropdown/button:
  - `Download Desktop App`

### Back Link

- `Back`

## User Actions

| Action | Result |
|---|---|
| Browser shows deep-link dialog | User can open desktop app |
| Click `Open in Desktop App` | Triggers custom protocol/deep link |
| Click download | Shows OS-specific app download options |
| Click back | Returns to call sessions/platform selection |

## States Needed

- Deep link triggered
- Browser blocked deep link
- Desktop app opened
- Desktop app not installed
- Download menu opened
- OS detected
- Unsupported OS
- Back navigation

---

# 17. Desktop App Deep-Link Browser Dialog

## Screen Goal

Let the browser confirm whether the user wants to open the installed desktop application.

## Required Components

This is a browser-native prompt, not an app-designed modal.

Browser dialog usually contains:

- App protocol name
- Website origin
- Checkbox:
  - `Always allow this site to open links of this type in the associated app`
- Primary button:
  - `Open [App Name]`
- Secondary button:
  - `Cancel`

## User Actions

| Action | Result |
|---|---|
| Click `Open [App Name]` | Desktop app opens with session details |
| Click `Cancel` | Stay on desktop launch page |
| Check always allow | Future desktop openings become smoother |

## States Needed

- Dialog shown
- User accepted
- User cancelled
- Protocol handler missing

---

# 18. Recommended Final Flow Order

## Main User Journey

1. User lands on Dashboard Home
2. User goes to CVs / Resumes
3. User sees empty state
4. User clicks Upload Resume
5. User chooses Upload PDF Resume
6. User uploads PDF and adds title
7. System parses resume
8. User reviews/edits parsed resume
9. User goes to Call Sessions or clicks Start Free Session
10. User fills free session form
11. User confirms session creation
12. Session appears in Call Sessions list
13. User opens/connects session
14. User chooses Desktop App or Browser
15. If Browser:
    - User configures language/model
    - User grants microphone permission
    - User shares meeting tab/window with audio
    - User enters live session screen
16. If Desktop:
    - User lands on desktop launch page
    - Browser opens desktop app deep-link dialog
    - User opens installed app or downloads app

---

# 19. Core Data Needed Across the Flow

## User Data

- User name
- User email
- Current plan
- Free session count
- Free session cooldown status
- Credit balance
- Subscription status

## Resume Data

- Resume ID
- Resume title
- Original file URL
- Parsed personal details
- Parsed introduction
- Parsed education
- Parsed job experience
- Parsed other experience
- Parse status
- Last saved timestamp

## Session Data

- Session ID
- Session title
- Description
- Company
- Job description
- Session type
- AI model
- Language
- Attached resume IDs
- Attached document IDs
- Extra context
- Save transcript enabled
- Auto-generate enabled
- Free/paid status
- Timer duration
- Created date
- Activation status
- AI usage count
- Expiration status

## Live Session Data

- Transcript messages
- Manual messages
- AI answers
- Screenshots
- Microphone permission status
- Screen sharing status
- Shared tab/window metadata
- Timer state
- Session ended status

---

# 20. Key Component List

## Global Components

- AppShell
- Sidebar
- Header
- PrimaryButton
- SecondaryButton
- Modal
- ConfirmationModal
- Dropdown
- SegmentedControl
- TextInput
- TextArea
- Checkbox
- Badge
- Alert
- EmptyState
- Table
- Pagination
- Toast
- Loader
- Tooltip

## Resume Components

- ResumeEmptyState
- UploadResumeMethodModal
- ResumePDFUploadModal
- ResumeFileSelectedState
- ResumeParsingState
- ResumeEditorPage
- ResumeSectionCard
- ResumeJobExperienceBlock
- ResumeEducationBlock
- ResumeOtherExperienceBlock
- OriginalPDFViewer

## Session Components

- FreeSessionModal
- SessionTypeSelector
- OutputSettings
- ContextSelector
- ExtraContextModal
- ReadyToCreateModal
- CallSessionsTable
- SessionRowActions
- ChoosePlatformModal

## Connection Components

- BrowserConnectModal
- PermissionHelpAlert
- PlatformHelpLinks
- MockInterviewHelpCard
- DesktopLaunchPage
- DesktopDownloadDropdown
- LiveSessionPage
- SharedScreenPreview
- TranscriptPanel
- AIAnswerPanel
- TimerBadge
- ManualMessageInput
- ScreenshotButton

---

# 21. Important UX Rules

## Resume Flow

- Keep the resume upload flow short.
- Let users correct parsed resume content before using it.
- Show clear parsing status.
- Do not allow duplicate upload clicks while parsing.
- Auto-save resume edits and clearly show save status.

## Session Creation Flow

- Keep free session setup minimal.
- Required fields should be clear.
- Show why resume/context helps.
- Do not start the timer before the user connects.
- Clearly explain free session limits and cooldowns.

## Connection Flow

- Explain microphone and screen sharing before browser permission prompts appear.
- Tell users to share the correct tab/window.
- Remind users to enable tab audio when required.
- Provide a fallback from browser to desktop app.
- Provide a fallback from desktop app to download app.

## Live Session Flow

- Keep the AI Answer CTA very visible.
- Show connection and timer status clearly.
- Make exit/end session obvious.
- Keep transcript and AI answer areas separated.
- Show errors in plain language with retry actions.

---

# 22. Suggested Route Structure

```text
/dashboard
/dashboard/resumes
/dashboard/resumes/:resumeId
/dashboard/documents
/dashboard/callSessions
/callSession/:sessionId
/callSession/:sessionId/desktop
/pricing
/help
/tutorials
```

---

# 23. Suggested Modal Flow Map

```text
Dashboard Home
  ├── Upload Resume
  │     └── Upload Method Modal
  │           ├── Upload PDF Resume
  │           │     ├── PDF Upload State
  │           │     ├── File Selected State
  │           │     ├── Parsing State
  │           │     └── Resume Editor Page
  │           └── Input Manually
  │                 └── Resume Editor Page
  │
  └── Start Free Session
        └── Free Session Modal
              ├── Validation State
              └── Ready to Create Modal
                    └── Call Sessions List
                          └── Choose Platform Modal
                                ├── Browser Connect Modal
                                │     └── Browser Permissions
                                │           └── Live Session Page
                                └── Desktop Launch Page
                                      └── Desktop App Deep-Link Dialog
```

---

# 24. Implementation Notes

## Frontend

Recommended structure:

```text
components/
  layout/
  sidebar/
  modals/
  resume/
  sessions/
  live-session/
  shared/

pages or app routes/
  dashboard/
  dashboard/resumes/
  dashboard/resumes/[resumeId]/
  dashboard/callSessions/
  callSession/[sessionId]/
  callSession/[sessionId]/desktop/
```

## State Management

Use local component state for simple modals, but use global/query state for:

- User profile and plan
- Resume list
- Session list
- Active session
- Live transcript
- Permission states

## API Calls Needed

```text
GET    /api/user/me
GET    /api/resumes
POST   /api/resumes/upload
GET    /api/resumes/:id
PATCH  /api/resumes/:id
DELETE /api/resumes/:id

GET    /api/sessions
POST   /api/sessions/free
POST   /api/sessions
GET    /api/sessions/:id
PATCH  /api/sessions/:id
DELETE /api/sessions/:id

POST   /api/sessions/:id/activate
POST   /api/sessions/:id/messages
POST   /api/sessions/:id/ai-answer
POST   /api/sessions/:id/screenshot
POST   /api/sessions/:id/end
```

---

# 25. Minimum Version to Build First

For the first implementation, build only this core flow:

1. Dashboard home
2. Resume empty state
3. Upload PDF resume modal
4. Parsing state
5. Resume editor
6. Free session modal
7. Ready to create confirmation
8. Call sessions list
9. Choose platform modal
10. Browser connect modal
11. Live session page

Desktop app flow can be added after the browser flow is stable.
