# HRMS Portal - System Architecture & Flow

## System Overview

### Architecture Diagram
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    HRMS Portal System                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │    Admin     │  │  Recruiter   │  │  Employee    │       │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│         │                 │                  │               │
│         └─────────────────┴──────────────────┘               │
│                      │                                       │
│                Authentication Layer (JWT)                    │
│                      │                                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │           API Gateway & Route Handlers             │    │
│  │  - Auth (Login, Check Auth, Logout)               │    │
│  │  - User Management (Create, Update, Suspend)      │    │
│  │  - Leave Management (Apply, Approve, Reject)      │    │
│  │  - Job Management (Create, Post, View)            │    │
│  │  - Interview (Schedule, Track, Update)            │    │
│  │  - Offer (Generate, Send, Track)                  │    │
│  │  - Salary (Generate Slip, View History)           │    │
│  │  - Attendance (Check-in/out, View Records)        │    │
│  │  - Rewards (Generate, Approve, View Balance)      │    │
│  │  - Exit (Submit Form, Process, Generate Docs)     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
│              Database Layer (Role-Based)                     │
│                      │                                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │          Data Models (TypeScript Types)            │    │
│  │  - Users (Admin, Recruiter, Employee, Candidate)  │    │
│  │  - Leaves                                          │    │
│  │  - Jobs & Job Responses                           │    │
│  │  - Interviews                                      │    │
│  │  - Offers                                          │    │
│  │  - Salary & Slips                                 │    │
│  │  - Attendance Records                             │    │
│  │  - Rewards & Referrals                            │    │
│  │  - Exit Forms                                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## Role-Based Access Control (RBAC)

### Admin Role
**Responsibilities:**
- Manage recruiters (create, approve, suspend, remove)
- Manage employees (create, update, suspend, remove)
- Approve/reject leaves
- Manage job postings and interview pipeline
- Generate offers and manage offer process
- Manage salary and generate salary slips
- View and manage rewards
- Approve exit forms and generate exit documents

**Dashboard KPIs:**
- Total employees count
- Number of recruiters (approved/pending)
- Present/absent employees today
- Job postings count
- Job responses count
- Interviews scheduled (total/today)

**Key Features:**
- Full system access
- User management capabilities
- Approval authority for all workflow stages
- Analytics and reporting dashboard

---

### Recruiter Role
**Responsibilities:**
- Register new employees (to be approved by admin)
- Manage employee database and profiles
- Create job postings and post to social media
- Review and manage job applications
- Schedule interviews with auto-generated meeting links
- Manage candidate pipeline
- Generate offers from templates
- Approve employee rewards (rewards go to admin for final approval)
- View and process exit forms
- Manage leave regularization

**Dashboard KPIs:**
- Total employees
- Open job postings
- Total job applications
- Interviews today
- Pending approvals
- New hires this month

**Key Features:**
- Recruitment workflow management
- Candidate pipeline tracking
- Interview scheduling with meeting links
- Offer management
- Exit processing authority (forwards to admin)

---

### Employee Role
**Responsibilities:**
- View personal dashboard with attendance
- Check-in/check-out functionality
- Apply for leave
- View leave status
- Access personal profile and salary details
- Download salary slips (previous month only)
- View internal job postings
- Refer candidates (with reward eligibility after 3 months)
- Submit exit/resignation form
- View reward points and history
- Access announcements

**Dashboard Features:**
- Check-in/out button
- Today's attendance hours
- Leave balance
- Reward points
- Recent announcements
- Quick links to common tasks
- Salary slip download
- Interview offers status

**Key Features:**
- Self-service employee portal
- Leave management
- Referral program
- Attendance tracking
- Access to internal job market

---

### Candidate Role (Onboarding Only)
**Responsibilities:**
- Register for onboarding
- Access onboarding portal
- Convert to Employee after recruiter approval

**Status Transition:** Candidate → Employee (after recruiter approval)

---

## Data Flow Architecture

### User Registration & Onboarding Flow

