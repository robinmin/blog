---
name: add i18n support
description: <prompt description>
status: Backlog
created_at: 2025-12-11 16:16:12
updated_at: 2025-12-11 16:16:12
---

## add i18n support

### Background
We need to add i18n support to the blog website.
### Requirements / Objectives
- We only support English, Chinese and Japanese.
- We use `astro-i18n` to implement i18n.
- Add a language switcher to the header with flags only no text.
- The default language is English.
- Centralize the i18n configuration in `config/i18n.ts`.
- As we defined category very limited, we can support i18n for category. It means we will see "科技" in Chinese and "Technology" in English if a blog has been categorized as "tech" automatically. So far we only support the following categories: "tech", "humanities", "daydreams", , "life" and "unknown".
- But for tags, we do not support i18n for tags. We just output the tags as it is.

### Solutions / Goals

### References
