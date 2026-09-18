#!/usr/bin/env python3
"""
Sync experiments from wiz-page to wiz-experiments GitHub repo.
Used for both initial population and daily automated sync.

Reads experiment metadata from wiz-page source files, copies every file in each
experiment directory (page.tsx, Client.tsx and any copy/translation data next to
them), generates per-experiment READMEs that describe what was actually copied,
and regenerates the top-level README catalog.
"""

import os
import re
import shutil
from pathlib import Path

# Paths
# Resolve wiz-page across machines (Mac Mini user=wiz, MacBook user=joozio).
WIZ_PAGE = next(
    (p for p in (
        Path("/Users/wiz/wiz/projects/wiz-page"),
        Path("/Users/joozio/wiz/projects/wiz-page"),
        Path.home() / "wiz/projects/wiz-page",
    ) if p.exists()),
    Path("/Users/wiz/wiz/projects/wiz-page"),
)
REPO_ROOT = Path(__file__).parent.parent
EXPERIMENTS_DIR = REPO_ROOT / "experiments"
EXPERIMENTS_SRC = WIZ_PAGE / "app" / "experiments"
TRANSLATIONS_FILE = WIZ_PAGE / "data" / "translations.ts"
# Experiments metadata moved from app/experiments/Client.tsx to
# data/experiments.ts in the wiz-page refactor; support both layouts.
INDEX_FILE = next(
    (f for f in (WIZ_PAGE / "data/experiments.ts", EXPERIMENTS_SRC / "Client.tsx") if f.exists()),
    WIZ_PAGE / "data/experiments.ts",
)

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


def decode_ts_escapes(text):
    """Turn TypeScript \\u{1F300} / \\uD83C escapes into the character itself."""
    def sub(m):
        return chr(int(m.group(1) or m.group(2), 16))
    return re.sub(r"\\u\{([0-9A-Fa-f]+)\}|\\u([0-9A-Fa-f]{4})", sub, text)


def parse_experiments_index():
    """Parse experiment metadata from the experiments index page.tsx."""
    content = INDEX_FILE.read_text()

    # Extract the experiments array
    array_match = re.search(r"(?:export\s+)?const experiments:\s*Experiment\[\]\s*=\s*\[(.*?)\];", content, re.DOTALL)
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
            # A handful of index entries write the emoji as a TS escape
            # (\u{1F300}); readers of a README want the character.
            "emoji": decode_ts_escapes(emoji),
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


# Files we never mirror out of a source experiment directory.
SKIP_NAMES = {".DS_Store"}

# The files this script owns in a mirrored directory, and so may remove when
# the source drops them. Anything else there was put there by hand; leave it.
MANAGED_NAMES = {"page.tsx", "Client.tsx"}


def source_files(slug):
    """Every mirrorable file in an experiment's source directory.

    An experiment is usually page.tsx (server component, metadata) plus
    Client.tsx (the experiment itself), and sometimes carries copy or
    translation files next to them. Copying only page.tsx left 223 of 226
    mirrored experiments as a stub importing a ./Client that was never there,
    so the rule is: mirror the whole directory, then describe what landed.
    """
    src_dir = EXPERIMENTS_SRC / slug
    if not src_dir.is_dir():
        return []
    files = [
        f for f in src_dir.iterdir()
        if f.is_file() and not f.name.startswith(".") and f.name not in SKIP_NAMES
    ]
    # page.tsx first, Client.tsx second, then the rest alphabetically: the
    # order a reader wants, not the order the filesystem hands back.
    rank = {"page.tsx": 0, "Client.tsx": 1}
    return sorted(files, key=lambda f: (rank.get(f.name, 2), f.name))


def sync_experiment_files(slug, dest_dir):
    """Copy the whole source directory into the mirror, return copied names.

    Stale copies of the two files this script manages are dropped when the
    source stops having them, so collapsing Client.tsx back into page.tsx
    upstream cannot leave a dead component behind. Everything else in the
    directory is left alone: a few old experiments carry hand-made artifacts
    (a standalone index.html, for one) that no source directory can regenerate.
    """
    copied = []
    for src in source_files(slug):
        shutil.copy2(src, dest_dir / src.name)
        copied.append(src.name)

    for name in MANAGED_NAMES - set(copied):
        stale = dest_dir / name
        if stale.is_file():
            stale.unlink()

    return copied


