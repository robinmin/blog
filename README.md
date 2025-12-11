# Robin's Blog

A modern, minimal personal blog built with [Astro](https://astro.build) and [TailwindCSS](https://tailwindcss.com), based on the [Stablo](https://stablo-pro.web3templates.com/) template.

This project features a custom AI-driven workflow for content enrichment using Anthropic's Claude.

## Features

- **Astro + MDX**: Fast, content-focused architecture.
- **Dynamic Categories**: Posts are automatically categorized (Tech, Humanities, Life, Reverie).
- **AI Processing**: Automated metadata generation (SEO, Tags, Descriptions) using Claude 3.5 Sonnet.
- **Clean UI**: Minimalist design with Dark Mode support.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.10+ (for AI scripts)
- Anthropic API Key (for `process_blog.sh`)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/new_blog.git
    cd new_blog
    ```
2.  Install Node dependencies:
    ```bash
    npm install
    ```
3.  Install Python dependencies:
    ```bash
    python3 -m pip install -r requirements.txt
    # Or manually: pip install claude-agent-sdk python-frontmatter python-dotenv
    ```

### Development

Start the local server:

```bash
npm run dev
```

Visit `http://localhost:4321` (or the port shown in terminal).

## AI Blog Processing

We use a custom Python script to enrich blog posts with SEO metadata, tags, and AI-generated image prompts.

### Usage

1.  **Draft your post** as a Markdown file (e.g., `src/blog_posts/my-new-post.md`).
2.  **Run the processing script**:
    ```bash
    ./process_blog.sh "src/blog_posts/my-new-post.md"
    ```
3.  **Review the output**:
    - The script will generate a new file with the `_new.md` suffix (e.g., `src/blog_posts/my-new-post_new.md`).
    - Check the new frontmatter for `seo` fields, AI-suggested tags, and `ai.illustration_prompt`.
    - If satisfied, rename it to replace the original.

### Configuration
Ensure your `.env` file contains your Anthropic credentials:
```env
ANTHROPIC_AUTH_TOKEN="sk-ant-..."
```

## References

- [Stablo Template](https://stablo-pro.web3templates.com/) - The visual foundation of this blog.
- [Astro Documentation](https://docs.astro.build)
- [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk-python)
- [Web3Templates](https://web3templates.com)
