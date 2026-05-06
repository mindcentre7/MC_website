#!/usr/bin/env python3
"""
Automated Internal Linking Script for Mind Centre Blog
Scans all posts and injects contextual internal links based on keyword phrase overlap.

Usage: python3 seo/inject-internal-links.py [--dry-run] [--max-links-per-post=5]
"""

import json
import re
import sys
import os
from collections import defaultdict
from typing import Dict, List, Set, Tuple

# ── Configuration ──────────────────────────────────────────
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(PROJECT_DIR, 'public', 'data', 'clean-blog-data.json')
OUTPUT_FILE = DATA_FILE  # Overwrite same file (backup first)
BACKUP_FILE = DATA_FILE + '.bak-internal-links'
BASE_URL = 'https://www.mindcentre.com.sg'

# Minimum phrase length to match (words)
MIN_PHRASE_LENGTH = 3
# Maximum internal links per post
MAX_LINKS = 5

# ── Phrase extraction ─────────────────────────────────────
def extract_key_phrases(title: str) -> List[str]:
    """Extract meaningful key phrases (2-5 words) from a post title."""
    # Clean title
    title = re.sub(r'[\[\]\(\)\?\:\.\,\!\@\#\$\%\^\&\*]', '', title)
    title = re.sub(r'\s+', ' ', title).strip().lower()
    
    words = title.split()
    phrases = []
    
    # Generate all contiguous 2-5 word phrases
    for length in range(2, min(6, len(words) + 1)):
        for i in range(len(words) - length + 1):
            phrase = ' '.join(words[i:i+length])
            # Skip short/meaningless phrases
            if len(phrase.replace(' ', '')) >= 8:
                phrases.append(phrase)
    
    # Also add individual significant words (4+ chars)
    for w in words:
        if len(w) >= 4 and w not in ('this', 'that', 'with', 'from', 'your', 'have', 'what', 'when', 'where', 'which', 'about', 'their', 'there'):
            phrases.append(w)
    
    return sorted(set(phrases), key=len, reverse=True)  # Longest first

# ── Link injection ────────────────────────────────────────
def inject_links(content: str, matches: List[Tuple[str, str, str]]) -> str:
    """
    Inject contextual links into HTML content.
    matches: list of (phrase, post_title, slug) tuples
    """
    if not matches:
        return content
    
    links_added = 0
    
    for phrase, post_title, slug in matches:
        if links_added >= MAX_LINKS:
            break
        
        url = f"{BASE_URL}/blog/{slug}"
        
        # Case-insensitive search for the phrase
        pattern = re.compile(r'\b(' + re.escape(phrase) + r')\b', re.IGNORECASE)
        
        # Only replace first occurrence that's NOT already inside an <a> tag
        def replace_first_not_in_link(m):
            # Check if this match is inside an <a> tag
            before = content[:m.start()]
            open_tags = len(re.findall(r'<a\b', before))
            close_tags = len(re.findall(r'</a>', before))
            if open_tags > close_tags:
                return m.group(0)  # Inside a link, don't modify
            
            # Is it inside an HTML tag?
            last_open = before.rfind('<')
            last_close = before.rfind('>')
            if last_open > last_close:
                return m.group(0)  # Inside a tag attribute, skip
            
            return f'<a href="{url}" title="{post_title}">{m.group(0)}</a>'
        
        new_content = pattern.sub(replace_first_not_in_link, content, count=1)
        if new_content != content:
            links_added += 1
            content = new_content
    
    return content

# ── Related posts section ─────────────────────────────────
def add_related_posts(content: str, related: List[Tuple[str, str]]) -> str:
    """Append a 'Related Posts' section at the bottom of the content."""
    if not related:
        return content
    
    related_html = '\n<div class="related-posts" style="margin-top:2rem;padding:1rem;background:#f9fafb;border-radius:0.5rem">\n'
    related_html += '<h3 style="font-size:1.25rem;font-weight:700;margin-bottom:0.75rem">📚 Related Posts</h3>\n<ul style="list-style:none;padding:0;margin:0">\n'
    
    for title, slug in related[:4]:  # Max 4 related posts
        related_html += f'  <li style="margin-bottom:0.5rem">→ <a href="{BASE_URL}/blog/{slug}" style="color:#7c3aed;text-decoration:none">{title}</a></li>\n'
    
    related_html += '</ul>\n</div>'
    
    # Append before closing if there's a closing container
    return content + related_html

