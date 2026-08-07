# Login Test Guide

## ✅ **IMPORTANT: Country Selection**

**The test user is registered in UAE (Country ID: 2)**

Before logging in, you MUST select the correct country:

1. **Click the country selector in the header** (top-right on desktop, hamburger menu on mobile)
2. **Select "UAE"** (🇦🇪 Dubai)
3. **Then proceed to login**

---

## 🔐 **Test Credentials**

### **User Details:**
```
Phone: 637438986
Email: ajithajith880@gmail.com
Password: 11223344
Country: UAE (Country ID: 2) ← MUST BE SELECTED
```

---

## 📝 **Step-by-Step Login Test**

### **Method 1: Login with Phone**

1. **Select Country:**
   - Click country selector
   - Choose: **🇦🇪 UAE - Dubai**

2. **Go to Login Page:**
   - Navigate to: `http://localhost:3000/user/login`

3. **Fill Form:**
   - Toggle: **Mobile** (phone option)
   - Phone: `637438986`
   - Password: `11223344`
   - ✅ Check "Remember me" (optional)

4. **Submit:**
   - Click "Sign In"
   - ✅ Should redirect to `/account` page
   - ✅ No OTP required (otpPage = 0)

---

### **Method 2: Login with Email**

1. **Select Country:**
   - Choose: **🇦🇪 UAE - Dubai**

2. **Go to Login Page:**
   - Navigate to: `http://localhost:3000/user/login`

3. **Fill Form:**
   - Toggle: **Email**
   - Email: `ajithajith880@gmail.com`
   - Password: `11223344`

4. **Submit:**
   - Click "Sign In"
   - ✅ Should redirect to `/account` page

---

## 🐛 **Troubleshooting**

### **Error: "User not found!"**

**Cause:** Wrong country selected

**Solution:**
1. Check country selector shows **UAE 🇦🇪**
2. If it shows India 🇮🇳, change it to UAE
3. Try login again

**Console Check:**
Open browser console (F12) and you should see:
```javascript
Login Request: {
  phone_or_email: "637438986",
  country: 2,  // ← Must be 2 for UAE
  password: "***"
}
```

---

### **Error: Network/Connection Issues**

**Check:**
1. API URL is correct: `http://jenideals.akprojects.co/api/android/version5`
2. Internet connection is working
3. API server is running

**Console Check:**
```javascript
Login Response: {
  status: true,
  otpPage: 0,
  message: "User is logged in successfully.",
  data: { token: "...", user: {...} }
}
```

---

## 🔍 **Debug Commands**

Open browser console (F12) and run:

```javascript
// Check selected country
console.log('Selected Country:', localStorage.getItem('selectedCountry'))

// Should show: "ae" for UAE

// Check if logged in
console.log('Is Logged In:', !!localStorage.getItem('auth_token'))

// Get user data
console.log('User Data:', JSON.parse(localStorage.getItem('user_data')))

// Get token
console.log('Token:', localStorage.getItem('auth_token'))
```

---

## 📊 **Expected Response**

**Successful Login:**
```json
{
  "status": true,
  "otpPage": 0,
  "message": "User is logged in successfully.",
  "data": {
    "token": "7622|z7FkpIVcesydZAjbvXn55wnjNU55Z3IGzqadusul4c7ba854",
    "user": {
      "id": 1022,
      "name": "Ajith R(Developer Testing)",
      "phone": "637438986",
      "email": "ajithajith880@gmail.com",
      "country": 2,
      "user_type": "user",
      // ... more fields
    }
  }
}
```

---

## ✅ **After Login**

Once logged in successfully:

1. **Token & User Data Stored:**
   - Token saved in `localStorage.auth_token`
   - User data saved in `localStorage.user_data`

2. **Redirected to:**
   - `/account` page (dashboard)

3. **Can Check:**
   ```javascript
   // In console
   authService.isLoggedIn() // → true
   authService.getUserData() // → { id: 1022, name: "...", ... }
   ```

---

## 🇮🇳 **Testing with India**

If you want to test with India users:

1. **Select Country:** 🇮🇳 India - Mumbai
2. **Use India credentials** (Country ID: 1)
3. Same login process

---

## 🎯 **Quick Test Checklist**

- [ ] Country selector shows **UAE 🇦🇪**
- [ ] Phone: `637438986` or Email: `ajithajith880@gmail.com`
- [ ] Password: `11223344`
- [ ] Click "Sign In"
- [ ] Check console logs (no errors)
- [ ] Should redirect to `/account`
- [ ] Token saved in localStorage
- [ ] User data saved in localStorage

---

**Last Updated:** Now
**API Base:** http://jenideals.akprojects.co/api/android/version5
**Default Country:** UAE (ID: 2)
