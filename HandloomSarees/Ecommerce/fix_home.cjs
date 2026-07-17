const fs = require('fs');
let code = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

// Find the last occurrence of GoldenThread function (the real one, not commented)
const needle = 'function GoldenThread({ className = "" }: { className?: string }) {\r\n  const pA = "M0,28 C220,5 330,52 550,28 C770,5 880,52 1100,28 C1210,8 1260,38 1320,28";\r\n  const pB = "M0,40 C180,16 400,58 660,36 C920,12 1100,54 1320,36";\r\n  const Half = () => (\r\n    <svg className="thread-svg-half" viewBox="0 0 1320 58" preserveAspectRatio="none" style={{ height: 52, display: "block" }}>\r\n      <path d={pA} stroke="rgba(196,152,10,0.62)" strokeWidth="1.2" fill="none" />\r\n      <path d={pB} stroke="rgba(196,152,10,0.38)" strokeWidth="0.8" fill="none" />\r\n    </svg>\r\n  );\r\n  return (\r\n    <div className={className} style={{ width: "100%", overflow: "hidden", lineHeight: 0, pointerEvents: "none", background: "var(--cream-lt)" }}>\r\n      <div className="thread-track"><Half /><Half /></div>\r\n    </div>\r\n  );\r\n}';

const replacement = 'function GoldenThread({ className = "" }: { className?: string }) {\r\n  const pA = "M0,28 C220,5 330,52 550,28 C770,5 880,52 1100,28 C1210,8 1260,38 1320,28";\r\n  const pB = "M0,40 C180,16 400,58 660,36 C920,12 1100,54 1320,36";\r\n  const halfSvg = (\r\n    <svg className="thread-svg-half" viewBox="0 0 1320 58" preserveAspectRatio="none" style={{ height: 52, display: "block" }}>\r\n      <path d={pA} stroke="rgba(196,152,10,0.62)" strokeWidth="1.2" fill="none" />\r\n      <path d={pB} stroke="rgba(196,152,10,0.38)" strokeWidth="0.8" fill="none" />\r\n    </svg>\r\n  );\r\n  return (\r\n    <div className={className} style={{ width: "100%", overflow: "hidden", lineHeight: 0, pointerEvents: "none", background: "var(--cream-lt)" }}>\r\n      <div className="thread-track">{halfSvg}{halfSvg}</div>\r\n    </div>\r\n  );\r\n}';

if (code.includes(needle)) {
  code = code.replace(needle, replacement);
  fs.writeFileSync('src/pages/HomePage.tsx', code);
  console.log('SUCCESS: GoldenThread fixed');
} else {
  console.log('NOT FOUND - checking index:');
  const idx = code.lastIndexOf('function GoldenThread(');
  console.log('lastIndexOf:', idx);
  console.log(JSON.stringify(code.substring(idx, idx + 700)));
}