def describe_files(files):
    """One honest sentence about what this directory actually contains."""
    names = set(files)
    if names == {"page.tsx"}:
        return ("One file. `page.tsx` is a `'use client'` component holding the "
                "whole experiment.")

    base = ""
    if "page.tsx" in names and "Client.tsx" in names:
        base = ("`page.tsx` is the server component carrying the route metadata; "
                "`Client.tsx` is the `'use client'` component that is the experiment.")
    elif "Client.tsx" in names:
        base = "`Client.tsx` is the `'use client'` component that is the experiment."
    elif "page.tsx" in names:
        base = "`page.tsx` is the route component."

    extras = sorted(n for n in names if n not in ("page.tsx", "Client.tsx"))
    if extras:
        listed = ", ".join(f"`{n}`" for n in extras)
        verb = "sits" if len(extras) == 1 else "sit"
        base += f" {listed} {verb} alongside them as copy and translation data."

    words = {2: "Two", 3: "Three", 4: "Four", 5: "Five"}
    count = words.get(len(files), str(len(files)))
    return f"{count} files. {base}".strip()


def shared_imports(dest_dir, files):
    """Imports that point outside the directory, at the wiz-page app."""
    found = set()
    for name in files:
        path = dest_dir / name
        try:
            text = path.read_text()
        except (OSError, UnicodeDecodeError):
            continue
        found.update(re.findall(r"from '(@/[^']+|\.\.?/\.\.[^']*)'", text))
    return sorted(found)


def readme_header(exp, translations):
    """The title, description and category block, from index metadata."""
    name = translations.get(exp["nameKey"], exp["slug"])
    desc = translations.get(exp["descKey"], "")
    slug = exp["slug"]
    cat_info = CATEGORY_INFO.get(
        exp["category"], {"name": exp["category"], "emoji": "", "desc": ""}
    )

    return f"""# {exp['emoji']} {name}

> {desc}

**Category:** {cat_info['emoji']} {cat_info['name']}
**Live demo:** [wiz.jock.pl/experiments/{slug}](https://wiz.jock.pl/experiments/{slug})
"""


def salvage_header(dest_dir, slug):
    """The header of an already-mirrored README, for a slug the index dropped.

    An experiment that leaves data/experiments.ts keeps its directory here (the
    repo is the archive, and the page usually stays live), but nothing can
    regenerate its name, emoji or category any more. Keep the curated header
    that earlier syncs wrote and rebuild only the parts that describe files.
    """
    path = dest_dir / "README.md"
    if path.is_file():
        head = path.read_text().split("**Lines of code:**")[0].rstrip()
        if head.startswith("#"):
            return head + "\n"
    return (f"# {slug}\n\n**Live demo:** "
            f"[wiz.jock.pl/experiments/{slug}](https://wiz.jock.pl/experiments/{slug})\n")


def generate_experiment_readme(header, slug, files, dest_dir):
    """Generate a mini README for a single experiment."""
    line_counts = [(n, count_lines(dest_dir / n)) for n in files]
    total_lines = sum(n for _, n in line_counts)

    readme = header + f"**Lines of code:** {total_lines}\n"

    if slug in STANDALONE_REPOS:
        readme += f"\n**Standalone repo:** [{slug}]({STANDALONE_REPOS[slug]})\n"

    readme += "\n## Files\n\n| File | Lines |\n|------|-------|\n"
    for fname, count in line_counts:
        readme += f"| `{fname}` | {count} |\n"

    readme += f"""
## About

{describe_files(files)} Client-side only, no API calls, no data collection.
"""

    shared = shared_imports(dest_dir, files)
    if shared:
        listed = ", ".join(f"`{s}`" for s in shared)
        readme += (
            f"\nMirrored verbatim from the site, so the imports {listed} still point "
            "at the wiz.jock.pl app and are not part of this directory. Read this as "
            "source, not as a standalone build.\n"
        )

    readme += """
Built by [Wiz](https://wiz.jock.pl) -- an AI agent directed by [Pawel Jozefiak](https://thoughts.jock.pl).

Human idea. AI execution.

## Tech

- React (Next.js App Router)
- Tailwind CSS
- `'use client'` component
"""

    return readme


def clean_desc(desc, limit=None):
    """Mirror a description without carrying a dash into this repo.

    A handful of the older wiz-page descriptions still use an em dash. This repo
    is written text, and written text here has none, so swap it rather than
    copy it through.
    """
    desc = desc.replace(" \u2014 ", ", ").replace(" \u2013 ", ", ")
    desc = desc.replace("\u2014", ", ").replace("\u2013", ", ")
    if limit and len(desc) > limit:
        desc = desc[: limit - 3] + "..."
    return desc


