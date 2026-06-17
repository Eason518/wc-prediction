const LANG_ORDER = ['zh', 'zh-cn', 'en', 'vi', 'th'];

export const LANG_OPTIONS = [
  { code: 'zh', label: '繁體中文' },
  { code: 'zh-cn', label: '简体中文' },
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'th', label: 'ภาษาไทย' },
];

const LANG_ATTRS = { zh: 'zh-Hant', 'zh-cn': 'zh-Hans', en: 'en', vi: 'vi', th: 'th' };

const locales = {
  zh: {
    'nav.pred': '賽事預測',
    'nav.matches': '場',

    'hero.live_score': '即時比分',
    'hero.final_score': '最終比分',
    'hero.ai_analysis': 'AI 分析',
    'hero.pred_score': '預測比分',
    'hero.win_rate': '勝率預測',
    'hero.draw': '和',
    'hero.odds': '賠率',
    'hero.cd.days_hours': (d, h) => `${d} 天 ${h} 小時後開賽`,
    'hero.cd.days': (d) => `${d} 天後開賽`,
    'hero.cd.hours': (h) => `${h} 小時後開賽`,
    'hero.cd.mins': (m) => `${m} 分鐘後開賽`,
    'hero.live': '直播',
    'hero.group': '小組',
    'hero.pred_hit': '預測命中',
    'hero.pred_miss': '預測失準',

    'tabs.summary': '🏆 總結',
    'tabs.players': '球員',
    'tabs.other': '📊 其他分析',
    'tabs.stats': '📈 即時數據',

    'stats.section.attacking': '進攻數據',
    'stats.section.distribution': '傳球數據',
    'stats.section.setplays': '定位球',
    'stats.section.discipline': '紀律',
    'stats.section.defending': '防守數據',
    'stats.possession': '控球率',
    'stats.goals': '進球',
    'stats.attempts_total': '射門',
    'stats.attempts_on': '射正',
    'stats.attempts_off': '射偏',
    'stats.passes': '傳球',
    'stats.pass_pct': '傳球成功率',
    'stats.crosses': '傳中',
    'stats.crosses_completed': '傳中成功',
    'stats.corners': '角球',
    'stats.free_kicks': '任意球',
    'stats.yellow_cards': '黃牌',
    'stats.red_cards': '紅牌',
    'stats.fouls': '犯規',
    'stats.offsides': '越位',
    'stats.forced_turnovers': '逼搶成功',
    'stats.pressing': '逼搶次數',
    'stats.line_breaks_comp': '突破防線',
    'stats.source': '數據來源：FIFA',

    'tag.starter': '首發主力',
    'tag.team': '隊內核心',
    'tag.league': '聯賽明星',
    'tag.squad': '替補',
    'tag.doubt': '⚠ 傷疑',

    'squad.title': '預測首發陣容',
    'squad.formation': '陣型',
    'squad.coach': '主教練',
    'squad.prob': '入球機率',
    'squad.prob_sub': '入球機率（上場後）',

    'other.score': '比分預測分析',
    'other.events': '角球 · 黃牌 · 紅牌預測',
    'other.referee': '裁判資訊',
    'other.h2h': '歷史交鋒',
    'other.battles': '關鍵對決',
    'battle.vs': 'VS',

    'h2h.wins': '勝',
    'h2h.draws': '平',

    'summary.title': '賽事總結與最終預測',
    'summary.pred_score': '📊 預測比分',
    'summary.wins': '勝',
    'summary.most_likely': '最高可能比分',
    'summary.corners': '預測總角球',
    'summary.yellows': '預測黃牌',
    'summary.reds': '預測紅牌',
    'summary.key_obs': '關鍵觀察',
    'summary.possession': '控球',

    'ai.title': 'AI 分析聲明',
    'ai.body': (model) => `本頁所有賽事分析、球員評分、比分預測及裁判數據，均由 <strong>${model}</strong> 根據公開資訊生成，僅供參考，不構成任何投注建議。預測結果可能與實際賽況存在差異。`,

    'error.load': '載入失敗：',

    'date.dows': ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
    'date.mons': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

    'placeholder.tbd': '待定',
    'placeholder.desc': '對陣隊伍待小組賽結束後公布，分析資料即將上線。',

    'cta.promo_bar': '🏆 AI 世界盃 2026 賽事預測',
    'cta.claim_bonus': '領取獎金 →',
    'cta.get_bonus': '領取獎金',
    'cta.hero_badge': '限時獨家優惠',
    'cta.hero_title': '用 AI 預測，贏在賠率之前',
    'cta.hero_sub': '獲取世界盃 2026 每場賽事最佳賠率',
    'cta.hero_btn': '立即領取獎金 →',
    'cta.footer_title': '準備好在世界盃 2026 大贏了嗎？',
    'cta.footer_sub': '加入數千名球迷，使用 AI 預測找到超值賠率 — 限新會員專屬歡迎禮金',
    'cta.footer_btn': '領取歡迎獎金 →',
    'cta.footer_note': '18+ · T&C 適用 · 請理性博彩',
    'cta.sponsor_pre': '本站所有賽事預測與 AI 分析資訊，由',
    'cta.sponsor_post': '12BET 贊助提供 · 18+ · 博彩有風險，請量力而為',

    'stage.group-stage': '小組賽',
    'stage.round-32': '32強',
    'stage.round-16': '16強',
    'stage.quarter-final': '8強',
    'stage.semi-final': '4強',
    'stage.third-place': '季軍賽',
    'stage.final': '決賽',
  },

  en: {
    'nav.pred': 'Predictions',
    'nav.matches': 'matches',

    'hero.live_score': 'Live Score',
    'hero.final_score': 'Final Score',
    'hero.ai_analysis': 'AI Analysis',
    'hero.pred_score': 'Predicted Score',
    'hero.win_rate': 'Win Rate',
    'hero.draw': 'Draw',
    'hero.odds': 'Odds',
    'hero.cd.days_hours': (d, h) => `Kickoff in ${d}d ${h}h`,
    'hero.cd.days': (d) => `Kickoff in ${d}d`,
    'hero.cd.hours': (h) => `Kickoff in ${h}h`,
    'hero.cd.mins': (m) => `Kickoff in ${m}m`,
    'hero.live': 'LIVE',
    'hero.group': 'GROUP',
    'hero.pred_hit': 'Prediction Hit',
    'hero.pred_miss': 'Prediction Miss',

    'tabs.summary': '🏆 Summary',
    'tabs.players': 'Players',
    'tabs.other': '📊 Analysis',
    'tabs.stats': '📈 Statistics',

    'stats.section.attacking': 'Attacking',
    'stats.section.distribution': 'Distribution',
    'stats.section.setplays': 'Set Plays',
    'stats.section.discipline': 'Discipline',
    'stats.section.defending': 'Defending',
    'stats.possession': 'Possession',
    'stats.goals': 'Goals',
    'stats.attempts_total': 'Attempts',
    'stats.attempts_on': 'On Target',
    'stats.attempts_off': 'Off Target',
    'stats.passes': 'Passes',
    'stats.pass_pct': 'Pass Accuracy',
    'stats.crosses': 'Crosses',
    'stats.crosses_completed': 'Crosses Completed',
    'stats.corners': 'Corners',
    'stats.free_kicks': 'Free Kicks',
    'stats.yellow_cards': 'Yellow Cards',
    'stats.red_cards': 'Red Cards',
    'stats.fouls': 'Fouls',
    'stats.offsides': 'Offsides',
    'stats.forced_turnovers': 'Forced Turnovers',
    'stats.pressing': 'Pressing Applied',
    'stats.line_breaks_comp': 'Line Breaks',
    'stats.source': 'Source: FIFA',

    'tag.starter': 'Starter',
    'tag.team': 'Team Core',
    'tag.league': 'League Star',
    'tag.squad': 'Bench',
    'tag.doubt': '⚠ Doubt',

    'squad.title': 'Predicted Starting XI',
    'squad.formation': 'Formation',
    'squad.coach': 'Head Coach',
    'squad.prob': 'Scoring Prob',
    'squad.prob_sub': 'Scoring Prob (sub)',

    'other.score': 'Score Prediction',
    'other.events': 'Corners · Yellows · Reds',
    'other.referee': 'Referee Info',
    'other.h2h': 'Head-to-Head',
    'other.battles': 'Key Battles',
    'battle.vs': 'VS',

    'h2h.wins': 'wins',
    'h2h.draws': 'draws',

    'summary.title': 'Match Summary & Final Prediction',
    'summary.pred_score': '📊 Predicted Score',
    'summary.wins': 'wins',
    'summary.most_likely': 'Most Likely Score',
    'summary.corners': 'Pred. Corners',
    'summary.yellows': 'Pred. Yellows',
    'summary.reds': 'Pred. Reds',
    'summary.key_obs': 'Key Observations',
    'summary.possession': 'Possession',

    'ai.title': 'AI Analysis Disclaimer',
    'ai.body': (model) => `All match analysis, player ratings, score predictions, and referee data on this page are generated by <strong>${model}</strong> based on publicly available information. For reference only — not betting advice. Predictions may differ from actual results.`,

    'error.load': 'Load failed: ',

    'date.dows': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    'date.mons': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

    'placeholder.tbd': 'TBD',
    'placeholder.desc': 'Teams will be confirmed after the group stage. Analysis coming soon.',

    'cta.promo_bar': '🏆 World Cup 2026 Predictions',
    'cta.claim_bonus': 'Claim Bonus →',
    'cta.get_bonus': 'Get Bonus',
    'cta.hero_badge': 'EXCLUSIVE OFFER',
    'cta.hero_title': 'Beat the Odds with AI Predictions',
    'cta.hero_sub': 'Get the best odds on every World Cup 2026 match',
    'cta.hero_btn': 'Get Bonus Now →',
    'cta.footer_title': 'Ready to Win on World Cup 2026?',
    'cta.footer_sub': 'Join thousands of fans using AI predictions to find value bets — exclusive welcome bonus for new members.',
    'cta.footer_btn': 'Claim Welcome Bonus →',
    'cta.footer_note': '18+ · T&Cs Apply · Please Gamble Responsibly',
    'cta.sponsor_pre': 'All predictions and AI analysis on this site are sponsored by',
    'cta.sponsor_post': '12BET · 18+ · Gamble Responsibly',

    'stage.group-stage': 'Group Stage',
    'stage.round-32': 'Round of 32',
    'stage.round-16': 'Round of 16',
    'stage.quarter-final': 'Quarter-final',
    'stage.semi-final': 'Semi-final',
    'stage.third-place': 'Third Place',
    'stage.final': 'Final',
  },

  'zh-cn': {
    'nav.pred': '赛事预测',
    'nav.matches': '场',

    'hero.live_score': '即时比分',
    'hero.final_score': '最终比分',
    'hero.ai_analysis': 'AI 分析',
    'hero.pred_score': '预测比分',
    'hero.win_rate': '胜率预测',
    'hero.draw': '平',
    'hero.odds': '赔率',
    'hero.cd.days_hours': (d, h) => `${d} 天 ${h} 小时后开赛`,
    'hero.cd.days': (d) => `${d} 天后开赛`,
    'hero.cd.hours': (h) => `${h} 小时后开赛`,
    'hero.cd.mins': (m) => `${m} 分钟后开赛`,
    'hero.live': '直播',
    'hero.group': '小组',
    'hero.pred_hit': '预测命中',
    'hero.pred_miss': '预测失准',

    'tabs.summary': '🏆 总结',
    'tabs.players': '球员',
    'tabs.other': '📊 其他分析',
    'tabs.stats': '📈 即时数据',

    'stats.section.attacking': '进攻数据',
    'stats.section.distribution': '传球数据',
    'stats.section.setplays': '定位球',
    'stats.section.discipline': '纪律',
    'stats.section.defending': '防守数据',
    'stats.possession': '控球率',
    'stats.goals': '进球',
    'stats.attempts_total': '射门',
    'stats.attempts_on': '射正',
    'stats.attempts_off': '射偏',
    'stats.passes': '传球',
    'stats.pass_pct': '传球成功率',
    'stats.crosses': '传中',
    'stats.crosses_completed': '传中成功',
    'stats.corners': '角球',
    'stats.free_kicks': '任意球',
    'stats.yellow_cards': '黄牌',
    'stats.red_cards': '红牌',
    'stats.fouls': '犯规',
    'stats.offsides': '越位',
    'stats.forced_turnovers': '逼抢成功',
    'stats.pressing': '逼抢次数',
    'stats.line_breaks_comp': '突破防线',
    'stats.source': '数据来源：FIFA',

    'tag.starter': '首发主力',
    'tag.team': '队内核心',
    'tag.league': '联赛明星',
    'tag.squad': '替补',
    'tag.doubt': '⚠ 伤疑',

    'squad.title': '预测首发阵容',
    'squad.formation': '阵型',
    'squad.coach': '主教练',
    'squad.prob': '入球概率',
    'squad.prob_sub': '入球概率（上场后）',

    'other.score': '比分预测分析',
    'other.events': '角球 · 黄牌 · 红牌预测',
    'other.referee': '裁判信息',
    'other.h2h': '历史交锋',
    'other.battles': '关键对决',
    'battle.vs': 'VS',

    'h2h.wins': '胜',
    'h2h.draws': '平',

    'summary.title': '赛事总结与最终预测',
    'summary.pred_score': '📊 预测比分',
    'summary.wins': '胜',
    'summary.most_likely': '最高可能比分',
    'summary.corners': '预测总角球',
    'summary.yellows': '预测黄牌',
    'summary.reds': '预测红牌',
    'summary.key_obs': '关键观察',
    'summary.possession': '控球',

    'ai.title': 'AI 分析声明',
    'ai.body': (model) => `本页所有赛事分析、球员评分、比分预测及裁判数据，均由 <strong>${model}</strong> 根据公开信息生成，仅供参考，不构成任何投注建议。预测结果可能与实际赛况存在差异。`,

    'error.load': '载入失败：',

    'date.dows': ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    'date.mons': ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

    'placeholder.tbd': '待定',
    'placeholder.desc': '对阵队伍将在小组赛结束后公布，分析资料即将上线。',

    'cta.promo_bar': '🏆 AI 世界杯 2026 赛事预测',
    'cta.claim_bonus': '领取奖金 →',
    'cta.get_bonus': '领取奖金',
    'cta.hero_badge': '限时独家优惠',
    'cta.hero_title': '用 AI 预测，赢在赔率之前',
    'cta.hero_sub': '获取世界杯 2026 每场赛事最佳赔率',
    'cta.hero_btn': '立即领取奖金 →',
    'cta.footer_title': '准备好在世界杯 2026 大赢了吗？',
    'cta.footer_sub': '加入数千名球迷，使用 AI 预测找到超值赔率 — 限新会员专属欢迎礼金',
    'cta.footer_btn': '领取欢迎奖金 →',
    'cta.footer_note': '18+ · T&C 适用 · 请理性博彩',
    'cta.sponsor_pre': '本站所有赛事预测与 AI 分析资讯，由',
    'cta.sponsor_post': '12BET 赞助提供 · 18+ · 博彩有风险，请量力而为',

    'stage.group-stage': '小组赛',
    'stage.round-32': '32强',
    'stage.round-16': '16强',
    'stage.quarter-final': '8强',
    'stage.semi-final': '4强',
    'stage.third-place': '季军赛',
    'stage.final': '决赛',
  },

  vi: {
    'nav.pred': 'Dự Đoán',
    'nav.matches': 'trận',

    'hero.live_score': 'Tỷ Số TT',
    'hero.final_score': 'Tỷ Số Cuối',
    'hero.ai_analysis': 'Phân Tích AI',
    'hero.pred_score': 'Dự Đoán Tỷ Số',
    'hero.win_rate': 'Tỷ Lệ Thắng',
    'hero.draw': 'Hòa',
    'hero.odds': 'Tỷ Lệ Cược',
    'hero.cd.days_hours': (d, h) => `Khai cuộc sau ${d}n ${h}g`,
    'hero.cd.days': (d) => `Khai cuộc sau ${d}n`,
    'hero.cd.hours': (h) => `Khai cuộc sau ${h}g`,
    'hero.cd.mins': (m) => `Khai cuộc sau ${m}p`,
    'hero.live': 'TRỰC TIẾP',
    'hero.group': 'BẢNG',
    'hero.pred_hit': 'Dự Đoán Đúng',
    'hero.pred_miss': 'Dự Đoán Sai',

    'tabs.summary': '🏆 Tổng Kết',
    'tabs.players': 'Cầu Thủ',
    'tabs.other': '📊 Phân Tích',
    'tabs.stats': '📈 Thống Kê',

    'stats.section.attacking': 'Tấn Công',
    'stats.section.distribution': 'Phân Phối',
    'stats.section.setplays': 'Bóng Chết',
    'stats.section.discipline': 'Kỷ Luật',
    'stats.section.defending': 'Phòng Thủ',
    'stats.possession': 'Kiểm Soát Bóng',
    'stats.goals': 'Bàn Thắng',
    'stats.attempts_total': 'Cú Sút',
    'stats.attempts_on': 'Trúng Khung',
    'stats.attempts_off': 'Trật Khung',
    'stats.passes': 'Đường Chuyền',
    'stats.pass_pct': 'Độ Chính Xác',
    'stats.crosses': 'Đường Tạt',
    'stats.crosses_completed': 'Tạt Thành Công',
    'stats.corners': 'Phạt Góc',
    'stats.free_kicks': 'Đá Phạt',
    'stats.yellow_cards': 'Thẻ Vàng',
    'stats.red_cards': 'Thẻ Đỏ',
    'stats.fouls': 'Phạm Lỗi',
    'stats.offsides': 'Việt Vị',
    'stats.forced_turnovers': 'Cướp Bóng',
    'stats.pressing': 'Pressing',
    'stats.line_breaks_comp': 'Phá Vỡ Hàng Thủ',
    'stats.source': 'Nguồn: FIFA',

    'tag.starter': 'Chính Thức',
    'tag.team': 'Cốt Lõi',
    'tag.league': 'Ngôi Sao',
    'tag.squad': 'Dự Bị',
    'tag.doubt': '⚠ Nghi Ngờ',

    'squad.title': 'Đội Hình Dự Kiến',
    'squad.formation': 'Sơ Đồ',
    'squad.coach': 'Huấn Luyện Viên',
    'squad.prob': 'Xác Suất Ghi Bàn',
    'squad.prob_sub': 'Xác Suất Ghi Bàn (vào sân)',

    'other.score': 'Phân Tích Tỷ Số',
    'other.events': 'Phạt Góc · Thẻ Vàng · Thẻ Đỏ',
    'other.referee': 'Thông Tin Trọng Tài',
    'other.h2h': 'Lịch Sử Đối Đầu',
    'other.battles': 'Đối Kháng Chính',
    'battle.vs': 'VS',

    'h2h.wins': 'thắng',
    'h2h.draws': 'hòa',

    'summary.title': 'Tổng Kết & Dự Đoán Cuối',
    'summary.pred_score': '📊 Tỷ Số Dự Đoán',
    'summary.wins': 'thắng',
    'summary.most_likely': 'Tỷ Số Khả Năng Cao',
    'summary.corners': 'Phạt Góc Dự Đoán',
    'summary.yellows': 'Thẻ Vàng Dự Đoán',
    'summary.reds': 'Thẻ Đỏ Dự Đoán',
    'summary.key_obs': 'Quan Sát Chính',
    'summary.possession': 'Kiểm Soát Bóng',

    'ai.title': 'Tuyên Bố Phân Tích AI',
    'ai.body': (model) => `Tất cả phân tích trận đấu, đánh giá cầu thủ, dự đoán tỷ số và dữ liệu trọng tài trên trang này được tạo bởi <strong>${model}</strong> dựa trên thông tin công khai. Chỉ để tham khảo — không phải lời khuyên cá cược. Dự đoán có thể khác với kết quả thực tế.`,

    'error.load': 'Tải thất bại: ',

    'date.dows': ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    'date.mons': ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],

    'placeholder.tbd': 'Chờ xác nhận',
    'placeholder.desc': 'Các đội thi đấu sẽ được xác nhận sau vòng bảng. Phân tích sắp có.',

    'cta.promo_bar': '🏆 Dự đoán AI World Cup 2026',
    'cta.claim_bonus': 'Nhận Thưởng →',
    'cta.get_bonus': 'Nhận Thưởng',
    'cta.hero_badge': 'ƯU ĐÃI ĐỘC QUYỀN',
    'cta.hero_title': 'Chiến Thắng Tỷ Lệ Cược với AI',
    'cta.hero_sub': 'Nhận tỷ lệ cược tốt nhất cho mọi trận World Cup 2026',
    'cta.hero_btn': 'Nhận Thưởng Ngay →',
    'cta.footer_title': 'Sẵn Sàng Thắng Lớn World Cup 2026?',
    'cta.footer_sub': 'Cùng hàng nghìn fan bóng đá dùng AI dự đoán tìm cược giá trị — thưởng chào mừng dành cho thành viên mới.',
    'cta.footer_btn': 'Nhận Thưởng Chào Mừng →',
    'cta.footer_note': '18+ · T&Cs Áp Dụng · Hãy Cá Cược Có Trách Nhiệm',
    'cta.sponsor_pre': 'Tất cả dự đoán và phân tích AI trên trang này được tài trợ bởi',
    'cta.sponsor_post': '12BET · 18+ · Hãy cá cược có trách nhiệm',

    'stage.group-stage': 'Vòng Bảng',
    'stage.round-32': 'Vòng 32',
    'stage.round-16': 'Vòng 16',
    'stage.quarter-final': 'Tứ Kết',
    'stage.semi-final': 'Bán Kết',
    'stage.third-place': 'Tranh Hạng Ba',
    'stage.final': 'Chung Kết',
  },

  th: {
    'nav.pred': 'ทำนายผล',
    'nav.matches': 'นัด',

    'hero.live_score': 'สกอร์สด',
    'hero.final_score': 'ผลสุดท้าย',
    'hero.ai_analysis': 'วิเคราะห์ AI',
    'hero.pred_score': 'ทำนายสกอร์',
    'hero.win_rate': 'โอกาสชนะ',
    'hero.draw': 'เสมอ',
    'hero.odds': 'ราคาต่อรอง',
    'hero.cd.days_hours': (d, h) => `เตะใน ${d}ว ${h}ชม`,
    'hero.cd.days': (d) => `เตะใน ${d}ว`,
    'hero.cd.hours': (h) => `เตะใน ${h}ชม`,
    'hero.cd.mins': (m) => `เตะใน ${m}น`,
    'hero.live': 'สด',
    'hero.group': 'กลุ่ม',
    'hero.pred_hit': 'ทำนายถูก',
    'hero.pred_miss': 'ทำนายผิด',

    'tabs.summary': '🏆 สรุป',
    'tabs.players': 'นักเตะ',
    'tabs.other': '📊 วิเคราะห์',
    'tabs.stats': '📈 สถิติ',

    'stats.section.attacking': 'การบุก',
    'stats.section.distribution': 'การส่งบอล',
    'stats.section.setplays': 'เซ็ตพีซ',
    'stats.section.discipline': 'วินัย',
    'stats.section.defending': 'การป้องกัน',
    'stats.possession': 'ครองบอล',
    'stats.goals': 'ประตู',
    'stats.attempts_total': 'การยิง',
    'stats.attempts_on': 'ยิงตรงเป้า',
    'stats.attempts_off': 'ยิงไม่ตรงเป้า',
    'stats.passes': 'การส่ง',
    'stats.pass_pct': 'ความแม่นยำ',
    'stats.crosses': 'ครอส',
    'stats.crosses_completed': 'ครอสสำเร็จ',
    'stats.corners': 'เตะมุม',
    'stats.free_kicks': 'เตะฟรีคิก',
    'stats.yellow_cards': 'ใบเหลือง',
    'stats.red_cards': 'ใบแดง',
    'stats.fouls': 'ฟาวล์',
    'stats.offsides': 'ล้ำหน้า',
    'stats.forced_turnovers': 'บังคับเสียบอล',
    'stats.pressing': 'กดดัน',
    'stats.line_breaks_comp': 'ทะลวงแนวรับ',
    'stats.source': 'ที่มา: FIFA',

    'tag.starter': 'ตัวจริง',
    'tag.team': 'แกนทีม',
    'tag.league': 'ดาวลีก',
    'tag.squad': 'สำรอง',
    'tag.doubt': '⚠ ไม่แน่นอน',

    'squad.title': 'ทีมตัวจริงที่ทำนาย',
    'squad.formation': 'รูปแบบ',
    'squad.coach': 'ผู้ฝึกสอน',
    'squad.prob': 'โอกาสยิง',
    'squad.prob_sub': 'โอกาสยิง (หลังลงสนาม)',

    'other.score': 'วิเคราะห์สกอร์',
    'other.events': 'เตะมุม · ใบเหลือง · ใบแดง',
    'other.referee': 'ข้อมูลกรรมการ',
    'other.h2h': 'ประวัติพบกัน',
    'other.battles': 'คู่ปะทะสำคัญ',
    'battle.vs': 'VS',

    'h2h.wins': 'ชนะ',
    'h2h.draws': 'เสมอ',

    'summary.title': 'สรุปและทำนายสุดท้าย',
    'summary.pred_score': '📊 สกอร์ที่ทำนาย',
    'summary.wins': 'ชนะ',
    'summary.most_likely': 'สกอร์ที่น่าจะเป็น',
    'summary.corners': 'เตะมุมที่ทำนาย',
    'summary.yellows': 'ใบเหลืองที่ทำนาย',
    'summary.reds': 'ใบแดงที่ทำนาย',
    'summary.key_obs': 'ข้อสังเกตสำคัญ',
    'summary.possession': 'ครองบอล',

    'ai.title': 'ประกาศการวิเคราะห์ AI',
    'ai.body': (model) => `การวิเคราะห์แมตช์ คะแนนนักเตะ ทำนายสกอร์ และข้อมูลกรรมการทั้งหมดในหน้านี้ถูกสร้างโดย <strong>${model}</strong> จากข้อมูลสาธารณะ เพื่อการอ้างอิงเท่านั้น — ไม่ใช่คำแนะนำการพนัน ผลทำนายอาจแตกต่างจากความเป็นจริง`,

    'error.load': 'โหลดล้มเหลว: ',

    'date.dows': ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
    'date.mons': ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],

    'placeholder.tbd': 'รอประกาศ',
    'placeholder.desc': 'ทีมจะประกาศหลังรอบแบ่งกลุ่ม การวิเคราะห์จะเพิ่มเร็วๆ นี้',

    'cta.promo_bar': '🏆 ทำนายฟุตบอล World Cup 2026 ด้วย AI',
    'cta.claim_bonus': 'รับโบนัส →',
    'cta.get_bonus': 'รับโบนัส',
    'cta.hero_badge': 'ข้อเสนอพิเศษ',
    'cta.hero_title': 'เอาชนะราคาต่อรองด้วย AI',
    'cta.hero_sub': 'รับราคาต่อรองดีที่สุดในทุกนัด World Cup 2026',
    'cta.hero_btn': 'รับโบนัสเลย →',
    'cta.footer_title': 'พร้อมชนะ World Cup 2026 แล้วหรือยัง?',
    'cta.footer_sub': 'ร่วมกับแฟนบอลหลายพันคน ใช้ AI ทำนายหาพนันคุ้มค่า — โบนัสต้อนรับสำหรับสมาชิกใหม่',
    'cta.footer_btn': 'รับโบนัสต้อนรับ →',
    'cta.footer_note': '18+ · เงื่อนไขใช้บังคับ · โปรดพนันอย่างรับผิดชอบ',
    'cta.sponsor_pre': 'การทำนายและการวิเคราะห์ AI ทั้งหมดบนเว็บไซต์นี้ได้รับการสนับสนุนโดย',
    'cta.sponsor_post': '12BET · 18+ · โปรดพนันอย่างรับผิดชอบ',

    'stage.group-stage': 'รอบแบ่งกลุ่ม',
    'stage.round-32': 'รอบ 32 ทีม',
    'stage.round-16': 'รอบ 16 ทีม',
    'stage.quarter-final': 'รอบก่อนรองฯ',
    'stage.semi-final': 'รอบรองชนะเลิศ',
    'stage.third-place': 'ชิงอันดับ 3',
    'stage.final': 'รอบชิงชนะเลิศ',
  },
};

