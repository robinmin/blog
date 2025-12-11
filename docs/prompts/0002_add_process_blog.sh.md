---
name: add process_blog.sh
description: <prompt description>
status: Done
created_at: 2025-12-05 22:01:58
updated_at: 2025-12-11 13:20:07
---

## add process_blog.sh

### Background
As we already have the legacy blog posts migrated to the new format, we need to process them to ensure they are valid and have all the necessary metadata. Meanwhile, we also need to make it's description and tags more accurate. So we need to add a script to do this. It not only used to process the legacy blog posts, but also used to process the new blog posts.

### Requirements / Objectives
- First of all, we need to define the metadata schema for the blog posts. Not only what we had so far, bu also we need to add new fields for further use. For example, we need to add fields for SEO and social media sharing and analytics. I need you have a clear understanding of the metadata schema and the figure out a plan to implement it. Then we need ti figure out which fields are required and which are optional.
- Then we need to add a script to process the blog posts. It should be able to process both legacy and new blog posts. It should be able to:
    - Check the required fields are present and valid.
    - Update the description and tags based on the content -- with AI help.
    - Update the category and tags based on the content -- with AI help.
    - Reserve position for further content enhancement with AI help  -- not in current scope but we need to reserve the position for future use.
    - Generate article illustration for the blog post based on the content -- with AI help. This is cost sensitive, so we need to add a special control flag to enable or disable this feature. By default, it should be disabled.
    - Generate thumbnail image for the blog post based on the content -- with AI help. This is cost sensitive, so we need to add a special control flag to enable or disable this feature. By default, it should be disabled.
- This script will accept two arguments: The first one is required, it is the path to the input blog post file. The second one is optional, it is a flag to enable or disable the AI features for the generation of article illustration and thumbnail image. By default, it should be disabled. The output file should be the same as the input file, but with a suffix added to the filename "_new" before the file extension.
- This is an also a learn tiny project for Anthroppic's Claude Agent SDK. We need to use it to build a simple agent to process the blog posts (I already add ANTHROPIC_BASE_URL and ANTHROPIC_AUTH_TOKEN to file .env). This .env file is local only and should not be committed to the repository.
- The other script may be one off usage for now, but this one is expected to be used frequently. So we must make it as simple and robust as possible.

### Solutions / Goals
- Got a solid plan to implement the script, then confirm with me before starting to implement it.
- Then implement the script as planned.

### References