def parse_lab_slugs():
    """The 15 slugs wiz.jock.pl/experiments actually lists, in display order.

    Empty if the constant is missing, which is the honest fallback: the README
    then just describes the full catalog without claiming a lab that the site
    does not have.
    """
    m = re.search(r"export const LAB_SLUGS = \[(.*?)\] as const;",
                  INDEX_FILE.read_text(), re.DOTALL)
    return re.findall(r"'([^']+)'", m.group(1)) if m else []


def generate_top_readme(experiments, translations):
    """Generate the top-level README catalog."""
    lab_slugs = parse_lab_slugs()
    total = len(experiments)

    readme = f"""# Wiz Experiments

> The complete archive: {total} interactive experiments built by an AI agent, directed by a human.
> The site shows a curated lab of {len(lab_slugs)}; this repo keeps all {total}.
> Live at [wiz.jock.pl/experiments](https://wiz.jock.pl/experiments)

**Human idea. AI execution.**

Every experiment here was built by [Wiz](https://wiz.jock.pl), an autonomous AI agent.
The creative direction comes from [Pawel Jozefiak](https://thoughts.jock.pl).
The code is 100% AI-generated.

Since September 2026 the site lists {len(lab_slugs)} experiments at a time, with a new one
every week, and every other experiment stays live in
[the archive](https://wiz.jock.pl/experiments/archive/). Nothing was deleted, and this
repo is the full catalog either way.

"""

    if lab_slugs:
        by_slug = {e["slug"]: e for e in experiments}
        readme += "## \u2b50 The Lab (currently on the site)\n\n"
        readme += "| Experiment | Description | Demo |\n"
        readme += "|-----------|-------------|------|\n"
        for slug in lab_slugs:
            exp = by_slug.get(slug)
            if not exp:
                continue
            name = translations.get(exp["nameKey"], slug)
            desc = clean_desc(translations.get(exp["descKey"], ""), 80)
            readme += (f"| [{name}](experiments/{slug}/) | {desc} | "
                       f"[Try it](https://wiz.jock.pl/experiments/{slug}) |\n")
        readme += "\n"

    # Group by category
    by_category = {}
    for exp in experiments:
        cat = exp["category"]
        if cat not in by_category:
            by_category[cat] = []
        by_category[cat].append(exp)

    # Render each category. This is every experiment, lab and archive alike:
    # the repo is the archive, so it does not hide anything the site retired.
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
            # Truncate long descriptions for the table
            desc = clean_desc(translations.get(exp["descKey"], ""), 80)
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
2. Wiz (Claude Code agent) builds the experiment as a React client component
3. Automated pipeline deploys to [wiz.jock.pl](https://wiz.jock.pl)
4. New experiments are pushed to this repo automatically
5. The site keeps a curated lab of 15; everything else moves to the archive and stays live

Read more: [I Told My AI to Build Apps Every Day](https://thoughts.jock.pl/p/directed-ai-experiments-vibe-business)

## Tech Stack

- `'use client'` React components: `page.tsx` for route metadata, `Client.tsx` for the experiment
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

        if not source_files(slug):
            print(f"  SKIP {slug}: no source files found")
            continue

        dest_dir = EXPERIMENTS_DIR / slug
        dest_dir.mkdir(exist_ok=True)

        # Copy the whole experiment directory, not just page.tsx
        files = sync_experiment_files(slug, dest_dir)

        # Generate README describing what was actually copied
        readme = generate_experiment_readme(
            readme_header(exp, translations), slug, files, dest_dir)
        (dest_dir / "README.md").write_text(readme)

        synced += 1

    print(f"Synced {synced} experiments")

    # Directories the index no longer lists but the repo still archives. They
    # get no metadata refresh, but their files and file description stay true.
    indexed = {e["slug"] for e in experiments}
    repaired = 0
    for dest_dir in sorted(p for p in EXPERIMENTS_DIR.iterdir() if p.is_dir()):
        slug = dest_dir.name
        if slug in indexed or not source_files(slug):
            continue
        files = sync_experiment_files(slug, dest_dir)
        readme = generate_experiment_readme(
            salvage_header(dest_dir, slug), slug, files, dest_dir)
        (dest_dir / "README.md").write_text(readme)
        repaired += 1

    if repaired:
        print(f"Refreshed {repaired} archived experiment(s) no longer in the index")

    # Generate top-level README
    readme = generate_top_readme(experiments, translations)
    (REPO_ROOT / "README.md").write_text(readme)
    print("Generated top-level README.md")

    print("Done.")


if __name__ == "__main__":
    main()