# ── Main ──────────────────────────────────────────────────
def main(dry_run=False):
    print("🔍 Loading blog data...")
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        posts = json.load(f)
    
    print(f"   Loaded {len(posts)} posts")
    
    # Build phrase index: phrase → [(slug, title, post_id), ...]
    phrase_index: Dict[str, List[Tuple[str, str, int]]] = defaultdict(list)
    
    for post in posts:
        if not post.get('content') or len(post['content']) < 20:
            continue
        
        phrases = extract_key_phrases(post['title'])
        for phrase in phrases:
            phrase_index[phrase].append((post['slug'], post['title'], post['id']))
    
    print(f"   Built phrase index: {len(phrase_index)} unique phrases")
    
    # Process each post
    modified_count = 0
    total_links = 0
    
    for post in posts:
        if not post.get('content') or len(post['content']) < 50:
            continue
        
        slug = post['slug']
        title = post['title']
        content = post['content']
        post_id = post['id']
        
        # Find matching phrases from OTHER posts' titles
        matches: List[Tuple[str, str, str, int]] = []  # (phrase, matched_title, matched_slug, score)
        seen_slugs: Set[str] = set()
        
        # Get phrases from THIS post's title
        my_phrases = set(extract_key_phrases(title))
        
        # Scan content for phrases from other posts
        content_lower = content.lower()
        
        for phrase, candidates in phrase_index.items():
            if phrase in content_lower:
                for candidate_slug, candidate_title, candidate_id in candidates:
                    if candidate_slug == slug or candidate_slug in seen_slugs:
                        continue
                    
                    # Calculate relevance score
                    score = len(phrase)  # Longer phrase = more specific match
                    
                    # Bonus: candidate's key phrase matches this post's title
                    candidate_phrases = set(extract_key_phrases(candidate_title))
                    overlap = len(my_phrases & candidate_phrases)
                    score += overlap * 10
                    
                    matches.append((phrase, candidate_title, candidate_slug, score))
                    seen_slugs.add(candidate_slug)
        
        # Sort by score, take top N
        matches.sort(key=lambda x: -x[3])
        top_matches = [(p, t, s) for p, t, s, _ in matches[:MAX_LINKS]]
        
        if top_matches:
            # Inject links
            new_content = inject_links(content, top_matches)
            
            # Add related posts section
            related = [(t, s) for _, t, s in top_matches[:4]]
            new_content = add_related_posts(new_content, related)
            
            if new_content != content:
                post['content'] = new_content
                modified_count += 1
                total_links += len(top_matches)
                if dry_run:
                    print(f"   [DRY RUN] {slug}: would add {len(top_matches)} links")
                    print(f"      Matches: {', '.join(t for _,t,_ in top_matches[:3])}")
    
    print(f"\n📊 Results:")
    print(f"   Posts modified: {modified_count}/{len(posts)}")
    print(f"   Total links injected: {total_links}")
    
    if dry_run:
        print("\n⚠ DRY RUN — no changes written.")
        return
    
    # Backup original
    import shutil
    shutil.copy2(DATA_FILE, BACKUP_FILE)
    print(f"\n💾 Backup saved: {BACKUP_FILE}")
    
    # Write updated data
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Written: {OUTPUT_FILE}")
    print(f"\n🔗 Link injection complete!")
    print(f"   To rebuild site: cd {PROJECT_DIR} && npx next build")
    print(f"   To restore backup: cp {BACKUP_FILE} {DATA_FILE}")

if __name__ == '__main__':
    dry_run = '--dry-run' in sys.argv
    main(dry_run=dry_run)
