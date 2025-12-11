# Robin Min's Blog

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

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/robinmin/blog.git
    cd blog
    ```
2.  Install Node dependencies:
    ```bash
    pnpm install
    ```

### Development

Start the local server:

```bash
pnpm dev
```

Visit `http://localhost:4321` (or the port shown in terminal).

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
