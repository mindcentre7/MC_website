// scripts/simplify-blogs.js
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function simplifyBlog(rawPost) {
  const $ = cheerio.load(rawPost.content || '');

  const paragraphs = [];
  $('p').each((i, el) => {
    const text = $(el).text().trim();
    if (text.length > 0) {
      let cleanText = text.replace(/\s+/g, ' ').trim();
      cleanText = cleanText.replace(/<[^>]*>/g, '');
      paragraphs.push(cleanText);
    }
  });

  const cleanContent = paragraphs.join('\n\n');

  // NO LONGER: Append video placeholders to content—keep videos separate for rendering

  // Derive URL-safe slug from title
  let baseSlug = rawPost.title || rawPost.slug || `post-${rawPost.id}`;
  let sanitizedSlug = baseSlug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const computedSlug = sanitizedSlug;

  return {
    id: rawPost.id,
    slug: computedSlug,
    title: rawPost.title,
    date: rawPost.date,
    date_display: rawPost.date_display,
    author: rawPost.author,
    content: cleanContent,  // Pure text only
    featured_image: rawPost.featured_image,
    content_images: rawPost.content_images || [],
    videos: rawPost.videos || [],
    url: `/blog/${computedSlug}`,  // Normalize URL too
    originalSlug: rawPost.slug,
  };
}

function processBlogs() {
  const rawDataPath = path.join(process.cwd(), 'public/blog-data.json');
  const cleanDataPath = path.join(process.cwd(), 'public/data/clean-blog-data.json');

  try {
    const outputDir = path.dirname(cleanDataPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
    if (!Array.isArray(rawData)) {
      throw new Error('blog-data.json must be an array of post objects');
    }

    const cleanData = rawData.map(simplifyBlog);

    fs.writeFileSync(cleanDataPath, JSON.stringify(cleanData, null, 2), 'utf8');
    console.log(`✅ Processed ${cleanData.length} blogs. Clean data saved to ${cleanDataPath}`);
    
    if (cleanData.length > 0) {
      console.log('First post slug:', cleanData[0].slug);
    }
  } catch (error) {
    console.error('❌ Error processing blogs:', error.message);
  }
}

processBlogs();