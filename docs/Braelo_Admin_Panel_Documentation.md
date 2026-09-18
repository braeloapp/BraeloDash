# Braelo Admin Panel — Complete Product Documentation

**Product:** Braelo Admin Panel (web)  
**Audience:** Client stakeholders, QA, operations, and onboarding  
**Scope:** Admin panel only (not the mobile app)  
**App version basis:** Current `Braelo-web` codebase (sidebar navigation as shipped for client review)  
**Date:** September 18, 2026  

---

## 1. Overview

The Braelo Admin Panel is a web application used by Braelo staff to operate the marketplace: manage users and businesses, moderate listings and reports, run support and announcements, and publish legal content.

### 1.1 Who uses it

| Role | Access |
|------|--------|
| **Administrator** | Day-to-day ops (users, listings, support, notifications, etc.) |
| **Super Admin** | Same as admin, plus ability to create other **admin** accounts when adding users |

### 1.2 How to access

1. Open the Admin Panel URL (local or deployed).
2. Sign in with staff email and password.
3. After login you land on the **Dashboard**.
4. Use the left sidebar to move between modules.
5. Use the bottom **account menu** for profile, notifications shortcut, language, and logout.

### 1.3 Languages

The panel supports **English**, **Portuguese**, and **Spanish**. Language can be changed from the login screen and from the sidebar account menu.

### 1.4 Navigation map (current sidebar)

| Group | Screens |
|-------|---------|
| **Overview** | Dashboard |
| **People** | Users, Business |
| **Marketplace** | Listing, Categories, Banner |
| **Moderation** | Reported Users |
| **Operations** | Support, Notifications, Feedback |
| **Insights** | Statistics |
| **Administration** | Privacy Policy |

**Account menu (not in main sidebar):** Admin Profile, Notifications shortcut, Language, Logout.

---

## 2. Global behaviors

### 2.1 Authentication

- Login stores a session token used on all admin API calls.
- Leaving the session (Logout) clears local session data and returns to Login.
- Protected screens under `/pages/*` require a valid session.

### 2.2 Common UI patterns

| Pattern | Where it appears |
|---------|------------------|
| **Search / filters** | Users, Business, Reported Users, Support, Feedback |
| **Pagination** | Most list screens and listing category tabs |
| **Export** | Users, Business, Reported Users; PDF/CSV on user & business detail |
| **Confirm dialogs** | Delete / deactivate / moderation actions |
| **Toasts** | Success and error feedback after saves |
| **Detail / edit modals** | Listings, banners, support, reports, profiles |

### 2.3 Data sources (high level)

- **Users / auth / admin accounts:** relational database used by the backend.
- **Listings / businesses / many marketplace docs:** MongoDB collections.
- **Images:** uploaded to Azure Blob Storage; URLs stored on the listing/business.
- **Push announcements:** Firebase Cloud Messaging (FCM).

---

## 3. Login

**Route:** `/`  
**Purpose:** Authenticate staff into the Admin Panel.

### Screen details

- Email and password fields.
- Show / hide password.
- Language switcher.
- Branded hero panel (desktop).

### Functionality

1. Admin enters credentials.
2. System validates and creates a session.
3. On success → redirect to **Dashboard**.
4. On failure → error message; stay on Login.

### User flow

```
Open Admin Panel → Login → Dashboard
```

---

## 4. Dashboard (Overview)

**Route:** `/pages/dashboard`  
**Purpose:** Operational home — live counts, growth in a selected period, and shortcuts to work that needs attention.

### Screen details

| Section | What it shows |
|---------|----------------|
| **Period selector** | Today · 7 days · 30 days · 90 days |
| **Ops alerts** | Pending reports, open support, new users (7d), active listings |
| **Period KPIs** | New users / listings / businesses in period; pending reports |
| **Summary cards** | Total listings, users, support requests, businesses |
| **Platform volume chart** | Daily growth (listings, users, businesses) for the selected period |
| **Listing & moderation chart** | Active vs inactive listings, reports, open support |
| **User statistics** | Active / new 7d / today |
| **Recent users** | Newest accounts with links to profiles |

### Functionality

- Change period → refreshes analytics.
- Click cards / alerts → jump to Users, Listings, Support, Reported Users, or Business.
- Retry if metrics fail to load.

### User flow

```
Login → Dashboard → review alerts → open the relevant module
```

---

## 5. People

### 5.1 Users

**Route:** `/pages/users`  
**Purpose:** Search, filter, and manage all platform accounts.

#### Screen details

- Header with **Add User** and **Export**.
- Filters: search, active/inactive, creation date, email/phone verification.
- Table columns typically include: ID, email, name, status, verification flags, created date, role, actions.

