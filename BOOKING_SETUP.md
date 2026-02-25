# Booking System Setup Guide

## Overview
I've created a complete booking/appointment system for your website. Here's what's included:

### Features
- 📅 **Date Picker** - Calendar to select appointment dates (weekends disabled)
- ⏰ **Time Slots** - Pre-defined time slots (9:00 AM - 4:30 PM)
- 📝 **Service Selection** - Choose from different service types
- 📧 **Email Notifications** - Booking confirmations sent via EmailJS
- ✅ **Form Validation** - Using Zod for robust validation
- 🎨 **Styled UI** - Matches your existing design system

---

## Setup Instructions

### 1. EmailJS Configuration (Required)

The booking form uses **EmailJS** to send emails. You need to set up your EmailJS account:

#### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/) and sign up
2. Create a new Email Service (Gmail, Outlook, etc.)
3. Create an Email Template with these variables:
   - `{{to_email}}` - Your receiving email address
   - `{{from_name}}` - Client's name
   - `{{from_email}}` - Client's email
   - `{{phone}}` - Client's phone
   - `{{service}}` - Selected service
   - `{{date}}` - Appointment date
   - `{{time}}` - Appointment time
   - `{{notes}}` - Additional notes

#### Step 2: Update the Code
Edit `src/sections/Booking.tsx` and replace these placeholders:

```typescript
// Line ~95-97
await emailjs.send(
  'YOUR_SERVICE_ID',      // Replace with your EmailJS Service ID
  'YOUR_TEMPLATE_ID',     // Replace with your EmailJS Template ID
  templateParams,
  'YOUR_PUBLIC_KEY'       // Replace with your EmailJS Public Key
)

// Line ~88
const templateParams = {
  to_email: 'your-email@example.com', // Replace with YOUR email
  // ... rest of the params
}
```

---

### 2. Customize Time Slots (Optional)

To change available time slots, edit line 18-23 in `Booking.tsx`:

```typescript
const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', // Your custom times
  '02:00 PM', '03:00 PM', '04:00 PM'
]
```

---

### 3. Customize Services (Optional)

To change the service options, edit line 26-32 in `Booking.tsx`:

```typescript
const SERVICES = [
  'Consultation',
  'Strategy Session',
  'Technical Review',
  'Project Discussion',
  'Other'  // Add your custom services here
]
```

---

### 4. Disable Weekend Bookings (Optional)

The calendar already disables weekends by default. To change this, edit line 114:

```typescript
const disabledDays = (date: Date) => {
  const today = startOfToday()
  return isBefore(date, today) || isWeekend(date) // Remove || isWeekend(date) to enable weekends
}
```

---

## How It Works

1. **Client fills out the form** - Selects date, time, service, and enters contact info
2. **Form validates** - Checks for required fields and valid email
3. **Email is sent** - EmailJS sends booking details to your email
4. **Success message** - Client sees a confirmation screen
5. **Toast notification** - Shows success/error feedback

---

## Alternative: Google Calendar Integration

If you prefer to add bookings directly to Google Calendar, you can modify the `onSubmit` function to use Google Calendar API instead of EmailJS.

---

## Testing

1. Run your dev server: `npm run dev`
2. Navigate to the Booking section
3. Fill out the form with test data
4. Submit and check your email

---

## Troubleshooting

### Emails not sending?
- Check EmailJS credentials
- Verify template variables match exactly
- Check browser console for errors

### Form not validating?
- Ensure all required fields are filled
- Check email format is valid

### Calendar not showing?
- Check if `date-fns` and `react-day-picker` are installed (they should be)

---

## Need Help?

- EmailJS Docs: https://www.emailjs.com/docs/
- React Hook Form: https://react-hook-form.com/
- Zod Validation: https://zod.dev/