const LANG_LABELS = { zh: '繁中', 'zh-cn': '简中', en: 'EN', vi: 'VI', th: 'TH' };

function detectBrowserLang() {
  const supported = Object.keys(LANG_ATTRS); // ['zh', 'zh-cn', 'en', 'vi', 'th']
  for (const nav of navigator.languages ?? [navigator.language]) {
    const lower = nav.toLowerCase();
    if (lower === 'zh-tw' || lower === 'zh-hant') return 'zh';
    if (lower === 'zh-cn' || lower === 'zh-hans' || lower === 'zh') return 'zh-cn';
    const base = lower.split('-')[0];
    if (supported.includes(base)) return base;
  }
  return 'en';
}

let currentLang = localStorage.getItem('wc-lang') ?? detectBrowserLang();
let langListeners = [];

export function getLang() { return currentLang; }

export function getNextLang() {
  const idx = LANG_ORDER.indexOf(currentLang);
  return LANG_ORDER[(idx + 1) % LANG_ORDER.length];
}

export function getNextLangLabel() {
  return LANG_LABELS[getNextLang()];
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('wc-lang', lang);
  document.documentElement.lang = LANG_ATTRS[lang] || lang;
  langListeners.forEach(fn => fn(lang));
}

export function onLangChange(fn) {
  langListeners.push(fn);
  return () => { langListeners = langListeners.filter(l => l !== fn); };
}

export function t(key, ...args) {
  const val = locales[currentLang]?.[key] ?? locales.zh[key];
  if (typeof val === 'function') return val(...args);
  return val ?? key;
}

// Initialize lang attribute on load
document.documentElement.lang = LANG_ATTRS[currentLang] || currentLang;
