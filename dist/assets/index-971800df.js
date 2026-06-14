(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const c of o)if(c.type==="childList")for(const i of c.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function a(o){const c={};return o.integrity&&(c.integrity=o.integrity),o.referrerPolicy&&(c.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?c.credentials="include":o.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function t(o){if(o.ep)return;o.ep=!0;const c=a(o);fetch(o.href,c)}})();function L(s){const e=W(s),a=z(s);return{id:e.id,dateKey:e.date,time:e.time,group:e.group,matchday:e.matchday||"GROUP STAGE",venue:e.venue,venueShort:e.venueShort,status:e.status||"upcoming",homeCode:e.homeCode,awayCode:e.awayCode,referee:e.referee,homeFormation:e.homeFormation,awayFormation:e.awayFormation,homeCoach:e.homeCoach,awayCoach:e.awayCoach,odds:{home:e.oddsHome,draw:e.oddsDraw,away:e.oddsAway},predScore:{home:Number(e.predScoreHome),away:Number(e.predScoreAway)},homeNote:a.home_note||"",awayNote:a.away_note||"",oddsNote:a.odds_note||"",homeSquad:h(a.home_squad),awaySquad:h(a.away_squad),scorePredictions:h(a.score_predictions),eventPreds:h(a.event_preds),referee_data:j(a.referee),h2h:q(a.h2h),battles:h(a.battles),summaryVerdict:a.summary_verdict||"",observations:h(a.observations)}}function W(s){const e=s.match(/^---\n([\s\S]*?)\n---/);if(!e)return{};const a={};for(const t of e[1].split(`
`)){const o=t.indexOf(":");if(o<0)continue;const c=t.slice(0,o).trim(),i=t.slice(o+1).trim().replace(/^"(.*)"$/,"$1");a[c]=i}return a}function z(s){const e=s.replace(/^---\n[\s\S]*?\n---\n/,""),a={},t=e.split(/^## /m).filter(Boolean);for(const o of t){const c=o.indexOf(`
`),i=o.slice(0,c).trim();a[i]=o.slice(c+1).trim()}return a}function h(s){if(!s)return[];const e=s.split(`
`).filter(o=>o.trim().startsWith("|"));if(e.length<2)return[];const a=e[0].split("|").map(o=>o.trim()).filter(Boolean),t=[];for(let o=2;o<e.length;o++){const c=e[o].split("|").map(d=>d.trim()).filter(Boolean);if(c.length===0)continue;const i={};a.forEach((d,r)=>{i[d]=c[r]||""}),t.push(i)}return t}function j(s){if(!s)return null;const e={},a=s.split(`
`).filter(t=>t.trim().startsWith("-"));for(const t of a){const o=t.match(/^-\s*(\w+):\s*(.+)/);o&&(e[o[1]]=o[2].trim())}return e.stats=h(s),e}function q(s){if(!s)return null;const e={},a=s.split(`
`).filter(o=>o.trim().startsWith("-"));for(const o of a){const c=o.match(/^-\s*(\w+):\s*(.+)/);c&&(e[c[1]]=c[2].trim())}e.homeWins=Number(e.homeWins)||0,e.draws=Number(e.draws)||0,e.awayWins=Number(e.awayWins)||0;const t=e.homeWins+e.draws+e.awayWins||1;return e.homePct=Math.round(e.homeWins/t*100),e.drawPct=Math.round(e.draws/t*100),e.awayPct=Math.round(e.awayWins/t*100),e}let B={},$=[],p={dateKey:"",matchId:"",tab:"home"},y=[];async function N(){const s="/wc-prediction/",[e,a]=await Promise.all([fetch(`${s}teams.json`),fetch(`${s}matches/index.json`)]);B=await e.json();const t=await a.json();$=await Promise.all(t.map(i=>fetch(`${s}matches/${i.file}`).then(d=>d.text()).then(d=>L(d))));const c=$[0];p={dateKey:c.dateKey,matchId:c.id,tab:"home"}}function b(){return B}function M(){return $}function g(){return p}function w(s){p={...p,...s},y.forEach(e=>e(p))}function F(s){return y.push(s),()=>{y=y.filter(e=>e!==s)}}function K(){const s={};for(const e of $)s[e.dateKey]||(s[e.dateKey]={count:0}),s[e.dateKey].count++;return Object.entries(s).map(([e,a])=>{const t=new Date(e),o=["週日","週一","週二","週三","週四","週五","週六"],c=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];return{key:e,dow:o[t.getUTCDay()],dom:String(t.getUTCDate()),mon:c[t.getUTCMonth()],count:a.count}})}function f(){return $.find(s=>s.id===p.matchId)||$[0]}const C={starter:"background:rgba(34,197,94,0.15);color:#4ade80;border:1px solid rgba(34,197,94,0.3)",team:"background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)",league:"background:rgba(139,92,246,0.15);color:#a78bfa;border:1px solid rgba(139,92,246,0.3)",squad:"background:rgba(100,116,139,0.15);color:#94a3b8;border:1px solid rgba(100,116,139,0.3)",doubt:"background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.3)"},H={gk:"background:#1a3a5c;color:#60a5fa",def:"background:#1a3a1a;color:#4ade80",mid:"background:#3a2a1a;color:#fb923c",fwd:"background:#3a1a1a;color:#f87171"};function O(s){return s=s.toUpperCase(),s==="GK"?"gk":["FWD","ST"].includes(s)?"fwd":["DEF","CB","RB","LB","WB","RWB","LWB"].includes(s)?"def":"mid"}function D(){const s=g(),e=K(),t=M().filter(d=>d.dateKey===s.dateKey),o=b(),c=e.map(d=>`<button class="date-btn${d.key===s.dateKey?" active":""}" data-date="${d.key}">
      <div class="date-dow">${d.dow}</div>
      <div class="date-dom">${d.dom}</div>
      <div class="date-mon">${d.mon} · ${d.count}場</div>
    </button>`).join(""),i=t.map(d=>{const r=o[d.homeCode],l=o[d.awayCode],m=d.id===s.matchId,n=d.status==="live",v=d.status==="ft",u=n?"#E30A17":v?"#64748B":"#22c55e";return`<button class="chip-btn${m?" active":""}" data-match="${d.id}">
      <span class="chip-dot" style="background:${u}"></span>
      <span class="chip-flag">${r.flag}</span>
      <span class="chip-code">${r.code}</span>
      <span class="chip-vs">vs</span>
      <span class="chip-code">${l.code}</span>
      <span class="chip-flag">${l.flag}</span>
      ${n?'<span class="chip-live">LIVE</span>':""}
      <span class="chip-time${m?" chip-time-active":""}">${d.time}</span>
    </button>`}).join("");return`
    <div class="nav-brand">
      <span class="brand-wc">WC 2026</span>
      <span class="brand-pred">賽事預測</span>
      <span class="brand-stage">GROUP STAGE</span>
    </div>
    <div class="nav-dates scrollx">${c}</div>
    <div class="nav-chips scrollx">${i}</div>
  `}function I(){const s=f(),e=b(),a=e[s.homeCode],t=e[s.awayCode],o=s.scorePredictions||[];let c=0,i=0,d=0;for(const v of o){const u=Number(v.prob)||0;v.result&&v.result.includes(a.zh+"勝")?c+=u:v.result&&v.result.includes(t.zh+"勝")?d+=u:v.result&&v.result.includes("平局")&&(i+=u)}const r=c+i+d||1,l=Math.round(c/r*100),m=Math.round(d/r*100),n=Math.max(0,100-l-m);return`
    <div class="hero-badge">FIFA WORLD CUP 2026 · GROUP ${s.group} · ${s.matchday}</div>
    <div class="hero-teams">
      <div class="hero-team">
        <div class="hero-flag">${a.flag}</div>
        <div class="hero-en" style="color:${a.color}">${a.en}</div>
        <div class="hero-meta">${a.zh} · ${a.rank}</div>
      </div>
      <div class="hero-vs">VS</div>
      <div class="hero-team">
        <div class="hero-flag">${t.flag}</div>
        <div class="hero-en" style="color:${t.color}">${t.en}</div>
        <div class="hero-meta">${t.zh} · ${t.rank}</div>
      </div>
    </div>
    <div class="hero-info">📍 ${s.venue} &nbsp;|&nbsp; <span style="color:#F59E0B">${s.dateKey} · ${s.time} MYT</span> &nbsp;|&nbsp; 裁判: ${s.referee}</div>
    <div class="hero-stats">
      <div class="hero-stat-cell">
        <div class="stat-label">預測比分</div>
        <div class="stat-score">
          <span style="color:${a.color}">${s.predScore.home}</span>
          <span style="color:#475569"> – </span>
          <span style="color:${t.color}">${s.predScore.away}</span>
        </div>
      </div>
      <div class="hero-stat-cell hero-stat-wide">
        <div class="stat-label">勝率預測</div>
        <div class="win-bar">
          <div style="width:${l}%;background:${a.color}"></div>
          <div style="width:${n}%;background:#475569"></div>
          <div style="width:${m}%;background:${t.color}"></div>
        </div>
        <div class="win-pct">
          <span style="color:${a.color}">${a.code} ${l}%</span>
          <span style="color:#94A3B8">和 ${n}%</span>
          <span style="color:${t.color}">${t.code} ${m}%</span>
        </div>
      </div>
      <div class="hero-stat-cell">
        <div class="stat-label">賠率</div>
        <div class="odds-row">
          <div class="odds-item">
            <div class="odds-val" style="color:${a.color}">${s.odds.home}</div>
            <div class="odds-lbl">${a.code}</div>
          </div>
          <div class="odds-item">
            <div class="odds-val">${s.odds.draw}</div>
            <div class="odds-lbl">和</div>
          </div>
          <div class="odds-item">
            <div class="odds-val" style="color:${t.color}">${s.odds.away}</div>
            <div class="odds-lbl">${t.code}</div>
          </div>
        </div>
      </div>
    </div>
  `}function _(){const s=f(),e=b(),a=e[s.homeCode],t=e[s.awayCode],o=g();return[{id:"home",label:`${a.flag} ${a.zh}球員`,color:a.color},{id:"away",label:`${t.flag} ${t.zh}球員`,color:t.color},{id:"other",label:"📊 其他分析",color:"#F59E0B"},{id:"summary",label:"🏆 總結",color:"#F59E0B"}].map(i=>{const d=i.id===o.tab;return`<button class="tab-btn${d?" active":""}" data-tab="${i.id}"
      style="border-bottom-color:${d?i.color:"transparent"};color:${d?i.color:"#94A3B8"}"
    >${i.label}</button>`}).join("")}function R(s,e){const a=O(s.pos),t=H[a],c=(s.tags||"").split(",").map(r=>r.trim()).filter(Boolean).map(r=>`<span class="player-tag" style="${C[r]||C.squad}">${{starter:"首發主力",team:"隊內核心",league:"聯賽明星",squad:"替補",doubt:"⚠ 傷疑"}[r]||r}</span>`).join(""),i=s.bench==="true",d=`width:${s.prob}%;background:${e.barColor}`;return`
    <div class="player-card${i?" bench":""}">
      <div class="player-accent" style="background:${e.barColor}"></div>
      <div class="player-header">
        <span class="player-pos" style="${t}">${s.pos}</span>
        <span class="player-num">${s.num}</span>
      </div>
      <div class="player-name">${s.name}</div>
      <div class="player-club">${s.flag||""} ${s.club}</div>
      <div class="player-tags">${c}</div>
      <div class="player-prob-label">${i?"入球機率（上場後）":"入球機率"}</div>
      <div class="player-bar-bg"><div class="player-bar" style="${d}"></div></div>
      <div class="player-prob-val">${s.prob}%</div>
      <div class="player-desc">${s.desc}</div>
    </div>`}function E(s){const e=f(),a=b(),t=s==="home"?e.homeSquad:e.awaySquad,o=s==="home"?e.homeCode:e.awayCode,c=s==="home"?e.homeFormation:e.awayFormation,i=s==="home"?e.homeCoach:e.awayCoach,d=s==="home"?e.homeNote:e.awayNote,r=a[o];return`
    <div class="section-title">
      <span class="section-dot" style="background:${r.color}"></span>
      ${r.zh} — 預測首發陣容 (${c})
    </div>
    <div class="squad-meta">
      <div class="squad-meta-card">
        <div class="meta-label">陣型</div>
        <div class="meta-value" style="color:${r.color}">${c}</div>
      </div>
      <div class="squad-meta-card">
        <div class="meta-label">主教練</div>
        <div class="meta-value" style="color:${r.color};font-size:15px">${i}</div>
      </div>
    </div>
    <div class="note-box">${d}</div>
    <div class="player-grid">
      ${t.map(l=>R(l,r)).join("")}
    </div>`}function U(){const s=f(),e=b(),a=e[s.homeCode],t=e[s.awayCode],o=(s.scorePredictions||[]).map((n,v)=>{const u=Number(n.prob)||0,A=Number((s.scorePredictions[0]||{}).prob)||21,k=Math.min(100,Math.round(u/A*100)),S=v===0,x=n.badge?`<span class="score-badge${S?" score-badge-best":""}">${n.badge}</span>`:"";return`<div class="score-row">
      <div class="score-val${S?" score-val-best":""}">${n.score}</div>
      <div class="score-result">${n.result}</div>
      <div class="score-bar-wrap">
        <div class="score-bar-bg"><div class="score-bar" style="width:${k}%;background:${n.color}"></div></div>
        <span class="score-pct">${u}%</span>
        ${x}
      </div>
    </div>`}).join(""),c=(s.eventPreds||[]).map(n=>`<div class="pred-card">
      <div class="pred-icon">${n.icon}</div>
      <div class="pred-value">${n.value}</div>
      <div class="pred-label">${n.label}</div>
      <div class="pred-detail">${n.detail}</div>
    </div>`).join("");let i="";const d=s.referee_data;if(d){const n=(d.stats||[]).map(v=>`<div class="ref-stat">
        <div class="ref-stat-val" style="color:${v.color}">${v.value}</div>
        <div class="ref-stat-lbl">${v.stat}</div>
      </div>`).join("");i=`<div class="ref-card">
      <div class="ref-avatar">${d.icon||"⚖️"}</div>
      <div class="ref-info">
        <div class="ref-name">${d.name}</div>
        <div class="ref-country">${d.country}</div>
        <div class="ref-stats">${n}</div>
      </div>
      <div class="ref-note">⚠️ ${d.note}</div>
    </div>`}let r="";const l=s.h2h;l&&(r=`<div class="h2h-card">
      <div class="h2h-title">${l.title}</div>
      <div class="h2h-bar">
        <div class="h2h-seg h2h-home" style="width:${l.homePct}%;background:${a.color}">${l.homeWins>0?`${a.zh} ${l.homeWins} 勝`:""}</div>
        <div class="h2h-seg h2h-draw" style="width:${l.drawPct}%;background:#374151">${l.draws>0?`${l.draws} 平`:""}</div>
        <div class="h2h-seg h2h-away" style="width:${l.awayPct}%;background:${t.color}">${l.awayWins>0?`${t.zh} ${l.awayWins} 勝`:""}</div>
      </div>
      <div class="h2h-names">
        <span>${a.flag} ${a.zh}</span><span>${t.flag} ${t.zh}</span>
      </div>
      <div class="h2h-note">${l.note}</div>
    </div>`);const m=(s.battles||[]).map(n=>`<div class="battle-card">
      <div class="battle-player">
        <div class="battle-name">${n.playerA}</div>
        <div class="battle-pos">${n.posA}</div>
      </div>
      <div class="battle-vs">VS</div>
      <div class="battle-player">
        <div class="battle-name">${n.playerB}</div>
        <div class="battle-pos">${n.posB}</div>
      </div>
      <div class="battle-desc">${n.desc}</div>
    </div>`).join("");return`
    <div class="section-title"><span class="section-dot"></span>比分預測分析</div>
    <div class="note-box">${s.oddsNote}</div>
    <div class="score-table">${o}</div>

    <div class="section-title" style="margin-top:28px"><span class="section-dot"></span>角球 · 黃牌 · 紅牌預測</div>
    <div class="pred-grid">${c}</div>

    <div class="section-title" style="margin-top:28px"><span class="section-dot"></span>裁判資訊</div>
    ${i}

    <div class="section-title" style="margin-top:28px"><span class="section-dot"></span>歷史交鋒</div>
    ${r}

    <div class="section-title" style="margin-top:28px"><span class="section-dot"></span>關鍵對決</div>
    ${m}
  `}function G(){const s=f(),e=b(),a=e[s.homeCode],t=e[s.awayCode],c=(s.scorePredictions||[])[0]||{},i=(c.result||"").includes(a.zh)?s.homeCode:s.awayCode,d=e[i],r=(s.summaryVerdict||"").split(`

`).filter(Boolean).map(v=>`<div class="summary-text">${v}</div>`).join(""),l=(s.observations||[]).map(v=>`<div class="obs-item"><strong class="obs-title">${v.title}：</strong>${v.detail}</div>`).join(""),n=[{v:"55%",l:`${a.zh}控球`,c:a.color},{v:"45%",l:`${t.zh}控球`,c:t.color},{v:(s.eventPreds[0]||{}).value||"—",l:"預測總角球",c:"#EAB308"},{v:(s.eventPreds[1]||{}).value||"—",l:"預測黃牌",c:"#EAB308"},{v:(s.eventPreds[2]||{}).value||"—",l:"預測紅牌",c:"#EF4444"}].map(v=>`<div class="summary-stat">
      <div class="summary-stat-val" style="color:${v.c}">${v.v}</div>
      <div class="summary-stat-lbl">${v.l}</div>
    </div>`).join("");return`
    <div class="section-title"><span class="section-dot"></span>賽事總結與最終預測</div>
    <div class="verdict-card">
      <div class="verdict-title">📊 預測比分</div>
      <div class="verdict-score">
        <div class="verdict-team">
          <div class="verdict-flag">${a.flag}</div>
          <div class="verdict-zh">${a.zh}</div>
        </div>
        <span class="verdict-num" style="color:${a.color}">${s.predScore.home}</span>
        <span class="verdict-dash">–</span>
        <span class="verdict-num" style="color:${t.color}">${s.predScore.away}</span>
        <div class="verdict-team">
          <div class="verdict-flag">${t.flag}</div>
          <div class="verdict-zh">${t.zh}</div>
        </div>
      </div>
      <div class="verdict-winner">${d.flag} ${d.zh}勝 · 最高可能比分 ${c.score||"—"}（${c.prob||"—"}%）</div>
      ${r}
    </div>

    <div class="summary-stats">${n}</div>

    <div class="section-title" style="margin-top:20px"><span class="section-dot"></span>關鍵觀察</div>
    ${l}
  `}const V=document.getElementById("nav"),Y=document.getElementById("hero"),J=document.getElementById("tabs"),T=document.getElementById("content");function P(){const s=g();V.innerHTML=D(),Y.innerHTML=I(),J.innerHTML=_();let e="";s.tab==="home"?e=E("home"):s.tab==="away"?e=E("away"):s.tab==="other"?e=U():s.tab==="summary"&&(e=G()),T.innerHTML=e,window.scrollTo({top:0}),Q()}function Q(){document.querySelectorAll("[data-date]").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.date,a=M().find(t=>t.dateKey===e);w({dateKey:e,matchId:a?a.id:g().matchId,tab:"home"})})}),document.querySelectorAll("[data-match]").forEach(s=>{s.addEventListener("click",()=>{w({matchId:s.dataset.match,tab:"home"})})}),document.querySelectorAll("[data-tab]").forEach(s=>{s.addEventListener("click",()=>{w({tab:s.dataset.tab})})})}async function X(){try{await N(),F(P),P()}catch(s){console.error(s),T.innerHTML=`<div style="color:#f87171;padding:40px;text-align:center">載入失敗：${s.message}</div>`}}X();
