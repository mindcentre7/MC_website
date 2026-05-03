#!/usr/bin/env python3
"""
Mind Centre Blog Auto-Sourcer v2
Finds YouTube videos matching MC's 7 methodology pillars,
filters by keyword relevance, generates blog posts, appends to queue.
"""

import json
import subprocess
import re
import os
from datetime import date, datetime, timedelta
from pathlib import Path

BASE = Path("/home/dhhl24/.hermes/MC_website-8Apr26h")
QUEUE_PATH = BASE / "public" / "data" / "mindcentre-blog-posts.json"
CLEAN_PATH = BASE / "public" / "data" / "clean-blog-data.json"

# ─── MC's 7 Methodology Pillars ───────────────────────────────
PILLARS = {
    "Mind-Mapping": {
        "channels": [
            "https://www.youtube.com/@AYOA",
            "https://www.youtube.com/@Biggerplate",
        ],
        "search_terms": [
            "mind mapping tutorial students", "how to mind map study",
            "visual learning techniques", "tony buzan mind mapping"
        ],
        "intro": "Mind-Mapping",
        "context": "At Mind Centre, we teach our students mind-mapping as a core study technique. This powerful visual method helps organise complex concepts for PSLE, O-Level, and A-Level subjects, making revision faster and more effective.",
        "title_keywords": ["mind map", "mindmap", "visual thinking", "concept map", "buzan", "organize ideas", "visual learning", "how to mind map", "diagram"],
    },
    "Story Memory Technique": {
        "channels": [
            "https://www.youtube.com/@PracticalPsychologyTips",
            "https://www.youtube.com/@MagneticMemory",
        ],
        "search_terms": [
            "memory techniques students", "how to memorize fast",
            "memory palace tutorial", "mnemonics for studying"
        ],
        "intro": "Story Memory Technique",
        "context": "Our Story Memory Technique transforms abstract facts into vivid, memorable narratives. Just like this video demonstrates, we help students create powerful mental associations that stick — especially useful for Science and Humanities subjects.",
        "title_keywords": ["memory", "memorize", "mnemonic", "remember", "palace", "recall", "memorization", "memory trick", "how to memorize"],
    },
    "Brain Research: Reading Out Aloud": {
        "channels": [
            "https://www.youtube.com/@TEDEd",
            "https://www.youtube.com/@AsapSCIENCE",
        ],
        "search_terms": [
            "reading out loud benefits", "science of reading",
            "how reading affects brain", "brain learning research"
        ],
        "intro": "Brain Research: Reading Out Aloud",
        "context": "Brain research confirms what we practice at Mind Centre: reading aloud strengthens neural pathways and improves retention. Our students use this technique for English compositions, Science keywords, and exam revision — with proven results.",
        "title_keywords": ["reading", "read aloud", "brain research", "neuroscience learning", "comprehension", "literacy science", "language learning", "how reading"],
    },
    "Problem-Solving Techniques": {
        "channels": [
            "https://www.youtube.com/@MindYourDecisions",
            "https://www.youtube.com/@numberphile",
        ],
        "search_terms": [
            "problem solving strategies students", "polya problem solving",
            "how to solve math problems step by step", "critical thinking math"
        ],
        "intro": "Problem-Solving Techniques",
        "context": "Problem-solving is at the heart of our Fast & Systematic Learning approach. We teach students structured methods to break down complex Math and Science questions into manageable steps — the same strategies used by top performers worldwide.",
        "title_keywords": ["problem solving", "solve", "strategy", "critical thinking", "polya", "math problem", "logic puzzle", "reasoning", "how to solve"],
    },
    "Excel in Exam Preparation": {
        "channels": [
            "https://www.youtube.com/@Thomasfrank",
            "https://www.youtube.com/@MedSchoolInsiders",
        ],
        "search_terms": [
            "how to study for exams effectively", "exam preparation tips",
            "best study techniques", "how to ace tests"
        ],
        "intro": "Excel in Exam Preparation",
        "context": "Exam excellence requires more than just studying hard — it requires studying smart. At Mind Centre, our Testing and Exam Methodologies help students approach PSLE, O-Level, and A-Level papers with confidence and precision.",
        "title_keywords": ["exam", "study technique", "test prep", "ace", "grade", "preparation", "how to study", "student success", "learning method"],
    },
    "Applying Science in Real Life": {
        "channels": [
            "https://www.youtube.com/@smartereveryday",
            "https://www.youtube.com/@physicsgirl",
        ],
        "search_terms": [
            "science in everyday life", "physics experiments explained",
            "chemistry in daily life", "applied science students"
        ],
        "intro": "Applying Science in Real Life",
        "context": "Science isn't just for textbooks — it's everywhere. We bring Science to life for our students by connecting concepts to real-world applications, making Physics, Chemistry, and Biology engaging, relevant, and unforgettable.",
        "title_keywords": ["science", "physics", "chemistry", "biology", "experiment", "everyday", "real life", "applied", "how things work", "why do"],
    },
    "Developing Critical Thinking & Growth Mindset": {
        "channels": [
            "https://www.youtube.com/@TEDx",
            "https://www.youtube.com/@BigThink",
        ],
        "search_terms": [
            "growth mindset for students", "carol dweck mindset",
            "developing resilience students", "learning mindset education"
        ],
        "intro": "Developing Critical Thinking & Growth Mindset",
        "context": "A growth mindset is the foundation of academic success. At Mind Centre, we nurture not just knowledge but the right attitude — teaching students to embrace challenges, learn from mistakes, and believe in their ability to improve.",
        "title_keywords": ["mindset", "growth", "critical thinking", "dweck", "resilience", "motivation", "education", "learning", "student success", "overcome"],
    },
}

