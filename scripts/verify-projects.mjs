import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const projectsSource = readFileSync("src/lib/projects.ts", "utf8");
const filterSource = readFileSync("src/components/ProjectsFilter.tsx", "utf8");

assert.match(projectsSource, /title:\s*"HMCPT"/);
assert.match(projectsSource, /slug:\s*"hmcpt"/);
assert.match(projectsSource, /url:\s*"https:\/\/hmcpt\.vercel\.app\/"/);
assert.match(projectsSource, /thumbnail:\s*"\/images\/hmcpt\/01\.png"/);
assert.match(projectsSource, /tech:\s*\[[\s\S]*"Next\.js"[\s\S]*"TypeScript"[\s\S]*\]/);
assert.match(projectsSource, /images:\s*\[/);
assert.match(projectsSource, /https:\/\/raw\.githubusercontent\.com\/1lmean\/devblog\/main\/public\/images\/hmcpt\/01\.png/);
assert.match(projectsSource, /https:\/\/raw\.githubusercontent\.com\/1lmean\/devblog\/main\/public\/images\/hmcpt\/02\.png/);
assert.match(projectsSource, /https:\/\/raw\.githubusercontent\.com\/1lmean\/devblog\/main\/public\/images\/hmcpt\/03\.png/);
assert.match(projectsSource, /https:\/\/raw\.githubusercontent\.com\/1lmean\/devblog\/main\/public\/images\/hmcpt\/04\.png/);
assert.match(projectsSource, /comment:\s*"/);

assert.equal(existsSync("src/components/ProjectCard.tsx"), true);
assert.equal(existsSync("src/app/projects/[slug]/page.tsx"), true);

const cardSource = readFileSync("src/components/ProjectCard.tsx", "utf8");
assert.match(cardSource, /next\/link/);
assert.match(cardSource, /next\/image/);
assert.match(cardSource, /href=\{`\/projects\/\$\{project\.slug\}`\}/);
assert.match(cardSource, /project\.thumbnail/);
assert.match(cardSource, /project\.url/);
assert.match(cardSource, /project\.description/);
assert.match(cardSource, /project\.tech\.map/);
assert.doesNotMatch(cardSource, /<time|dateTime|formatPostDate/);

assert.match(filterSource, /import \{ ProjectCard \}/);
assert.match(filterSource, /<ProjectCard[\s\S]*project=\{project\}/);

const detailSource = readFileSync("src/app/projects/[slug]/page.tsx", "utf8");
assert.match(detailSource, /generateStaticParams/);
assert.match(detailSource, /getProjectBySlug/);
assert.match(detailSource, /post\.slug\.startsWith\(`\$\{project\.slug\}-`\)/);
assert.doesNotMatch(detailSource, /<Image[\s\S]*project\.thumbnail/);
assert.match(detailSource, /project\.images\.map/);
assert.match(detailSource, /image\.comment/);
assert.match(detailSource, /관련 글/);
assert.match(detailSource, /\/posts\/\$\{post\.slug\}/);