\`\`\`
1. ADMIN CREATES EMPLOYEE
   │
   ├─ Admin uses /api/admin/employees endpoint
   ├─ System generates temporary password
   ├─ Employee created with status = 'active'
   └─ Welcome email sent with credentials

2. RECRUITER CREATES CANDIDATE
   │
   ├─ Recruiter submits application
   ├─ Candidate registered with status = 'pending'
   ├─ Candidate gains access to onboarding portal
   └─ Awaits recruiter approval

3. RECRUITER APPROVES CANDIDATE
   │
   ├─ Recruiter reviews candidate profile
   ├─ Candidate status changed from 'pending' to 'active'
   ├─ Candidate role changed from 'candidate' to 'employee'
   ├─ Employee dashboard becomes available
   └─ Employee gains full system access
\`\`\`

---

### Leave Management Flow

\`\`\`
1. EMPLOYEE APPLIES FOR LEAVE
   ├─ Employee submits via /api/employee/leave/apply
   ├─ Leave status = 'pending'
   ├─ Notification sent to recruiter

2. RECRUITER REVIEWS LEAVE
   ├─ Leave appears in Recruiter dashboard
   ├─ If duration < 9 hours → Leave Regularization section
   ├─ If duration >= 9 hours → Normal approval process

3. DECISION
   ├─ APPROVED: Status = 'approved', Employee notified
   └─ REJECTED: Status = 'rejected', Employee notified
\`\`\`

---

### Recruitment & Hiring Flow

\`\`\`
1. RECRUITER CREATES JOB POSTING
   ├─ Job posted via /api/jobs
   ├─ Can post to LinkedIn, Facebook, Instagram
   ├─ Auto CV parsing with 75%+ score threshold
   ├─ Status = 'open'

2. CV PARSING & SCREENING
   ├─ If score > 75% → Auto-listed in candidate table
   ├─ Admin/Recruiter can search and filter candidates
   ├─ Candidate profile available with score

3. INTERVIEW SCHEDULING
   ├─ Recruiter schedules via /api/interviews
   ├─ Auto-generated meeting link created
   ├─ Email sent to candidate with meeting link
   ├─ Interview status: Scheduled → Rescheduled → No-show → Done

4. CANDIDATE PIPELINE STAGES
   ├─ New
   ├─ Shortlisted
   ├─ Interviewed
   ├─ Offered
   ├─ Hired
   └─ Rejected

5. OFFER GENERATION & SENDING
   ├─ Recruiter selects shortlisted candidate
   ├─ Clicks "Generate Offer"
   ├─ Fills candidate info + salary + joining date
   ├─ Generates offer letter from template
   ├─ Can email or download
   ├─ Offer sent via /api/offers/{offerId}/send

6. ONBOARDING
   ├─ Candidate becomes employee
   ├─ Access to employee dashboard granted
\`\`\`

---

### Salary Management Flow

\`\`\`
1. GENERATE SALARY SLIP
   ├─ Admin/Recruiter uses /api/salary/slip/generate
   ├─ Selects employee and month/year
   ├─ System calculates:
   │  ├─ Gross Salary
   │  ├─ Deductions
   │  └─ Net Salary
   ├─ PDF generated
   └─ Salary slip sent via email

2. EMPLOYEE VIEWS SALARY
   ├─ Employee can access /api/employee/salary/slips
   ├─ View/download previous month slips only
   ├─ Cannot modify or delete slips
\`\`\`

---

### Exit Management Flow

\`\`\`
1. EMPLOYEE SUBMITS EXIT FORM
   ├─ Employee submits via /api/employee/exit
   ├─ Includes reason and last working day
   ├─ Status = 'pending'
   ├─ Form sent to recruiter portal

2. RECRUITER REVIEWS & DECIDES
   ├─ Recruiter can approve or reject
   ├─ If approved:
   │  ├─ Generate experience letter
   │  ├─ Generate certificate
   │  └─ Send documents via email
   ├─ If rejected:
   │  ├─ Generate termination letter
   │  └─ Document sent

3. FINAL ADMIN APPROVAL (if recruiter approved)
   ├─ Form forwarded to admin
   ├─ Admin reviews recruiter decision
   ├─ Once approved by admin:
   │  ├─ Employee account deactivated
   │  ├─ Access removed
   │  └─ Exit marked as completed
\`\`\`

---

### Reward Management Flow

\`\`\`
1. EMPLOYEE REFERRAL
   ├─ Employee refers candidate via internal job posting
   ├─ New hire joins company
   ├─ After 3 months → Reward generated
   ├─ Reward points added to employee account

2. MANUAL REWARD (by recruiter)
   ├─ Recruiter manually generates reward via /api/rewards/generate
   ├─ Reward status = 'pending'
   ├─ Requires admin approval

3. REWARD APPROVAL (Admin)
   ├─ Admin reviews pending rewards
   ├─ If approved → Points reflected in employee portal
   ├─ Employee can view reward history
\`\`\`

---

## API Endpoints by Category

### Authentication (3 endpoints)
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/logout

### User Management (4 endpoints)
- POST /api/admin/employees
- POST /api/admin/recruiters
- GET /api/users
- PATCH /api/users/{userId}/status

### Leave Management (3 endpoints)
- POST /api/employee/leave/apply
- GET /api/leave
- PATCH /api/leave/{leaveId}/approve

### Job Management (2 endpoints)
- POST /api/jobs
- GET /api/jobs

### Interview Management (2 endpoints)
- POST /api/interviews
- GET /api/interviews

### Offer Management (2 endpoints)
- POST /api/offers
- POST /api/offers/{offerId}/send

### Salary Management (2 endpoints)
- POST /api/salary/slip/generate
- GET /api/employee/salary/slips

### Attendance Management (2 endpoints)
- POST /api/attendance/checkin
- GET /api/attendance

### Reward Management (2 endpoints)
- POST /api/rewards/generate
- GET /api/employee/rewards

### Exit Management (2 endpoints)
- POST /api/employee/exit
- PATCH /api/exit/{exitId}/process

**Total: 24 API Endpoints**

---

## Security Considerations

### Authentication
- JWT token-based authentication
- Tokens included in Authorization header
- Token expiration implemented (recommend 24 hours)
- Refresh token mechanism (optional)

### Authorization
- Role-based access control (RBAC)
- Endpoint-level authorization checks
- Data-level authorization (employees can only see their own data)
- Admin override capability where needed

### Data Protection
- Password hashing (bcrypt recommended)
- SQL injection prevention (parameterized queries)
- CORS policy implementation
- Rate limiting (100 requests/minute)
- Input validation and sanitization

---

## File Structure

\`\`\`
HRMS-Portal/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── recruiters/
│   │   ├── employees/
│   │   ├── leave/
│   │   ├── jobs/
│   │   ├── interviews/
│   │   ├── offers/
│   │   ├── salary/
│   │   └── rewards/
│   ├── recruiter/
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── leave/
│   │   ├── jobs/
│   │   ├── interviews/
│   │   ├── offers/
│   │   ├── rewards/
│   │   └── exit/
│   ├── employee/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── leave/
│   │   ├── attendance/
│   │   ├── salary/
│   │   ├── jobs/
│   │   ├── rewards/
│   │   └── exit/
│   └── api/
│       ├── auth/
│       │   ├── login/
│       │   ├── me/
│       │   └── logout/
│       ├── admin/
│       ├── users/
│       ├── leave/
│       ├── jobs/
│       ├── interviews/
│       ├── offers/
│       ├── salary/
│       ├── attendance/
│       ├── rewards/
│       └── exit/
├── components/
│   ├── ui/
│   ├── login-form.tsx
│   ├── sidebar-nav.tsx
│   └── dashboard-card.tsx
├── lib/
│   ├── auth-context.tsx
│   ├── utils.ts
│   └── constants.ts
├── types/
│   └── index.ts
├── hooks/
│   └── use-auth.ts
├── API_DOCUMENTATION.md
├── SYSTEM_ARCHITECTURE.md
└── README.md
\`\`\`

---

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: React Context API + Local Storage
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Database**: To be implemented (Supabase, Neon, or custom)

---

## Implementation Priority

### Phase 1 (Core)
1. Authentication system
2. Login/Logout pages
3. Role-based navigation

### Phase 2 (Dashboards)
1. Admin dashboard with KPIs
2. Recruiter dashboard
3. Employee dashboard

### Phase 3 (User Management)
1. Employee creation/management
2. Recruiter registration
3. Status management

### Phase 4 (Operations)
1. Leave management system
2. Attendance tracking
3. Job posting and recruitment

### Phase 5 (Advanced)
1. Offer generation and management
2. Salary management
3. Exit management

### Phase 6 (Optimization)
1. Database integration
2. Security hardening
3. Performance optimization
4. Production deployment

---
