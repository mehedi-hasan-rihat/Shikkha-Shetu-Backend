# SkillBridge Database ERD

## Entity Relationship Diagram

```
┌─────────────────────────────────────┐
│                USER                 │
├─────────────────────────────────────┤
│ PK  id: String                      │
│     name: String                    │
│     email: String (unique)          │
│     emailVerified: Boolean          │
│     image: String?                  │
│     phone: String?                  │
│     status: UserStatus              │
│     role: UserRole                  │
│     createdAt: DateTime             │
│     updatedAt: DateTime             │
└─────────────────────────────────────┘
                    │
                    │ 1:0..1
                    ▼
┌─────────────────────────────────────┐
│            TUTOR_PROFILE            │
├─────────────────────────────────────┤
│ PK  id: String                      │
│ FK  userId: String (unique)         │
│     bio: String?                    │
│     hourlyRate: Float               │
│     experience: Int                 │
│     subjects: String[]              │
│ FK  categoryId: String              │
│     rating: Float                   │
│     totalReviews: Int               │
│     isAvailable: Boolean            │
│     createdAt: DateTime             │
│     updatedAt: DateTime             │
└─────────────────────────────────────┘
                    │
                    │ 1:0..*
                    ▼
┌─────────────────────────────────────┐
│         AVAILABILITY_SLOT           │
├─────────────────────────────────────┤
│ PK  id: String                      │
│ FK  tutorId: String                 │
│     dayOfWeek: Int (0-6)            │
│     startTime: String               │
│     endTime: String                 │
│     isAvailable: Boolean            │
│     createdAt: DateTime             │
│     updatedAt: DateTime             │
│                                     │
│ UNIQUE(tutorId, dayOfWeek, startTime)│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│              CATEGORY               │
├─────────────────────────────────────┤
│ PK  id: String                      │
│     name: String (unique)           │
│     description: String?            │
│     createdAt: DateTime             │
└─────────────────────────────────────┘
                    │
                    │ 1:0..*
                    ▼
            TUTOR_PROFILE

        USER ──────────────────────────┐
         │                             │
         │ 1:0..* (Student)            │ 1:0..* (Tutor)
         ▼                             ▼
┌─────────────────────────────────────┐
│              BOOKING                │
├─────────────────────────────────────┤
│ PK  id: String                      │
│ FK  studentId: String               │
│ FK  tutorId: String                 │
│     scheduledAt: DateTime           │
│     duration: Int                   │
│     status: BookingStatus           │
│     notes: String?                  │
│     totalAmount: Float              │
│     createdAt: DateTime             │
│     updatedAt: DateTime             │
└─────────────────────────────────────┘
                    │
                    │ 1:0..1
                    ▼
┌─────────────────────────────────────┐
│              REVIEW                 │
├─────────────────────────────────────┤
│ PK  id: String                      │
│ FK  bookingId: String (unique)      │
│ FK  studentId: String               │
│ FK  tutorId: String                 │
│     rating: Int                     │
│     comment: String?                │
│     createdAt: DateTime             │
└─────────────────────────────────────┘
         │                       │
         │ M:1 (Student)         │ M:1 (Tutor)
         ▼                       ▼
       USER ─────────────────── USER
```

## Relationship Details

### 🔗 Primary Relationships

| From | To | Type | Description |
|------|----|----- |-------------|
| **User** | **TutorProfile** | 1:0..1 | User can optionally become a tutor |
| **TutorProfile** | **AvailabilitySlot** | 1:0..* | Tutor sets multiple time slots |
| **Category** | **TutorProfile** | 1:0..* | Category groups tutors by subject |
| **User** | **Booking** | 1:0..* | User books sessions (as student) |
| **User** | **Booking** | 1:0..* | User receives bookings (as tutor) |
| **Booking** | **Review** | 1:0..1 | Booking can have one review |
| **User** | **Review** | 1:0..* | User writes reviews (as student) |
| **User** | **Review** | 1:0..* | User receives reviews (as tutor) |

### 🎯 Business Flow

```
Student Journey:
USER (Student) → BOOKING → REVIEW

Tutor Journey:
USER (Tutor) → TUTOR_PROFILE → AVAILABILITY_SLOT
                    ↓
               BOOKING ← USER (Student)
                    ↓
               REVIEW (optional)
```

## 📊 Key Constraints & Rules

### Unique Constraints
- `User.email` - One email per user
- `Category.name` - Unique category names
- `Review.bookingId` - One review per booking
- `AvailabilitySlot.(tutorId, dayOfWeek, startTime)` - No overlapping slots

### Business Rules
1. **Role-Based Access**: Users have STUDENT, TUTOR, or ADMIN roles
2. **Tutor Requirements**: Only TUTOR role users can have TutorProfile
3. **Booking Flow**: CONFIRMED → COMPLETED → Optional Review
4. **Review Restrictions**: Only students can write reviews after booking completion
5. **Availability Management**: Tutors set weekly recurring time slots
6. **Admin Powers**: Can manage user status (ACTIVE/BANNED/SUSPENDED)

## 🏷️ Enums

### UserRole
- `STUDENT` - Browse tutors, book sessions, write reviews
- `TUTOR` - Create profile, set availability, teach sessions  
- `ADMIN` - Platform management and moderation

### UserStatus
- `ACTIVE` - Normal account operation
- `BANNED` - Permanently disabled account
- `SUSPENDED` - Temporarily disabled account

### BookingStatus
- `CONFIRMED` - Booking accepted (default)
- `COMPLETED` - Session finished
- `CANCELLED` - Booking cancelled

## 💡 Key Features

### For Students
- Browse and filter tutors by category, rating, price
- Book sessions with available tutors
- Leave reviews after completed sessions
- Manage booking history

### For Tutors
- Create detailed profile with bio, rates, subjects
- Set weekly availability schedule
- Manage incoming bookings
- View ratings and reviews

### For Admins
- Monitor all users and activities
- Manage user accounts (ban/unban)
- Oversee platform operations
- Manage categories

---

*This ERD represents the core business logic of SkillBridge tutoring platform, excluding authentication tables managed by Better Auth.*