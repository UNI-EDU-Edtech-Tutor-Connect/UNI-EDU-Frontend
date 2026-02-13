# Refactoring Office Dashboard Sub-pages

We have successfully refactored the remaining sub-pages of the Office Dashboard to integrate with the Redux store and API services. This moves the application away from hardcoded mock data for `Requests`, `Matching`, `Reports`, and `Calendar` pages.

## Changes Overview

### 1. Requests Page (`app/dashboard/office/requests/page.tsx`)
- **Data Source**: Now fetches `classRequests` from `state.classes` via `fetchClassesRequest`.
- **Integration**:
    - Mapped `ClassRequest` entities (status 'open' or 'in_progress') to the unified request view.
    - Preserved mock data for 'support', 'complaint', and 'refund' types as these are not yet supported by the backend.
- **Features**: dynamic counts in summary cards, real-time filtering by status/type.

### 2. Matching Page (`app/dashboard/office/matching/page.tsx`)
- **Data Source**: Fetches `classRequests` (Open status) and `tutors` (Available) from Redux.
- **Matching Logic**: Implemented a client-side matching algorithm `calculateMatchScore`:
    - **Subject Match**: +50 points.
    - **Experience Match**: +20 points (based on `totalClasses` as proxy).
    - **Location Match**: +10 points (base score, location comparisons temporarily mocked).
- **UI**: Lists dynamic pending classes and suggests tutors based on the highest match score.

### 3. Reports Page (`app/dashboard/office/reports/page.tsx`)
- **Data Source**: Fetches `officeStats`, `users`, and `classRequests`.
- **Dynamic Stats**:
    - **Registrations**: Calculated from total users created in the current period.
    - **Classes Created**: Calculated from total class requests.
    - **Weekly Trends**: Generated dynamically by grouping historical data (`createdAt`) by week using `date-fns`.
- **Placeholders**: Staff Performance and Source Breakdown remain as static mock data pending Analytics API.

### 4. Calendar Page (`app/dashboard/office/calendar/page.tsx`)
- **Data Source**: Fetches `sessions` from `state.classes`.
- **Integration**:
    - Displays real `ClassSession` items as "Lớp học" events on the calendar.
    - Combined with mock "Office Appointments" (Interviews, Consultations) for a complete view.
- **Details**: Shows accurate time, status, and location for class sessions.

## Next Steps
1. **Connect Write Operations**: Implement the "Add" actions (Add Request, Confirm Match, Add Appointment) to dispatch POST actions.
2. **Refine Analytics**: Implement dedicated endpoints for aggregation stats (Week/Month) instead of client-side calculation.
3. **Enhance Types**: Add proper types for `OfficeAppointment` and other auxiliary reporting structures.
