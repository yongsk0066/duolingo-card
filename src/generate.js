import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// Configuration
// ============================================
const CONFIG = {
  username: process.env.DUOLINGO_USERNAME || 'yongsk0066',
  theme: process.env.THEME || 'dark',
  maxCourses: 3,
};

const THEMES = {
  'dark': { background: '#2b2b2b', colorPrimary: '#fff', colorSecondary: '#B6C1AC' },
  'github-dark': { background: '#0D1117', colorPrimary: '#58A6FF', colorSecondary: '#fff' },
  'dracula': { background: '#282A36', colorPrimary: '#FF79C6', colorSecondary: '#F8F8F2' },
};

// Language code to flag file mapping
const FLAG_MAP = {
  'en': 'logo_0000_en.svg', 'es': 'logo_0001_es.svg', 'fr': 'logo_0002_fr.svg',
  'de': 'logo_0003_de.svg', 'hi': 'logo_0004_hi.svg', 'ja': 'logo_0005_ja.svg',
  'it': 'logo_0006_it.svg', 'ko': 'logo_0007_ko.svg', 'zh': 'logo_0008_zh.svg',
  'zh-CN': 'logo_0008_zh.svg', 'zh-HK': 'logo_0008_zh.svg', 'pt': 'logo_0009_pt.svg',
  'ru': 'logo_0010_ru.svg', 'tr': 'logo_0011_tr.svg', 'nl': 'logo_0012_nl.svg',
  'sv': 'logo_0013_sv.svg', 'el': 'logo_0014_el.svg', 'he': 'logo_0015_iw.svg',
  'iw': 'logo_0015_iw.svg', 'pl': 'logo_0016_pl.svg', 'no': 'logo_0017_no.svg',
  'no-BO': 'logo_0017_no.svg', 'vi': 'logo_0018_vi.svg', 'da': 'logo_0019_da.svg',
  'ar': 'logo_0020_ar.svg', 'uk': 'logo_0021_uk.svg', 'ga': 'logo_0022_ga.svg',
  'la': 'logo_0023_la.svg', 'ro': 'logo_0025_ro.svg', 'sw': 'logo_0026_sw.svg',
  'hu': 'logo_0028_hu.svg', 'cy': 'logo_0029_cy.svg', 'cs': 'logo_0030_cz.svg',
  'id': 'logo_0031_id.svg', 'fi': 'logo_0034_fi.svg', 'th': 'logo_0052_th.svg',
  'world': 'logo_0036_world.svg',
};