#### Features & functionalities

| Action | Description |
|--------|-------------|
| Search | Debounced text search across user fields |
| Filter | Status, date, verification |
| View | Opens User Detail |
| Deactivate | Soft-deactivates an active account |
| Reactivate | Restores a deactivated (non-banned) account |
| Export | CSV / Excel / HTML of loaded results |
| Add User | Opens Add User form |

#### User flow

```
Users → filter/search → View profile
                      → Deactivate / Reactivate
                      → Export
                      → Add User
```

---

### 5.2 Add User

**Route:** `/pages/users/adduser`  
**Purpose:** Create a new platform user (or admin, if the signed-in user is Super Admin).

#### Fields

- Full name, email, phone, password.
- Role: `user` (always). `admin` only when creator is Super Admin.

#### User flow

```
Users → Add User → fill form → Submit → success toast
```

---

### 5.3 User Detail

**Route:** `/pages/users/userdetail?id={userId}`  
**Purpose:** Full profile for one account, including their listings.

#### Screen details

- Hero: avatar, name, email, status chips (active, role, email/phone verified).
- Meta cards: phone, created/updated, warned/banned flags.
- **Edit profile** modal.
- **Listings** tabs for that user: Total / Active / Inactive / Saved.
- **Account history** (staff actions related to this user, when available).
- Download profile as PDF or CSV.

#### Features

- Edit name, contact, status, verification flags (admin update).
- Browse and manage that user’s listings (edit / delete / activate–deactivate from listing cards).
- Export profile snapshot.

#### User flow

```
Users → View → Edit profile
             → Manage user’s listings
             → Download PDF/CSV
```

---

### 5.4 Business

**Route:** `/pages/business`  
**Purpose:** Directory of business accounts.

#### Screen details

- **Add Business**, **Export**.
- Filters: search, status, date.
- Table: business identity, contact, category, status, dates, address, logo, actions.

#### Features

| Action | Description |
|--------|-------------|
| View | Business Detail |
| Deactivate | Deactivates business for that owner |
| Export | CSV / Excel / HTML |
| Add Business | Opens create form |

#### User flow

```
Business → filter → View / Deactivate / Export / Add
```

---

### 5.5 Add Business

**Route:** `/pages/business/addbusiness`  
**Purpose:** Register a new business profile (with media).

#### Typical fields

- Business name, logo, address (Google Places), phone, email, website.
- Goals, category / subcategory.
- Banner and gallery images.

#### User flow

```
Business → Add Business → complete form + media → Submit
```

---

### 5.6 Business Detail

**Route:** `/pages/business/businessdetail?id={businessId}`  
**Purpose:** Inspect and edit one business; see its listings.

#### Screen details

- Profile hero and meta (address, contact, category, status).
- Edit modal for profile and media.
- Listing tabs: Total / Active / Inactive (for the business owner).
- History panel when staff actions exist.
- PDF / CSV export.

#### User flow

```
Business → View → Edit business
               → Review listings
               → Export
```

---

## 6. Marketplace

### 6.1 Listing hub

**Route:** `/pages/listing`  
**Purpose:** Browse all marketplace listings by category and manage them.

#### Category tabs

1. Vehicles  
2. Real Estate  
3. Services  
4. Events  
5. Jobs  
6. Electronics  
7. Furniture  
8. Fashion  
9. Kids  
10. Sports & Hobby  

#### Per-listing card features

| Action | Description |
|--------|-------------|
| View details | Opens listing detail modal (full fields, images, price/fee) |
| Edit | Opens edit shell / modal with category-specific fields |
| Delete | Removes listing after confirm |
| Active toggle | Activate or deactivate listing |

#### Price display notes (important)

Different categories store money in different fields. The admin UI maps them for display:

| Category | Money field shown as price |
|----------|----------------------------|
| Most goods | `price` |
| Services | `service_fee` |
| Events | `ticket_price` |
| Jobs | `salary_range` |

#### User flow

```
Listing → pick category tab → view / edit / delete / toggle status
         → Add Listing (wizard)
```

---

### 6.2 Add Listing (wizard)

Creating a listing is a **3-step** flow.

#### Step 1 — Choose category

**Route:** `/pages/listing/addlisting`  
Pick one of the 10 marketplace categories.

#### Step 2 — Choose subcategory

**Route:** `/pages/listing/addlisting/[slug]`  
Pick the subcategory for that category.

#### Step 3 — Fill listing form

**Route:** `/pages/listing/addlisting/[slug]/[name]`  

Includes:

- Common fields (title, description, keywords, location via Google Places, coordinates, negotiable, etc.).
- Category-specific fields and **chip selectors** (must match backend allowed values — e.g. Real Estate lease terms: **SHORT-TERM** / **LONG-TERM**).
- Image upload.
- `from_business` flag when applicable.

On success → toast → return to Listing hub.

#### User flow

```
Listing → Add Listing → Category → Subcategory → Form → Submit → Listing hub
```

---

### 6.3 Categories (taxonomy)

**Route:** `/pages/categories`  
**Purpose:** Manage the catalog of categories and subcategories used by the app and admin forms.

#### List screen features

- Add Category / Add Subcategory.
- Table: key, label, subcategory count, active toggle, view subs, delete.

#### Add Category — `/pages/categories/addcategory`

- Display name, optional key/slug, sort order, Active.

#### Add Subcategory — `/pages/categories/addsubcategory`

- Parent category, display name, optional key, sort order, Active.

#### Subcategories — `/pages/categories/[id]/subcategories`

- List/toggle/delete subs under one parent.
- Shortcut to add another subcategory for that parent.

#### User flow

```
Categories → Add category/subcategory
           → Open subcategories → toggle / delete
```

---

### 6.4 Banners

**Route:** `/pages/banners`  
**Purpose:** Manage promotional business banners shown in the product.

#### List features

- Table of banners (user/business linkage, image, email, name, category/subcategory).
- Edit modal (image + metadata).
- Delete.
- **Add Banner**.

#### Add Banner — `/pages/banners/addbanner`

- Required: image, business name, email, category, subcategory, URL.

#### User flow

```
Banners → Add / Edit / Delete
```

---

## 7. Moderation

### 7.1 Reported Users

**Route:** `/pages/reportedusers`  
**Purpose:** Triage user reports filed from the platform.

#### Screen details

- Filters: status, search, date.
- Table: report ID, reported user, reporter, reason, date, status.
- Detail modal.
- Moderation confirmation with optional notes.

#### Actions

| Action | Meaning |
|--------|---------|
| **Warn** | Flags / warns the reported user (policy may escalate on repeat) |
| **Ban** | Bans the reported user |
| **Ignore** | Closes the report without punitive action |
| **Export** | CSV / PDF / HTML |

#### User flow

```
Reported Users → filter Pending → open report → Warn / Ban / Ignore
```

---

## 8. Operations

### 8.1 Support

**Route:** `/pages/support`  
**Purpose:** Support / help-request inbox.

#### Features

- Search by email; filter by status and date.
- Change ticket status.
- Open detail; send email reply.
- Delete ticket (with confirm).

#### User flow

```
Support → find ticket → update status → reply or delete
```

---

### 8.2 Notifications

**Route:** `/pages/notifications`  
**Purpose:** Staff notification inbox (read/unread) and entry to broadcasts.

#### Inbox features

- Paginated cards (title, body, type, time).
- Mark read / unread.
- Mark all visible as read.
- Delete.
- **Add New Notification**.

#### Add Notification — `/pages/notifications/addnotification`

| Field | Description |
|-------|-------------|
| Title | Notification title |
| Audience | **All users** (FCM topic) or **Business users only** |
| Description | Body text (with preview) |

#### User flow

```
Notifications → review inbox
              → Add Notification → choose audience → Publish
```

---

### 8.3 Feedback

**Route:** `/pages/feedback`  
**Purpose:** Read-only view of in-app sentiment feedback.

#### Features

- Filter by reaction (e.g. Hate → Love scale).
- Table: user, reaction, date, description.
- No create/edit/delete (view only).

#### User flow

```
Feedback → filter by reaction → review comments
```

---

## 9. Insights

### 9.1 Statistics

**Route:** `/pages/statistics`  
**Purpose:** Visual analytics for leadership / ops review.

#### Charts

- User growth.
- Business statistics.
- Listings by category.

Data is driven by the same live admin statistics / analytics sources as the Dashboard.

#### User flow

```
Statistics → review charts (optionally after checking Dashboard KPIs)
```

---

## 10. Administration

### 10.1 Privacy Policy (CMS)

**Route:** `/pages/privacypolicy`  
**Purpose:** Edit and publish the privacy policy content consumed by clients.

#### Features

- Title and body editors.
- **Save draft** (not public).
- **Publish** (available to apps via public legal endpoint).
- Shows draft vs published and last updated time.

#### User flow

```
Privacy Policy → edit → Save draft or Publish
```

---

## 11. Admin Profile

**Route:** `/pages/adminprofile`  
**Opened from:** Sidebar account menu  

**Purpose:** View and update the signed-in administrator’s own profile.

