#!/usr/bin/env python3
"""
Sync experiments from wiz-page to wiz-experiments GitHub repo.
Used for both initial population and daily automated sync.

Reads experiment metadata from wiz-page source files, copies page.tsx,
generates per-experiment READMEs, and regenerates the top-level README catalog.
"""

import os
import re
import shutil
from pathlib import Path

# Paths
WIZ_PAGE = Path("/Users/joozio/wiz/projects/wiz-page")
REPO_ROOT = Path(__file__).parent.parent
EXPERIMENTS_DIR = REPO_ROOT / "experiments"
EXPERIMENTS_SRC = WIZ_PAGE / "app" / "experiments"
TRANSLATIONS_FILE = WIZ_PAGE / "data" / "translations.ts"
INDEX_FILE = EXPERIMENTS_SRC / "Client.tsx"

# Standalone repos for graduated experiments
STANDALONE_REPOS = {
    "agent-arena": "https://github.com/joozio/agent-arena",
    "genesis-engine": "https://github.com/joozio/genesis-engine",
    "agent-orchestra": "https://github.com/joozio/agent-orchestra",
    "dungeon-of-opus": "https://github.com/joozio/dungeon-of-opus",
}

CATEGORY_INFO = {
    "laboratory": {"name": "The Laboratory", "emoji": "\U0001f9ea", "desc": "AI perspective"},
    "observatory": {"name": "The Observatory", "emoji": "\U0001f52d", "desc": "Scale and perspective"},
    "arcade": {"name": "The Arcade", "emoji": "\U0001f3ae", "desc": "Games and challenges"},
    "reflection": {"name": "The Chamber of Reflection", "emoji": "\U0001fa9e", "desc": "Introspection"},
}


def parse_experiments_index():
    """Parse experiment metadata from the experiments index page.tsx."""
    content = INDEX_FILE.read_text()

    # Extract the experiments array
    array_match = re.search(r"const experiments:\s*Experiment\[\]\s*=\s*\[(.*?)\];", content, re.DOTALL)
    if not array_match:
        raise RuntimeError("Could not find experiments array in page.tsx")

    array_text = array_match.group(1)

    experiments = []
    # Match each object in the array
    for obj_match in re.finditer(
        r"\{\s*slug:\s*'([^']+)'\s*,\s*nameKey:\s*'([^']+)'\s*,\s*descKey:\s*'([^']+)'\s*,\s*emoji:\s*'([^']+)'\s*,\s*category:\s*'([^']+)'",
        array_text,
    ):
        slug, name_key, desc_key, emoji, category = obj_match.groups()
        # Skip cross-references to mini-apps
        if slug.startswith(".."):
            continue
        experiments.append({
            "slug": slug,
            "nameKey": name_key,
            "descKey": desc_key,
            "emoji": emoji,
            "category": category,
        })

    return experiments


def parse_translations():
    """Parse English translations from translations.ts."""
    content = TRANSLATIONS_FILE.read_text()

    # Extract English section (first 'en:' block)
    en_match = re.search(r"en:\s*\{(.*?)(?:\n  \},|\n  \}$)", content, re.DOTALL)
    if not en_match:
        raise RuntimeError("Could not find English translations")

    en_text = en_match.group(1)

    translations = {}
    for match in re.finditer(r"(\w+):\s*[\"'](.+?)[\"']\s*,?\s*$", en_text, re.MULTILINE):
        key, value = match.groups()
        translations[key] = value

    return translations


def count_lines(filepath):
    """Count lines in a file."""
    try:
        return sum(1 for _ in open(filepath))
    except FileNotFoundError:
        return 0


def generate_experiment_readme(exp, translations):
    """Generate a mini README for a single experiment."""
    name = translations.get(exp["nameKey"], exp["slug"])
    desc = translations.get(exp["descKey"], "")
    slug = exp["slug"]
    emoji = exp["emoji"]
    category = exp["category"]
    cat_info = CATEGORY_INFO.get(category, {"name": category, "emoji": "", "desc": ""})

    src_file = EXPERIMENTS_SRC / slug / "page.tsx"
    lines = count_lines(src_file)

    readme = f"""# {emoji} {name}

> {desc}

**Category:** {cat_info['emoji']} {cat_info['name']}
**Live demo:** [wiz.jock.pl/experiments/{slug}](https://wiz.jock.pl/experiments/{slug})
**Lines of code:** {lines}
"""

    if slug in STANDALONE_REPOS:
        readme += f"\n**Standalone repo:** [{slug}]({STANDALONE_REPOS[slug]})\n"

    readme += f"""
## About

Single-file React experiment. Client-side only, no API calls, no data collection.

Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
"""

    return readme


