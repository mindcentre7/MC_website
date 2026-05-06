#!/usr/bin/env python3
"""
GEO Content Optimizer — Add TL;DR summaries, FAQ sections, and proper heading hierarchy
to Mind Centre blog posts for AI extraction (ChatGPT, Perplexity, Google SGE).

Usage: python3 seo/optimize-content-geo.py [--dry-run] [--top-n=30]
"""

import json
import re
import sys
import os
import shutil
from datetime import datetime

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(PROJECT_DIR, 'public', 'data', 'clean-blog-data.json')
BACKUP_FILE = DATA_FILE + '.bak-geo-optimize'

# ── TL;DR Generator ───────────────────────────────────────
def generate_tldr(content: str, title: str) -> str:
    """Generate a TL;DR summary from post content."""
    # Strip HTML
    clean = re.sub(r'<[^>]*>', ' ', content)
    clean = re.sub(r'\s+', ' ', clean).strip()
    
    if not clean:
        return f"A brief overview of {title.lower()}."
    
    # Try to find the best summary paragraph
    sentences = re.split(r'(?<=[.!?])\s+', clean)
    
    # Use first 1-2 sentences (up to 200 chars)
    summary = ''
    for s in sentences:
        if len(summary) + len(s) < 200:
            summary += s + ' '
        else:
            break
    
    summary = summary.strip()
    if len(summary) < 30:
        summary = clean[:200].strip()
    
    return summary

# ── FAQ Generator ─────────────────────────────────────────
def generate_faqs(content: str, title: str) -> list:
    """Generate FAQ questions from post content heuristics."""
    faqs = []
    clean = re.sub(r'<[^>]*>', ' ', content)
    clean = re.sub(r'\s+', ' ', clean).strip()
    clean_lower = clean.lower()
    
    # Heuristic FAQ generation based on content topics
    topic_map = [
        (r'\bmath|\bcalculation|\balgebra|\bgeometry|\btrigonometry|\bcalculus', 
         [f"What is the main math concept covered in '{title}'?",
          "How can students apply this math technique in exams?"]),
        (r'\bscience|\bexperiment|\bchemical|\bbiology|\bphysics|\bchemistry',
         [f"What scientific concept does '{title}' explain?",
          "Why is this science topic important for students?"]),
        (r'\benglish|\bwriting|\bessay|\bcomposition|\bgrammar',
         [f"What writing skill does '{title}' teach?",
          "How can this improve exam performance?"]),
        (r'\bstudy|\blearn|\bmemory|\bexam|\brevision|\bfeynman|\bmind map',
         [f"How does the technique in '{title}' improve learning?",
          "What are the practical steps to apply this method?"]),
        (r'\bpsle|\bprimary|\bp[1-6]\b',
         [f"How does '{title}' help with PSLE preparation?",
          "What common mistakes do students make with this topic?"]),
        (r'\bo.level|\bo-level|\bsecondary|\bsec[1-4]\b',
         [f"How is '{title}' tested in O-Level exams?",
          "What scoring techniques work for this topic?"]),
        (r'\ba.level|\ba-level|\bjc|\bh2|\bh1|\bgp|\beconomics',
         [f"How does '{title}' apply to A-Level exams?",
          "What are the key points JC students should remember?"]),
        (r'\bproblem|\bsolution|\bsolve|\bstrategy|\bheuristic',
         [f"What problem-solving approach does '{title}' demonstrate?",
          "How can students practice this problem-solving method?"]),
    ]
    
    for pattern, questions in topic_map:
        if re.search(pattern, clean_lower):
            for q in questions:
                # Get a relevant passage as the answer
                answer = extract_answer_passage(clean, q)
                faqs.append({"question": q, "answer": answer})
            if len(faqs) >= 3:
                break
    
    # If no topic matches, use generic
    if not faqs:
        faqs = [
            {"question": f"What is '{title}' about?",
             "answer": clean[:200].strip() + ('...' if len(clean) > 200 else '')},
            {"question": "Who is this article for?",
             "answer": "Students, parents, and educators interested in improving their understanding of this topic."},
        ]
    
    return faqs[:3]  # Max 3 FAQs

def extract_answer_passage(clean_text: str, question: str) -> str:
    """Extract a relevant passage for the FAQ answer."""
    sentences = re.split(r'(?<=[.!?])\s+', clean_text)
    
    # Try to find sentences that seem explanatory
    for s in sentences:
        if len(s) > 50 and len(s) < 300:
            # Avoid sentences that are just topic labels
            if not s.startswith('Topic:') and not s.startswith('Updated:'):
                return s.strip()
    
    # Fallback
    return clean_text[:250].strip() + '...'

# ── HTML Generators ──────────────────────────────────────
def make_tldr_html(summary: str) -> str:
    """Generate TL;DR HTML block."""
    return f'<div class="tldr" style="background:#f0f9ff;border-left:4px solid #7c3aed;padding:1rem 1.25rem;margin-bottom:1.5rem;border-radius:0 0.5rem 0.5rem 0"><strong style="color:#7c3aed">📌 TL;DR:</strong> {summary}</div>'

