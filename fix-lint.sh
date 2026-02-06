#!/bin/bash

# Fix unescaped quotes in JSX
find app components -name "*.tsx" -type f -exec sed -i "s/'\([^']*\)'/\&apos;\1\&apos;/g" {} \;
find app components -name "*.tsx" -type f -exec sed -i 's/"\([^"]*\)"/\&quot;\1\&quot;/g' {} \;

# Fix specific unescaped entities
sed -i "s/We're/We\&apos;re/g" app/about/page.tsx app/contact/page.tsx
sed -i "s/Don't/Don\&apos;t/g" app/about/page.tsx
sed -i "s/can't/can\&apos;t/g" app/about/page.tsx
sed -i "s/won't/won\&apos;t/g" app/about/page.tsx

echo "Lint fixes applied!"
