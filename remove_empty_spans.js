const fs = require('fs');

console.log('Loading blog data...');
const blogData = JSON.parse(fs.readFileSync('public/blog-data.json', 'utf8'));

console.log(`Processing ${blogData.length} blog posts...`);

let totalRemoved = 0;
let postsModified = 0;

blogData.forEach((post, index) => {
  const originalContent = post.content;
  
  // Remove empty hV4Sgn spans (these are the empty count placeholders next to share buttons)
  let modifiedContent = originalContent.replace(/<span class="hV4Sgn"><\/span>/g, '');
  
  // Also remove with any whitespace variations
  modifiedContent = modifiedContent.replace(/<span class="hV4Sgn">\s*<\/span>/g, '');
  
  const removed = (originalContent.match(/<span class="hV4Sgn">\s*<\/span>/g) || []).length;
  
  if (removed > 0) {
    totalRemoved += removed;
    postsModified++;
    post.content = modifiedContent;
    
    if (postsModified <= 3) {
      console.log(`  Post ${index + 1} "${post.title.substring(0, 50)}...": Removed ${removed} empty spans`);
    }
  }
});

console.log(`\nSummary:`);
console.log(`  Posts modified: ${postsModified}`);
console.log(`  Total empty spans removed: ${totalRemoved}`);

// Save the cleaned data
fs.writeFileSync('public/blog-data.json', JSON.stringify(blogData, null, 2));
console.log('\nBlog data saved successfully!');

// Verify removal
const verifyData = JSON.parse(fs.readFileSync('public/blog-data.json', 'utf8'));
const remainingSpans = verifyData.reduce((sum, post) => {
  return sum + (post.content.match(/<span class="hV4Sgn">/g) || []).length;
}, 0);

console.log(`\nVerification: ${remainingSpans} hV4Sgn spans remaining`);

