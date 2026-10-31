export type VoiceProfile = 'nightingale' | 'wren' | 'cuckoo' | 'skylark' | 'great-tit' | 'hwamei'
export type Ambience = 'forest' | 'wetland' | 'open' | 'urban' | 'mountain'
export type Season = '春季' | '夏季' | '秋季' | '冬季'

export const HABITATS = ['温带森林', '林缘灌丛', '湿地', '草原', '山地', '城市园林', '竹林'] as const
export type Habitat = (typeof HABITATS)[number]

export const SEASONS: Season[] = ['春季', '夏季', '秋季', '冬季']

export const AMBIENCE_LABELS: Record<Ambience, string> = {
  forest: '森林回响',
  wetland: '水岸低噪',
  open: '开阔微风',
  urban: '城市底噪',
  mountain: '山谷风声',
}

export const VOICE_PROFILES: { value: VoiceProfile; label: string }[] = [
  { value: 'nightingale', label: '夜莺型 · 重复音与长哨音' },
  { value: 'wren', label: '鹪鹩型 · 高速颤音' },
  { value: 'cuckoo', label: '杜鹃型 · 双音节鸣叫' },
  { value: 'skylark', label: '云雀型 · 连续飞鸣' },
  { value: 'great-tit', label: '山雀型 · 节律双音' },
  { value: 'hwamei', label: '画眉型 · 婉转哨音' },
]

export interface Species {
  id: string
  slug: string
  nameZh: string
  nameEn: string
  scientificName: string
  family: string
  image: string
  description: string
  voiceNote: string
  voiceProfile: VoiceProfile
}

export interface Recording {
  id: string
  speciesId: string
  title: string
  country: string
  region: string
  lat?: number
  lng?: number
  date: string
  time: string
  season: Season
  habitat: Habitat
  environment: string
  ambience: Ambience
  duration: number
  source: {
    kind: 'audio' | 'video'
    recordist: string
    equipment: string
    reference: string
  }
  description: string
  published: boolean
  seed: number
  pitch: number
  tempo: number
  mediaUrl?: string
  mediaName?: string
  videoUrl?: string
  videoName?: string
}

export const RECORDING_COLORS = ['#8fe3b0', '#e8c27a', '#8cc8e8', '#e89a8c', '#c3a8e8', '#d8e88c']

export const species: Species[] = [
  {
    id: 'sp-nightingale',
    slug: 'common-nightingale',
    nameZh: '新疆歌鸲',
    nameEn: 'Common Nightingale',
    scientificName: 'Luscinia megarhynchos',
    family: '鹟科 Muscicapidae',
    image: '/images/birds/nightingale.png',
    description:
      '欧洲文学中最著名的歌者。外表朴素，却拥有超过两百种乐句，常在夜色与黎明之间整夜歌唱。',
    voiceNote: '城市个体会提高音量与音高以穿透噪声，乡野个体的长哨音则更为舒缓。',
    voiceProfile: 'nightingale',
  },
  {
    id: 'sp-wren',
    slug: 'eurasian-wren',
    nameZh: '鹪鹩',
    nameEn: 'Eurasian Wren',
    scientificName: 'Troglodytes troglodytes',
    family: '鹪鹩科 Troglodytidae',
    image: '/images/birds/wren.png',
    description: '体重不足十克，鸣声却响亮得惊人。高速颤音在苔藓与倒木之间回荡，是森林底层的号角。',
    voiceNote: '日本北海道亚种的颤音段落更长，而威尔士山地个体的乐句更短促、更高亢。',
    voiceProfile: 'wren',
  },
  {
    id: 'sp-cuckoo',
    slug: 'common-cuckoo',
    nameZh: '大杜鹃',
    nameEn: 'Common Cuckoo',
    scientificName: 'Cuculus canorus',
    family: '杜鹃科 Cuculidae',
    image: '/images/birds/cuckoo.png',
    description: '“布谷、布谷”——横跨欧亚大陆的春之信使。每年往返于非洲越冬地与北方繁殖地之间。',
    voiceNote: '双音节的音程在不同地区略有差异，草原个体的叫声在开阔地带传播得更远。',
    voiceProfile: 'cuckoo',
  },
  {
    id: 'sp-skylark',
    slug: 'eurasian-skylark',
    nameZh: '云雀',
    nameEn: 'Eurasian Skylark',
    scientificName: 'Alauda arvensis',
    family: '百灵科 Alaudidae',
    image: '/images/birds/skylark.png',
    description: '一边垂直升空一边歌唱，连续鸣唱可长达数分钟。它的歌声是开阔草地上最明亮的声音。',
    voiceNote: '十九世纪被引入新西兰的种群，在南半球的春天里发展出了更简化的乐句结构。',
    voiceProfile: 'skylark',
  },
  {
    id: 'sp-great-tit',
    slug: 'great-tit',
    nameZh: '大山雀',
    nameEn: 'Great Tit',
    scientificName: 'Parus major',
    family: '山雀科 Paridae',
    image: '/images/birds/great-tit.png',
    description: '“tea-cher, tea-cher”的节律双音辨识度极高。它是鸟类声学与城市生态研究中最常被研究的物种之一。',
    voiceNote: '研究发现城市大山雀的鸣唱速度更快、最低音更高，以避开交通噪声的低频段。',
    voiceProfile: 'great-tit',
  },
  {
    id: 'sp-hwamei',
    slug: 'chinese-hwamei',
    nameZh: '画眉',
    nameEn: 'Chinese Hwamei',
    scientificName: 'Garrulax canorus',
    family: '噪鹛科 Leiothrichidae',
    image: '/images/birds/hwamei.png',
    description: '白色眼圈如同细细描画的眉线。在中国南方的竹林与灌丛中，它的歌声婉转多变，善于模仿。',
    voiceNote: '竹林中的画眉偏好中高频哨音，而城市公园个体常夹杂对周围鸟种的模仿。',
    voiceProfile: 'hwamei',
  },
]

