
# 📝 How to Edit Your Mind Centre Website Content

Your website now has a **Simple Content Editor** that lets you update text, images, contact details, and more - **no coding required!**

---

## 🚀 Quick Start

### Step 1: Access the Admin Panel

Go to: **https://mindcentre.abacusai.app/admin** (or http://localhost:3000/admin for local testing)

### Step 2: Choose What to Edit

You'll see a list of content files on the left:
- **Home Page** - Hero section, promotional banners
- **Contact Information** - Branch addresses, phone numbers
- **Site Settings** - Logo, social media links, colors
- **About Us** - Mission, vision, values
- **Blog Posts** - All 183 blog articles

### Step 3: Edit the Content

1. Click on a file name to open it
2. Edit the text in the editor
3. Click **"Save Changes"**
4. Your website updates instantly! ✨

---

## 📋 What You Can Edit

### 1. **Home Page Content** (`home.json`)

**What's inside:**
- Hero title and subtitle
- Promotional banners
- "Buy 1 Get 1" promotion text
- "Why Choose Us" section

**Example Edit:**
```json
{
  "hero": {
    "title": "Your New Title Here",
    "subtitle": "Your new subtitle here"
  }
}
```

**Tips:**
- Keep text inside quotation marks `"like this"`
- Don't remove commas at the end of lines
- Update promotion text anytime

---

### 2. **Contact Information** (`contact.json`)

**What's inside:**
- Serangoon Centre address, phone, WhatsApp
- Bedok Centre address, phone, WhatsApp
- Operating hours
- Email address
- Branch descriptions

**Example Edit - Change Phone Number:**
```json
{
  "branches": [
    {
      "name": "Serangoon Centre",
      "phone": "+65-1234-5678",  ← Change this
      "whatsapp": "+65-9876-5432"  ← Change this
    }
  ]
}
```

**Example Edit - Update Operating Hours:**
```json
{
  "operatingHours": {
    "weekdays": "Monday - Friday: 1:00 PM - 8:00 PM",  ← Update hours
    "weekends": "Saturday - Sunday: 10:00 AM - 5:00 PM"  ← Update hours
  }
}
```

**Tips:**
- Update phone numbers when changed
- Adjust hours for holidays or special events
- Add new landmarks or features

---

### 3. **Site Settings** (`site-settings.json`)

**What's inside:**
- Site name and tagline
- Logo and favicon paths
- Social media links (Facebook, X, Instagram)
- Theme colors
- SEO settings (meta description, keywords)

**Example Edit - Update Social Media:**
```json
{
  "socialMedia": {
    "facebook": "https://www.facebook.com/mindcentre",  ← Update link
    "instagram": "https://www.instagram.com/mind.centre7/"  ← Update link
  }
}
```

**Example Edit - Change SEO Description:**
```json
{
  "seo": {
    "metaDescription": "Your new SEO description here"  ← Update for Google
  }
}
```

---

### 4. **About Us Page** (`about.json`)

**What's inside:**
- Introduction text
- Mission statement
- Vision statement
- Core values
- Achievements list

**Example Edit - Update Mission:**
```json
{
  "mission": "Your updated mission statement here"
}
```

**Example Edit - Add an Achievement:**
```json
{
  "achievements": [
    "Over 20 years of excellence",
    "Your new achievement here"  ← Add new achievement
  ]
}
```

---

### 5. **Blog Posts** (`blog-data.json`)

**What's inside:**
- All 183 blog posts with titles, content, images, videos

**⚠️ Warning:** This file is very large (183 posts). Only edit if you need to update a specific blog post.

**Example Edit - Update a Blog Title:**
Find the blog post by searching for its title, then change it:
```json
{
  "title": "Your Updated Blog Title",
  "content": "Updated content here..."
}
```

---

## 💡 Editing Tips

### ✅ DO:
- ✅ Keep text inside quotation marks: `"like this"`
- ✅ Keep commas at the end of lines (except the last line in a section)
- ✅ Use `\n` for line breaks in text
- ✅ Use `\"` for quotes inside text: `"He said \"hello\""`
- ✅ Save often!

### ❌ DON'T:
- ❌ Remove commas, brackets `{ }`, or square brackets `[ ]`
- ❌ Delete important fields like "name", "phone", etc.
- ❌ Use smart quotes (`" "`) - only straight quotes (`" "`)
- ❌ Forget to save before leaving!

---

## 🔧 Common Tasks

### Task 1: Update Phone Number

1. Go to `/admin`
2. Click **"Contact Information"**
3. Find: `"phone": "+65-6634-3411"`
4. Change to: `"phone": "+65-YOUR-NEW-NUMBER"`
5. Click **"Save Changes"**

### Task 2: Change Promotion Text

1. Go to `/admin`
2. Click **"Home Page"**
3. Find the `"promotionalBanner"` section
4. Edit the description or call-to-action text
5. Click **"Save Changes"**

### Task 3: Update Operating Hours

1. Go to `/admin`
2. Click **"Contact Information"**
3. Find `"operatingHours"`
4. Update weekdays or weekends
5. Click **"Save Changes"**

### Task 4: Add a New Branch Landmark

1. Go to `/admin`
2. Click **"Contact Information"**
3. Find `"nearbyLandmarks"` for the branch
4. Add a new item: `"Your new landmark here"`
5. Don't forget the comma after the previous line!
6. Click **"Save Changes"**

---

## 🚨 Troubleshooting

### Error: "Invalid JSON format"

**Problem:** You have a syntax error (missing comma, extra bracket, etc.)

**Solution:**
1. Click the **"Reset"** button to undo your changes
2. Try editing again, being careful with commas and quotes
3. Or ask for help!

### Error: "Failed to save file"

**Problem:** Network issue or permissions problem

**Solution:**
1. Check your internet connection
2. Try refreshing the page
3. Try saving again

### Changes Not Showing on Website

**Problem:** Browser cache

**Solution:**
1. Hard refresh your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Wait 1-2 minutes for changes to propagate

---

## 📞 Need Help?

If you get stuck or want to update something complex:
- Contact your web developer
- Or ask in the chat where this website was created

---

## 🎯 Best Practices

1. **Edit one section at a time** - Don't make too many changes at once
2. **Preview before major changes** - Test small edits first
3. **Keep a backup** - Copy the original text before editing
4. **Be consistent** - Use the same style/formatting throughout
5. **Save frequently** - Don't lose your work!

---

## 🔐 Security Note

The admin panel is currently **open** (no login required). For production:
- Keep the `/admin` URL private
- Consider adding password protection
- Only share with trusted staff

---

## 📂 File Structure Reference

```
public/content/
├── home.json           ← Home page content
├── contact.json        ← Contact information
├── site-settings.json  ← Global settings
└── about.json          ← About us page

public/
└── blog-data.json      ← All blog posts
```

---

## 🎉 You're All Set!

You can now edit your website content anytime, anywhere - just like Wix! 

**Admin URL:** https://mindcentre.abacusai.app/admin

Happy editing! 🚀

---

*Last updated: October 17, 2025*