def generate_top_readme(experiments, translations):
    """Generate the top-level README catalog."""
    readme = """# Wiz Experiments

> 30+ interactive experiments built by an AI agent, directed by a human.
> Live at [wiz.jock.pl/experiments](https://wiz.jock.pl/experiments)

**Human idea. AI execution.**

Every experiment here was built by [Wiz](https://wiz.jock.pl), an autonomous AI agent.
The creative direction comes from [Pawel Jozefiak](https://thoughts.jock.pl).
The code is 100% AI-generated.

"""

    # Group by category
    by_category = {}
    for exp in experiments:
        cat = exp["category"]
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(exp)

    # Render each category
    category_order = ["laboratory", "observatory", "arcade", "reflection"]
    for cat_key in category_order:
        cat_exps = by_category.get(cat_key, [])
        if not cat_exps:
            continue
        cat = CATEGORY_INFO[cat_key]
        readme += f"## {cat['emoji']} {cat['name']}\n"
        readme += f"*{cat['desc']}*\n\n"
        readme += "| Experiment | Description | Demo |\n"
        readme += "|-----------|-------------|------|\n"
        for exp in cat_exps:
            name = translations.get(exp["nameKey"], exp["slug"])
            desc = translations.get(exp["descKey"], "")
            # Truncate long descriptions for the table
            if len(desc) > 80:
                desc = desc[:77] + "..."
            slug = exp["slug"]
            readme += f"| [{name}](experiments/{slug}/) | {desc} | [Try it](https://wiz.jock.pl/experiments/{slug}) |\n"
        readme += "\n"

    # Graduated experiments
    readme += """## Graduated Experiments

These experiments grew into their own standalone repositories:

"""
    for slug, url in sorted(STANDALONE_REPOS.items()):
        name = "Unknown"
        for exp in experiments:
            if exp["slug"] == slug:
                name = translations.get(exp["nameKey"], slug)
                break
        readme += f"- [{name}]({url})\n"

    readme += """
## How These Are Made

1. Pawel writes a creative brief (the "what" and "why")
2. Wiz (Claude Code agent) builds the experiment as a single-file React component
3. Automated pipeline deploys to [wiz.jock.pl](https://wiz.jock.pl) daily
4. New experiments are pushed to this repo automatically

Read more: [I Told My AI to Build Apps Every Day](https://thoughts.jock.pl/p/directed-ai-experiments-vibe-business)

## Tech Stack

- Single-file `'use client'` React components
- Next.js App Router + Tailwind CSS
- Zero external API calls -- everything runs client-side
- No data collection, no tracking

## License

MIT

---

Built by [Wiz](https://wiz.jock.pl) | Directed by [Pawel Jozefiak](https://thoughts.jock.pl) | [@joozio](https://x.com/joozio)
"""
    return readme


def main():
    print("Syncing experiments to GitHub repo...")

    # Parse sources
    experiments = parse_experiments_index()
    translations = parse_translations()
    print(f"Found {len(experiments)} experiments")

    # Ensure experiments directory exists
    EXPERIMENTS_DIR.mkdir(exist_ok=True)

    # Sync each experiment
    synced = 0
    for exp in experiments:
        slug = exp["slug"]
        src_file = EXPERIMENTS_SRC / slug / "page.tsx"

        if not src_file.exists():
            print(f"  SKIP {slug}: no page.tsx found")
            continue

        dest_dir = EXPERIMENTS_DIR / slug
        dest_dir.mkdir(exist_ok=True)

        # Copy page.tsx
        shutil.copy2(src_file, dest_dir / "page.tsx")

        # Generate README
        readme = generate_experiment_readme(exp, translations)
        (dest_dir / "README.md").write_text(readme)

        synced += 1

    print(f"Synced {synced} experiments")

    # Generate top-level README
    readme = generate_top_readme(experiments, translations)
    (REPO_ROOT / "README.md").write_text(readme)
    print("Generated top-level README.md")

    print("Done.")


if __name__ == "__main__":
    main()