export const recordings: Recording[] = [
  {
    id: 'rec-001',
    speciesId: 'sp-nightingale',
    title: '萨福克林缘的黎明合唱',
    country: '英国',
    region: '萨福克 Suffolk',
    lat: 52.19,
    lng: 1.52,
    date: '2025-05-02',
    time: '04:52',
    season: '春季',
    habitat: '林缘灌丛',
    environment: '黎明前 · 微风 · 远处有溪流',
    ambience: 'forest',
    duration: 18,
    source: { kind: 'audio', recordist: 'M. Hollis', equipment: 'Sound Devices MixPre-3 + Telinga 抛物面', reference: 'BS-ATL-0001' },
    description: '雄鸟在灌丛深处持续鸣唱，长哨音之后紧接密集的重复音节，是典型的乡野乐句。',
    published: true,
    seed: 11,
    pitch: 1,
    tempo: 0.9,
  },
  {
    id: 'rec-002',
    speciesId: 'sp-nightingale',
    title: '普罗旺斯的夜曲',
    country: '法国',
    region: '普罗旺斯 Provence',
    lat: 43.94,
    lng: 5.18,
    date: '2025-04-21',
    time: '23:15',
    season: '春季',
    habitat: '林缘灌丛',
    environment: '深夜 · 无风 · 远处有蛙鸣',
    ambience: 'wetland',
    duration: 20,
    source: { kind: 'audio', recordist: 'C. Laurent', equipment: 'Zoom F3 + Sennheiser ME66', reference: 'BS-ATL-0002' },
    description: '午夜时分的独唱，乐句间隔更长，长哨音的渐强段落尤为突出。',
    published: true,
    seed: 23,
    pitch: 0.95,
    tempo: 0.8,
  },
  {
    id: 'rec-003',
    speciesId: 'sp-nightingale',
    title: '塞维利亚城市公园',
    country: '西班牙',
    region: '安达卢西亚 · 塞维利亚',
    lat: 37.38,
    lng: -5.98,
    date: '2025-04-10',
    time: '06:30',
    season: '春季',
    habitat: '城市园林',
    environment: '清晨 · 交通底噪明显',
    ambience: 'urban',
    duration: 15,
    source: { kind: 'video', recordist: 'Bird Symphony 社区 · L. Ortega', equipment: 'iPhone 16 Pro 视频音轨', reference: 'BS-VID-0107' },
    description: '从观鸟视频中提取的音轨。城市个体音高明显偏高，节奏也更紧凑。',
    published: true,
    seed: 37,
    pitch: 1.12,
    tempo: 1.15,
  },
  {
    id: 'rec-004',
    speciesId: 'sp-nightingale',
    title: '卡赫季河岸林',
    country: '格鲁吉亚',
    region: '卡赫季 Kakheti',
    lat: 41.92,
    lng: 45.81,
    date: '2024-05-14',
    time: '05:10',
    season: '春季',
    habitat: '湿地',
    environment: '黎明 · 河水流动',
    ambience: 'wetland',
    duration: 16,
    source: { kind: 'audio', recordist: 'N. Beridze', equipment: 'Tascam DR-40X', reference: 'BS-ATL-0004' },
    description: '高加索地区的种群，重复音节的数量更多，是一段尚在整理中的录音。',
    published: false,
    seed: 41,
    pitch: 1.03,
    tempo: 1,
  },
  {
    id: 'rec-005',
    speciesId: 'sp-wren',
    title: '斯诺登尼亚山谷',
    country: '英国',
    region: '威尔士 · 斯诺登尼亚',
    lat: 53.07,
    lng: -3.9,
    date: '2025-04-03',
    time: '07:05',
    season: '春季',
    habitat: '山地',
    environment: '清晨 · 山风 · 石墙边',
    ambience: 'mountain',
    duration: 14,
    source: { kind: 'audio', recordist: 'G. Price', equipment: 'Sound Devices MixPre-6 + Rode NTG5', reference: 'BS-ATL-0011' },
    description: '短促而高亢的乐句，在岩石与石墙之间形成清晰回声。',
    published: true,
    seed: 53,
    pitch: 1.08,
    tempo: 1.1,
  },
  {
    id: 'rec-006',
    speciesId: 'sp-wren',
    title: '北海道针阔混交林',
    country: '日本',
    region: '北海道 · 札幌近郊',
    lat: 43.06,
    lng: 141.35,
    date: '2024-06-08',
    time: '04:20',
    season: '夏季',
    habitat: '温带森林',
    environment: '黎明 · 湿润 · 林下溪流',
    ambience: 'forest',
    duration: 19,
    source: { kind: 'audio', recordist: 'H. Sato', equipment: 'Zoom F6 + Telinga 抛物面', reference: 'BS-ATL-0012' },
    description: '东亚亚种的颤音段落更长，在潮湿的林下空间中显得饱满悠长。',
    published: true,
    seed: 61,
    pitch: 0.96,
    tempo: 0.85,
  },
  {
    id: 'rec-007',
    speciesId: 'sp-wren',
    title: '比亚沃维耶扎原始森林',
    country: '波兰',
    region: '比亚沃维耶扎 Białowieża',
    lat: 52.7,
    lng: 23.85,
    date: '2025-05-11',
    time: '05:45',
    season: '春季',
    habitat: '温带森林',
    environment: '清晨 · 古老阔叶林 · 啄木鸟敲击声',
    ambience: 'forest',
    duration: 16,
    source: { kind: 'video', recordist: 'A. Nowak', equipment: 'Sony FX30 视频 + 枪式麦克风', reference: 'BS-VID-0118' },
    description: '在欧洲最后的低地原始森林中拍摄，雄鸟站在倒木上反复鸣唱。',
    published: true,
    seed: 67,
    pitch: 1,
    tempo: 1,
  },
  {
    id: 'rec-008',
    speciesId: 'sp-cuckoo',
    title: '呼伦贝尔草原',
    country: '中国',
    region: '内蒙古 · 呼伦贝尔',
    lat: 49.21,
    lng: 119.76,
    date: '2025-06-02',
    time: '05:20',
    season: '夏季',
    habitat: '草原',
    environment: '清晨 · 开阔草原 · 远处牛羊',
    ambience: 'open',
    duration: 18,
    source: { kind: 'audio', recordist: '乌云其其格', equipment: 'Zoom H6 + Sennheiser MKH416', reference: 'BS-ATL-0021' },
    description: '在开阔的草原上，叫声传播距离极远，音程清晰稳定。',
    published: true,
    seed: 71,
    pitch: 1,
    tempo: 1,
  },
  {
    id: 'rec-009',
    speciesId: 'sp-cuckoo',
    title: '巴伐利亚高山牧场',
    country: '德国',
    region: '巴伐利亚 · 加米施',
    lat: 47.49,
    lng: 11.1,
    date: '2025-05-18',
    time: '06:10',
    season: '春季',
    habitat: '山地',
    environment: '清晨 · 山谷回声 · 牛铃',
    ambience: 'mountain',
    duration: 16,
    source: { kind: 'video', recordist: 'J. Weber', equipment: 'Canon R6 视频音轨', reference: 'BS-VID-0125' },
    description: '山谷之间的回声让每一声“布谷”都拥有柔和的尾音。',
    published: true,
    seed: 79,
    pitch: 0.94,
    tempo: 0.9,
  },
  {
    id: 'rec-010',
    speciesId: 'sp-cuckoo',
    title: '贝加尔湖畔湿地',
    country: '俄罗斯',
    region: '布里亚特 · 贝加尔湖',
    lat: 53.5,
    lng: 108.2,
    date: '2024-06-15',
    time: '04:40',
    season: '夏季',
    habitat: '湿地',
    environment: '黎明 · 湖岸 · 轻微水浪',
    ambience: 'wetland',
    duration: 14,
    source: { kind: 'audio', recordist: 'D. Ivanov', equipment: 'Tascam DR-100MKIII', reference: 'BS-ATL-0023' },
    description: '湖岸桦树林中的雄鸟，叫声节奏略快，偶尔出现三连音。',
    published: true,
    seed: 83,
    pitch: 1.05,
    tempo: 1.15,
  },
  {
    id: 'rec-011',
    speciesId: 'sp-skylark',
    title: '威尔特郡丘陵草地',
    country: '英国',
    region: '威尔特郡 Wiltshire',
    lat: 51.17,
    lng: -1.83,
    date: '2025-05-24',
    time: '07:30',
    season: '春季',
    habitat: '草原',
    environment: '上午 · 阳光 · 微风拂草',
    ambience: 'open',
    duration: 20,
    source: { kind: 'audio', recordist: 'R. Ashdown', equipment: 'Sound Devices MixPre-3 + 立体声对', reference: 'BS-ATL-0031' },
    description: '升空鸣唱的完整片段，连续不断的颤鸣如同从天空倾泻而下。',
    published: true,
    seed: 89,
    pitch: 1,
    tempo: 1,
  },
  {
    id: 'rec-012',
    speciesId: 'sp-skylark',
    title: '坎特伯雷平原',
    country: '新西兰',
    region: '坎特伯雷 Canterbury',
    lat: -43.53,
    lng: 172.04,
    date: '2024-10-18',
    time: '08:15',
    season: '春季',
    habitat: '草原',
    environment: '南半球春季 · 农田 · 风较大',
    ambience: 'open',
    duration: 17,
    source: { kind: 'audio', recordist: 'K. Tane', equipment: 'Zoom F3 + Rode NTG4', reference: 'BS-ATL-0032' },
    description: '引入种群的鸣唱，乐句更简化、重复度更高，是声音“方言”的生动例证。',
    published: true,
    seed: 97,
    pitch: 0.92,
    tempo: 0.85,
  },
  {
    id: 'rec-013',
    speciesId: 'sp-skylark',
    title: '皮卡第麦田',
    country: '法国',
    region: '皮卡第 Picardie',
    lat: 49.9,
    lng: 2.3,
    date: '2025-06-20',
    time: '06:00',
    season: '夏季',
    habitat: '草原',
    environment: '清晨 · 麦田 · 远处拖拉机',
    ambience: 'urban',
    duration: 15,
    source: { kind: 'video', recordist: 'Bird Symphony 社区 · É. Martin', equipment: 'DJI Pocket 3 视频音轨', reference: 'BS-VID-0131' },
    description: '农业景观中的鸣唱，背景中可听到人类活动的低频声。',
    published: true,
    seed: 101,
    pitch: 1.06,
    tempo: 1.1,
  },
  {
    id: 'rec-014',
    speciesId: 'sp-great-tit',
    title: '牛津威瑟姆森林',
    country: '英国',
    region: '牛津 · Wytham Woods',
    lat: 51.77,
    lng: -1.33,
    date: '2025-03-12',
    time: '06:40',
    season: '春季',
    habitat: '温带森林',
    environment: '早春清晨 · 阔叶林 · 宁静',
    ambience: 'forest',
    duration: 15,
    source: { kind: 'audio', recordist: 'S. Whitfield', equipment: 'Sound Devices MixPre-6 + Telinga', reference: 'BS-ATL-0041' },
    description: '长期鸟类研究样地中的雄鸟，节奏舒缓，低音丰满。',
    published: true,
    seed: 103,
    pitch: 0.95,
    tempo: 0.85,
  },
  {
    id: 'rec-015',
    speciesId: 'sp-great-tit',
    title: '柏林蒂尔加滕公园',
    country: '德国',
    region: '柏林 Tiergarten',
    lat: 52.51,
    lng: 13.36,
    date: '2025-03-28',
    time: '07:20',
    season: '春季',
    habitat: '城市园林',
    environment: '早高峰 · 交通噪声 · 人声',
    ambience: 'urban',
    duration: 14,
    source: { kind: 'video', recordist: 'Bird Symphony 社区 · F. Krüger', equipment: 'Pixel 9 视频音轨', reference: 'BS-VID-0140' },
    description: '城市个体的鸣唱速度更快，最低音明显上移，以避开交通噪声。',
    published: true,
    seed: 107,
    pitch: 1.12,
    tempo: 1.25,
  },
  {
    id: 'rec-016',
    speciesId: 'sp-great-tit',
    title: '赫尔辛基冬末',
    country: '芬兰',
    region: '赫尔辛基 Helsinki',
    lat: 60.19,
    lng: 24.92,
    date: '2025-02-20',
    time: '08:50',
    season: '冬季',
    habitat: '城市园林',
    environment: '冬末 · 积雪 · 空气清冷',
    ambience: 'open',
    duration: 13,
    source: { kind: 'audio', recordist: 'E. Virtanen', equipment: 'Zoom H5', reference: 'BS-ATL-0043' },
    description: '积雪吸收了大部分环境声，鸣唱显得格外干净、清脆。',
    published: true,
    seed: 109,
    pitch: 1.04,
    tempo: 1,
  },
  {
    id: 'rec-017',
    speciesId: 'sp-hwamei',
    title: '武夷山竹海',
    country: '中国',
    region: '福建 · 武夷山',
    lat: 27.72,
    lng: 117.68,
    date: '2025-04-16',
    time: '06:05',
    season: '春季',
    habitat: '竹林',
    environment: '清晨 · 竹叶沙沙 · 山溪',
    ambience: 'forest',
    duration: 18,
    source: { kind: 'audio', recordist: '林知远', equipment: 'Zoom F6 + Sennheiser MKH416', reference: 'BS-ATL-0051' },
    description: '竹林深处的长段鸣唱，中高频哨音一气呵成，转折圆润。',
    published: true,
    seed: 113,
    pitch: 1,
    tempo: 0.95,
  },
  {
    id: 'rec-018',
    speciesId: 'sp-hwamei',
    title: '鼎湖山季风常绿林',
    country: '中国',
    region: '广东 · 肇庆鼎湖山',
    lat: 23.17,
    lng: 112.54,
    date: '2024-05-03',
    time: '05:50',
    season: '春季',
    habitat: '温带森林',
    environment: '雨后清晨 · 湿润 · 鸟浪丰富',
    ambience: 'forest',
    duration: 16,
    source: { kind: 'video', recordist: '陈曦', equipment: 'Sony A7S III 视频 + 外接麦克风', reference: 'BS-VID-0152' },
    description: '雨后的常绿阔叶林中，画眉与其他鸟种交替鸣唱。',
    published: true,
    seed: 127,
    pitch: 0.97,
    tempo: 1.05,
  },
  {
    id: 'rec-019',
    speciesId: 'sp-hwamei',
    title: '杭州西湖孤山',
    country: '中国',
    region: '浙江 · 杭州',
    lat: 30.25,
    lng: 120.15,
    date: '2025-09-27',
    time: '07:10',
    season: '秋季',
    habitat: '城市园林',
    environment: '秋日清晨 · 游人渐多 · 湖面微风',
    ambience: 'urban',
    duration: 14,
    source: { kind: 'audio', recordist: 'Bird Symphony 社区 · 周宁', equipment: 'Tascam DR-05X', reference: 'BS-ATL-0053' },
    description: '城市公园个体，乐句中夹杂对白头鹎等鸟种的模仿。',
    published: true,
    seed: 131,
    pitch: 1.08,
    tempo: 1.15,
  },
]

export function getSpeciesBySlug(slug: string) {
  return species.find((s) => s.slug === slug)
}

export function getPublishedRecordings(speciesId: string, list: Recording[] = recordings) {
  return list.filter((r) => r.speciesId === speciesId && r.published)
}

export function formatDuration(seconds: number) {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function formatCoords(lat?: number, lng?: number) {
  if (lat === undefined || lng === undefined) return '坐标未记录'
  const ns = lat >= 0 ? 'N' : 'S'
  const ew = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(2)}° ${ns}, ${Math.abs(lng).toFixed(2)}° ${ew}`
}

export function formatDate(date: string) {
  const [y, m, d] = date.split('-')
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`
}