// ============================================
// Duolingo API
// ============================================
async function fetchDuolingoStats(username) {
  const url = `https://www.duolingo.com/2017-06-30/users?username=${username}`;
  console.log(`Fetching stats for: ${username}`);

  const response = await fetch(url, {
    headers: { 'User-Agent': 'duolingo-card-generator', 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  const data = await response.json();
  if (!data.users || data.users.length === 0) throw new Error(`User not found: ${username}`);

  const user = data.users[0];
  const topCourses = [...user.courses].sort((a, b) => b.xp - a.xp).slice(0, CONFIG.maxCourses);

  return { username: user.username, name: user.name, streak: user.streak, totalXp: user.totalXp, courses: topCourses };
}

// ============================================
// Number Formatting (same as original)
// ============================================
function numberFormatter(num) {
  return Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(num);
}

// ============================================
// SVG Assets
// ============================================
function loadSvgContent(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return null;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(/<\?xml[^>]*\?>/g, '').replace(/<!DOCTYPE[^>]*>/g, '');
  return content.trim();
}

function getFlagSvg(languageCode) {
  const flagFile = FLAG_MAP[languageCode] || FLAG_MAP['world'];
  const svg = loadSvgContent(`assets/flags/${flagFile}`);
  if (!svg) return '';
  // Remove outer svg tag and add dimensions
  return svg.replace(/<svg[^>]*>/, '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="37" viewBox="0 0 82 66">').trim();
}

// Streak icon SVG
const STREAK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;fill-rule:evenodd;clip-rule:evenodd" viewBox="0 0 250 283"><path fill="#ffc700" d="M130.5 18.5c6.988-.852 9.322 1.981 7 8.5-4.516 2.244-7.516.911-9-4a27.648 27.648 0 0 1 2-4.5Z" style="opacity:0.849"/><path fill="#ffc700" d="M104.5 35.5c7.521.61 12.855 4.443 16 11.5-2.566 4.573-5.899 8.573-10 12-2 .667-4 .667-6 0L96 50.5c-.667-2-.667-4 0-6 3.038-2.87 5.871-5.87 8.5-9Z" style="opacity:0.959"/><path fill="#ff9600" d="M139.5 52.5c5.497-.172 9.997 1.828 13.5 6l46 60c14.332 23.271 16.332 47.605 6 73-20.957 35.323-51.123 46.823-90.5 34.5-23.47-10.467-37.636-28.3-42.5-53.5l-.5-42a494.287 494.287 0 0 1 1.5-44c5.381-6.638 11.881-8.138 19.5-4.5a168.758 168.758 0 0 0 13 8.5 2258.279 2258.279 0 0 1 28-35.5 218.46 218.46 0 0 0 6-2.5Z" style="opacity:0.994"/><path fill="#ffc600" d="M139.5 126.5c2.436-.183 4.603.484 6.5 2l20 26c10.488 21.189 4.988 36.689-16.5 46.5-19.679 2.747-32.179-5.419-37.5-24.5-1.439-8.021.227-15.354 5-22a996.845 996.845 0 0 1 22.5-28Z" style="opacity:1"/></svg>`;

// XP icon SVG
const XP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 56 56"><path fill="#FFD900" fill-rule="evenodd" d="M32.082 10.288c-.292-2.868-3.974-3.855-5.66-1.517l-13.88 19.241c-1.284 1.78-.39 4.294 1.73 4.861l7.896 2.116 1.167 11.47c.291 2.868 3.973 3.854 5.66 1.517l13.88-19.241c1.284-1.78.39-4.294-1.73-4.862l-7.897-2.116-1.166-11.47Z" clip-rule="evenodd"/><path fill="#F7C100" d="M15.265 30.558c-.718-.194-.788-1.186-.104-1.477l5.488-2.342a.784.784 0 0 1 1.09.666l.272 3.897a.784.784 0 0 1-.986.81l-5.76-1.554Z"/><path fill="#FFEF8F" d="M40.416 25.806c.718.194.787 1.185.103 1.477l-5.488 2.341a.784.784 0 0 1-1.09-.666l-.272-3.896a.784.784 0 0 1 .986-.811l5.76 1.555Z"/></svg>`;

// Small XP icon
const XP_SMALL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 56 56"><path fill="#FFD900" fill-rule="evenodd" d="M32.082 10.288c-.292-2.868-3.974-3.855-5.66-1.517l-13.88 19.241c-1.284 1.78-.39 4.294 1.73 4.861l7.896 2.116 1.167 11.47c.291 2.868 3.973 3.854 5.66 1.517l13.88-19.241c1.284-1.78.39-4.294-1.73-4.862l-7.897-2.116-1.166-11.47Z" clip-rule="evenodd"/><path fill="#F7C100" d="M15.265 30.558c-.718-.194-.788-1.186-.104-1.477l5.488-2.342a.784.784 0 0 1 1.09.666l.272 3.897a.784.784 0 0 1-.986.81l-5.76-1.554Z"/><path fill="#FFEF8F" d="M40.416 25.806c.718.194.787 1.185.103 1.477l-5.488 2.341a.784.784 0 0 1-1.09-.666l-.272-3.896a.784.784 0 0 1 .986-.811l5.76 1.555Z"/></svg>`;

// Duo Jolly SVG (flipped)
const DUO_JOLLY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 -27 189 200" height="152" width="122" style="display:block;transform:scale(-1, 1)"><path fill="#58cc02" fill-rule="evenodd" d="M46.985 55.473C42.51 42.205 53.627 28.765 67.592 29.78c13.022.947 26.712 1.218 33.182-.964 6.471-2.182 17.201-10.688 26.99-19.328 10.498-9.265 27.484-5.301 31.958 7.966l12.231 36.268a60.13 60.13 0 0 1 1.923 7.113c.065.177.129.355.191.532 2.605 14.327 2.22 29.225-2.01 44.295l-3.259 9.118c-10.797 30.206-44.036 45.94-74.241 35.143-27.133-9.699-42.589-37.506-37.626-64.957Z" clip-rule="evenodd"/><path fill="#58cc02" d="M6.853 97.698 93.246 120.9c4.63 1.244 9.107-2.381 8.84-7.158-1.283-22.954-17.41-42.899-40.236-49.03-22.825-6.13-46.67 3.08-59.126 22.344-2.592 4.01-.502 9.398 4.129 10.642Z"/><path fill="#58cc02" fill-rule="evenodd" d="M46.986 55.473C42.512 42.205 53.63 28.765 67.594 29.78c13.022.947 26.711 1.218 33.182-.964 6.47-2.182 17.2-10.688 26.989-19.328 10.498-9.265 27.484-5.301 31.958 7.966l12.231 36.268a60.136 60.136 0 0 1 1.924 7.113l.066.184c4.234 20.345-.939 41.342-5.194 53.899-10.849 30.115-44.032 45.785-74.192 35.005-27.133-9.699-42.589-37.507-37.626-64.957Z" clip-rule="evenodd"/><path fill="#8ee000" d="m103.055 116.234 14.729-2.69c.789-.144 1.482.485 1.368 1.242-.548 3.639-3.526 6.626-7.417 7.337-3.891.711-7.729-1.032-9.523-4.243-.373-.668.054-1.502.843-1.646zM128.762 111.549l14.729-2.691c.789-.144 1.482.485 1.368 1.242-.548 3.639-3.526 6.626-7.417 7.337-3.891.711-7.729-1.032-9.523-4.243-.373-.668.054-1.501.843-1.645zM118.176 126.324l14.729-2.69c.789-.145 1.482.484 1.368 1.242-.548 3.638-3.526 6.626-7.417 7.337-3.891.71-7.728-1.032-9.523-4.243-.373-.669.054-1.502.843-1.646z"/><path fill="#89e219" fill-rule="evenodd" d="M92.356 44.024c8.312 4.205 19.227.524 23.999-8.093 4.772-8.618 11.322 36.995 11.285 36.885-.018-.053-3.708 1.174-11.07 3.682-1.974.672-5.528 1.888-10.663 3.647C91.332 53.26 86.816 41.22 92.357 44.024Z" clip-rule="evenodd"/><path fill="#8ee000" d="m125.554 14.777-10.432 24.226c-.559 1.299.308 2.767 1.711 2.9 6.745.637 13.243-3.197 15.999-9.598 2.756-6.4 1.085-13.776-4.001-18.266a2.072 2.072 0 0 0-3.277.738z"/><path fill="#8ee000" d="m136.776 15.932-10.431 24.226c-.559 1.299.307 2.767 1.711 2.9 6.745.637 13.243-3.197 15.999-9.598 2.756-6.4 1.084-13.776-4.002-18.266a2.073 2.073 0 0 0-3.277.738z"/><path fill="#89e219" d="m72.456 32.627 22.324 12.74a2.015 2.015 0 0 1 .357 3.25c-4.905 4.424-12.231 5.232-18.13 1.866-5.898-3.366-8.9-10.068-7.546-16.52.282-1.342 1.798-2.019 2.995-1.336z"/><path fill="#89e219" d="m64.066 40.47 21.002 11.986a1.895 1.895 0 0 1 .334 3.056c-4.614 4.163-11.505 4.923-17.054 1.757-5.548-3.167-8.374-9.472-7.1-15.541.266-1.263 1.692-1.9 2.818-1.257z"/><path fill="#89e219" d="M59.15 73.096c-4.212-12.489 2.498-26.027 14.986-30.239 12.49-4.211 26.028 2.499 30.239 14.988l3.758 11.142c4.211 12.49-2.498 26.028-14.987 30.24-12.49 4.211-26.028-2.5-30.24-14.988ZM115.188 54.197c-4.211-12.488 2.499-26.027 14.987-30.238 12.489-4.212 26.028 2.498 30.239 14.987l3.758 11.142c4.212 12.49-2.498 26.028-14.987 30.24-12.489 4.21-26.027-2.5-30.239-14.988z"/><rect width="33.202" height="42.541" x="40.646" y="72.602" fill="#fff" rx="16.601" transform="rotate(-18.636)"/><rect width="33.202" height="42.541" x="98.401" y="72.6" fill="#fff" rx="16.601" transform="rotate(-18.636)"/><rect width="15.564" height="23.864" x="54.477" y="81.939" fill="#4b4b4b" rx="7.782" transform="rotate(-18.636)"/><path fill="#4b4b4b" fill-rule="evenodd" d="M126.128 54.16a6.225 6.225 0 0 0 2.145-10.555 7.783 7.783 0 0 1 11.993 3.779l2.652 7.865a7.782 7.782 0 0 1-14.748 4.973l-2.044-6.062h.002z" clip-rule="evenodd"/><circle cx="54.479" cy="85.398" r="6.225" fill="#fff" transform="rotate(-18.636)"/><rect width="16.255" height="32.677" x="77.997" y="100.27" fill="#f49000" rx="8.128" transform="rotate(-18.636)"/><rect width="13.46" height="26.46" x="79.45" y="102.207" fill="#b06800" rx="6.73" transform="rotate(-18.636)"/><path stroke="#ffde00" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.459" d="M112.626 71.487c.626-.564 2.566-1.47 4.261-1.437"/><path fill="#ffc200" d="M127.616 72.28a.661.661 0 0 1-.252.936l-9.828 5.375-11.077 1.674a.661.661 0 0 1-.768-.592c-.414-5.319 2.801-10.442 8.087-12.225 5.286-1.782 10.947.348 13.838 4.831z"/><path stroke="#ffde00" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.459" d="M112.536 71.303c.626-.564 2.566-1.47 4.261-1.437"/><path fill="#f49000" fill-rule="evenodd" d="M81.73 115.701a7.692 7.692 0 0 1 10.714 1.887l6.852 9.781a7.693 7.693 0 1 1-12.6 8.827l-6.853-9.781a7.692 7.692 0 0 1 1.887-10.714z" clip-rule="evenodd"/><rect width="18.331" height="13.143" x="107.734" y="177.387" fill="#f49000" rx="6.571"/><rect width="24.369" height="15.813" x="116.567" y="-176.245" fill="#f49000" rx="7.907" transform="rotate(109.924)"/><path fill="#ffb8d1" fill-rule="evenodd" d="m126.888 85.509.116.346a6.73 6.73 0 1 1-12.754 4.301l-.201-.595a8.681 8.681 0 0 1 6.527-5.299 8.713 8.713 0 0 1 6.312 1.247z" clip-rule="evenodd"/><path fill="#89e219" d="m69.96 84.882 30.1 2.28c-.496 6.55-6.21 11.46-12.76 10.963l-6.375-.483c-6.551-.496-11.46-6.209-10.964-12.76ZM159.129 56.265l-24.12 18.15c3.359 4.463 9.7 5.359 14.164 2l7.955-5.986c4.464-3.36 5.36-9.7 2.001-14.164z"/><path fill="#58cc02" d="m127.506 104.919 11.598-5.805 17.523-3.194 3.221 8.026-5.898 23.574-4.807 7.38-23.539 3.94-5.105-1.003-2.677-4.082.6-7.317 8.501-13.151z"/><path fill="#43c000" fill-rule="evenodd" d="M162.841 126.852c-10.475 7.999-24.556 11.537-36.593 12.25l-.038.002-.038.003c-2.121.205-3.604-.121-4.627-.627a4.7 4.7 0 0 1-2.127-2.069 5.74 5.74 0 0 1-.631-2.71c.012-.924.241-1.605.456-1.941l.053-.082.045-.086 8.881-17.172a2.074 2.074 0 0 0-.89-2.796 2.074 2.074 0 0 0-2.796.889l-8.842 17.096c-.704 1.143-1.039 2.601-1.057 4.039a9.897 9.897 0 0 0 1.105 4.69 8.856 8.856 0 0 0 3.962 3.862c1.842.911 4.118 1.297 6.827 1.042 9.015-.537 19.381-2.607 28.735-7.013a57.593 57.593 0 0 0 7.575-9.377z" clip-rule="evenodd"/></svg>`;

// CSS styles (same as original)
const CSS_STYLES = `html,body{padding:0;margin:0;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;font-weight:500}.card{display:grid;grid-template-columns:3fr 1fr;color:white;border:1.5px solid#21212120;padding:10px 20px 10px 10px;gap:10px;border-radius:10px;background-color:#21D4FD;background-image:linear-gradient(19deg,#21D4FD 0%,#B721FF 100%);background-size:200%200%;animation:gradient-animation 4s ease-in-out infinite}.content{display:grid}.stats{display:flex;flex-direction:column;font-size:25px;font-weight:bold}.stats #streak,.stats #xp{display:flex;align-items:center}.courses{display:flex;gap:40px;padding:10px 10px 0 10px;justify-content:center}.language{display:flex;flex-direction:column;font-size:10px;align-items:center}.language #crown-count,.language #xp-count{font-weight:bold}@keyframes gradient-animation{0%{background-position:0%50%}50%{background-position:100%50%}100%{background-position:0%50%}}.crown{height:13px;width:17px;position:relative;z-index:0}.xp{height:20px;width:20px;position:relative;z-index:0}`;

// ============================================
// SVG Generation (matching original structure)
// ============================================
function generateSVG(stats, theme) {
  const colors = THEMES[theme] || THEMES['dark'];
  const width = 420;
  const height = 185;

  // Generate course items HTML
  const courseItems = stats.courses.map(course => {
    const flagSvg = getFlagSvg(course.learningLanguage);
    return `<div class="language"><div class="xp">${XP_SMALL_SVG}</div><span id="xp-count">${numberFormatter(course.xp)}</span>${flagSvg}</div>`;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" font-family="Segoe UI, sans-serif">
    <style>${CSS_STYLES}</style>
    <g><foreignObject x="0" y="0" width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" class="card" style="background:${colors.background}!important;color:${colors.colorPrimary};height:100%;width:100%;box-sizing:border-box"><div class="content"><div class="stats"><span id="streak">${STREAK_SVG}${stats.streak} Day streak</span><span id="xp">${XP_SVG}${stats.totalXp} XP</span></div><div class="courses" style="color:${colors.colorSecondary}">${courseItems}</div></div>${DUO_JOLLY_SVG}</div></foreignObject></g>
    </svg>`;

  return svg;
}

// ============================================
// Main
// ============================================
async function main() {
  try {
    console.log('Starting Duolingo card generation...');
    console.log(`Username: ${CONFIG.username}`);
    console.log(`Theme: ${CONFIG.theme}`);

    const stats = await fetchDuolingoStats(CONFIG.username);
    console.log(`Fetched stats: ${stats.streak} day streak, ${stats.totalXp} XP`);
    console.log(`Top courses: ${stats.courses.map(c => c.title).join(', ')}`);

    const svg = generateSVG(stats, CONFIG.theme);

    const distDir = path.join(__dirname, '..', 'dist');
    if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

    const outputPath = path.join(distDir, 'card.svg');
    fs.writeFileSync(outputPath, svg, 'utf8');
    console.log(`Card generated: ${outputPath}`);

    // Preview HTML
    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Duolingo Stats Card</title>
<style>body{display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#0d1117}
a{transition:transform 0.2s;border-radius:10px;display:block}a:hover{transform:translateY(-4px)}</style>
</head><body><a href="https://duolingo.com/profile/${stats.username}" target="_blank"><img src="card.svg" alt="Duolingo Stats"/></a></body></html>`;
    fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf8');

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error.message);
    const distDir = path.join(__dirname, '..', 'dist');
    if (fs.existsSync(path.join(distDir, 'card.svg'))) {
      console.log('Keeping existing card due to error');
      process.exit(0);
    }
    process.exit(1);
  }
}

main();