def make_faq_html(faqs: list) -> str:
    """Generate FAQ HTML block with schema-compatible structure."""
    if not faqs:
        return ''
    
    html = '<div class="faq-section" style="margin-top:2rem;padding:1.25rem;background:#faf5ff;border-radius:0.5rem">\n'
    html += '<h2 style="font-size:1.5rem;font-weight:700;color:#7c3aed;margin-bottom:1rem">❓ Frequently Asked Questions</h2>\n'
    
    for i, faq in enumerate(faqs):
        html += f'<div class="faq-item" style="margin-bottom:1rem">\n'
        html += f'  <h3 style="font-size:1.1rem;font-weight:600;color:#1f2937;margin-bottom:0.5rem">Q{i+1}: {faq["question"]}</h3>\n'
        html += f'  <p style="color:#4b5563;line-height:1.6">{faq["answer"]}</p>\n'
        html += f'</div>\n'
    
    html += '</div>'
    return html

def fix_heading_hierarchy(content: str) -> str:
    """Ensure proper heading structure: H2 for sections, H3 for subsections."""
    # If content has no H2/H3, wrap first strong topic line as H2
    if '<h2' not in content.lower() and '<h3' not in content.lower():
        # Look for "Topic:" or "[...]" patterns at start
        content = re.sub(
            r'<p>(<strong>Topic:</strong>\s*[^<]+)</p>',
            r'<h2 style="font-size:1.3rem;font-weight:700;color:#374151;margin:1.5rem 0 0.75rem">\1</h2>',
            content, count=1
        )
        # Convert bracketed level indicators like [P5 Science] to H2
        content = re.sub(
            r'<p>(\[[PpSJ]\d[^\]]+\])</p>',
            r'<h2 style="font-size:1.3rem;font-weight:700;color:#374151;margin:1.5rem 0 0.75rem">\1</h2>',
            content, count=1
        )
    
    return content

# ── Main ─────────────────────────────────────────────────
def main(dry_run=False, top_n=30):
    print("🔍 Loading blog data...")
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        posts = json.load(f)
    
    print(f"   Loaded {len(posts)} posts")
    
    # Determine which posts to optimize (longest = highest SEO value)
    posts_by_len = sorted(
        [(i, p) for i, p in enumerate(posts) if p.get('content')],
        key=lambda x: len(x[1]['content']),
        reverse=True
    )
    
    optimized_count = 0
    faq_count = 0
    tldr_count = 0
    
    for idx, (orig_i, post) in enumerate(posts_by_len[:top_n]):
        content = post.get('content', '')
        if len(content) < 50:
            continue
        
        title = post['title']
        slug = post['slug']
        
        changes = []
        
        # 1. Add TL;DR
        if '<div class="tldr"' not in content:
            tldr = generate_tldr(content, title)
            tldr_html = make_tldr_html(tldr)
            # Insert after first <p> or at beginning
            first_p_end = content.find('</p>')
            if first_p_end > 0:
                content = content[:first_p_end+4] + '\n' + tldr_html + '\n' + content[first_p_end+4:]
            else:
                content = tldr_html + '\n' + content
            changes.append('TL;DR')
            tldr_count += 1
        
        # 2. Add FAQ section (for posts > 500 chars)
        if '<div class="faq-section"' not in content and len(content) > 500:
            faqs = generate_faqs(content, title)
            if faqs:
                faq_html = make_faq_html(faqs)
                content = content + '\n' + faq_html
                changes.append('FAQ')
                faq_count += 1
        
        # 3. Fix heading hierarchy
        if '<h2' not in content.lower():
            content = fix_heading_hierarchy(content)
            if '<h2' in content.lower():
                changes.append('Headings')
        
        if changes:
            posts[orig_i]['content'] = content
            optimized_count += 1
            if dry_run:
                print(f"   [DRY RUN] [{post['id']}] {title[:60]}... → +{', '.join(changes)}")
    
    # Also add TL;DR to ALL remaining posts (quick extraction, no FAQ)
    for i, post in enumerate(posts):
        content = post.get('content', '')
        if len(content) < 50:
            continue
        if '<div class="tldr"' not in content:
            tldr = generate_tldr(content, post['title'])
            tldr_html = make_tldr_html(tldr)
            first_p_end = content.find('</p>')
            if first_p_end > 0:
                content = content[:first_p_end+4] + '\n' + tldr_html + '\n' + content[first_p_end+4:]
            else:
                content = tldr_html + '\n' + content
            posts[i]['content'] = content
            tldr_count += 1
    
    print(f"\n📊 Results:")
    print(f"   Posts with TL;DR: {tldr_count}")
    print(f"   Posts with FAQ: {faq_count}")
    print(f"   Posts with heading fixes: {optimized_count}")
    
    if dry_run:
        print("\n⚠ DRY RUN — no changes written.")
        return
    
    # Backup
    shutil.copy2(DATA_FILE, BACKUP_FILE)
    print(f"\n💾 Backup saved: {BACKUP_FILE}")
    
    # Write
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Written: {DATA_FILE}")

if __name__ == '__main__':
    dry_run = '--dry-run' in sys.argv
    top_n = 30
    for arg in sys.argv:
        if arg.startswith('--top-n='):
            top_n = int(arg.split('=')[1])
    main(dry_run=dry_run, top_n=top_n)