### Features

- View name, role, email, phone, address fields, bio.
- Edit and save profile details.

### User flow

```
Account menu → Profile → Edit → Save
```

---

## 12. End-to-end operational flows (cheat sheet)

### Onboard a new consumer user

1. People → **Users** → **Add User**.  
2. Optionally open detail to verify status / listings later.

### Onboard a business

1. People → **Business** → **Add Business**.  
2. Open Business Detail to confirm media and listings.

### Publish a marketplace listing from admin

1. Marketplace → **Listing** → **Add Listing**.  
2. Category → Subcategory → complete form (valid chips + image).  
3. Submit → verify card under the correct category tab.

### Moderate a bad actor

1. Moderation → **Reported Users**.  
2. Open pending report → **Warn** or **Ban** (or **Ignore**).  
3. Optionally deactivate from **Users** if needed.

### Reply to a customer

1. Operations → **Support**.  
2. Open ticket → update status → **Reply**.

### Send an announcement

1. Operations → **Notifications** → **Add New Notification**.  
2. Choose audience (all vs business) → Publish.

### Update legal copy

1. Administration → **Privacy Policy**.  
2. Edit → Publish when ready for apps.

---

## 13. Screen index (quick reference)

| # | Screen | Route |
|---|--------|-------|
| 1 | Login | `/` |
| 2 | Dashboard | `/pages/dashboard` |
| 3 | Users | `/pages/users` |
| 4 | Add User | `/pages/users/adduser` |
| 5 | User Detail | `/pages/users/userdetail?id=` |
| 6 | Business | `/pages/business` |
| 7 | Add Business | `/pages/business/addbusiness` |
| 8 | Business Detail | `/pages/business/businessdetail?id=` |
| 9 | Listing hub | `/pages/listing` |
| 10 | Add Listing — category | `/pages/listing/addlisting` |
| 11 | Add Listing — subcategory | `/pages/listing/addlisting/[slug]` |
| 12 | Add Listing — form | `/pages/listing/addlisting/[slug]/[name]` |
| 13 | Categories | `/pages/categories` |
| 14 | Add Category | `/pages/categories/addcategory` |
| 15 | Add Subcategory | `/pages/categories/addsubcategory` |
| 16 | Subcategories | `/pages/categories/[id]/subcategories` |
| 17 | Banners | `/pages/banners` |
| 18 | Add Banner | `/pages/banners/addbanner` |
| 19 | Reported Users | `/pages/reportedusers` |
| 20 | Support | `/pages/support` |
| 21 | Notifications | `/pages/notifications` |
| 22 | Add Notification | `/pages/notifications/addnotification` |
| 23 | Feedback | `/pages/feedback` |
| 24 | Statistics | `/pages/statistics` |
| 25 | Privacy Policy | `/pages/privacypolicy` |
| 26 | Admin Profile | `/pages/adminprofile` |

---

## 14. Out of scope for this client build (removed from nav)

The following were removed from the primary sidebar for the client-facing product and are **not** part of the delivered navigation:

- Global Search  
- Blocks  
- AI Ops  
- Audit Logs  
- Platform Settings  

*(Backend capabilities may still exist for internal engineering use; they are not exposed in the admin menu for client ops.)*

---

## 15. Suggested weekend review checklist

Use this while clicking through the live admin:

- [ ] Login + language switch  
- [ ] Dashboard periods and alert links  
- [ ] Users: search, filter, detail, deactivate/reactivate, add user  
- [ ] Business: list, detail, add, deactivate  
- [ ] Listing: each category tab; edit/delete/toggle; add listing wizard  
- [ ] Categories + subcategories CRUD  
- [ ] Banners add/edit/delete  
- [ ] Reported Users moderation actions  
- [ ] Support reply + status  
- [ ] Notifications inbox + broadcast (all / business)  
- [ ] Feedback filters  
- [ ] Statistics charts  
- [ ] Privacy Policy draft + publish  
- [ ] Admin Profile edit  

---

## 16. Notes on screen recordings / Drive

This deliverable is the **complete Admin Panel documentation** document you asked to prepare for client review.

**Screen recordings** (short clips per section) and **Google Drive upload** require recording from a logged-in admin session and Drive access on your side. Recommended clip structure if you record this weekend:

1. Login & language  
2. Dashboard  
3. Users (+ detail)  
4. Business (+ detail)  
5. Listings + Add Listing  
6. Categories & Banners  
7. Reported Users  
8. Support  
9. Notifications + Feedback  
10. Statistics + Privacy Policy + Admin Profile  

---

*End of Braelo Admin Panel documentation.*
