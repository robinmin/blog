---
name: Convert scripts process_blog into typescript
description: <prompt description>
status: Done
created_at: 2025-12-06 19:06:22
updated_at: 2025-12-11 13:20:11
---

## Convert scripts process_blog into typescript

### Background
Despite we already implemented the process_blog script in python, as it will be a long term used script, to reduce the technical complexity, we should convert it into typescript as it will align with the rest of the codebase. Meanwhile, for the major depedency of Claude Agent SDK, Anthropic has already released the official npm package, so we can use it instead of the python one. We can install it via the following command:

```bash
npm install @anthropic-ai/claude-agent-sdk
```

### Requirements / Objectives
Besides all features defined in both @docs/prompts/0002_Implement_claude_agent_sdk.md and its inplementation in @scripts/process_blog.py, we need to implement the following features:
- Single entry point with multiple subcommands support. This single entry point in file @scripts/process_blog.ts should be able to handle all the subcommands defined in the dedicated folder @scripts/cmd. Each file in this folder should be a subcommand with the same name as the filename. So far, we only support the following subcommands:
    - `new`: create a new blog post in markdown format based on the template.
    - `prepare`: prepare all relevant information in the frontmatter of the markdown file. This is the place we implemented in @scripts/process_blog.py. It is composed by a set of subcommands, like `prepare-title`, `prepare-metadata`, `prepare-images`, etc. The key is that for all of these prepare subcommands, we only enhance the frontmatter of the markdown file, instead of the content of the markdown file.
    - `prepare-metadata`: prepare all relevant title, tags, abstract and SEO information in the frontmatter of the markdown file based on the content of the markdown file. It's a part of the prepare subcommand.
    - `prepare-images`: prepare all relevant images and thumbnail image in the frontmatter of the markdown file based on the content of the markdown file. It's a part of the prepare subcommand.
- All common parts should be extracted into a dedicated file @scripts/common.ts. Fat common parts.
- All prompts should be wrapped as a single function if any.

### Solutions / Goals

----

## Verify and enhance the implementation logic for subcommand `prepare-metadata` and `prepare-images`
### Background
As we already implemented the subcommand `prepare-metadata` and `prepare-images` in @scripts/process_blog.py, we need to verify and enhance the implementation logic for these two subcommands. 

### Requirements / Objectives
We need to verify whether the implementation logic for subcommand `prepare-metadata` and `prepare-images` is correct and enhance it if necessary:
- Subcommand `prepare-metadata` should be able to generate all relevant title, tags, abstract and SEO information in the frontmatter of the markdown file based on the content of the markdown file. It also should contain attributes `illustration_prompt` and `thumbnail_prompt` in the frontmatter of the markdown file. We need to generate these two prompts based on the content of the markdown file instead of generating them in the subcommand `prepare-images`. That means we need to generate all attributes in the frontmatter of the markdown file based on one comprehensive analysis of the content of the markdown file. This will help us to save tokens and reduce the times to having conversation analysis on the content of the markdown file. And, more importantly, it will give the end user the chance to enhance or adjust these prompts manually.

- Subcommand `prepare-images` should be able to generate all relevant images and thumbnail image in the frontmatter of the markdown file majorly based on the attributes `illustration_prompt` and `thumbnail_prompt` in the frontmatter of the markdown file. It also can refer to the content of the markdown file to generate the images to fine tune the images if necessary. To make it simple, it we can not see the value of attributes `illustration_prompt` in the frontmatter of the markdown file, we can just skip this step and response some hints to the end user. 

Meanwhile, 
- I also see that, there are some attributes in the `seo` section in the frontmatter of the markdown file, like `title`, `description`, `keywords`, etc. We majorly share the contents to twitter, wechat, Facebook, LinkedIn, Telegram, etc. So, is there anything we can do to generage OG for these platforms?

### Solutions / Goals
Comfirm and answer my questions first, then we need to work out the solid plan to implement or enhance them as expected.

### References