# ─── HELPERS ──────────────────────────────────────────────────
def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text[:80]

def get_existing_video_ids():
    ids = set()
    for path in [QUEUE_PATH, CLEAN_PATH]:
        if path.exists():
            with open(path) as f:
                posts = json.load(f)
            for p in posts:
                vids = p.get('videos', [])
                if isinstance(vids, str):
                    try: vids = json.loads(vids)
                    except: vids = []
                for v in vids:
                    match = re.search(r'[?&]v=([a-zA-Z0-9_-]{11})', v)
                    if match:
                        ids.add(match.group(1))
    return ids

def is_relevant(title, keywords):
    """Video title must contain at least one relevant keyword."""
    t = title.lower()
    return any(kw.lower() in t for kw in keywords)

def search_videos(query, is_channel=False, max_results=5):
    """Search YouTube via yt-dlp."""
    try:
        if is_channel:
            url = f"{query}/videos"
        else:
            url = f"ytsearch{max_results}:{query}"
        
        result = subprocess.run([
            "yt-dlp", "--flat-playlist", "--dump-json",
            "--playlist-end", str(max_results), url
        ], capture_output=True, text=True, timeout=45)
        
        videos = []
        for line in result.stdout.strip().split('\n'):
            if not line: continue
            try:
                d = json.loads(line)
                dur = d.get("duration", 0) or 0
                if dur and (dur < 60 or dur > 2400):  # Skip Shorts & >40min
                    continue
                videos.append({
                    "id": d.get("id", ""),
                    "title": d.get("title", ""),
                    "duration": dur,
                    "channel": d.get("channel", d.get("uploader", "")),
                    "url": f"https://www.youtube.com/watch?v={d.get('id', '')}",
                    "thumbnail": f"https://img.youtube.com/vi/{d.get('id', '')}/hqdefault.jpg",
                })
            except: continue
        return videos
    except Exception as e:
        print(f"  ⚠ Search error: {e}")
        return []

def generate_post(video, pillar_config):
    title = re.sub(r'\s*\(.*?\)\s*', '', video["title"])
    title = re.sub(r'\s*\|\s*.*$', '', title).strip()
    slug = slugify(title)
    
    content = (
        f'<p><strong>Topic:</strong> {pillar_config["intro"]}</p>'
        f'<p>{pillar_config["context"]} Watch this video to learn more!</p>'
        f'<p>Video content available</p>'
    )
    
    return {
        "slug": slug, "title": title,
        "date": "", "date_display": "",
        "author": "Mind Centre", "content": content,
        "featured_image": video["thumbnail"],
        "content_images": [], "videos": [video["url"]],
        "channel": video.get("channel", "Unknown"),
    }

# ─── MAIN ─────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("Mind Centre Blog Auto-Sourcer v2")
    print("=" * 60)
    
    existing_ids = get_existing_video_ids()
    print(f"\n📊 Existing video IDs: {len(existing_ids)}")
    
    with open(QUEUE_PATH) as f:
        queue = json.load(f)
    
    last_date = max(p["date"] for p in queue)
    last_dt = datetime.strptime(last_date, '%Y-%m-%d')
    next_monday = last_dt + timedelta(days=(7 - last_dt.weekday()) % 7)
    if next_monday <= last_dt:
        next_monday += timedelta(days=7)
    
    print(f"Last queued: {last_date}")
    print(f"Next Monday: {next_monday.strftime('%Y-%m-%d')}")
    
    all_new = []
    
    for pillar_name, config in PILLARS.items():
        print(f"\n🔍 {pillar_name}")
        pillar_videos = []
        keywords = config["title_keywords"]
        
        # Strategy: topic search first (more relevant), then channels
        for term in config["search_terms"][:3]:
            vids = search_videos(term, max_results=4)
            for v in vids:
                if v["id"] not in existing_ids and is_relevant(v["title"], keywords):
                    pillar_videos.append(v)
                    existing_ids.add(v["id"])
        
        # Fallback to channels if not enough
        if len(pillar_videos) < 1:
            for ch in config["channels"][:2]:
                vids = search_videos(ch, is_channel=True, max_results=5)
                for v in vids:
                    if v["id"] not in existing_ids and is_relevant(v["title"], keywords):
                        pillar_videos.append(v)
                        existing_ids.add(v["id"])
        
        pillar_videos = pillar_videos[:2]
        
        if pillar_videos:
            for v in pillar_videos:
                post = generate_post(v, config)
                all_new.append((pillar_name, post))
            print(f"  ✓ {len(pillar_videos)} videos: {pillar_videos[0]['title'][:60]}")
        else:
            print(f"  ⚠ None found")
    
    if not all_new:
        print("\n❌ No new videos found.")
        return
    
    # Schedule — rotate pillars weekly
    print(f"\n📝 Scheduling {len(all_new)} posts...")
    pillar_order = list(PILLARS.keys())
    current_date = next_monday
    
    while all_new:
        for pillar in pillar_order:
            if not all_new: break
            match = next(((p, post) for p, post in all_new if p == pillar), all_new[0])
            p_name, post = match
            all_new.remove(match)
            post["date"] = current_date.strftime('%Y-%m-%d')
            post["date_display"] = current_date.strftime('%B %d, %Y')
            queue.append(post)
            current_date += timedelta(days=7)
    
    queue.sort(key=lambda p: p["date"])
    
    with open(QUEUE_PATH, "w") as f:
        json.dump(queue, f, indent=2)
    
    print(f"\n✅ Queue: {len(queue)} posts → extended to {current_date.strftime('%b %d, %Y')}")
    print(f"   Next cron publishes: Monday 9am")

if __name__ == "__main__":
    main()
