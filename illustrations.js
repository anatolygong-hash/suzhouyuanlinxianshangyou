/* ============================================================
 * illustrations.js — 苏州园林实景照片 + 精细水墨插画库
 * ============================================================ */
(function(){
  if (window.GP) return;

  // ===== 实景照片资源 =====
  // 优先使用本地 images/{key}.jpg（见 README-下载指南.md）；
  // 本地缺失时直接回落到 SVG 水墨插画，不加载任何外链图片，避免无关照片。
  const PHOTO_IDS = [
    '1518998053901-5348d3961a04','1565967511849-76a60a516170',
    '1582719471384-894fbb16e074','1551018612-9715965c6742',
    '1554188248-986adbb73be4','1606298855672-3efb63017be8',
    '1528360983277-13d401cdc186','1545987796-200677ee1011',
    '1505839673365-e3971f8d9184','1542038784456-1ea8e935640e',
    '1559827260-dc66d52bef19','1551410224-699683e15636',
    '1574691250077-03a929faece5','1581497396202-5645e76a3a8e',
    '1582456891925-a53965520520'
  ];
  const LOCAL_PHOTO_DIR = 'images/';
  const photoUrl = (id, w=1600, q=82) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
  function hashStr(s){
    let h=0; for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;} return Math.abs(h);
  }
  // 本地照片路径：images/{key}.jpg
  const localPhoto = (key) => `${LOCAL_PHOTO_DIR}${key}.jpg`;
  // 统一入口：优先本地实景照片，取不到则返回空串（由调用方渲染 SVG）
  const photoFor = (key) => localPhoto(key);
  const photoForIdx = (idx) => localPhoto(`idx-${idx}`);
  // 远程备用（仅在显式调用时使用）
  const remotePhotoFor = (key) => photoUrl(PHOTO_IDS[hashStr(key) % PHOTO_IDS.length]);

  // ===== 配色 =====
  const C = {
    paper:'#f1e7cf', paper2:'#e8dec3', paper3:'#d8c9a8', paper4:'#c9b896',
    ink:'#1a1410', inkSoft:'#3d3329', inkLight:'#5a4d3d', inkFaint:'#8a7d6a',
    vermilion:'#b13a2f', vermilionD:'#872821', vermilionL:'#d4543f',
    gold:'#b58d4e', goldL:'#d6b46e', goldD:'#8a6a30',
    daiqing:'#2f5a6e', daiqingD:'#143442', daiqingL:'#5a8090',
    mtFar:'#7a8a9a', mtFar2:'#a5b0bd', mtNear:'#1f2a35', mtNear2:'#3a4858',
    water:'#3a5868', waterL:'#6a8a98', waterD:'#1a3540',
    building:'#c9b896', buildingDk:'#7a6a4a', buildingRoof:'#4a3a25',
    wood:'#8b5a3c', woodD:'#5a3a25',
    vegDark:'#2d4a2a', vegMid:'#3d5a3a', vegLight:'#5a7a4a', vegPine:'#1a3020',
    bamboo:'#4a6b3a', bambooD:'#2a4520',
    lotus:'#5a8a4a', lotusF:'#e89aaa', lotusD:'#c46a7a',
    plum:'#c97a8a', maple:'#b85a3a', ginkgo:'#d4a93a', wisteria:'#9a7aba',
    snow:'#f0f0f8', snow2:'#d8e0e8',
    moon:'#f5e8b8', sun:'#e89a3a',
    koi1:'#c84a3a', koi2:'#f0e8c0', koi3:'#1a1410',
    sandstone:'#a89878', rockeryL:'#5a6b5a', rockeryD:'#3a4a3a',
    pineNeedle:'#1a4030', plumBranch:'#4a3530',
  };

  // ===== 通用 SVG 包装器 =====
  const _uid = (() => { let n=0; return () => ++n; })();
  const makeSvg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:100%">${body}</svg>`;
  const sky = (W, H, top=C.paper, bottom=C.paper3) => `
    <defs><linearGradient id="sk-${_uid()}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${top}"/><stop offset="100%" stop-color="${bottom}"/>
    </linearGradient></defs>
    <rect width="${W}" height="${H}" fill="${url_sky(top,bottom)}"/>
  `;
  // helper to reuse the same gradient id
  function url_sky(top, bottom){
    const id = _uid()-1;
    return `url(#sk-${id})`;
  }
  const inkOverlay = (W, H, op=0.1) => `<rect width="${W}" height="${H}" fill="${C.ink}" opacity="${op}" style="mix-blend-mode:multiply"/>`;
  const paperTexture = (W, H, op=0.05) => {
    let r='';
    for (let i=0;i<80;i++){
      const x=Math.random()*W, y=Math.random()*H;
      r += `<circle cx="${x}" cy="${y}" r="${Math.random()*1.4}" fill="${C.ink}" opacity="${Math.random()*op}"/>`;
    }
    return r;
  };
  const goldFleck = (W, H, n=20) => {
    let r='';
    for (let i=0;i<n;i++){
      const x=Math.random()*W, y=Math.random()*H;
      r += `<circle cx="${x}" cy="${y}" r="${0.4+Math.random()*0.6}" fill="${C.goldL}" opacity="${0.3+Math.random()*0.4}"/>`;
    }
    return r;
  };

  // ===== 山体 =====
  const mountainFar = (W, H, baseY, amp, color=C.mtFar, opacity=0.4, segs=5) => {
    const step = W/segs, id=_uid();
    let d=`M 0 ${baseY}`;
    for(let i=1;i<=segs;i++){
      const cx=i*step-step/2, cy=baseY-amp*(0.4+Math.random()*0.6);
      d += ` Q ${cx} ${cy} ${i*step} ${baseY-amp*0.3*(Math.random()*0.6+0.4)}`;
    }
    d += ` L ${W} ${H} L 0 ${H} Z`;
    return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
  };
  const mountainMid = (W, H, baseY, amp, color=C.mtFar2, opacity=0.55, segs=6) => {
    const step = W/segs;
    let d=`M 0 ${baseY}`;
    for(let i=1;i<=segs;i++){
      const cx=i*step-step/2, cy=baseY-amp*(0.4+Math.random()*0.7);
      d += ` Q ${cx} ${cy} ${i*step} ${baseY-amp*0.5*(Math.random()*0.5+0.4)}`;
    }
    d += ` L ${W} ${H} L 0 ${H} Z`;
    return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
  };
  const mountainNear = (W, H, baseY, amp, color=C.mtNear, opacity=0.7, segs=7) => {
    const step = W/segs;
    let d=`M 0 ${baseY}`;
    for(let i=1;i<=segs;i++){
      const cx=i*step-step/2, cy=baseY-amp*(0.5+Math.random()*0.7);
      d += ` Q ${cx} ${cy} ${i*step} ${baseY-amp*0.5*(Math.random()*0.5+0.4)}`;
    }
    d += ` L ${W} ${H} L 0 ${H} Z`;
    return `<path d="${d}" fill="${color}" opacity="${opacity}"/>`;
  };

  // 远山淡墨 (atmospheric)
  const mountainMisty = (W, baseY, amp=80) => {
    let d=`M 0 ${baseY}`;
    for(let i=0;i<7;i++){
      const x = i*W/6;
      d += ` Q ${x+W/12} ${baseY-amp*(0.5+Math.random()*0.5)} ${x+W/6} ${baseY-amp*0.4}`;
    }
    d += ` L ${W} ${baseY+30} L 0 ${baseY+30} Z`;
    return `<path d="${d}" fill="${C.mtFar}" opacity="0.25"/>`;
  };

  // ===== 水面 =====
  const water = (W, H, startY, color=C.water, opacity=0.85) => {
    const id=_uid();
    return `
      <defs><linearGradient id="wa-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${C.waterL}" stop-opacity="${opacity*0.7}"/>
        <stop offset="100%" stop-color="${color}" stop-opacity="${opacity}"/>
      </linearGradient></defs>
      <path d="M 0 ${startY}
               Q ${W*0.25} ${startY-H*0.015} ${W*0.5} ${startY}
               T ${W} ${startY-H*0.008}
               L ${W} ${H} L 0 ${H} Z"
            fill="url(#wa-${id})"/>
    `;
  };
  const ripples = (W, H, startY, count=4) => {
    let r='';
    for (let i=0;i<count;i++){
      const y=startY+H*0.04+i*H*0.06, offset=Math.random()*W*0.3;
      r += `<path d="M ${-10+offset} ${y} Q ${W*0.25+offset} ${y-2} ${W*0.5+offset} ${y} T ${W+10+offset} ${y-1}"`
         + ` stroke="${C.waterL}" stroke-width="0.6" fill="none" opacity="${0.4-i*0.05}"/>`;
    }
    return r;
  };
  // 水面倒影
  const waterRefl = (path, opacity=0.2) => `<g transform="scale(1,-0.35) translate(0,${-2*path.y})" opacity="${opacity}">${path.body}</g>`;

  // ===== 建筑 =====
  // 六角亭 (重檐)
  const pavilionHex = (x, y, scale=1, opts={}) => {
    const r = opts.roof || C.ink, w = opts.wall || C.building;
    return `
      <g transform="translate(${x},${y}) scale(${scale})">
        <!-- 上檐 -->
        <polygon points="-44,-12 0,-26 44,-12" fill="${r}" opacity="0.85"/>
        <!-- 下檐 -->
        <polygon points="-50,0 0,-18 50,0" fill="${r}"/>
        <polygon points="-50,0 -38,-10 0,-18 38,-10 50,0" fill="${C.inkSoft}"/>
        <circle cx="0" cy="-26" r="2.5" fill="${r}"/>
        <line x1="-52" y1="0" x2="52" y2="0" stroke="${C.ink}" stroke-width="0.8"/>
        <line x1="-50" y1="2" x2="50" y2="2" stroke="${C.ink}" stroke-width="0.4" opacity="0.6"/>
        <!-- 亭身 -->
        <rect x="-36" y="2" width="72" height="24" fill="${w}" stroke="${C.ink}" stroke-width="0.6"/>
        <!-- 柱 -->
        <line x1="-30" y1="2" x2="-30" y2="26" stroke="${C.ink}" stroke-width="1"/>
        <line x1="-15" y1="2" x2="-15" y2="26" stroke="${C.ink}" stroke-width="1"/>
        <line x1="0" y1="2" x2="0" y2="26" stroke="${C.ink}" stroke-width="1"/>
        <line x1="15" y1="2" x2="15" y2="26" stroke="${C.ink}" stroke-width="1"/>
        <line x1="30" y1="2" x2="30" y2="26" stroke="${C.ink}" stroke-width="1"/>
        <!-- 美人靠 (curved bench) -->
        <path d="M -38 24 Q 0 28 38 24" fill="none" stroke="${C.ink}" stroke-width="0.5" opacity="0.5"/>
        <!-- 台基 -->
        <rect x="-40" y="26" width="80" height="4" fill="${C.inkLight}"/>
        <line x1="-42" y1="30" x2="42" y2="30" stroke="${C.ink}" stroke-width="0.4"/>
        <!-- 台阶 -->
        <rect x="-12" y="30" width="24" height="3" fill="${C.inkFaint}"/>
      </g>
    `;
  };

  // 四方亭
  const pavilionQuad = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <polygon points="-50,0 0,-30 50,0" fill="${C.ink}"/>
      <polygon points="-50,0 -38,-12 0,-30 38,-12 50,0" fill="${C.inkSoft}"/>
      <polygon points="-2,-30 2,-30 0,-36" fill="${C.ink}"/>
      <rect x="-40" y="2" width="80" height="22" fill="${C.building}" stroke="${C.ink}" stroke-width="0.6"/>
      <line x1="-32" y1="2" x2="-32" y2="24" stroke="${C.ink}" stroke-width="1"/>
      <line x1="-16" y1="2" x2="-16" y2="24" stroke="${C.ink}" stroke-width="1"/>
      <line x1="0" y1="2" x2="0" y2="24" stroke="${C.ink}" stroke-width="1"/>
      <line x1="16" y1="2" x2="16" y2="24" stroke="${C.ink}" stroke-width="1"/>
      <line x1="32" y1="2" x2="32" y2="24" stroke="${C.ink}" stroke-width="1"/>
      <!-- 瓦垄 (roof tiles) -->
      <g stroke="${C.ink}" stroke-width="0.3" opacity="0.5">
        <line x1="-44" y1="-2" x2="44" y2="-2"/>
        <line x1="-42" y1="-6" x2="42" y2="-6"/>
        <line x1="-40" y1="-10" x2="40" y2="-10"/>
      </g>
      <rect x="-44" y="24" width="88" height="4" fill="${C.inkLight}"/>
      <rect x="-12" y="28" width="24" height="3" fill="${C.inkFaint}"/>
    </g>
  `;

  // 厅堂 (含匾额楹联)
  const hall = (x, y, w=120, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <polygon points="${-w/2 - 10},0 ${-w/2},-14 ${w/2},-14 ${w/2 + 10},0" fill="${C.ink}"/>
      <polygon points="${-w/2 - 10},0 ${-w/2 + 4},-6 0,-12 ${w/2 - 4},-6 ${w/2 + 10},0" fill="${C.inkSoft}"/>
      <polygon points="${-w/2 - 8},0 ${-w/2 + 4},-4 -4,-12 4,-12 ${w/2 - 4},-4 ${w/2 + 8},0" fill="${C.vermilionD}"/>
      <rect x="${-w/2}" y="0" width="${w}" height="22" fill="${C.building}" stroke="${C.ink}" stroke-width="0.8"/>
      <line x1="${-w/2 + 10}" y1="0" x2="${-w/2 + 10}" y2="22" stroke="${C.ink}" stroke-width="1"/>
      <line x1="${-w/4}" y1="0" x2="${-w/4}" y2="22" stroke="${C.ink}" stroke-width="1"/>
      <line x1="0" y1="0" x2="0" y2="22" stroke="${C.ink}" stroke-width="1"/>
      <line x1="${w/4}" y1="0" x2="${w/4}" y2="22" stroke="${C.ink}" stroke-width="1"/>
      <line x1="${w/2 - 10}" y1="0" x2="${w/2 - 10}" y2="22" stroke="${C.ink}" stroke-width="1"/>
      <!-- 匾额 -->
      <rect x="${-20}" y="-10" width="40" height="14" fill="${C.ink}" stroke="${C.gold}" stroke-width="0.4"/>
      <text x="0" y="0" text-anchor="middle" font-family="'Ma Shan Zheng',serif" font-size="9" fill="${C.gold}">题额</text>
      <!-- 门扇 -->
      <rect x="${-12}" y="4" width="10" height="16" fill="${C.wood}" stroke="${C.ink}" stroke-width="0.4"/>
      <rect x="2" y="4" width="10" height="16" fill="${C.wood}" stroke="${C.ink}" stroke-width="0.4"/>
      <line x1="${-7}" y1="4" x2="${-7}" y2="20" stroke="${C.ink}" stroke-width="0.3"/>
      <line x1="7" y1="4" x2="7" y2="20" stroke="${C.ink}" stroke-width="0.3"/>
      <!-- 窗格 -->
      <g stroke="${C.ink}" stroke-width="0.4" fill="none">
        <rect x="${-w/2 + 4}" y="6" width="14" height="10"/>
        <line x1="${-w/2 + 11}" y1="6" x2="${-w/2 + 11}" y2="16"/>
        <line x1="${-w/2 + 4}" y1="11" x2="${-w/2 + 18}" y2="11"/>
        <rect x="${w/2 - 18}" y="6" width="14" height="10"/>
        <line x1="${w/2 - 11}" y1="6" x2="${w/2 - 11}" y2="16"/>
        <line x1="${w/2 - 18}" y1="11" x2="${w/2 - 4}" y2="11"/>
      </g>
      <!-- 台基 (raised platform) -->
      <rect x="${-w/2 - 6}" y="22" width="${w + 12}" height="6" fill="${C.inkLight}"/>
      <rect x="${-w/2 - 6}" y="28" width="${w + 12}" height="2" fill="${C.ink}"/>
      <!-- 台阶 -->
      <rect x="${-14}" y="28" width="28" height="4" fill="${C.inkFaint}"/>
      <rect x="${-10}" y="32" width="20" height="2" fill="${C.inkFaint}"/>
    </g>
  `;

  // 楼阁
  const tower = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <!-- 上层 -->
      <polygon points="-32,-40 -32,-54 32,-54 32,-40" fill="${C.building}" stroke="${C.ink}" stroke-width="0.6"/>
      <polygon points="-38,-40 0,-62 38,-40" fill="${C.ink}"/>
      <polygon points="-32,-54 -24,-60 0,-66 24,-60 32,-54" fill="${C.inkSoft}"/>
      <line x1="-24" y1="-40" x2="-24" y2="-54" stroke="${C.ink}" stroke-width="0.6"/>
      <line x1="0" y1="-40" x2="0" y2="-54" stroke="${C.ink}" stroke-width="0.6"/>
      <line x1="24" y1="-40" x2="24" y2="-54" stroke="${C.ink}" stroke-width="0.6"/>
      <rect x="-6" y="-50" width="12" height="10" fill="${C.wood}"/>
      <line x1="0" y1="-50" x2="0" y2="-40" stroke="${C.ink}" stroke-width="0.3"/>
      <!-- 下层 -->
      <rect x="-38" y="-40" width="76" height="38" fill="${C.building}" stroke="${C.ink}" stroke-width="0.8"/>
      <line x1="-28" y1="-40" x2="-28" y2="-2" stroke="${C.ink}" stroke-width="1"/>
      <line x1="-12" y1="-40" x2="-12" y2="-2" stroke="${C.ink}" stroke-width="1"/>
      <line x1="12" y1="-40" x2="12" y2="-2" stroke="${C.ink}" stroke-width="1"/>
      <line x1="28" y1="-40" x2="28" y2="-2" stroke="${C.ink}" stroke-width="1"/>
      <rect x="-12" y="-32" width="10" height="14" fill="${C.wood}" stroke="${C.ink}" stroke-width="0.4"/>
      <rect x="2" y="-32" width="10" height="14" fill="${C.wood}" stroke="${C.ink}" stroke-width="0.4"/>
      <rect x="-40" y="-2" width="80" height="4" fill="${C.inkLight}"/>
      <rect x="-40" y="2" width="80" height="2" fill="${C.ink}"/>
    </g>
  `;

  // 长廊 (含花窗)
  const corridor = (x, y, length=200, dir='h', scale=1) => {
    const isH = dir==='h', w=isH?length:20, h=isH?20:length;
    const windowPos = isH
      ? Array.from({length:Math.floor(length/40)}, (_, i) => -length/2 + 20 + i*40)
      : Array.from({length:Math.floor(length/40)}, (_, i) => -length/2 + 20 + i*40);
    return `
      <g transform="translate(${x},${y}) scale(${scale})">
        <polygon points="${-w/2 - 5},0 ${-w/2},-8 ${w/2},-8 ${w/2 + 5},0" fill="${C.ink}"/>
        <polygon points="${-w/2 - 3},0 ${-w/2 + 2},-2 0,-4 ${w/2 - 2},-2 ${w/2 + 3},0" fill="${C.vermilionD}"/>
        <line x1="${-w/2}" y1="0" x2="${w/2}" y2="0" stroke="${C.ink}" stroke-width="0.6"/>
        <rect x="${-w/2}" y="0" width="${w}" height="${h}" fill="${C.building}" stroke="${C.ink}" stroke-width="0.5" opacity="0.9"/>
        ${isH ?
          windowPos.map(xPos => `
            <!-- 花窗 -->
            <rect x="${xPos - 8}" y="3" width="16" height="14" fill="${C.paper}" stroke="${C.ink}" stroke-width="0.4"/>
            <g stroke="${C.ink}" stroke-width="0.4" fill="none">
              <line x1="${xPos - 8}" y1="10" x2="${xPos + 8}" y2="10"/>
              <line x1="${xPos}" y1="3" x2="${xPos}" y2="17"/>
              <circle cx="${xPos}" cy="10" r="2"/>
            </g>
            <!-- 立柱 -->
            <line x1="${xPos + 12}" y1="0" x2="${xPos + 12}" y2="${h}" stroke="${C.ink}" stroke-width="0.5"/>
          `).join('')
          : windowPos.map(yPos => `
            <rect x="3" y="${yPos - 8}" width="14" height="16" fill="${C.paper}" stroke="${C.ink}" stroke-width="0.4"/>
            <g stroke="${C.ink}" stroke-width="0.4" fill="none">
              <line x1="10" y1="${yPos - 8}" x2="10" y2="${yPos + 8}"/>
              <line x1="3" y1="${yPos}" x2="17" y2="${yPos}"/>
            </g>
            <line x1="0" y1="${yPos + 12}" x2="${w}" y2="${yPos + 12}" stroke="${C.ink}" stroke-width="0.5"/>
          `).join('')
        }
        <rect x="${-w/2 - 5}" y="${h}" width="${w + 10}" height="2" fill="${C.inkLight}"/>
      </g>
    `;
  };

  // 拱桥
  const bridgeArch = (x, y, w=80, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <path d="M ${-w/2} 0 Q 0 ${-w*0.18} ${w/2} 0 L ${w/2 - 4} 0 Q 0 ${-w*0.16} ${-w/2 + 4} 0 Z" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.8"/>
      <line x1="${-w/2 + 4}" y1="-2" x2="${w/2 - 4}" y2="-2" stroke="${C.ink}" stroke-width="0.5" opacity="0.6"/>
      <path d="M ${-w/2 + 2} -2 Q 0 ${-w*0.18 + 4} ${w/2 - 2} -2" fill="none" stroke="${C.ink}" stroke-width="0.5"/>
      <ellipse cx="0" cy="-3" rx="${w*0.32}" ry="${w*0.08}" fill="${C.water}" opacity="0.85"/>
      <ellipse cx="0" cy="-2" rx="${w*0.3}" ry="${w*0.06}" fill="${C.waterD}" opacity="0.5"/>
      <!-- 桥栏柱 -->
      <circle cx="${-w/2 + 6}" cy="${-w*0.16 - 2}" r="2" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.4"/>
      <circle cx="${w/2 - 6}" cy="${-w*0.16 - 2}" r="2" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.4"/>
      <circle cx="0" cy="${-w*0.18 - 1}" r="2" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.4"/>
    </g>
  `;

  // 平桥
  const bridgeFlat = (x, y, w=100, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <rect x="${-w/2}" y="-2" width="${w}" height="6" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.8"/>
      <line x1="${-w/2}" y1="-4" x2="${w/2}" y2="-4" stroke="${C.ink}" stroke-width="0.6"/>
      <line x1="${-w/2 + 4}" y1="0" x2="${w/2 - 4}" y2="0" stroke="${C.ink}" stroke-width="0.5" opacity="0.6"/>
      <circle cx="${-w/2 + 4}" cy="-4" r="1.5" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.3"/>
      <circle cx="0" cy="-4" r="1.5" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.3"/>
      <circle cx="${w/2 - 4}" cy="-4" r="1.5" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.3"/>
    </g>
  `;

  // 九曲桥 (蜿蜒)
  const bridgeZigzag = (x, y, w=200, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <path d="M ${-w/2} 0 Q ${-w/4} -8 0 0 T ${w/4} 0 L ${w/2} 0" fill="none" stroke="${C.sandstone}" stroke-width="5" opacity="0.8"/>
      <path d="M ${-w/2} 0 Q ${-w/4} -8 0 0 T ${w/4} 0 L ${w/2} 0" fill="none" stroke="${C.ink}" stroke-width="0.6"/>
    </g>
  `;

  // 画舫 (painted boat)
  const boat = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <!-- 船身 -->
      <path d="M -60 0 Q -50 -10 0 -12 Q 50 -10 60 0 L 50 18 L -50 18 Z" fill="${C.wood}" stroke="${C.ink}" stroke-width="0.8"/>
      <line x1="-50" y1="2" x2="50" y2="2" stroke="${C.ink}" stroke-width="0.3" opacity="0.5"/>
      <!-- 船舱 -->
      <rect x="-30" y="-30" width="60" height="20" fill="${C.woodD}" stroke="${C.ink}" stroke-width="0.6"/>
      <polygon points="-35,-30 0,-44 35,-30" fill="${C.ink}"/>
      <polygon points="-33,-30 -22,-38 0,-44 22,-38 33,-30" fill="${C.inkSoft}"/>
      <!-- 舱窗 -->
      <rect x="-22" y="-25" width="10" height="12" fill="${C.paper}" stroke="${C.ink}" stroke-width="0.3"/>
      <rect x="-8" y="-25" width="10" height="12" fill="${C.paper}" stroke="${C.ink}" stroke-width="0.3"/>
      <rect x="6" y="-25" width="10" height="12" fill="${C.paper}" stroke="${C.ink}" stroke-width="0.3"/>
      <line x1="-17" y1="-25" x2="-17" y2="-13" stroke="${C.ink}" stroke-width="0.2"/>
      <line x1="-3" y1="-25" x2="-3" y2="-13" stroke="${C.ink}" stroke-width="0.2"/>
      <line x1="11" y1="-25" x2="11" y2="-13" stroke="${C.ink}" stroke-width="0.2"/>
      <!-- 船舷 -->
      <rect x="-50" y="14" width="100" height="4" fill="${C.inkLight}"/>
      <!-- 倒影 -->
      <path d="M -60 0 Q -50 10 0 12 Q 50 10 60 0 L 50 -10 L -50 -10 Z" fill="${C.ink}" opacity="0.15" transform="translate(0, 20) scale(1, 0.6)"/>
    </g>
  `;

  // 月洞门 (moon gate)
  const moonGate = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <!-- 院墙 -->
      <rect x="-50" y="-30" width="100" height="80" fill="${C.paper2}" stroke="${C.ink}" stroke-width="1.2"/>
      <!-- 月洞门 -->
      <circle cx="0" cy="10" r="22" fill="${C.ink}" opacity="0.85"/>
      <circle cx="0" cy="10" r="18" fill="${C.paper3}"/>
      <!-- 墙顶瓦垄 -->
      <g fill="${C.ink}">
        <rect x="-52" y="-32" width="104" height="4"/>
        <rect x="-50" y="-34" width="100" height="2"/>
      </g>
      <line x1="-50" y1="-30" x2="50" y2="-30" stroke="${C.ink}" stroke-width="0.3"/>
      <!-- 墙基 -->
      <rect x="-54" y="46" width="108" height="4" fill="${C.ink}"/>
    </g>
  `;

  // 花窗 (flower window lattice)
  const flowerWindow = (x, y, scale=1, pattern='ice') => {
    const patterns = {
      ice: () => `
        <line x1="-15" y1="-15" x2="0" y2="0" stroke="${C.ink}" stroke-width="0.6"/>
        <line x1="0" y1="-15" x2="-15" y2="0" stroke="${C.ink}" stroke-width="0.6"/>
        <line x1="0" y1="0" x2="15" y2="-15" stroke="${C.ink}" stroke-width="0.6"/>
        <line x1="0" y1="0" x2="15" y2="15" stroke="${C.ink}" stroke-width="0.6"/>
        <line x1="-15" y1="0" x2="0" y2="15" stroke="${C.ink}" stroke-width="0.6"/>
        <line x1="0" y1="15" x2="15" y2="0" stroke="${C.ink}" stroke-width="0.6"/>
        <line x1="-10" y1="-10" x2="10" y2="10" stroke="${C.ink}" stroke-width="0.4"/>
        <line x1="10" y1="-10" x2="-10" y2="10" stroke="${C.ink}" stroke-width="0.4"/>
      `,
      key: () => `
        <g stroke="${C.ink}" stroke-width="0.6" fill="none">
          <line x1="0" y1="-18" x2="0" y2="-8"/><line x1="-4" y1="-14" x2="4" y2="-14"/>
          <line x1="0" y1="-8" x2="0" y2="2"/><line x1="-4" y1="-2" x2="4" y2="-2"/>
          <line x1="0" y1="2" x2="0" y2="12"/><line x1="-4" y1="8" x2="4" y2="8"/>
          <line x1="0" y1="12" x2="0" y2="18"/><line x1="-4" y1="16" x2="4" y2="16"/>
        </g>
      `,
      circle: () => `
        <circle r="6" fill="none" stroke="${C.ink}" stroke-width="0.5"/>
        <circle cx="-12" cy="-12" r="4" fill="none" stroke="${C.ink}" stroke-width="0.5"/>
        <circle cx="12" cy="-12" r="4" fill="none" stroke="${C.ink}" stroke-width="0.5"/>
        <circle cx="-12" cy="12" r="4" fill="none" stroke="${C.ink}" stroke-width="0.5"/>
        <circle cx="12" cy="12" r="4" fill="none" stroke="${C.ink}" stroke-width="0.5"/>
        <line x1="-7" y1="-7" x2="0" y2="0" stroke="${C.ink}" stroke-width="0.3"/>
        <line x1="7" y1="-7" x2="0" y2="0" stroke="${C.ink}" stroke-width="0.3"/>
        <line x1="-7" y1="7" x2="0" y2="0" stroke="${C.ink}" stroke-width="0.3"/>
        <line x1="7" y1="7" x2="0" y2="0" stroke="${C.ink}" stroke-width="0.3"/>
      `,
    };
    const p = patterns[pattern] || patterns.ice;
    return `
      <g transform="translate(${x},${y}) scale(${scale})">
        <rect x="-22" y="-22" width="44" height="44" fill="${C.paper}" stroke="${C.ink}" stroke-width="1"/>
        <rect x="-18" y="-18" width="36" height="36" fill="none" stroke="${C.ink}" stroke-width="0.4"/>
        ${p()}
      </g>
    `;
  };

  // 石灯笼
  const stoneLantern = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <!-- 底座 -->
      <rect x="-8" y="20" width="16" height="4" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.4"/>
      <rect x="-6" y="14" width="12" height="6" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.4"/>
      <!-- 柱 -->
      <rect x="-2" y="2" width="4" height="12" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.3"/>
      <!-- 灯室 -->
      <rect x="-7" y="-8" width="14" height="12" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.4"/>
      <rect x="-5" y="-6" width="10" height="8" fill="${C.moon}" opacity="0.8"/>
      <!-- 顶 -->
      <polygon points="-9,-8 0,-14 9,-8" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.4"/>
      <circle cx="0" cy="-16" r="1.5" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.3"/>
      <!-- 窗格 -->
      <g stroke="${C.ink}" stroke-width="0.3" fill="none">
        <line x1="-3" y1="-8" x2="-3" y2="4"/>
        <line x1="0" y1="-8" x2="0" y2="4"/>
        <line x1="3" y1="-8" x2="3" y2="4"/>
        <line x1="-7" y1="-2" x2="7" y2="-2"/>
      </g>
    </g>
  `;

  // 匾额 (单独组件，可叠加在建筑上)
  const plaque = (x, y, text='', scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <rect x="-22" y="-7" width="44" height="14" fill="${C.ink}" stroke="${C.gold}" stroke-width="0.6"/>
      <rect x="-20" y="-5" width="40" height="10" fill="none" stroke="${C.gold}" stroke-width="0.3"/>
      <text x="0" y="3" text-anchor="middle" font-family="'Ma Shan Zheng',serif" font-size="10" fill="${C.gold}">${text}</text>
    </g>
  `;

  // ===== 植物 =====
  const pineTree = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <ellipse cx="0" cy="-12" rx="22" ry="14" fill="${C.vegPine}"/>
      <ellipse cx="-10" cy="-8" rx="14" ry="10" fill="${C.vegDark}"/>
      <ellipse cx="10" cy="-14" rx="13" ry="10" fill="${C.vegDark}"/>
      <ellipse cx="0" cy="-6" rx="12" ry="8" fill="${C.vegMid}"/>
      <!-- 针叶细节 -->
      <g stroke="${C.pineNeedle}" stroke-width="0.3" fill="none" opacity="0.5">
        <line x1="-18" y1="-12" x2="-15" y2="-15"/>
        <line x1="-8" y1="-15" x2="-6" y2="-19"/>
        <line x1="6" y1="-18" x2="9" y2="-21"/>
        <line x1="14" y1="-10" x2="17" y2="-13"/>
      </g>
      <!-- 树干 -->
      <rect x="-2" y="-2" width="4" height="14" fill="${C.plumBranch}" stroke="${C.ink}" stroke-width="0.4"/>
      <line x1="-1" y1="2" x2="1" y2="2" stroke="${C.ink}" stroke-width="0.3" opacity="0.6"/>
      <line x1="-1" y1="6" x2="1" y2="6" stroke="${C.ink}" stroke-width="0.3" opacity="0.6"/>
      <!-- 树下影子 -->
      <ellipse cx="0" cy="12" rx="10" ry="1.5" fill="${C.ink}" opacity="0.3"/>
    </g>
  `;

  const willowTree = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <ellipse cx="0" cy="-12" rx="14" ry="10" fill="${C.vegMid}"/>
      <!-- 柳条 -->
      <g stroke="${C.vegDark}" stroke-width="0.6" fill="none" opacity="0.85">
        <path d="M -12 -2 Q -14 8 -10 18"/>
        <path d="M -8 -2 Q -10 12 -6 22"/>
        <path d="M -4 -2 Q -5 14 -2 24"/>
        <path d="M 0 -2 Q 2 14 -1 24"/>
        <path d="M 4 -2 Q 5 12 2 22"/>
        <path d="M 8 -2 Q 10 8 6 18"/>
        <path d="M 12 -2 Q 14 6 10 16"/>
        <!-- 柳叶 -->
        <ellipse cx="-11" cy="6" rx="2" ry="0.6" transform="rotate(20 -11 6)" fill="${C.vegDark}" opacity="0.7"/>
        <ellipse cx="-7" cy="12" rx="2" ry="0.6" transform="rotate(15 -7 12)" fill="${C.vegDark}" opacity="0.7"/>
        <ellipse cx="-3" cy="16" rx="2" ry="0.6" transform="rotate(10 -3 16)" fill="${C.vegDark}" opacity="0.7"/>
        <ellipse cx="3" cy="16" rx="2" ry="0.6" transform="rotate(-10 3 16)" fill="${C.vegDark}" opacity="0.7"/>
        <ellipse cx="7" cy="12" rx="2" ry="0.6" transform="rotate(-15 7 12)" fill="${C.vegDark}" opacity="0.7"/>
        <ellipse cx="11" cy="6" rx="2" ry="0.6" transform="rotate(-20 11 6)" fill="${C.vegDark}" opacity="0.7"/>
      </g>
      <rect x="-2" y="-2" width="4" height="14" fill="${C.plumBranch}" stroke="${C.ink}" stroke-width="0.4"/>
    </g>
  `;

  // 竹
  const bamboo = (x, y, h=60, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      ${Array.from({length: Math.floor(h/12)}, (_, i) => `
        <line x1="0" y1="${-i*12}" x2="0" y2="${-(i+1)*12}" stroke="${C.bamboo}" stroke-width="${2 - i*0.15}"/>
        <line x1="-3" y1="${-(i*12+4)}" x2="3" y2="${-(i*12+4)}" stroke="${C.bamboo}" stroke-width="0.6"/>
        <line x1="-2" y1="${-(i*12+8)}" x2="2" y2="${-(i*12+8)}" stroke="${C.bambooD}" stroke-width="0.4"/>
      `).join('')}
      <g fill="${C.vegDark}">
        <ellipse cx="-8" cy="${-h*0.4}" rx="6" ry="2" transform="rotate(-30 -8 ${-h*0.4})"/>
        <ellipse cx="8" cy="${-h*0.5}" rx="6" ry="2" transform="rotate(30 8 ${-h*0.5})"/>
        <ellipse cx="-6" cy="${-h*0.7}" rx="5" ry="1.6" transform="rotate(-25 -6 ${-h*0.7})"/>
        <ellipse cx="6" cy="${-h*0.8}" rx="5" ry="1.6" transform="rotate(25 6 ${-h*0.8})"/>
      </g>
    </g>
  `;
  const bambooCluster = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      ${bamboo(-14, 0, 70, 0.85)}
      ${bamboo(0, 0, 80, 1)}
      ${bamboo(14, 0, 65, 0.75)}
      ${bamboo(-7, 0, 55, 0.65)}
      ${bamboo(7, 0, 60, 0.7)}
      <!-- 地面叶 -->
      <ellipse cx="0" cy="0" rx="20" ry="1.5" fill="${C.vegDark}" opacity="0.3"/>
    </g>
  `;

  // 树丛 (general)
  const treeCluster = (x, y, scale=1, c1=C.vegDark, c2=C.vegMid) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <ellipse cx="-15" cy="0" rx="18" ry="14" fill="${c1}"/>
      <ellipse cx="0" cy="-4" rx="22" ry="16" fill="${c2}"/>
      <ellipse cx="14" cy="0" rx="16" ry="13" fill="${c1}"/>
      <ellipse cx="-5" cy="-8" rx="14" ry="11" fill="${c2}"/>
      <ellipse cx="8" cy="-6" rx="12" ry="9" fill="${c1}" opacity="0.7"/>
      <line x1="-22" y1="10" x2="22" y2="10" stroke="${C.ink}" stroke-width="0.4" opacity="0.4"/>
    </g>
  `;

  // 梅 (plum)
  const plum = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <path d="M -2 -2 Q 0 -15 2 -25" stroke="${C.plumBranch}" stroke-width="1.4" fill="none"/>
      <path d="M 0 -10 Q -8 -12 -10 -16" stroke="${C.plumBranch}" stroke-width="0.8" fill="none"/>
      <path d="M 0 -16 Q 6 -18 8 -22" stroke="${C.plumBranch}" stroke-width="0.8" fill="none"/>
      <g fill="${C.plum}">
        <circle cx="-10" cy="-16" r="2"/>
        <circle cx="-8" cy="-12" r="2.5"/>
        <circle cx="8" cy="-22" r="2.5"/>
        <circle cx="6" cy="-18" r="2"/>
        <circle cx="2" cy="-25" r="2.5"/>
        <circle cx="-2" cy="-20" r="2"/>
        <circle cx="0" cy="-14" r="2"/>
      </g>
      <g fill="${C.goldL}">
        <circle cx="-10" cy="-16" r="0.5"/>
        <circle cx="-8" cy="-12" r="0.5"/>
        <circle cx="8" cy="-22" r="0.5"/>
        <circle cx="2" cy="-25" r="0.5"/>
      </g>
    </g>
  `;

  // 枫 (maple)
  const maple = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <ellipse cx="0" cy="-8" rx="20" ry="13" fill="${C.maple}"/>
      <ellipse cx="-6" cy="-4" rx="14" ry="9" fill="${C.vermilionD}"/>
      <ellipse cx="6" cy="-12" rx="10" ry="7" fill="${C.vermilion}"/>
      <!-- 枫叶 -->
      <g fill="${C.vermilion}" opacity="0.7">
        <path d="M 0 0 L -2 -3 L 0 -6 L 2 -3 Z"/>
        <path d="M 8 -2 L 6 -6 L 8 -10 L 10 -6 Z" transform="rotate(45 8 -6)"/>
        <path d="M -8 -2 L -10 -6 L -8 -10 L -6 -6 Z" transform="rotate(-45 -8 -6)"/>
      </g>
      <rect x="-1.5" y="-2" width="3" height="12" fill="${C.plumBranch}"/>
    </g>
  `;

  // 假山石 (太湖石)
  const rockery = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <path d="M -40 0 L -30 -25 L -10 -32 L 10 -28 L 30 -20 L 40 0 Z" fill="${C.inkLight}" stroke="${C.ink}" stroke-width="0.8"/>
      <path d="M -30 -25 L -22 -10 L -10 -32" stroke="${C.ink}" stroke-width="0.4" fill="none" opacity="0.6"/>
      <path d="M 10 -28 L 5 -10 L 18 -20" stroke="${C.ink}" stroke-width="0.4" fill="none" opacity="0.6"/>
      <path d="M -10 -32 L 0 -16" stroke="${C.ink}" stroke-width="0.4" fill="none" opacity="0.6"/>
      <path d="M 30 -20 L 25 -8 L 38 -12" stroke="${C.ink}" stroke-width="0.4" fill="none" opacity="0.6"/>
      <!-- 峰顶 -->
      <circle cx="-10" cy="-32" r="2" fill="${C.ink}"/>
      <circle cx="30" cy="-20" r="1.5" fill="${C.ink}"/>
      <circle cx="-30" cy="-25" r="1.5" fill="${C.ink}"/>
      <!-- 洞 -->
      <ellipse cx="-8" cy="-12" rx="6" ry="3" fill="${C.ink}" opacity="0.5"/>
      <ellipse cx="18" cy="-8" rx="4" ry="2" fill="${C.ink}" opacity="0.5"/>
      <ellipse cx="-22" cy="-6" rx="3" ry="1.5" fill="${C.ink}" opacity="0.4"/>
      <ellipse cx="28" cy="-4" rx="3" ry="1.5" fill="${C.ink}" opacity="0.4"/>
      <!-- 苔痕 -->
      <g fill="${C.rockeryL}" opacity="0.4">
        <ellipse cx="-15" cy="-22" rx="4" ry="1.5" transform="rotate(-30 -15 -22)"/>
        <ellipse cx="15" cy="-15" rx="3" ry="1" transform="rotate(20 15 -15)"/>
        <ellipse cx="0" cy="-25" rx="3" ry="1" transform="rotate(-15 0 -25)"/>
      </g>
    </g>
  `;

  // 巨型假山群
  const rockeryGroup = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <path d="M -60 0 L -45 -28 L -25 -38 L -5 -32 L 15 -42 L 35 -34 L 55 -20 L 65 0 Z" fill="${C.inkLight}" stroke="${C.ink}" stroke-width="0.8"/>
      <path d="M -45 -28 L -38 -10 L -25 -38" stroke="${C.ink}" stroke-width="0.4" fill="none" opacity="0.6"/>
      <path d="M 15 -42 L 8 -18 L 25 -28" stroke="${C.ink}" stroke-width="0.4" fill="none" opacity="0.6"/>
      <path d="M -25 -38 L -18 -14" stroke="${C.ink}" stroke-width="0.4" fill="none" opacity="0.6"/>
      <path d="M 35 -34 L 28 -10 L 45 -22" stroke="${C.ink}" stroke-width="0.4" fill="none" opacity="0.6"/>
      <ellipse cx="-20" cy="-18" rx="6" ry="3" fill="${C.ink}" opacity="0.4"/>
      <ellipse cx="22" cy="-16" rx="5" ry="2.5" fill="${C.ink}" opacity="0.4"/>
      <ellipse cx="-2" cy="-22" rx="4" ry="2" fill="${C.ink}" opacity="0.4"/>
      <ellipse cx="-40" cy="-12" rx="3" ry="1.5" fill="${C.ink}" opacity="0.4"/>
      <ellipse cx="48" cy="-8" rx="3" ry="1.5" fill="${C.ink}" opacity="0.4"/>
      <circle cx="-25" cy="-38" r="2" fill="${C.ink}"/>
      <circle cx="15" cy="-42" r="2" fill="${C.ink}"/>
      <circle cx="35" cy="-34" r="1.5" fill="${C.ink}"/>
      <circle cx="-45" cy="-28" r="1.5" fill="${C.ink}"/>
      <!-- 苔 -->
      <g fill="${C.rockeryL}" opacity="0.5">
        <ellipse cx="-15" cy="-30" rx="5" ry="2" transform="rotate(-30 -15 -30)"/>
        <ellipse cx="20" cy="-32" rx="4" ry="1.5" transform="rotate(20 20 -32)"/>
        <ellipse cx="-35" cy="-15" rx="3" ry="1" transform="rotate(40 -35 -15)"/>
        <ellipse cx="40" cy="-20" rx="4" ry="1.5" transform="rotate(-20 40 -20)"/>
      </g>
    </g>
  `;

  // ===== 荷花 =====
  const lotus = (x, y, scale=1, withFlower=false) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <ellipse cx="0" cy="0" rx="14" ry="3" fill="${C.lotus}" opacity="0.85"/>
      <ellipse cx="-2" cy="-1" rx="12" ry="2" fill="${C.vegMid}" opacity="0.6"/>
      <g stroke="${C.vegDark}" stroke-width="0.3" fill="none" opacity="0.5">
        <line x1="-10" y1="0" x2="10" y2="0"/>
        <line x1="-8" y1="-1" x2="8" y2="-1"/>
      </g>
      ${withFlower ? `
        <!-- 花瓣 -->
        <g fill="${C.lotusF}">
          <ellipse cx="0" cy="-3" rx="4" ry="6" transform="rotate(0 0 -3)"/>
          <ellipse cx="-3" cy="-1" rx="3" ry="5" transform="rotate(-30 -3 -1)"/>
          <ellipse cx="3" cy="-1" rx="3" ry="5" transform="rotate(30 3 -1)"/>
        </g>
        <ellipse cx="0" cy="-3" rx="2.5" ry="3.5" fill="${C.lotusD}"/>
        <circle cx="0" cy="-5" r="1" fill="${C.goldL}"/>
      ` : ''}
    </g>
  `;
  const lotusField = (W, H, startY, count=8) => {
    let r='';
    for (let i=0;i<count;i++){
      const x = W*(0.05+i*(0.9/count)) + Math.random()*30-15;
      const y = startY + H*0.05 + Math.random()*H*0.12;
      const hasFlower = Math.random() > 0.6;
      r += lotus(x, y, 0.7+Math.random()*0.5, hasFlower);
    }
    return r;
  };

  // ===== 飞鸟 =====
  const birds = (W, baseY, count=3) => {
    let r='';
    for (let i=0;i<count;i++){
      const x = W*(0.2+i*0.25) + Math.random()*40;
      const y = baseY + Math.random()*20-10;
      const size = 0.7 + Math.random()*0.5;
      r += `<g transform="translate(${x},${y}) scale(${size})">
        <path d="M 0 0 Q -5 -4 -10 0 M 0 0 Q 5 -4 10 0" stroke="${C.ink}" stroke-width="0.8" fill="none"/>
      </g>`;
    }
    return r;
  };
  // 白鹭
  const egret = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <ellipse cx="0" cy="0" rx="6" ry="3" fill="${C.snow}"/>
      <circle cx="-5" cy="-2" r="2" fill="${C.snow}"/>
      <line x1="-7" y1="-2" x2="-10" y2="-2" stroke="${C.gold}" stroke-width="0.6"/>
      <line x1="0" y1="3" x2="0" y2="8" stroke="${C.ink}" stroke-width="0.4"/>
      <line x1="3" y1="3" x2="3" y2="8" stroke="${C.ink}" stroke-width="0.4"/>
      <line x1="-3" y1="3" x2="-3" y2="8" stroke="${C.ink}" stroke-width="0.4"/>
    </g>
  `;

  // 锦鲤
  const koi = (x, y, scale=1, color=C.koi1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <ellipse cx="0" cy="0" rx="10" ry="3" fill="${color}"/>
      <ellipse cx="-2" cy="0" rx="6" ry="2" fill="${C.koi2}" opacity="0.4"/>
      <ellipse cx="9" cy="0" rx="3" ry="2" fill="${color}"/>
      <path d="M -10 0 L -14 -3 L -12 0 L -14 3 Z" fill="${color}"/>
      <circle cx="6" cy="-1" r="0.6" fill="${C.ink}"/>
      <path d="M 5 1 Q 3 2 1 1" stroke="${C.ink}" stroke-width="0.3" fill="none"/>
    </g>
  `;
  const koiPair = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      ${koi(-8, 0, 1, C.koi1)}
      ${koi(10, 3, 0.8, C.koi2)}
    </g>
  `;

  // 祥云 (decorative)
  const xiangCloud = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})" opacity="0.6">
      <path d="M -20 0 Q -25 -8 -15 -10 Q -10 -16 0 -12 Q 10 -18 15 -10 Q 25 -10 22 -2 Q 28 4 20 6 Q 12 12 0 8 Q -10 14 -16 8 Q -25 8 -20 0 Z" fill="${C.paper3}"/>
      <path d="M -10 -6 Q 0 -10 8 -6" stroke="${C.ink}" stroke-width="0.3" fill="none" opacity="0.4"/>
      <path d="M 0 0 Q 8 4 16 0" stroke="${C.ink}" stroke-width="0.3" fill="none" opacity="0.4"/>
    </g>
  `;

  // 月亮
  const moon = (x, y, r=18, opacity=0.85) => `
    <g transform="translate(${x},${y})">
      <circle r="${r+4}" fill="${C.moon}" opacity="0.2"/>
      <circle r="${r}" fill="${C.moon}" opacity="${opacity}"/>
      <circle r="${r}" fill="none" stroke="${C.gold}" stroke-width="0.3" opacity="0.5"/>
      <circle cx="${-r*0.3}" cy="${-r*0.2}" r="${r*0.85}" fill="${C.paper2}" opacity="0.3"/>
      <circle cx="${r*0.2}" cy="${r*0.3}" r="${r*0.1}" fill="${C.paper2}" opacity="0.4"/>
      <circle cx="${-r*0.4}" cy="${r*0.4}" r="${r*0.08}" fill="${C.paper2}" opacity="0.4"/>
    </g>
  `;
  const sun = (x, y, r=14) => `
    <g transform="translate(${x},${y})" opacity="0.7">
      <circle r="${r+3}" fill="${C.sun}" opacity="0.3"/>
      <circle r="${r}" fill="${C.vermilion}" opacity="0.5"/>
      <circle r="${r*0.7}" fill="${C.gold}" opacity="0.6"/>
    </g>
  `;

  // 雾
  const mist = (W, H, yLevel, opacity=0.4) => {
    const id=_uid();
    return `
      <defs><linearGradient id="mi-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${C.paper}" stop-opacity="0"/>
        <stop offset="50%" stop-color="${C.paper}" stop-opacity="${opacity}"/>
        <stop offset="100%" stop-color="${C.paper}" stop-opacity="0"/>
      </linearGradient></defs>
      <rect y="${yLevel-H*0.05}" width="${W}" height="${H*0.1}" fill="url(#mi-${id})"/>
    `;
  };

  // 雪
  const snow = (W, H, count=30) => {
    let r='';
    for (let i=0;i<count;i++){
      const x=Math.random()*W, y=Math.random()*H;
      r += `<circle cx="${x}" cy="${y}" r="${0.8+Math.random()*1.2}" fill="${C.snow}" opacity="${0.5+Math.random()*0.4}"/>`;
      r += `<circle cx="${x-2}" cy="${y+2}" r="${0.3+Math.random()*0.4}" fill="${C.snow}" opacity="0.3"/>`;
    }
    return r;
  };
  // 雨
  const rain = (W, H, count=40) => {
    let r='';
    for (let i=0;i<count;i++){
      const x=Math.random()*W, y=Math.random()*H;
      r += `<line x1="${x}" y1="${y}" x2="${x-2}" y2="${y+8}" stroke="${C.daiqingL}" stroke-width="0.6" opacity="0.4"/>`;
    }
    return r;
  };

  // 落花
  const petals = (W, H, count=12, color=C.plum) => {
    let r='';
    for (let i=0;i<count;i++){
      const x=Math.random()*W, y=Math.random()*H;
      r += `<ellipse cx="${x}" cy="${y}" rx="2" ry="1.2" fill="${color}" opacity="0.7" transform="rotate(${Math.random()*60},${x},${y})"/>`;
    }
    return r;
  };

  // 雪压枝
  const snowyBranch = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <path d="M -2 -2 Q -10 -10 -16 -16" stroke="${C.plumBranch}" stroke-width="1.4" fill="none"/>
      <ellipse cx="-10" cy="-12" rx="3" ry="1" fill="${C.snow}"/>
      <ellipse cx="-15" cy="-16" rx="2.5" ry="0.8" fill="${C.snow}"/>
      <ellipse cx="-7" cy="-8" rx="2" ry="0.6" fill="${C.snow}"/>
    </g>
  `;

  // ===== 印章 (更精致) =====
  const sealStamp = (x, y, text='拙政', scale=1, color=C.vermilion) => `
    <g transform="translate(${x},${y}) rotate(-3) scale(${scale})">
      <rect x="-30" y="-30" width="60" height="60" fill="${color}" stroke="${color==C.vermilion?C.vermilionD:C.ink}" stroke-width="2.5"/>
      <rect x="-26" y="-26" width="52" height="52" fill="none" stroke="${C.paper}" stroke-width="0.6" opacity="0.5"/>
      ${text.split('').map((ch, i) => {
        const col = i % 2;
        const row = Math.floor(i/2);
        return `<text x="${col*24 - 12}" y="${row*22 - 4 + 6}" text-anchor="middle" font-family="'Ma Shan Zheng',serif" font-size="16" fill="${C.paper}">${ch}</text>`;
      }).join('')}
    </g>
  `;

  // 圆形印章
  const sealRound = (x, y, text='园', scale=1, color=C.vermilion) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <circle r="22" fill="${color}"/>
      <circle r="20" fill="none" stroke="${C.paper}" stroke-width="0.4" opacity="0.6"/>
      <text x="0" y="6" text-anchor="middle" font-family="'Ma Shan Zheng',serif" font-size="18" fill="${C.paper}">${text}</text>
    </g>
  `;

  // ===== 装饰纹样 =====
  // 回纹 (meander pattern) — 用于角隅
  const meanderCorner = (x, y, scale=1, flip=false) => {
    const f = flip ? -1 : 1;
    return `
      <g transform="translate(${x},${y}) scale(${scale * f},${scale})" fill="none" stroke="${C.vermilion}" stroke-width="1.2">
        <path d="M 0 0 L 60 0 L 60 8 L 8 8 L 8 16 L 52 16 L 52 24 L 16 24 L 16 32 L 44 32 L 44 40 L 24 40 L 24 48 L 36 48"/>
        <path d="M 0 0 L 0 60 L 8 60 L 8 8 L 16 8 L 16 52 L 24 52 L 24 16 L 32 16 L 32 44 L 40 44 L 40 24 L 48 24 L 48 36" stroke="${C.ink}" stroke-width="0.8" fill="none"/>
      </g>
    `;
  };

  // 卷草纹 (curling grass)
  const scrollPattern = (x, y, w=100, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})" fill="none" stroke="${C.ink}" stroke-width="0.6" opacity="0.7">
      <path d="M 0 0 Q 10 -8 20 0 Q 30 8 40 0 Q 50 -8 60 0 Q 70 8 80 0 Q 90 -8 100 0"/>
      <path d="M 0 4 Q 10 -4 20 4 Q 30 12 40 4 Q 50 -4 60 4 Q 70 12 80 4 Q 90 -4 100 4" opacity="0.5"/>
    </g>
  `;

  // 团扇
  const roundFan = (x, y, scale=1, color=C.vermilion) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <path d="M 0 0 A 18 24 0 0 1 0 -48 A 18 24 0 0 1 0 0 Z" fill="${color}" stroke="${C.ink}" stroke-width="0.6"/>
      <path d="M 0 0 L 0 -48" stroke="${C.ink}" stroke-width="0.4"/>
      <path d="M 0 0 A 18 24 0 0 1 0 -48" fill="none" stroke="${C.ink}" stroke-width="0.3" transform="scale(0.85)" opacity="0.4"/>
      <!-- 扇骨 -->
      <g stroke="${C.ink}" stroke-width="0.3" opacity="0.4">
        <line x1="0" y1="0" x2="-15" y2="-12"/>
        <line x1="0" y1="0" x2="-8" y2="-30"/>
        <line x1="0" y1="0" x2="0" y2="-40"/>
        <line x1="0" y1="0" x2="8" y2="-30"/>
        <line x1="0" y1="0" x2="15" y2="-12"/>
      </g>
      <text x="0" y="-22" text-anchor="middle" font-family="'Ma Shan Zheng',serif" font-size="10" fill="${C.gold}">园</text>
    </g>
  `;

  // 古籍线装书
  const ancientBook = (x, y, scale=1) => `
    <g transform="translate(${x},${y}) scale(${scale})">
      <rect x="-20" y="-15" width="40" height="30" fill="${C.paper2}" stroke="${C.ink}" stroke-width="0.6"/>
      <line x1="0" y1="-15" x2="0" y2="15" stroke="${C.ink}" stroke-width="0.3" opacity="0.6"/>
      <line x1="-15" y1="-15" x2="-15" y2="15" stroke="${C.vermilion}" stroke-width="0.4"/>
      <line x1="15" y1="-15" x2="15" y2="15" stroke="${C.vermilion}" stroke-width="0.4"/>
      <line x1="-20" y1="-12" x2="-15" y2="-12" stroke="${C.ink}" stroke-width="0.3"/>
      <line x1="-20" y1="12" x2="-15" y2="12" stroke="${C.ink}" stroke-width="0.3"/>
      <line x1="15" y1="-12" x2="20" y2="-12" stroke="${C.ink}" stroke-width="0.3"/>
      <line x1="15" y1="12" x2="20" y2="12" stroke="${C.ink}" stroke-width="0.3"/>
      <text x="-10" y="-3" text-anchor="middle" font-family="'Ma Shan Zheng',serif" font-size="6" fill="${C.ink}">园</text>
      <text x="10" y="6" text-anchor="middle" font-family="'Ma Shan Zheng',serif" font-size="6" fill="${C.ink}">志</text>
    </g>
  `;

  // ===== 场景模板（更高细节） =====
  function makeSceneHero(gardenName, opts){
    const W=1600, H=900, sy=H*0.6;
    const o = Object.assign({water:true, pavilionType:'hex', withBridge:true, withLotus:true, withBoat:false, season:'summer'}, opts||{});
    const isNight = o.season==='night';
    const isWinter = o.season==='winter';
    const isAutumn = o.season==='autumn';
    const skyTop = isNight ? '#1a2230' : (isWinter ? '#d8d8e0' : '#e8d8b8');
    const skyBot = isNight ? '#0a1018' : (isWinter ? '#b8b8c0' : '#d0c0a0');
    return makeSvg(W, H, `
      ${sky(W, H, skyTop, skyBot)}
      ${isNight ? '' : xiangCloud(120, 110, 1.4)}
      ${isNight ? '' : xiangCloud(1380, 80, 1.2)}
      ${mountainMisty(W, sy - 30, 60)}
      ${mountainFar(W, H, sy - 30, 80, C.mtFar, 0.4)}
      ${mountainMid(W, H, sy - 10, 100, C.mtFar2, 0.5)}
      ${mountainNear(W, H, sy + 30, 130, C.mtNear, 0.7)}
      ${o.water ? water(W, H, sy + 110) : ''}
      ${o.water ? ripples(W, H, sy + 130, 5) : ''}
      ${o.water ? mist(W, H, sy + 80, isNight?0.2:0.5) : ''}
      ${isNight ? moon(1300, 180, 50, 0.85) : ''}
      ${!isNight && !isWinter ? sun(1450, 130, 16) : ''}
      ${!isNight ? birds(W, 200, 4) : ''}
      <!-- 远山小亭 -->
      ${pavilionHex(360, sy - 70, 0.7)}
      <!-- 主建筑 -->
      ${hall(800, sy - 90, 280, 1.4)}
      ${o.pavilionType==='quad' ? pavilionQuad(1180, sy - 70, 0.9) : ''}
      ${o.withBridge ? bridgeArch(1080, sy + 100, 110, 1) : ''}
      ${o.withLotus ? lotusField(W, H, sy + 200, isAutumn?4:12) : ''}
      ${o.withBoat ? boat(1280, sy + 110, 0.6) : ''}
      ${o.water && !isNight ? koiPair(1200, sy + 220, 0.6) : ''}
      ${pineTree(120, sy - 40, 1.4)}
      ${pineTree(220, sy - 30, 1.2)}
      ${willowTree(1480, sy - 30, isAutumn?1.3:1.5)}
      ${treeCluster(1420, sy - 60, 1.2, isAutumn?C.maple:C.vegDark, isAutumn?C.vermilion:C.vegMid)}
      ${treeCluster(700, sy - 80, 1)}
      ${bambooCluster(1100, sy - 20, 0.7)}
      <!-- 印章 -->
      ${sealStamp(1450, 800, gardenName.slice(0,2), 1)}
      ${inkOverlay(W, H, isNight?0.15:0.08)}
      ${paperTexture(W, H, 0.05)}
    `);
  }

  // ===== 6 园 Hero =====
  function heroZhuozheng(){ return makeSceneHero('拙政', {pavilionType:'hex', withBridge:true, withLotus:true, withBoat:false}); }
  function heroLiu(){
    const W=1600, H=900, sy=H*0.62;
    return makeSvg(W, H, `
      ${sky(W,H,'#e0d2b8','#c9b896')}
      ${mountainMisty(W, sy-30, 70)}
      ${mountainFar(W,H,sy-30,80,C.mtFar,0.4)}
      ${mountainMid(W,H,sy-10,100,C.mtFar2,0.5)}
      ${mountainNear(W,H,sy+30,120,C.mtNear,0.7)}
      <!-- 巨型冠云峰 -->
      <g transform="translate(800, sy-80)">
        <path d="M -100 0 L -70 -180 L -30 -240 L 0 -280 L 30 -240 L 70 -180 L 100 0 Z" fill="${C.inkLight}" stroke="${C.ink}" stroke-width="1.2"/>
        <path d="M -70 -180 L -55 -120 L -30 -240" stroke="${C.ink}" stroke-width="0.6" fill="none" opacity="0.6"/>
        <path d="M 0 -280 L -10 -200 L 30 -240" stroke="${C.ink}" stroke-width="0.6" fill="none" opacity="0.6"/>
        <path d="M 30 -240 L 50 -160 L 70 -180" stroke="${C.ink}" stroke-width="0.6" fill="none" opacity="0.6"/>
        <path d="M -50 -200 L -40 -160" stroke="${C.ink}" stroke-width="0.4" fill="none" opacity="0.5"/>
        <ellipse cx="-30" cy="-160" rx="10" ry="6" fill="${C.ink}" opacity="0.4"/>
        <ellipse cx="30" cy="-180" rx="8" ry="5" fill="${C.ink}" opacity="0.4"/>
        <ellipse cx="0" cy="-200" rx="6" ry="4" fill="${C.ink}" opacity="0.4"/>
        <ellipse cx="-50" cy="-100" rx="5" ry="3" fill="${C.ink}" opacity="0.4"/>
        <circle cx="0" cy="-280" r="3" fill="${C.ink}"/>
        <circle cx="-70" cy="-180" r="2" fill="${C.ink}"/>
        <circle cx="70" cy="-180" r="2" fill="${C.ink}"/>
        <g fill="${C.rockeryL}" opacity="0.5">
          <ellipse cx="-30" cy="-220" rx="6" ry="2" transform="rotate(-20 -30 -220)"/>
          <ellipse cx="20" cy="-220" rx="5" ry="1.8" transform="rotate(20 20 -220)"/>
          <ellipse cx="-50" cy="-140" rx="4" ry="1.5" transform="rotate(40 -50 -140)"/>
        </g>
      </g>
      ${hall(380, sy - 60, 240, 1.2)}
      ${hall(1240, sy - 50, 200, 1)}
      ${pineTree(120, sy - 40, 1.5)}
      ${pineTree(220, sy - 30, 1.3)}
      ${treeCluster(1500, sy - 50, 1.4)}
      ${bambooCluster(1100, sy - 20, 0.8)}
      ${bridgeArch(1000, sy + 100, 90, 0.9)}
      <rect x="280" y="${sy + 10}" width="240" height="8" fill="${C.inkLight}" opacity="0.5"/>
      <rect x="1180" y="${sy + 10}" width="200" height="8" fill="${C.inkLight}" opacity="0.5"/>
      ${sealStamp(1450, 800, '留园', 1)}
      ${inkOverlay(W,H,0.1)}
      ${paperTexture(W,H,0.05)}
    `);
  }
  function heroWangshi(){
    const W=1600, H=900, sy=H*0.6;
    return makeSvg(W, H, `
      <defs><radialGradient id="ng-${_uid()}" cx="0.7" cy="0.25" r="0.5">
        <stop offset="0%" stop-color="#3a4a5a" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#d8c9a8" stop-opacity="0"/>
      </radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#ng-${_uid()-1})"/>
      ${moon(1300, 180, 50, 0.85)}
      <circle cx="1300" cy="180" r="55" fill="${C.moon}" opacity="0.1"/>
      ${mountainMisty(W, sy-30, 60)}
      ${mountainFar(W,H,sy-30,70,C.mtFar,0.35)}
      ${mountainMid(W,H,sy-10,90,C.mtFar2,0.45)}
      ${mountainNear(W,H,sy+30,110,C.mtNear,0.6)}
      ${water(W,H,sy+100)}
      ${ripples(W,H,sy+130,6)}
      <ellipse cx="1300" cy="${sy + 180}" rx="30" ry="3" fill="${C.moon}" opacity="0.4"/>
      <ellipse cx="1300" cy="${sy + 220}" rx="40" ry="2" fill="${C.moon}" opacity="0.25"/>
      <ellipse cx="1300" cy="${sy + 260}" rx="50" ry="2" fill="${C.moon}" opacity="0.15"/>
      ${pavilionHex(800, sy - 80, 1.3)}
      ${hall(380, sy - 50, 200, 1.1)}
      ${bridgeArch(1150, sy + 100, 80, 1)}
      ${koiPair(900, sy + 180, 0.6)}
      ${pineTree(150, sy - 40, 1.4)}
      ${willowTree(1450, sy - 30, 1.5)}
      ${treeCluster(650, sy - 60, 1.2)}
      ${treeCluster(1300, sy - 50, 1.1)}
      ${bambooCluster(1700, sy - 20, 0.6)}
      ${birds(W, 250, 2)}
      ${sealStamp(1450, 800, '网师', 1)}
      ${inkOverlay(W,H,0.12)}
      ${paperTexture(W,H,0.05)}
    `);
  }
  function heroShizi(){
    const W=1600, H=900, sy=H*0.65;
    return makeSvg(W, H, `
      ${sky(W,H,'#e0d2b8','#c9b896')}
      ${mountainFar(W,H,sy-30,80,C.mtFar,0.4)}
      ${rockeryGroup(800, sy - 30, 1.6)}
      ${rockeryGroup(400, sy - 20, 1.2)}
      ${rockeryGroup(1300, sy - 30, 1.4)}
      ${hall(1100, sy - 80, 220, 1.1)}
      ${pavilionHex(600, sy - 60, 1)}
      ${pineTree(150, sy - 40, 1.5)}
      ${pineTree(250, sy - 30, 1.2)}
      ${treeCluster(1450, sy - 60, 1.3)}
      ${bambooCluster(1700, sy - 20, 0.6)}
      <rect x="900" y="${sy - 220}" width="3" height="120" fill="${C.waterL}" opacity="0.7"/>
      <path d="M 900 ${sy - 100} Q 895 ${sy - 80} 900 ${sy - 60}" stroke="${C.waterL}" stroke-width="3" fill="none" opacity="0.6"/>
      <path d="M 900 ${sy - 100} Q 905 ${sy - 80} 900 ${sy - 60}" stroke="${C.waterL}" stroke-width="3" fill="none" opacity="0.5"/>
      ${sealStamp(1450, 800, '狮林', 1)}
      ${inkOverlay(W,H,0.1)}
      ${paperTexture(W,H,0.05)}
    `);
  }
  function heroCanglang(){
    const W=1600, H=900, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W,H,'#e8d8b8','#d8c9a8')}
      ${mountainMisty(W, sy-30, 90)}
      ${mountainFar(W,H,sy-30,100,C.mtFar,0.4)}
      ${mountainMid(W,H,sy-10,120,C.mtFar2,0.5)}
      ${mountainNear(W,H,sy+30,140,C.mtNear,0.65)}
      ${water(W,H,sy+130)}
      ${ripples(W,H,sy+150,5)}
      ${mist(W,H,sy+80,0.5)}
      ${xiangCloud(800, 200, 1.2)}
      ${pavilionQuad(800, sy - 80, 1.4)}
      ${tower(380, sy - 60, 1.2)}
      ${hall(1280, sy - 60, 240, 1.2)}
      ${corridor(200, sy + 50, 280, 'h', 1)}
      ${pineTree(120, sy - 40, 1.4)}
      ${willowTree(1450, sy - 30, 1.5)}
      ${treeCluster(600, sy - 60, 1.1)}
      ${bambooCluster(1100, sy - 20, 0.7)}
      ${lotusField(W, H, sy + 200, 8)}
      ${birds(W, 180, 3)}
      ${sealStamp(1450, 800, '沧浪', 1)}
      ${inkOverlay(W,H,0.1)}
      ${paperTexture(W,H,0.05)}
    `);
  }
  function heroYi(){
    const W=1600, H=900, sy=H*0.6;
    return makeSvg(W, H, `
      ${sky(W,H,'#e8d8b8','#d0c0a0')}
      ${mountainFar(W,H,sy-30,80,C.mtFar,0.4)}
      ${mountainMid(W,H,sy-10,100,C.mtFar2,0.5)}
      ${mountainNear(W,H,sy+30,120,C.mtNear,0.65)}
      ${water(W,H,sy+110)}
      ${ripples(W,H,sy+130,4)}
      ${hall(800, sy - 80, 260, 1.3)}
      ${pavilionQuad(380, sy - 50, 1)}
      ${hall(1280, sy - 60, 200, 1)}
      <g transform="translate(600, ${sy - 10})">
        <path d="M -25 0 L -15 -25 L -5 -32 L 5 -28 L 15 -20 L 25 0 Z" fill="${C.inkLight}" stroke="${C.ink}" stroke-width="0.6"/>
        <ellipse cx="0" cy="-15" rx="4" ry="2" fill="${C.ink}" opacity="0.4"/>
        <g fill="${C.rockeryL}" opacity="0.5">
          <ellipse cx="-8" cy="-20" rx="3" ry="1" transform="rotate(-20 -8 -20)"/>
        </g>
      </g>
      <g transform="translate(1100, ${sy - 20})">
        <path d="M -20 0 L -12 -22 L -2 -28 L 8 -24 L 16 -16 L 20 0 Z" fill="${C.inkLight}" stroke="${C.ink}" stroke-width="0.6"/>
        <ellipse cx="0" cy="-12" rx="3" ry="1.5" fill="${C.ink}" opacity="0.4"/>
      </g>
      ${bambooCluster(150, sy - 30, 1.2)}
      ${bambooCluster(1450, sy - 30, 1.1)}
      ${bambooCluster(1100, sy - 60, 0.9)}
      ${pineTree(250, sy - 40, 1.3)}
      ${treeCluster(700, sy - 60, 1)}
      ${petals(W, sy + 50, 18, C.maple)}
      ${sealStamp(1450, 800, '怡园', 1)}
      ${inkOverlay(W,H,0.08)}
      ${paperTexture(W,H,0.05)}
    `);
  }

  // ===== 艺圃（第七园）=====
  // 砖雕门楼「别有洞天」——艺圃的标志
  const yipuGateTower = (x, y, s=1) => `
    <g transform="translate(${x},${y}) scale(${s})">
      <!-- 门楼墙体 -->
      <rect x="-120" y="-118" width="240" height="118" fill="${C.paper}" stroke="${C.ink}" stroke-width="0.9" opacity="0.95"/>
      <!-- 砖雕仿额枋 -->
      <rect x="-120" y="-150" width="240" height="34" fill="${C.paper2}" stroke="${C.ink}" stroke-width="0.8"/>
      ${Array.from({length:7},(_,i)=>`<rect x="${-114+i*33}" y="-146" width="26" height="26" fill="none" stroke="${C.inkLight}" stroke-width="0.5" opacity="0.6"/>`).join('')}
      <!-- 屋檐（翘角） -->
      <path d="M -142 -150 Q -80 -168 0 -172 Q 80 -168 142 -150 L 130 -142 L -130 -142 Z" fill="${C.buildingRoof}" stroke="${C.ink}" stroke-width="0.8"/>
      <path d="M -142 -150 Q -120 -140 -128 -152 M 142 -150 Q 120 -140 128 -152" fill="none" stroke="${C.ink}" stroke-width="1.4"/>
      <circle cx="-138" cy="-150" r="3.5" fill="${C.buildingRoof}" stroke="${C.ink}" stroke-width="0.5"/>
      <circle cx="138" cy="-150" r="3.5" fill="${C.buildingRoof}" stroke="${C.ink}" stroke-width="0.5"/>
      <!-- 额匾「别有洞天」 -->
      <rect x="-76" y="-140" width="152" height="22" fill="${C.paper3}" stroke="${C.ink}" stroke-width="0.8"/>
      <text x="0" y="-123" text-anchor="middle" font-family="'Ma Shan Zheng',serif" font-size="17" fill="${C.ink}" letter-spacing="4">别有洞天</text>
      <!-- 门洞 -->
      <rect x="-46" y="-44" width="92" height="44" fill="${C.ink}" opacity="0.9"/>
      <rect x="-52" y="-50" width="104" height="8" fill="${C.buildingDk}" stroke="${C.ink}" stroke-width="0.5"/>
      <!-- 门内一盏灯 -->
      <circle cx="0" cy="-20" r="4" fill="${C.goldL}" opacity="0.85"/>
      <!-- 砖缝 -->
      ${Array.from({length:9},(_,i)=>`<line x1="-120" y1="${-104+i*12}" x2="120" y2="${-104+i*12}" stroke="${C.inkLight}" stroke-width="0.3" opacity="0.25"/>`).join('')}
    </g>
  `;

  function heroYipu(){
    const W=1600, H=900, sy=H*0.6;
    return makeSvg(W, H, `
      ${sky(W,H,'#e2e2d0','#c2c4b0')}
      ${mountainMisty(W, sy-40, 70)}
      ${mountainFar(W,H,sy-30,70,C.mtFar,0.35)}
      ${mountainNear(W,H,sy+10,110,C.mtNear,0.55)}
      ${water(W,H,sy+120)}
      ${ripples(W,H,sy+140,4)}
      ${mist(W,H,sy+90,0.45)}
      ${yipuGateTower(800, sy+10, 1.5)}
      ${hall(300, sy - 70, 220, 1)}
      ${pavilionHex(1330, sy - 60, 1)}
      ${pineTree(150, sy - 30, 1.3)}
      ${maple(1470, sy - 40, 1.1)}
      ${bambooCluster(560, sy - 20, 1)}
      ${bambooCluster(1060, sy - 30, 0.85)}
      ${treeCluster(1200, sy - 60, 0.9)}
      ${rockeryGroup(230, sy + 60, 1)}
      ${lotusField(W,H,sy+210,7)}
      ${birds(W, 170, 3)}
      ${sealStamp(1460, 810, '艺圃', 1)}
      ${inkOverlay(W,H,0.09)}
      ${paperTexture(W,H,0.05)}
    `);
  }
  // 艺圃场景
  function sceneShiLunTang(){   // 世纶堂
    const W=1200, H=700, sy=H*0.62;
    return makeSvg(W, H, `
      ${sky(W,H,'#e8e0cc','#ccc4b0')}
      ${moonGate(600, sy - 10, 1.9)}
      ${hall(600, sy - 150, 240, 1)}
      ${plaque(600, sy - 190, '世纶堂', 1.2)}
      ${bambooCluster(160, sy - 30, 1)}
      ${bambooCluster(1040, sy - 30, 1)}
      ${lanterns(430, sy - 90, 3, 0.9)}
      ${lanterns(770, sy - 90, 3, 0.9)}
      ${rockeryGroup(900, sy + 10, 0.9)}
      ${treeCluster(260, sy - 60, 0.9)}
      ${inkOverlay(W,H,0.1)}
      ${paperTexture(W,H,0.05)}
    `);
  }
  function sceneYipuMoonGate(){ // 别有洞天 · 月洞门红枫
    const W=1200, H=700, sy=H*0.62;
    return makeSvg(W, H, `
      ${sky(W,H,'#f0dcc0','#d8c0a0')}
      ${mountainFar(W,H,sy-20,60,C.mtFar,0.35)}
      ${moonGate(600, sy, 2.1)}
      ${maple(220, sy - 20, 1.3)}
      ${maple(1010, sy - 30, 1.1)}
      ${pineTree(420, sy - 40, 1.1)}
      ${rockeryGroup(820, sy + 20, 1)}
      ${water(W,H,sy+70)}
      ${ripples(W,H,sy+90,3)}
      ${lotusField(W,H,sy+120,5)}
      ${petals(W,H,24,C.maple)}
      ${inkOverlay(W,H,0.09)}
      ${paperTexture(W,H,0.05)}
    `);
  }
  function sceneRuYuTing(){     // 乳鱼亭
    const W=1200, H=700, sy=H*0.6;
    return makeSvg(W, H, `
      ${sky(W,H,'#e4e0cc','#c0bca8')}
      ${mountainMisty(W, sy-30, 60)}
      ${water(W,H,sy+40)}
      ${ripples(W,H,sy+60,4)}
      ${pavilionHex(600, sy - 40, 1.6)}
      ${bridgeZigzag(600, sy + 90, 260, 1)}
      ${maple(200, sy - 30, 1.2)}
      ${maple(1020, sy - 20, 1)}
      ${rockeryGroup(380, sy + 30, 1)}
      ${willowTree(880, sy - 20, 1.1)}
      ${koiPair(760, sy + 150, 0.7)}
      ${petals(W,H,20,C.maple)}
      ${inkOverlay(W,H,0.09)}
      ${paperTexture(W,H,0.05)}
    `);
  }
  function sceneSiShiXuan(){   // 思嗜轩
    const W=1200, H=700, sy=H*0.62;
    return makeSvg(W, H, `
      ${sky(W,H,'#eae2d0','#ccc2ac')}
      ${mountainFar(W,H,sy-20,55,C.mtFar,0.35)}
      ${wallGate(600, sy, 2.4)}
      ${hall(600, sy - 110, 220, 0.9)}
      ${rockeryGroup(240, sy + 10, 1.1)}
      ${rockeryGroup(960, sy + 20, 0.95)}
      ${bambooCluster(80, sy - 20, 1)}
      ${pineTree(1120, sy - 30, 1.1)}
      ${treeCluster(420, sy - 50, 0.85)}
      ${water(W,H,sy+60)}
      ${ripples(W,H,sy+80,3)}
      ${inkOverlay(W,H,0.1)}
      ${paperTexture(W,H,0.05)}
    `);
  }

  function heroScrollArt(){
    const W=460, H=520, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#d0c0a0')}
      ${mountainMisty(W, sy-20, 50)}
      ${mountainFar(W, H, sy - 20, 50, C.mtFar, 0.4)}
      ${mountainNear(W, H, sy + 10, 60, C.mtNear, 0.7)}
      ${water(W, H, sy + 80)}
      ${ripples(W, H, sy + 100, 3)}
      ${lotusField(W, H, sy + 130, 5)}
      <g transform="translate(230, sy - 60) scale(1.2)">
        <path d="M -60 0 L -40 -40 L -20 -55 L 0 -60 L 20 -55 L 40 -40 L 60 0 Z" fill="${C.ink}"/>
        <polygon points="-60,0 -45,-20 0,-45 45,-20 60,0" fill="${C.inkSoft}"/>
        <line x1="-65" y1="0" x2="65" y2="0" stroke="${C.ink}" stroke-width="0.6"/>
        <rect x="-50" y="2" width="100" height="40" fill="${C.building}" stroke="${C.ink}" stroke-width="0.8"/>
        <line x1="-40" y1="2" x2="-40" y2="42" stroke="${C.ink}" stroke-width="1"/>
        <line x1="-20" y1="2" x2="-20" y2="42" stroke="${C.ink}" stroke-width="1"/>
        <line x1="0" y1="2" x2="0" y2="42" stroke="${C.ink}" stroke-width="1"/>
        <line x1="20" y1="2" x2="20" y2="42" stroke="${C.ink}" stroke-width="1"/>
        <line x1="40" y1="2" x2="40" y2="42" stroke="${C.ink}" stroke-width="1"/>
        <rect x="-54" y="42" width="108" height="4" fill="${C.inkLight}"/>
      </g>
      ${pineTree(60, sy - 30, 0.9)}
      ${pineTree(380, sy - 20, 0.9)}
      ${willowTree(20, sy - 10, 0.9)}
      ${willowTree(420, sy - 10, 0.9)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }

  // ===== 通用卡片 =====
  function cardPavilionWater(seed=0){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#d0c0a0')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.4)}
      ${mountainMid(W, H, sy - 5, 50, C.mtFar2, 0.5)}
      ${mountainNear(W, H, sy + 10, 50, C.mtNear, 0.65)}
      ${water(W, H, sy + 50)}
      ${ripples(W, H, sy + 60, 3)}
      ${hall(200, sy - 50, 140, 0.7)}
      ${pavilionHex(80, sy - 30, 0.5)}
      ${bridgeArch(280, sy + 50, 50, 0.6)}
      ${lotusField(W, H, sy + 80, 4)}
      ${pineTree(360, sy - 20, 0.8)}
      ${willowTree(20, sy - 10, 0.8)}
      ${koi(120, sy + 80, 0.5)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function cardRockery(seed=0){
    const W=400, H=300, sy=H*0.6;
    return makeSvg(W, H, `
      ${sky(W, H, '#e0d2b8', '#c9b896')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.4)}
      ${rockeryGroup(120, sy, 0.5)}
      ${rockeryGroup(290, sy - 10, 0.45)}
      ${hall(220, sy - 50, 130, 0.6)}
      ${pavilionHex(60, sy - 30, 0.5)}
      ${pineTree(380, sy - 20, 0.7)}
      ${treeCluster(40, sy - 30, 0.6)}
      ${plum(350, sy - 10, 0.4)}
      ${inkOverlay(W, H, 0.1)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function cardCorridorWater(seed=0){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.4)}
      ${water(W, H, sy + 30)}
      ${ripples(W, H, sy + 40, 3)}
      ${lotusField(W, H, sy + 80, 4)}
      ${corridor(200, sy - 30, 240, 'h', 0.7)}
      ${pavilionHex(360, sy - 40, 0.5)}
      ${hall(60, sy - 30, 100, 0.5)}
      ${willowTree(20, sy - 10, 0.8)}
      ${koi(280, sy + 100, 0.5)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function cardTower(seed=0){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${mountainFar(W, H, sy - 20, 50, C.mtFar, 0.4)}
      ${mountainMid(W, H, sy - 5, 60, C.mtFar2, 0.5)}
      ${mountainNear(W, H, sy + 5, 60, C.mtNear, 0.6)}
      ${tower(200, sy - 20, 0.9)}
      ${pineTree(60, sy - 20, 0.8)}
      ${pineTree(340, sy - 20, 0.8)}
      ${treeCluster(380, sy - 10, 0.6)}
      ${willowTree(20, sy - 10, 0.7)}
      ${stoneLantern(360, sy - 20, 0.5)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function cardBamboo(seed=0){
    const W=400, H=300, sy=H*0.6;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.35)}
      ${bambooCluster(80, sy, 1)}
      ${bambooCluster(300, sy, 0.9)}
      ${bambooCluster(180, sy, 0.7)}
      ${hall(200, sy - 40, 120, 0.6)}
      ${pavilionHex(60, sy - 30, 0.5)}
      ${stoneLantern(340, sy - 20, 0.5)}
      ${inkOverlay(W, H, 0.1)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function cardLotus(seed=0){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#d8c9a8')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.4)}
      ${water(W, H, sy + 30)}
      ${ripples(W, H, sy + 50, 3)}
      ${lotusField(W, H, sy + 60, 10)}
      ${lotusField(W, H, sy + 90, 6)}
      ${lotusField(W, H, sy + 130, 3)}
      ${pavilionHex(200, sy - 30, 0.5)}
      ${hall(340, sy - 30, 100, 0.5)}
      ${willowTree(20, sy - 10, 0.8)}
      ${koiPair(100, sy + 130, 0.5)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function cardWinter(seed=0){
    const W=400, H=300, sy=H*0.6;
    return makeSvg(W, H, `
      ${sky(W, H, '#d8d8e0', '#b8b8c0')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.5)}
      ${mountainNear(W, H, sy + 5, 50, C.inkLight, 0.7)}
      <rect y="${sy + 5}" width="${W}" height="${H - sy - 5}" fill="${C.snow}" opacity="0.85"/>
      ${hall(200, sy - 50, 140, 0.7)}
      ${pavilionHex(60, sy - 30, 0.5)}
      ${pineTree(340, sy - 20, 0.8)}
      ${pineTree(380, sy - 10, 0.7)}
      ${snowyBranch(150, sy - 15, 0.6)}
      ${plum(80, sy - 30, 0.4)}
      ${snow(W, H, 30)}
      ${inkOverlay(W, H, 0.05)}
      ${paperTexture(W, H, 0.03)}
    `);
  }
  function cardFlower(seed=0){
    const W=400, H=300, sy=H*0.6;
    return makeSvg(W, H, `
      ${sky(W, H, '#f0d8d0', '#e0b8b0')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.4)}
      ${hall(200, sy - 50, 140, 0.7)}
      ${pavilionHex(60, sy - 30, 0.5)}
      ${pineTree(340, sy - 20, 0.8)}
      ${willowTree(20, sy - 10, 0.8)}
      ${plum(100, sy - 30, 0.5)}
      ${plum(280, sy - 30, 0.5)}
      ${petals(W, H, 30, C.plum)}
      ${petals(W, H, 15, '#e89aaa')}
      ${inkOverlay(W, H, 0.06)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function cardAutumn(seed=0){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#f0d0a0', '#d0a878')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.4)}
      ${mountainNear(W, H, sy + 5, 50, C.maple, 0.5)}
      ${water(W, H, sy + 50)}
      ${ripples(W, H, sy + 60, 3)}
      ${hall(200, sy - 50, 140, 0.7)}
      ${pavilionHex(60, sy - 30, 0.5)}
      ${maple(340, sy - 20, 0.8)}
      ${maple(50, sy - 25, 0.6)}
      ${willowTree(20, sy - 10, 0.8)}
      ${lotusField(W, H, sy + 80, 4)}
      ${petals(W, H, 25, C.maple)}
      ${petals(W, H, 15, C.ginkgo)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }

  // 新增: 月洞门
  function cardMoonGate(seed=0){
    const W=400, H=300;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${moonGate(200, 200, 1.4)}
      <ellipse cx="200" cy="240" rx="60" ry="6" fill="${C.ink}" opacity="0.2"/>
      ${pineTree(80, 200, 0.6)}
      ${bambooCluster(320, 240, 0.5)}
      ${stoneLantern(60, 200, 0.6)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  // 新增: 画舫
  function cardBoat(seed=0){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${mountainFar(W, H, sy - 20, 30, C.mtFar, 0.35)}
      ${water(W, H, sy + 30)}
      ${ripples(W, H, sy + 40, 3)}
      ${lotusField(W, H, sy + 80, 5)}
      ${boat(200, sy, 1.4)}
      ${koi(60, sy + 100, 0.5)}
      ${koi(340, sy + 120, 0.5)}
      ${willowTree(20, sy - 5, 0.7)}
      ${pineTree(370, sy - 10, 0.7)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  // 新增: 雪桥
  function cardSnowBridge(seed=0){
    const W=400, H=300, sy=H*0.6;
    return makeSvg(W, H, `
      ${sky(W, H, '#d8d8e0', '#b8b8c0')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.5)}
      ${water(W, H, sy + 30)}
      ${ripples(W, H, sy + 40, 2)}
      ${bridgeArch(200, sy + 20, 100, 1)}
      ${pavilionHex(60, sy - 30, 0.6)}
      ${pineTree(340, sy - 30, 0.8)}
      ${pineTree(360, sy - 15, 0.6)}
      ${snowyBranch(150, sy - 20, 0.6)}
      ${snow(W, H, 50)}
      ${inkOverlay(W, H, 0.05)}
      ${paperTexture(W, H, 0.03)}
    `);
  }
  // 新增: 竹径
  function cardBambooPath(seed=0){
    const W=400, H=300;
    return makeSvg(W, H, `
      ${sky(W, H, '#c9b896', '#a89878')}
      ${path(200, 220, 100, 1.4)}
      ${bamboo(-30, 200, 90, 0.8)}
      ${bamboo(40, 200, 100, 0.9)}
      ${bamboo(120, 200, 80, 0.7)}
      ${bamboo(280, 200, 90, 0.8)}
      ${bamboo(360, 200, 100, 0.9)}
      ${bamboo(420, 200, 80, 0.7)}
      ${stoneLantern(80, 220, 0.5)}
      ${inkOverlay(W, H, 0.1)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function path(x, y, w=100, scale=1){
    return `<g transform="translate(${x},${y}) scale(${scale})">
      <path d="M ${-w/2} 80 L 0 -30 L ${w/2} 80 L ${w/4} 80 L 0 -10 L ${-w/4} 80 Z" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="0.4" opacity="0.85"/>
      <g stroke="${C.ink}" stroke-width="0.3" opacity="0.4">
        <line x1="${-w/4}" y1="80" x2="${-w/4 - 5}" y2="50"/>
        <line x1="0" y1="80" x2="0" y2="50"/>
        <line x1="${w/4}" y1="80" x2="${w/4 + 5}" y2="50"/>
      </g>
    </g>`;
  }
  // 新增: 灯笼夜
  function cardLantern(seed=0){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      <defs><radialGradient id="lt-${_uid()}" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="${C.moon}" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="${C.ink}" stop-opacity="0"/>
      </radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#lt-${_uid()-1})"/>
      <rect width="${W}" height="${H}" fill="${C.daiqingD}" opacity="0.4"/>
      ${moon(60, 60, 18, 0.85)}
      ${hall(200, sy - 50, 160, 0.7)}
      ${pavilionHex(60, sy - 30, 0.5)}
      ${stoneLantern(340, sy - 30, 0.7)}
      ${stoneLantern(100, sy - 30, 0.6)}
      ${lanterns(330, 60, 3)}
      ${pineTree(370, sy - 20, 0.7)}
      ${inkOverlay(W, H, 0.2)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function lanterns(x, y, count=3){
    let r='';
    for(let i=0;i<count;i++){
      const lx = x + i*30;
      r += `<g transform="translate(${lx},${y + i*8})">
        <line x1="0" y1="-15" x2="0" y2="0" stroke="${C.ink}" stroke-width="0.4"/>
        <ellipse cx="0" cy="6" rx="8" ry="10" fill="${C.vermilion}" stroke="${C.ink}" stroke-width="0.3"/>
        <ellipse cx="0" cy="2" rx="6" ry="2" fill="${C.moon}" opacity="0.5"/>
        <line x1="-7" y1="6" x2="7" y2="6" stroke="${C.gold}" stroke-width="0.4"/>
        <line x1="0" y1="16" x2="0" y2="20" stroke="${C.gold}" stroke-width="0.4"/>
      </g>`;
    }
    return r;
  }
  // 新增: 雨打芭蕉
  function cardRain(seed=0){
    const W=400, H=300, sy=H*0.6;
    return makeSvg(W, H, `
      ${sky(W, H, '#a8a8b0', '#787880')}
      ${mountainFar(W, H, sy - 20, 30, C.mtFar, 0.4)}
      ${hall(200, sy - 50, 160, 0.7)}
      <g transform="translate(80, sy - 10)">
        <ellipse cx="0" cy="0" rx="30" ry="12" fill="${C.vegDark}" transform="rotate(-15)"/>
        <ellipse cx="20" cy="-8" rx="20" ry="8" fill="${C.vegMid}" transform="rotate(-20 20 -8)"/>
        <ellipse cx="-15" cy="-5" rx="15" ry="6" fill="${C.vegDark}" transform="rotate(-25 -15 -5)"/>
        <line x1="-5" y1="0" x2="-3" y2="20" stroke="${C.vegDark}" stroke-width="1"/>
        <line x1="10" y1="0" x2="12" y2="20" stroke="${C.vegDark}" stroke-width="1"/>
        <line x1="25" y1="0" x2="27" y2="20" stroke="${C.vegDark}" stroke-width="1"/>
      </g>
      ${pavilionHex(320, sy - 30, 0.5)}
      ${pineTree(360, sy - 20, 0.7)}
      ${rain(W, H, 50)}
      ${mist(W, H, sy + 30, 0.5)}
      ${inkOverlay(W, H, 0.1)}
      ${paperTexture(W, H, 0.04)}
    `);
  }

  // ===== 场景缩略图（带更多细节） =====
  function sceneYuanXiangTang(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#d0c0a0')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.4)}
      ${water(W, H, sy + 50)}
      ${ripples(W, H, sy + 60, 3)}
      ${hall(200, sy - 50, 180, 0.9)}
      ${lotusField(W, H, sy + 80, 6)}
      ${pavilionHex(60, sy - 30, 0.5)}
      ${pineTree(360, sy - 20, 0.8)}
      ${willowTree(20, sy - 10, 0.8)}
      ${koi(120, sy + 90, 0.5)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneXiaoFeiHong(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#d0c0a0')}
      ${water(W, H, sy + 30)}
      ${ripples(W, H, sy + 50, 4)}
      ${bridgeArch(200, sy + 30, 100, 1)}
      <line x1="${200 - 50}" y1="${sy + 30}" x2="${200 - 40}" y2="${sy - 5}" stroke="${C.ink}" stroke-width="0.6"/>
      <line x1="${200 + 50}" y1="${sy + 30}" x2="${200 + 40}" y2="${sy - 5}" stroke="${C.ink}" stroke-width="0.6"/>
      <polygon points="${200 - 60},${sy - 5} ${200 - 40},${sy - 18} ${200 + 40},${sy - 18} ${200 + 60},${sy - 5}" fill="${C.ink}"/>
      <rect x="${200 - 50}" y="${sy - 18}" width="100" height="14" fill="${C.vermilionD}"/>
      <rect x="${200 - 50}" y="${sy - 4}" width="100" height="3" fill="${C.inkLight}"/>
      ${lotusField(W, H, sy + 80, 4)}
      ${pineTree(60, sy - 20, 0.8)}
      ${willowTree(340, sy - 10, 0.8)}
      ${koiPair(280, sy + 90, 0.5)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneXiangZhou(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.4)}
      ${water(W, H, sy + 30)}
      ${ripples(W, H, sy + 50, 3)}
      ${lotusField(W, H, sy + 80, 5)}
      ${boat(200, sy, 1.2)}
      ${pineTree(60, sy - 30, 0.8)}
      ${willowTree(340, sy - 10, 0.8)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneWuZhu(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      <rect x="40" y="${sy - 80}" width="320" height="${sy + 50}" fill="${C.paper2}" stroke="${C.ink}" stroke-width="1.5"/>
      ${moonGate(150, sy - 20, 0.7)}
      ${flowerWindow(330, sy - 20, 0.5, 'ice')}
      <ellipse cx="150" cy="${sy + 10}" rx="40" ry="4" fill="${C.ink}" opacity="0.2"/>
      <g transform="translate(230, sy - 30) scale(0.9)">
        <ellipse cx="0" cy="0" rx="22" ry="14" fill="${C.vegDark}"/>
        <ellipse cx="-6" cy="-6" rx="14" ry="10" fill="${C.vegMid}"/>
        <rect x="-1.5" y="0" width="3" height="14" fill="${C.wood}"/>
      </g>
      ${bambooCluster(70, sy - 20, 0.6)}
      <line x1="40" y1="${sy + 26}" x2="360" y2="${sy + 26}" stroke="${C.ink}" stroke-width="0.4" opacity="0.6"/>
      ${stoneLantern(80, sy - 30, 0.5)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneWenMeiGe(){   // 问梅阁 · 临窗种梅
    const W=400, H=300, sy=H*0.58;
    return makeSvg(W, H, `
      ${sky(W, H, '#ece1c6', '#cfc1a6')}
      ${mountainFar(W, H, sy - 52, 32, C.mtFar, 0.26)}
      <rect x="118" y="${sy - 98}" width="176" height="98" fill="${C.paper2}" stroke="${C.ink}" stroke-width="1.4"/>
      <polygon points="104,${sy - 98} 206,${sy - 132} 308,${sy - 98}" fill="${C.ink}"/>
      <polygon points="116,${sy - 98} 206,${sy - 123} 296,${sy - 98}" fill="${C.inkSoft}" opacity="0.55"/>
      <rect x="142" y="${sy - 78}" width="128" height="54" fill="${C.paper}" stroke="${C.ink}" stroke-width="0.9"/>
      <line x1="206" y1="${sy - 78}" x2="206" y2="${sy - 24}" stroke="${C.ink}" stroke-width="1"/>
      <line x1="142" y1="${sy - 52}" x2="270" y2="${sy - 52}" stroke="${C.ink}" stroke-width="0.7"/>
      <circle cx="196" cy="${sy - 50}" r="13" fill="none" stroke="${C.ink}" stroke-width="1"/>
      <rect x="152" y="${sy - 34}" width="44" height="34" fill="${C.paper3}" opacity="0.45"/>
      <line x1="40" y1="${sy + 24}" x2="360" y2="${sy + 24}" stroke="${C.ink}" stroke-width="0.4" opacity="0.6"/>
      ${plum(74, sy + 8, 0.9)}
      ${plum(332, sy + 12, 0.78)}
      ${plum(288, sy - 38, 0.5)}
      ${foreBranch(4, 10, 1, C.plum, 0.6, 8)}
      ${petals(W, H, 24, C.plum)}
      ${petals(W, H, 14, '#e8b0c0')}
      ${inkOverlay(W, H, 0.07)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneYanYuTang(){  // 燕誉堂 · 主厅堂前紫薇
    const W=400, H=300, sy=H*0.6;
    return makeSvg(W, H, `
      ${sky(W, H, '#e9dcbe', '#cdbd9c')}
      ${mountainFar(W, H, sy - 46, 30, C.mtFar, 0.22)}
      <rect x="96" y="${sy - 86}" width="212" height="86" fill="${C.paper2}" stroke="${C.ink}" stroke-width="1.4"/>
      <polygon points="82,${sy - 86} 202,${sy - 122} 322,${sy - 86}" fill="${C.ink}"/>
      <polygon points="94,${sy - 86} 202,${sy - 113} 310,${sy - 86}" fill="${C.inkSoft}" opacity="0.5"/>
      <rect x="126" y="${sy - 66}" width="152" height="40" fill="${C.paper}" stroke="${C.ink}" stroke-width="0.8"/>
      <line x1="202" y1="${sy - 66}" x2="202" y2="${sy - 26}" stroke="${C.ink}" stroke-width="1"/>
      <line x1="126" y1="${sy - 46}" x2="278" y2="${sy - 46}" stroke="${C.ink}" stroke-width="0.6"/>
      <g fill="#c98aa0">
        <circle cx="58" cy="${sy - 34}" r="7"/><circle cx="70" cy="${sy - 46}" r="5.5"/>
        <circle cx="50" cy="${sy - 48}" r="5"/><circle cx="64" cy="${sy - 22}" r="5.5"/>
        <circle cx="340" cy="${sy - 40}" r="6.5"/><circle cx="330" cy="${sy - 54}" r="5"/>
        <circle cx="350" cy="${sy - 26}" r="5"/>
      </g>
      <path d="M 58 ${sy - 18} Q 56 ${sy + 8} 60 ${sy + 22}" stroke="${C.plumBranch}" stroke-width="2.2" fill="none"/>
      <path d="M 340 ${sy - 22} Q 342 ${sy + 4} 338 ${sy + 20}" stroke="${C.plumBranch}" stroke-width="2" fill="none"/>
      <line x1="40" y1="${sy + 24}" x2="360" y2="${sy + 24}" stroke="${C.ink}" stroke-width="0.4" opacity="0.6"/>
      ${stoneLantern(300, sy - 18, 0.45)}
      ${petals(W, H, 18, '#c98aa0')}
      ${inkOverlay(W, H, 0.07)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneFeiPuTing(){   // 飞瀑亭 · 假山叠瀑
    const W=400, H=300, sy=H*0.52;
    return makeSvg(W, H, `
      ${sky(W, H, '#e6dcbe', '#c9b895')}
      ${mountainFar(W, H, sy - 74, 48, C.mtFar, 0.34)}
      ${rockeryGroup(96, sy + 28, 0.95)}
      ${rockeryGroup(312, sy + 32, 0.85)}
      <g>
        <rect x="190" y="${sy - 56}" width="17" height="30" rx="8" fill="${C.snow}" opacity="0.72"/>
        <rect x="193" y="${sy - 28}" width="11" height="32" rx="5" fill="${C.snow}" opacity="0.62"/>
        <rect x="195" y="${sy + 2}" width="8" height="28" rx="4" fill="${C.snow}" opacity="0.52"/>
        <circle cx="199" cy="${sy + 34}" r="9" fill="${C.snow}" opacity="0.5"/>
      </g>
      ${water(W, H, sy + 38)}
      ${ripples(W, H, sy + 52, 3)}
      ${pavilionQuad(206, sy + 6, 0.62)}
      ${pineTree(36, sy - 6, 0.6)}
      ${foreBranch(W-4, 16, -1, C.plum, 0.5, 6)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneWuTongFeng(){  // 碧梧栖凤 · 梧桐
    const W=400, H=300, sy=H*0.6;
    return makeSvg(W, H, `
      ${sky(W, H, '#eaddc0', '#cdbc9b')}
      ${mountainFar(W, H, sy - 44, 30, C.mtFar, 0.22)}
      <g transform="translate(212, ${sy + 12})">
        <path d="M 0 0 Q -4 -40 -2 -80" stroke="${C.plumBranch}" stroke-width="5" fill="none"/>
        <path d="M -2 -44 Q -26 -56 -40 -74" stroke="${C.plumBranch}" stroke-width="2.6" fill="none"/>
        <path d="M -2 -62 Q 22 -72 34 -92" stroke="${C.plumBranch}" stroke-width="2.4" fill="none"/>
        <g fill="${C.vegMid}" opacity="0.82">
          <ellipse cx="-34" cy="-78" rx="16" ry="11"/>
          <ellipse cx="-46" cy="-68" rx="13" ry="9"/>
          <ellipse cx="-24" cy="-88" rx="14" ry="10"/>
          <ellipse cx="28" cy="-94" rx="15" ry="10"/>
          <ellipse cx="42" cy="-84" rx="12" ry="9"/>
          <ellipse cx="18" cy="-106" rx="13" ry="9"/>
        </g>
        <g fill="#c98aa0">
          <circle cx="-20" cy="-96" r="4"/><circle cx="-8" cy="-104" r="3.4"/>
          <circle cx="10" cy="-112" r="3.6"/><circle cx="24" cy="-104" r="3.2"/>
          <circle cx="-34" cy="-86" r="3.2"/>
        </g>
      </g>
      ${flowerWindow(74, sy - 28, 0.55, 'ice')}
      <line x1="40" y1="${sy + 26}" x2="360" y2="${sy + 26}" stroke="${C.ink}" stroke-width="0.4" opacity="0.6"/>
      ${stoneLantern(320, sy - 16, 0.45)}
      ${petals(W, H, 16, '#c98aa0')}
      ${inkOverlay(W, H, 0.07)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneYuHuaShi(){    // 鱼化石 · 留园三绝
    const W=400, H=300, sy=H*0.6;
    let scales = '';
    for (let r=0;r<3;r++){
      for (let c=0;c<7;c++){
        const x = -42 + c*13 + (r%2)*6.5;
        const y = -11 + r*9;
        scales += `<path d="M ${x} ${y} q 6.5 -5 13 0 q -6.5 5 -13 0 Z" fill="${C.ink}" opacity="0.2"/>`;
      }
    }
    return makeSvg(W, H, `
      ${sky(W, H, '#e7dcc2', '#cabb97')}
      <rect x="20" y="${sy + 30}" width="360" height="3" fill="${C.ink}" opacity="0.12"/>
      <g transform="translate(200, ${sy + 12})">
        <rect x="-62" y="0" width="124" height="16" fill="${C.buildingDk}" stroke="${C.ink}" stroke-width="0.8"/>
        <rect x="-48" y="-19" width="96" height="21" rx="4" fill="${C.sandstone}" stroke="${C.ink}" stroke-width="1.1"/>
        ${scales}
        <path d="M -48 -13 q 24 -8 48 -4 q 24 4 48 -4" fill="none" stroke="${C.ink}" stroke-width="0.5" opacity="0.3"/>
      </g>
      ${flowerWindow(80, sy - 26, 0.5, 'ice')}
      ${flowerWindow(320, sy - 26, 0.5, 'ice')}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneCaiXiaChi(){   // 彩霞池 · 网师园中心水面
    const W=400, H=300, sy=H*0.48;
    return makeSvg(W, H, `
      ${sky(W, H, '#ead9b8', '#cbb894')}
      ${mountainFar(W, H, sy - 38, 26, C.mtFar, 0.25)}
      ${willowTree(42, sy - 14, 0.78)}
      ${pineTree(358, sy - 12, 0.68)}
      ${water(W, H, sy + 8)}
      ${ripples(W, H, sy + 26, 5)}
      ${pavilionQuad(198, sy - 4, 0.58)}
      ${bridgeArch(288, sy + 12, 66, 0.68)}
      ${koi(112, sy + 56, 0.55)}
      ${koi(248, sy + 80, 0.46)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneHeFengTing(){
    const W=400, H=300, sy=H*0.5;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#d0c0a0')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.4)}
      ${water(W, H, sy + 20)}
      ${ripples(W, H, sy + 40, 3)}
      ${lotusField(W, H, sy + 60, 8)}
      <g transform="translate(200, sy)">
        <polygon points="-44,0 0,-22 44,0" fill="${C.ink}"/>
        <polygon points="-44,0 -32,-10 0,-22 32,-10 44,0" fill="${C.inkSoft}"/>
        <circle cx="0" cy="-22" r="3" fill="${C.ink}"/>
        <line x1="-46" y1="0" x2="46" y2="0" stroke="${C.ink}" stroke-width="0.8"/>
        <rect x="-36" y="2" width="72" height="24" fill="${C.building}" stroke="${C.ink}" stroke-width="0.6"/>
        <line x1="-30" y1="2" x2="-30" y2="26" stroke="${C.ink}" stroke-width="1"/>
        <line x1="0" y1="2" x2="0" y2="26" stroke="${C.ink}" stroke-width="1"/>
        <line x1="30" y1="2" x2="30" y2="26" stroke="${C.ink}" stroke-width="1"/>
      </g>
      ${bridgeFlat(80, sy + 18, 80, 0.7)}
      ${bridgeFlat(320, sy + 18, 80, 0.7)}
      ${willowTree(20, sy - 10, 0.7)}
      ${pineTree(380, sy - 10, 0.7)}
      ${koi(280, sy + 60, 0.5)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneXiaoCanglang(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${water(W, H, sy + 20)}
      ${ripples(W, H, sy + 40, 4)}
      ${lotusField(W, H, sy + 70, 4)}
      ${hall(180, sy - 50, 130, 0.6)}
      ${pavilionHex(330, sy - 30, 0.5)}
      ${bambooCluster(60, sy - 30, 0.6)}
      ${pineTree(380, sy - 10, 0.6)}
      ${bridgeArch(80, sy + 20, 50, 0.6)}
      ${koi(200, sy + 80, 0.5)}
      ${inkOverlay(W, H, 0.1)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneHanBiShanFang(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#d0c0a0')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.4)}
      ${water(W, H, sy + 30)}
      ${ripples(W, H, sy + 50, 3)}
      ${lotusField(W, H, sy + 80, 6)}
      ${hall(200, sy - 50, 180, 0.8)}
      ${pavilionHex(60, sy - 30, 0.5)}
      ${pineTree(360, sy - 20, 0.8)}
      ${willowTree(20, sy - 10, 0.8)}
      <rect x="100" y="${sy + 10}" width="200" height="6" fill="${C.inkLight}" opacity="0.5"/>
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneGuanYunFeng(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e0d2b8', '#c9b896')}
      ${mountainFar(W, H, sy - 20, 30, C.mtFar, 0.35)}
      <g transform="translate(200, sy - 20)">
        <path d="M -70 0 L -50 -120 L -20 -160 L 0 -180 L 20 -160 L 50 -120 L 70 0 Z" fill="${C.inkLight}" stroke="${C.ink}" stroke-width="1"/>
        <path d="M -50 -120 L -38 -80 L -20 -160" stroke="${C.ink}" stroke-width="0.4" fill="none" opacity="0.6"/>
        <path d="M 0 -180 L -8 -120 L 20 -160" stroke="${C.ink}" stroke-width="0.4" fill="none" opacity="0.6"/>
        <ellipse cx="-20" cy="-100" rx="6" ry="3" fill="${C.ink}" opacity="0.4"/>
        <ellipse cx="20" cy="-120" rx="5" ry="2.5" fill="${C.ink}" opacity="0.4"/>
        <ellipse cx="0" cy="-140" rx="4" ry="2" fill="${C.ink}" opacity="0.4"/>
        <circle cx="0" cy="-180" r="2" fill="${C.ink}"/>
        <g fill="${C.rockeryL}" opacity="0.5">
          <ellipse cx="-15" cy="-140" rx="4" ry="1.5" transform="rotate(-20 -15 -140)"/>
          <ellipse cx="15" cy="-130" rx="3" ry="1.2" transform="rotate(20 15 -130)"/>
        </g>
      </g>
      <g transform="translate(80, sy - 30) scale(0.4)">
        <polygon points="-44,0 0,-22 44,0" fill="${C.ink}"/>
        <rect x="-36" y="2" width="72" height="20" fill="${C.building}"/>
      </g>
      ${pineTree(340, sy - 10, 0.7)}
      ${pineTree(60, sy - 10, 0.7)}
      ${inkOverlay(W, H, 0.1)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneNanMuTing(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${mountainFar(W, H, sy - 20, 30, C.mtFar, 0.4)}
      ${hall(200, sy - 50, 200, 0.9)}
      <g stroke="${C.ink}" stroke-width="0.4" fill="none" opacity="0.5">
        <line x1="160" y1="${sy - 50}" x2="160" y2="${sy - 10}"/>
        <line x1="180" y1="${sy - 50}" x2="180" y2="${sy - 10}"/>
        <line x1="200" y1="${sy - 50}" x2="200" y2="${sy - 10}"/>
        <line x1="220" y1="${sy - 50}" x2="220" y2="${sy - 10}"/>
        <line x1="240" y1="${sy - 50}" x2="240" y2="${sy - 10}"/>
      </g>
      ${pineTree(60, sy - 20, 0.8)}
      ${pineTree(340, sy - 20, 0.8)}
      ${treeCluster(380, sy - 10, 0.6)}
      ${stoneLantern(80, sy - 30, 0.5)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneDianChunYi(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#f0d8d0', '#e0b8b0')}
      <rect x="40" y="60" width="320" height="${sy + 50}" fill="${C.paper2}" stroke="${C.ink}" stroke-width="1.5"/>
      ${moonGate(80, 130, 0.7)}
      ${flowerWindow(280, 110, 0.5, 'ice')}
      ${flowerWindow(340, 110, 0.5, 'key')}
      <ellipse cx="80" cy="140" rx="18" ry="3" fill="${C.ink}" opacity="0.5"/>
      <g transform="translate(160, 180) scale(0.9)">
        <ellipse cx="0" cy="0" rx="30" ry="10" fill="${C.vegDark}" transform="rotate(-20)"/>
        <ellipse cx="20" cy="-8" rx="20" ry="6" fill="${C.vegMid}" transform="rotate(-25 20 -8)"/>
        <line x1="0" y1="0" x2="-3" y2="-20" stroke="${C.vegDark}" stroke-width="1"/>
        <line x1="10" y1="0" x2="12" y2="-15" stroke="${C.vegDark}" stroke-width="1"/>
      </g>
      <g transform="translate(240, 190)">
        ${petals(0, 0, 5, C.plum)}
        ${petals(0, -10, 4, C.plum)}
      </g>
      <line x1="40" y1="${sy + 40}" x2="360" y2="${sy + 40}" stroke="${C.ink}" stroke-width="0.4" opacity="0.6"/>
      ${petals(W, H, 30, C.plum)}
      ${inkOverlay(W, H, 0.06)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneYueDaoFengLai(){
    const W=400, H=300, sy=H*0.5;
    return makeSvg(W, H, `
      <defs><radialGradient id="moon-${_uid()}" cx="0.85" cy="0.2" r="0.5">
        <stop offset="0%" stop-color="${C.moon}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${C.daiqingD}" stop-opacity="0"/>
      </radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#moon-${_uid()-1})"/>
      <rect width="${W}" height="${H}" fill="${C.daiqingD}" opacity="0.25"/>
      ${moon(330, 60, 30, 0.85)}
      ${water(W, H, sy + 20)}
      ${ripples(W, H, sy + 40, 4)}
      <ellipse cx="330" cy="${sy + 60}" rx="20" ry="2" fill="${C.moon}" opacity="0.4"/>
      <ellipse cx="330" cy="${sy + 100}" rx="25" ry="2" fill="${C.moon}" opacity="0.2"/>
      ${pavilionHex(200, sy - 30, 0.7)}
      ${pineTree(60, sy - 20, 0.7)}
      ${willowTree(340, sy - 10, 0.7)}
      ${bridgeArch(80, sy + 20, 50, 0.6)}
      ${inkOverlay(W, H, 0.15)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneShiZiFeng(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e0d2b8', '#c9b896')}
      ${mountainFar(W, H, sy - 20, 30, C.mtFar, 0.4)}
      ${rockeryGroup(150, sy, 0.55)}
      ${rockeryGroup(280, sy - 10, 0.5)}
      ${hall(350, sy - 40, 100, 0.5)}
      ${pineTree(50, sy - 20, 0.7)}
      ${pineTree(380, sy - 10, 0.7)}
      ${bambooCluster(80, sy - 20, 0.4)}
      ${inkOverlay(W, H, 0.1)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneZhenQuTing(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${mountainFar(W, H, sy - 20, 30, C.mtFar, 0.4)}
      ${rockery(80, sy, 0.6)}
      ${pavilionHex(220, sy - 30, 0.7)}
      <rect x="200" y="${sy - 40}" width="40" height="20" fill="${C.ink}" stroke="${C.gold}" stroke-width="0.5"/>
      <text x="220" y="${sy - 26}" text-anchor="middle" font-family="'Ma Shan Zheng',serif" font-size="12" fill="${C.gold}">真趣</text>
      ${pineTree(340, sy - 20, 0.7)}
      ${pineTree(380, sy - 10, 0.6)}
      ${plum(150, sy - 30, 0.4)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneCangLangTing(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.4)}
      ${water(W, H, sy + 30)}
      ${ripples(W, H, sy + 50, 3)}
      ${pavilionQuad(200, sy - 40, 1)}
      ${pineTree(60, sy - 20, 0.8)}
      ${willowTree(340, sy - 10, 0.8)}
      ${bambooCluster(380, sy - 30, 0.5)}
      ${lotusField(W, H, sy + 80, 4)}
      ${bridgeFlat(80, sy + 30, 60, 0.6)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneKanShanLou(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${mountainFar(W, H, sy - 20, 50, C.mtFar, 0.4)}
      ${mountainMid(W, H, sy - 5, 60, C.mtFar2, 0.5)}
      ${mountainNear(W, H, sy + 5, 70, C.mtNear, 0.6)}
      ${tower(200, sy - 20, 1)}
      ${pineTree(60, sy - 10, 0.7)}
      ${pineTree(340, sy - 10, 0.7)}
      ${willowTree(20, sy - 10, 0.7)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneMianShuiXuan(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${water(W, H, sy + 30)}
      ${ripples(W, H, sy + 50, 4)}
      ${lotusField(W, H, sy + 80, 6)}
      ${corridor(200, sy - 30, 240, 'h', 0.6)}
      ${willowTree(20, sy - 10, 0.8)}
      ${willowTree(380, sy - 10, 0.8)}
      ${koiPair(100, sy + 100, 0.5)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function scenePoXian(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${hall(200, sy - 50, 180, 0.8)}
      ${bambooCluster(60, sy - 30, 0.8)}
      ${bambooCluster(340, sy - 30, 0.8)}
      ${pineTree(20, sy - 10, 0.7)}
      <g transform="translate(200, sy)">
        <ellipse cx="0" cy="0" rx="40" ry="6" fill="${C.wood}" stroke="${C.ink}" stroke-width="0.6"/>
        <ellipse cx="-30" cy="0" rx="6" ry="3" fill="${C.ink}"/>
        <ellipse cx="30" cy="0" rx="6" ry="3" fill="${C.ink}"/>
        <g stroke="${C.ink}" stroke-width="0.3" fill="none" opacity="0.6">
          <line x1="-30" y1="0" x2="30" y2="0"/>
          <line x1="-25" y1="0" x2="-25" y2="-3"/>
          <line x1="-15" y1="0" x2="-15" y2="-3"/>
          <line x1="0" y1="0" x2="0" y2="-3"/>
          <line x1="15" y1="0" x2="15" y2="-3"/>
          <line x1="25" y1="0" x2="25" y2="-3"/>
        </g>
      </g>
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function sceneBaiShiXuan(){
    const W=400, H=300, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${mountainFar(W, H, sy - 20, 30, C.mtFar, 0.4)}
      ${hall(220, sy - 50, 140, 0.7)}
      <g transform="translate(120, sy)">
        <path d="M -25 0 L -15 -25 L -5 -32 L 5 -28 L 15 -20 L 25 0 Z" fill="${C.inkLight}" stroke="${C.ink}" stroke-width="0.6"/>
        <ellipse cx="0" cy="-15" rx="4" ry="2" fill="${C.ink}" opacity="0.4"/>
        <g fill="${C.rockeryL}" opacity="0.5">
          <ellipse cx="-5" cy="-25" rx="3" ry="1" transform="rotate(-20 -5 -25)"/>
        </g>
      </g>
      <g transform="translate(320, sy - 10)">
        <path d="M -22 0 L -12 -22 L -2 -28 L 8 -24 L 18 -18 L 22 0 Z" fill="${C.inkLight}" stroke="${C.ink}" stroke-width="0.6"/>
        <ellipse cx="0" cy="-12" rx="3" ry="1.5" fill="${C.ink}" opacity="0.4"/>
      </g>
      ${pineTree(60, sy - 20, 0.7)}
      ${bambooCluster(380, sy - 30, 0.4)}
      ${inkOverlay(W, H, 0.1)}
      ${paperTexture(W, H, 0.04)}
    `);
  }

  // ===== 季节（更精致） =====

  // 前景垂枝（自上角探入，中国园林画卷常用构图）
  const foreBranch = (x, y, dir=1, color=C.plum, scale=1, density=9) => {
    let r = `<g transform="translate(${x},${y}) scale(${dir*scale},${scale})">`;
    r += `<path d="M 0 0 C 38 16 76 28 118 32" fill="none" stroke="${C.plumBranch}" stroke-width="2.6" stroke-linecap="round"/>`;
    r += `<path d="M 30 13 C 44 32 48 50 44 72" fill="none" stroke="${C.plumBranch}" stroke-width="1.5"/>`;
    r += `<path d="M 72 25 C 86 44 88 60 84 80" fill="none" stroke="${C.plumBranch}" stroke-width="1.3"/>`;
    r += `<path d="M 104 30 C 114 46 115 58 112 72" fill="none" stroke="${C.plumBranch}" stroke-width="1.1"/>`;
    for (let i=0;i<density;i++){
      const t = (i+0.5)/density;
      const bx = 22 + t*100;
      const by = 10 + t*22 + Math.sin(i*2.1)*5;
      r += `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${(2.2+Math.random()*2.4).toFixed(1)}" fill="${color}" opacity="${(0.5+Math.random()*0.45).toFixed(2)}"/>`;
      r += `<circle cx="${(bx+7).toFixed(1)}" cy="${(by+13).toFixed(1)}" r="${(1.8+Math.random()*1.8).toFixed(1)}" fill="${color}" opacity="0.5"/>`;
      r += `<circle cx="${(bx-6).toFixed(1)}" cy="${(by+9).toFixed(1)}" r="${(1.4+Math.random()*1.4).toFixed(1)}" fill="${color}" opacity="0.4"/>`;
    }
    r += `</g>`;
    return r;
  };

  // 前景坡岸 + 苔点
  const foreBank = (W, y, color=C.vegDark, opacity=0.5) => `
    <g>
      <path d="M 0 ${y} Q ${W*0.16} ${y-16} ${W*0.34} ${y-5} T ${W*0.6} ${y-13} Q ${W*0.82} ${y-20} ${W} ${y-7} L ${W} ${y+60} L 0 ${y+60} Z" fill="${color}" opacity="${opacity}"/>
      <path d="M 0 ${y} Q ${W*0.16} ${y-16} ${W*0.34} ${y-5} T ${W*0.6} ${y-13} Q ${W*0.82} ${y-20} ${W} ${y-7}" fill="none" stroke="${C.ink}" stroke-width="0.7" opacity="${(opacity+0.2).toFixed(2)}"/>
      ${(()=>{ let t=''; for(let i=0;i<14;i++){ const px=Math.random()*W, py=y-4+Math.random()*16; t+=`<circle cx="${px.toFixed(0)}" cy="${py.toFixed(0)}" r="${(0.8+Math.random()*1.6).toFixed(1)}" fill="${C.vegMid}" opacity="${(0.3+Math.random()*0.4).toFixed(2)}"/>`; } return t; })()}
    </g>
  `;

  // 石径（前景踏道）
  const forePath = (W, y, h=70) => `
    <g opacity="0.45">
      <path d="M ${W*0.30} ${y} Q ${W*0.38} ${y+h*0.35} ${W*0.33} ${y+h} L ${W*0.66} ${y+h} Q ${W*0.60} ${y+h*0.35} ${W*0.68} ${y} Z" fill="${C.paper2}" opacity="0.4"/>
      ${[0,1,2,3].map(i=>`<path d="M ${W*(0.34+i*0.012)} ${y+h*(0.18+i*0.22)} Q ${W*0.48} ${y+h*(0.22+i*0.22)} ${W*(0.64-i*0.012)} ${y+h*(0.18+i*0.22)}" fill="none" stroke="${C.inkLight}" stroke-width="0.5" opacity="0.5"/>`).join('')}
    </g>
  `;

  // 雪地脚印
  const snowFootsteps = (x, y, n=6, dx=14, dy=9) => {
    let r='';
    for(let i=0;i<n;i++){
      const px = x + i*dx, py = y + i*dy;
      r += `<ellipse cx="${px}" cy="${py}" rx="4" ry="2.4" fill="${C.inkLight}" opacity="0.16" transform="rotate(${-24},${px},${py})"/>`;
    }
    return r;
  };

  // 蝴蝶
  const butterfly = (x, y, s=1, color='#e8a0b8') => `
    <g transform="translate(${x},${y}) scale(${s})" opacity="0.85">
      <path d="M 0 0 C -8 -9 -15 -6 -12 1 C -9 6 -3 4 0 0 Z" fill="${color}"/>
      <path d="M 0 0 C 8 -9 15 -6 12 1 C 9 6 3 4 0 0 Z" fill="${color}"/>
      <path d="M -2 0 L 2 0" stroke="${C.ink}" stroke-width="0.8"/>
      <path d="M -1 -1 L -5 -5 M 1 -1 L 5 -5" stroke="${C.ink}" stroke-width="0.4" fill="none"/>
    </g>
  `;

  // 粉墙月洞门（中景，苏州园林的标志物）
  const wallGate = (x, baseY, scale=0.8) => `
    <g transform="translate(${x},${baseY}) scale(${scale})">
      <rect x="-52" y="-56" width="104" height="56" fill="${C.paper}" opacity="0.92"/>
      <rect x="-52" y="-56" width="104" height="56" fill="none" stroke="${C.ink}" stroke-width="0.8" opacity="0.55"/>
      <path d="M -60 -56 L 60 -56 L 52 -64 L -52 -64 Z" fill="${C.buildingRoof}" opacity="0.9"/>
      <path d="M -62 -64 Q 0 -71 62 -64" fill="none" stroke="${C.ink}" stroke-width="1"/>
      <circle cx="0" cy="-28" r="20" fill="${C.inkSoft}" opacity="0.45"/>
      <circle cx="0" cy="-28" r="20" fill="none" stroke="${C.ink}" stroke-width="1.3"/>
      <circle cx="0" cy="-28" r="23" fill="none" stroke="${C.paper3}" stroke-width="0.9" opacity="0.9"/>
      ${[0,1,2,3].map(i=>`<line x1="-52" y1="${-44+i*11}" x2="52" y2="${-44+i*11}" stroke="${C.inkLight}" stroke-width="0.3" opacity="0.28"/>`).join('')}
    </g>
  `;

  function seasonSpring(){
    const W=400, H=533, sy=H*0.6;
    return makeSvg(W, H, `
      ${sky(W, H, '#f0d8d0', '#e0b8b0')}
      ${mountainFar(W, H, sy - 20, 50, C.mtFar, 0.4)}
      ${tower(322, sy - 78, 0.5)}
      ${wallGate(120, sy - 2, 0.82)}
      ${hall(200, sy - 60, 160, 0.8)}
      ${pavilionHex(60, sy - 30, 0.5)}
      ${pineTree(340, sy - 20, 0.8)}
      ${willowTree(20, sy - 10, 0.8)}
      ${plum(100, sy - 30, 0.6)}
      ${plum(280, sy - 30, 0.6)}
      ${plum(180, sy - 50, 0.5)}
      ${foreBank(W, sy + 22, C.vegMid, 0.4)}
      ${forePath(W, sy + 26, 62)}
      ${foreBranch(4, 6, 1, C.plum, 0.85, 10)}
      ${foreBranch(W-4, 20, -1, '#e8b0c0', 0.62, 7)}
      ${butterfly(150, sy + 70, 0.9)}
      ${butterfly(250, sy + 120, 0.7, '#f0c060')}
      ${petals(W, H, 50, C.plum)}
      ${petals(W, H, 30, '#e89aaa')}
      ${inkOverlay(W, H, 0.05)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function seasonSummer(){
    const W=400, H=533, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#e8d8b8', '#c9b896')}
      ${water(W, H, sy + 30)}
      ${ripples(W, H, sy + 50, 4)}
      ${tower(330, sy - 76, 0.45)}
      ${wallGate(112, sy + 6, 0.78)}
      ${lotusField(W, H, sy + 60, 12)}
      ${lotusField(W, H, sy + 100, 8)}
      ${lotusField(W, H, sy + 140, 6)}
      ${lotusField(W, H, sy + 180, 4)}
      ${pavilionHex(200, sy - 30, 0.5)}
      ${hall(340, sy - 30, 100, 0.5)}
      ${willowTree(20, sy - 10, 0.8)}
      ${koiPair(100, sy + 130, 0.5)}
      ${koi(280, sy + 150, 0.5)}
      ${egret(330, sy + 92, 0.55)}
      ${bridgeFlat(190, sy + 218, 120, 0.9)}
      ${foreBranch(W-6, 8, -1, C.vegMid, 0.66, 7)}
      ${bambooCluster(28, sy + 150, 0.7)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function seasonAutumn(){
    const W=400, H=533, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#f0d0a0', '#d0a878')}
      ${mountainFar(W, H, sy - 20, 40, C.mtFar, 0.4)}
      ${mountainNear(W, H, sy + 5, 50, C.maple, 0.5)}
      ${water(W, H, sy + 30)}
      ${ripples(W, H, sy + 50, 3)}
      ${tower(326, sy - 74, 0.48)}
      ${wallGate(126, sy + 4, 0.8)}
      ${hall(200, sy - 50, 140, 0.7)}
      ${pavilionHex(60, sy - 30, 0.5)}
      ${maple(340, sy - 20, 0.8)}
      ${maple(50, sy - 25, 0.6)}
      ${maple(280, sy - 40, 0.5)}
      ${willowTree(20, sy - 10, 0.8)}
      ${foreBank(W, sy + 40, '#8a4a2a', 0.42)}
      ${forePath(W, sy + 44, 60)}
      ${foreBranch(4, 6, 1, C.maple, 0.9, 10)}
      ${foreBranch(W-4, 26, -1, C.ginkgo, 0.6, 7)}
      ${petals(W, H, 40, C.maple)}
      ${petals(W, H, 26, C.ginkgo)}
      ${petals(W, H, 18, C.vermilion)}
      ${inkOverlay(W, H, 0.08)}
      ${paperTexture(W, H, 0.04)}
    `);
  }
  function seasonWinter(){
    const W=400, H=533, sy=H*0.55;
    return makeSvg(W, H, `
      ${sky(W, H, '#d8d8e0', '#b8b8c0')}
      ${mountainFar(W, H, sy - 20, 50, C.mtFar, 0.5)}
      ${mountainNear(W, H, sy + 5, 60, C.inkLight, 0.7)}
      <rect y="${sy + 5}" width="${W}" height="${H - sy - 5}" fill="${C.snow}" opacity="0.85"/>
      ${hall(200, sy - 50, 140, 0.7)}
      ${pavilionHex(60, sy - 30, 0.5)}
      ${pineTree(340, sy - 20, 0.8)}
      ${pineTree(380, sy - 10, 0.7)}
      ${snowyBranch(150, sy - 15, 0.6)}
      ${snowyBranch(280, sy - 25, 0.5)}
      ${plum(80, sy - 30, 0.4)}
      ${tower(330, sy - 72, 0.45)}
      ${wallGate(120, sy + 6, 0.78)}
      ${snowFootsteps(120, sy + 55, 7, 17, 11)}
      ${snowFootsteps(232, sy + 128, 5, -15, 10)}
      ${foreBranch(4, 8, 1, C.plum, 0.72, 8)}
      ${foreBranch(W-4, 24, -1, C.plum, 0.55, 6)}
      ${snowyBranch(40, sy + 62, 0.9)}
      ${snowyBranch(330, sy + 108, 0.8)}
      ${stoneLantern(200, sy + 96, 0.7)}
      ${snow(W, H, 80)}
      ${inkOverlay(W, H, 0.05)}
      ${paperTexture(W, H, 0.03)}
    `);
  }

  // ===== 装饰元素（用于页面其他位置） =====
  // 角隅回纹 (左上角)
  const cornerMeander = (side='tl', size=80) => {
    const s = size;
    return `<svg viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg" style="width:${s}px;height:${s}px">
      <g fill="none" stroke="${C.vermilion}" stroke-width="2">
        <path d="M 0 0 L ${s-10} 0 L ${s-10} 10 L 10 10 L 10 ${s-10} L ${s-20} ${s-10} L ${s-20} 20 L 20 20 L 20 ${s-20} L ${s-30} ${s-20} L ${s-30} 30 L 30 30 L 30 ${s-30}"/>
        <path d="M 0 0 L 0 ${s-10} L 10 ${s-10} L 10 10 L ${s-10} 10 L ${s-10} 0" stroke="${C.ink}" stroke-width="0.8" opacity="0.5"/>
      </g>
    </svg>`;
  };

  // 章节分隔（中央印章 + 线条）
  const sectionDivider = (text='造 化 自 然') => {
    const W=600, H=80;
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:600px;height:auto">
      <line x1="20" y1="40" x2="${W*0.3}" y2="40" stroke="${C.vermilion}" stroke-width="1"/>
      <line x1="${W*0.7}" y1="40" x2="${W-20}" y2="40" stroke="${C.vermilion}" stroke-width="1"/>
      <g transform="translate(${W/2}, 40)">
        <circle r="28" fill="none" stroke="${C.vermilion}" stroke-width="1.5"/>
        <circle r="25" fill="none" stroke="${C.vermilion}" stroke-width="0.5" opacity="0.5"/>
        <text y="6" text-anchor="middle" font-family="'Ma Shan Zheng',serif" font-size="16" fill="${C.vermilion}" letter-spacing="0.15em">${text}</text>
      </g>
      <g transform="translate(${W*0.18}, 40)"><circle r="3" fill="${C.vermilionD}"/></g>
      <g transform="translate(${W*0.82}, 40)"><circle r="3" fill="${C.vermilionD}"/></g>
    </svg>`;
  };

  // 单个灯笼icon (用于页面装饰)
  const lanternIcon = (color=C.vermilion) => `
    <svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg" style="width:60px;height:100px">
      <line x1="30" y1="0" x2="30" y2="20" stroke="${C.ink}" stroke-width="1.2"/>
      <rect x="10" y="20" width="40" height="6" fill="${C.wood}" stroke="${C.ink}" stroke-width="0.5"/>
      <ellipse cx="30" cy="55" rx="18" ry="26" fill="${color}" stroke="${C.ink}" stroke-width="0.6"/>
      <ellipse cx="30" cy="48" rx="14" ry="6" fill="${C.moon}" opacity="0.4"/>
      <line x1="14" y1="55" x2="46" y2="55" stroke="${C.gold}" stroke-width="0.6"/>
      <text x="30" y="60" text-anchor="middle" font-family="'Ma Shan Zheng',serif" font-size="14" fill="${C.gold}">园</text>
      <rect x="10" y="78" width="40" height="6" fill="${C.wood}" stroke="${C.ink}" stroke-width="0.5"/>
      <line x1="30" y1="84" x2="30" y2="92" stroke="${C.gold}" stroke-width="0.6"/>
      <polygon points="25,92 30,98 35,92" fill="${C.gold}"/>
    </svg>
  `;

  // 折扇
  const foldingFan = (color=C.vermilion) => `
    <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg" style="width:120px;height:60px">
      <path d="M 60 55 L 5 30 A 55 30 0 0 1 115 30 Z" fill="${color}" stroke="${C.ink}" stroke-width="0.6"/>
      <path d="M 60 55 L 10 32" stroke="${C.ink}" stroke-width="0.4"/>
      <path d="M 60 55 L 25 28" stroke="${C.ink}" stroke-width="0.4"/>
      <path d="M 60 55 L 40 26" stroke="${C.ink}" stroke-width="0.4"/>
      <path d="M 60 55 L 55 25" stroke="${C.ink}" stroke-width="0.4"/>
      <path d="M 60 55 L 75 25" stroke="${C.ink}" stroke-width="0.4"/>
      <path d="M 60 55 L 90 27" stroke="${C.ink}" stroke-width="0.4"/>
      <path d="M 60 55 L 105 30" stroke="${C.ink}" stroke-width="0.4"/>
      <text x="55" y="42" text-anchor="middle" font-family="'Ma Shan Zheng',serif" font-size="8" fill="${C.gold}">园</text>
      <circle cx="60" cy="55" r="3" fill="${C.gold}"/>
    </svg>
  `;

  // 冰裂窗格 (可用于背景图案)
  const iceCrackPattern = (W, H) => {
    let r = '<defs><pattern id="ice" width="60" height="60" patternUnits="userSpaceOnUse">';
    r += `<rect width="60" height="60" fill="none"/>`;
    r += `<g stroke="${C.ink}" stroke-width="0.4" fill="none" opacity="0.3">`;
    r += `<path d="M 10 20 L 25 35 L 18 50"/><path d="M 25 35 L 40 30 L 50 45"/>`;
    r += `<path d="M 30 10 L 25 35"/><path d="M 50 45 L 60 25"/>`;
    r += `<path d="M 5 50 L 18 50"/><path d="M 40 30 L 60 25"/>`;
    r += `</g></defs>`;
    r += `<rect width="${W}" height="${H}" fill="url(#ice)"/>`;
    return r;
  };

  // 回纹横条 (用于章节分隔条)
  const meanderStrip = (W, h=20) => {
    return `<svg viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:${h}px">
      <g fill="none" stroke="${C.vermilion}" stroke-width="1">
        ${Array.from({length: Math.ceil(W/24)}, (_, i) => {
          const x = i*24;
          return `<path d="M ${x} 0 L ${x+16} 0 L ${x+16} ${h/2} L ${x+20} ${h/2} L ${x+20} ${h} L ${x+24} ${h}"/>
                  <path d="M ${x+8} 0 L ${x+8} ${h}" opacity="0.5"/>`;
        }).join('')}
      </g>
    </svg>`;
  };

  // ===== 暴露 API =====
  window.GP = {
    // 照片 API（本地优先，缺失时回落 SVG）
    photoFor, photoForIdx, photoUrl, localPhoto, remotePhotoFor, PHOTO_IDS,
    // 7 园 Hero
    heroZhuozheng, heroLiu, heroWangshi, heroShizi, heroCanglang, heroYi, heroYipu,
    // 通用卡片（更丰富）
    cardPavilionWater, cardRockery, cardCorridorWater, cardTower, cardBamboo,
    cardLotus, cardWinter, cardFlower, cardAutumn,
    cardMoonGate, cardBoat, cardSnowBridge, cardBambooPath, cardLantern, cardRain,
    // 场景缩略图
    sceneYuanXiangTang, sceneXiaoFeiHong, sceneXiangZhou, sceneWuZhu,
    sceneHeFengTing, sceneXiaoCanglang,
    sceneHanBiShanFang, sceneGuanYunFeng, sceneNanMuTing,
    sceneDianChunYi, sceneYueDaoFengLai,
    sceneShiZiFeng, sceneZhenQuTing,
    sceneCangLangTing, sceneKanShanLou, sceneMianShuiXuan,
    scenePoXian, sceneBaiShiXuan,
    sceneShiLunTang, sceneYipuMoonGate, sceneRuYuTing, sceneSiShiXuan,
    sceneWenMeiGe, sceneYanYuTang, sceneFeiPuTing, sceneWuTongFeng,
    sceneYuHuaShi, sceneCaiXiaChi,
    // 季节
    seasonSpring, seasonSummer, seasonAutumn, seasonWinter,
    // 杂项
    heroScrollArt,
    // 装饰元素
    cornerMeander, sectionDivider, lanternIcon, foldingFan, iceCrackPattern, meanderStrip,
    sealStamp, sealRound, plaque, moonGate, flowerWindow, stoneLantern,
    roundFan, ancientBook,
  };
})();