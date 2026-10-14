// 个人信息集中在这里修改
export const site = {
  name: '苏振坤',
  nameEn: 'Zhenkun Su',
  // 在作者列表中加粗自己的名字
  selfNames: ['苏振坤', 'Zhenkun Su'],
  title: '对外经济贸易大学国际经济贸易学院 · 博士研究生',
  titleEn: 'PhD Student, School of International Trade and Economics, UIBE',
  tagline: '用数据，读懂制度如何塑造市场。',
  taglineEn: 'Understanding how institutions shape markets, with evidence.',
  email: 'zhenkunsu989699@gmail.com',
  links: [
    { label: 'Google Scholar', href: '' },
    { label: 'ORCID', href: '' },
    { label: 'GitHub', href: '' },
  ],
  interests: ['法经济学', '公司信息披露', '制度经济学', '产业链与供应链韧性', '政策评估'],
  interestsEn: ['Law and Economics', 'Corporate Disclosure', 'Institutional Economics', 'Supply-Chain Resilience', 'Policy Evaluation'],
};

export const nav = [
  { href: '/', zh: '首页', en: 'Home' },
  { href: '/research/', zh: '研究', en: 'Research' },
  { href: '/notes/', zh: '随笔', en: 'Notes' },
  { href: '/about/', zh: '关于', en: 'About' },
];

// 研究主题：首页卡片，对应论文 id（src/content/papers 下的文件名）
export const themes = [
  {
    key: 'judicial',
    eyebrow: '司法改革 · 信息披露',
    title: '更好的法院，\n更透明的企业。',
    desc: '法官员额制改革如何通过司法知识的数量、质量与权威，提升上市公司信息透明度。',
    paper: 'quota-of-judges-transparency',
  },
  {
    key: 'port',
    eyebrow: '制度型开放 · 区域创新',
    title: '开放的规则，\n高质量的创新。',
    desc: '自由贸易试验区设立对 286 个城市创新质量的影响，以及向邻近城市的空间溢出。',
    paper: 'ftz-innovation-quality',
  },
  {
    key: 'data',
    eyebrow: '数据要素 · 产业链韧性',
    title: '流动的数据，\n更韧的链条。',
    desc: '数据交易平台设立如何通过数字能力、技术多样性与营运资本弹性增强产业链韧性。',
    paper: 'data-market-chain-resilience',
  },
] as const;

// 图片来源（Unsplash License，可免费商用）
export const credits = [
  { what: '法院建筑', who: 'Nathan Cima', href: 'https://unsplash.com/photos/L89SN03SJK8' },
  { what: '夜间港口', who: 'Timelab', href: 'https://unsplash.com/photos/sWOvgOOFk1g' },
  { what: '数据网络', who: 'Max Petrunin', href: 'https://unsplash.com/photos/KKx5r-w1dPo' },
  { what: '图书馆', who: 'Zoshua Colah', href: 'https://unsplash.com/photos/bz4vI87iRQc' },
  { what: '北京夜景', who: 'Yuhan Wang', href: 'https://unsplash.com/photos/wTtUrr7PNoM' },
];
