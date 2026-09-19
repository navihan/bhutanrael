import { SiteContent, ThemeConfig, SeoConfig, Post, EventItem, BookItem } from '../types';

export const defaultTheme: ThemeConfig = {
  bgColor: '#FAF7F2',
  accentColor: '#EA580C',
  fontFamily: 'editorial',
  borderRadius: 'rounded-xl',
  showAnnouncement: true,
  announcementText: {
    ko: '✨ 2026 부탄 팀푸 엘로힘 평화 명상 워크숍 참가 신청 접수 중입니다.',
    en: '✨ Registration is now open for the 2026 Bhutan Thimphu Elohim Peace Meditation Workshop.'
  },
  announcementLink: '#events'
};

export const defaultSeo: SeoConfig = {
  metaTitle: {
    ko: '부탄 라엘리안 무브먼트 | Bhutan Raëlian Movement',
    en: 'Bhutan Raëlian Movement | Official Portal'
  },
  metaDescription: {
    ko: '부탄 라엘리안 무브먼트 공식 웹사이트. 우주인 엘로힘의 메시지, 지적설계 철학, 외계인 대사관 프로젝트 및 팀푸 세미나 안내.',
    en: 'Official Bhutan Raëlian Movement website. Messages from the Elohim, Intelligent Design, Extraterrestrial Embassy project and seminars in Bhutan.'
  },
  keywords: '부탄 라엘리안, Bhutan Raelian, 엘로힘, Elohim, 지적설계, Intelligent Design, 외계인 대사관, Embassy project, 라엘, Rael, 감각명상, Sensual Meditation, 팀푸, Thimphu, GNH',
  ogImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
  canonicalUrl: 'https://bhutanrm.org',
  siteName: 'Bhutan Raëlian Movement',
  socialLinks: {
    facebook: 'https://www.facebook.com/BhutanRaelianMovement',
    youtube: 'https://www.youtube.com/@RaelianMovement',
    twitter: 'https://x.com/raelianofficial',
    instagram: 'https://instagram.com/raelianmovement',
    telegram: 'https://t.me/raelianmovement',
    email: 'navihan01@gmail.com'
  }
};

export const defaultContent: SiteContent = {
  hero: {
    badge: {
      ko: '부탄 라엘리안 무브먼트 공식 웹사이트',
      en: 'Official Portal of Bhutan Raëlian Movement'
    },
    title: {
      ko: '인류의 창조자 엘로힘을 맞이하는 평화의 땅, 부탄',
      en: 'Welcoming Our Creators, The Elohim, in the Serene Land of Bhutan'
    },
    subtitle: {
      ko: '과학적 지적설계, 감각명상을 통한 내면의 각성, 그리고 지구상에 평화로운 미래를 열어갈 외계인 대사관 프로젝트에 동참하세요.',
      en: 'Join the journey of scientific intelligent design, awakening through sensual meditation, and the historic Extraterrestrial Embassy project.'
    },
    primaryCtaText: {
      ko: '엘로힘 메시지 읽기',
      en: 'Read Elohim Message'
    },
    primaryCtaLink: '#philosophy',
    secondaryCtaText: {
      ko: '도서 무료 다운로드',
      en: 'Download Free eBooks'
    },
    secondaryCtaLink: '#books',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80'
  },
  about: {
    title: {
      ko: '인류의 기원과 라엘리안 무브먼트',
      en: 'Origins of Humanity & The Raëlian Movement'
    },
    subtitle: {
      ko: '우주는 영원하며, 생명은 우연이 아닌 고도의 과학기술에 의해 설계되었습니다',
      en: 'The universe is eternal, and life was scientifically created through advanced genetics.'
    },
    description: {
      ko: '1973년 12월, 프랑스의 저널리스트 라엘(Raël)은 지구상의 모든 생명체를 DNA 합성 기술로 창조한 우주인 "엘로힘(Elohim)"과 조우하여 전 인류에게 전할 메시지를 받았습니다. 엘로힘은 히브리어 원어로 "하늘에서 온 사람들"을 의미하며, 고대 경전에서 신(God)으로 잘못 번역되었습니다. 부탄 라엘리안 무브먼트는 평화와 자연을 숭상하는 부탄의 정신과 함께, 엘로힘의 메시지를 널리 알리고 대사관을 준비하는 비영리 평화 운동 단체입니다.',
      en: 'In December 1973, French journalist Raël encountered representatives of an advanced extraterrestrial civilization known as the Elohim—meaning "those who came from the sky" in ancient Hebrew. They revealed that all life on Earth was created scientifically using DNA synthesis and advanced genetic engineering. The Bhutan Raëlian Movement works peacefully alongside Bhutan’s rich values of harmony and Gross National Happiness to share this transformative truth.'
    },
    quote: {
      ko: '사랑은 모든 것의 해답이며, 과학은 진실을 보는 눈입니다.',
      en: 'Love is the answer to everything, and science is the eye to see truth.'
    },
    quoteAuthor: {
      ko: '마이트레야 라엘 (Maitreya Raël)',
      en: 'Maitreya Raël'
    },
    aboutImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80'
  },
  embassy: {
    title: {
      ko: '외계인 대사관 프로젝트',
      en: 'The Extraterrestrial Embassy Project'
    },
    subtitle: {
      ko: '창조자 엘로힘의 공식 귀환을 영접하기 위한 지구상 최초의 외교 공관',
      en: 'The First Official Diplomatic Compound on Earth to Welcome Our Creators'
    },
    description: {
      ko: '엘로힘은 인류가 스스로 그들을 맞이할 준비가 되었을 때만 공식적으로 지구에 귀환하겠다고 약속했습니다. 이를 위해 국제법상 치외법권과 비행 제한 구역이 보장되는 중립적 대사관 부지가 필요합니다. 부탄의 순수한 자연환경과 평화 애호 정책(Gross National Happiness)은 엘로힘 대사관 후보지로서 상징적인 조화를 이룹니다.',
      en: 'The Elohim will only return when humanity proves ready to welcome them in peace and love. A designated extraterrestrial embassy with extraterritorial diplomatic status and secure neutral airspace is required. Bhutan, with its peaceful coexistence and commitment to national happiness, holds a deeply inspiring resonance with this cosmic mission.'
    },
    highlightPoints: {
      ko: [
        '국제법상 치외법권 지위 보장 및 대사관 부지 약 4km² 구상',
        '비행 제한 공역과 외교적 중립성을 갖춘 평화 협정 체결',
        '엘로힘과의 공식 교류를 통한 첨단 청정에너지 및 의료 기술 전수 기회',
        '세계적인 평화 순례지와 인류 화합의 상징적 랜드마크 조성'
      ],
      en: [
        'Extraterritorial diplomatic status spanning approx. 4 km² safe zone',
        'Neutral airspace agreement guaranteeing peaceful and safe arrival',
        'Unprecedented transfer of advanced ecological, scientific and health technologies',
        'A global landmark for world peace, unity, and cosmic brotherhood'
      ]
    },
    embassyImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80'
  },
  contact: {
    address: {
      ko: '부탄 팀푸 노르진 람 (Norzin Lam, Thimphu, Kingdom of Bhutan)',
      en: 'Norzin Lam, Thimphu, Kingdom of Bhutan'
    },
    phone: '+975 2 321 000 / +82 10 0000 0000',
    email: 'navihan01@gmail.com',
    meetingHours: {
      ko: '토요일 & 일요일: 오후 2시 ~ 5시 (사전 예약 권장)',
      en: 'Saturday & Sunday: 2:00 PM – 5:00 PM (RSVP recommended)'
    }
  }
};

export const defaultPosts: Post[] = [
  {
    id: 'post-1',
    title: {
      ko: '부탄 라엘리안 무브먼트 공식 포털 개설 및 팀푸 평화 모임 안내',
      en: 'Official Launch of Bhutan Raëlian Movement Portal & Thimphu Peace Gathering'
    },
    summary: {
      ko: '부탄 왕국 내 라엘리안 철학 보급과 엘로힘 대사관 비전을 공유하기 위한 공식 온라인 포털이 공식 오픈하였습니다.',
      en: 'Our official digital portal has launched to share the Elohim message and Embassy vision across the Kingdom of Bhutan.'
    },
    content: {
      ko: `부탄 라엘리안 무브먼트는 부탄 왕국의 고유한 평화 전통과 국민총행복(GNH) 정신에 깊은 경의를 표하며, 인류의 기원과 평화로운 미래를 제시하는 엘로힘의 메시지를 전파하기 위한 공식 포털을 오픈하였습니다.

### 주요 활동 계획
1. **정기 감각명상 워크숍**: 팀푸 및 파로 지역에서 매월 2회 평화 명상 및 뇌 활성화 세미나를 진행합니다.
2. **지적설계 도서 무료 보급**: 인류 창조의 진실을 담은 도서 '지적설계(Intelligent Design)' 무료 디지털 다운로드 및 종이책 증정 행사.
3. **대사관 프로젝트 설명회**: 유엔 및 부탄 정부에 외계인 대사관 유치의 경제적, 학문적, 평화적 혜택을 알리는 활동.

모든 관심 있는 분들의 자유롭고 따뜻한 참여를 환영합니다.`,
      en: `The Bhutan Raëlian Movement pays deep respect to the Kingdom of Bhutan's tradition of peace and Gross National Happiness (GNH), and proudly announces the opening of its official portal.

### Core Initiatives
1. **Sensual Meditation Workshops**: Held bi-weekly in Thimphu and Paro to foster deep mindfulness and brain harmony.
2. **Free Book Distribution**: Free electronic and printed copies of 'Intelligent Design: Message from the Designers'.
3. **Embassy Presentation**: Public awareness on the peaceful and technological benefits of hosting the Extraterrestrial Embassy.

We warmly welcome all free-thinking seekers of peace and scientific understanding.`
    },
    category: 'announcement',
    author: '부탄 지부 운영위원회',
    date: '2026-03-10',
    readTime: '3 min',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80',
    tags: ['공지', '부탄', '포털오픈', '팀푸'],
    isFeatured: true,
    status: 'published',
    views: 1240
  },
  {
    id: 'post-2',
    title: {
      ko: '외계인 엘로힘과 지적설계: 신화가 아닌 현대 유전공학의 관점',
      en: 'The Elohim and Intelligent Design: Genetic Science, Not Mythology'
    },
    summary: {
      ko: '인간 게놈 프로젝트와 합성생물학의 눈부신 발전은 생명이 우연한 진화가 아닌 고도의 지적 생명공학으로 탄생했음을 뒷받침합니다.',
      en: 'Advancements in synthetic biology and genomics demonstrate that biological complexity is the product of deliberate scientific engineering.'
    },
    content: {
      ko: `현대 분자생물학과 유전공학의 눈부신 발전은 생명의 정교함이 단순한 우연적 무작위 돌연변이만으로는 설명되기 어렵다는 사실을 끊임없이 보여주고 있습니다.

1973년 라엘이 전달받은 메시지에서 엘로힘은 "지구상의 모든 생명체는 고도의 DNA 합성 실험실에서 계획적으로 창조되었다"고 분명히 밝혔습니다.

### 현대 과학이 밝혀내는 진실들
- **DNA의 디지털 정보성**: 4가지 염기서열(A, T, G, C)로 이루어진 완벽한 프로그래밍 언어.
- **합성 생물학의 태동**: 현대 인류 과학자들도 이미 실험실에서 인공 합성 미생물을 창조하기 시작했습니다. 인류가 할 수 있는 일이라면, 수만 년 앞선 문명이 행하지 못했을 이유가 없습니다.
- **신(God) 개념의 탈신비화**: 고대인들은 우주선과 과학 장비를 보고 '신'으로 착각하여 신격화하고 종교를 만들었으나, 이제 우리는 과학의 눈으로 그들의 본질을 올바르게 이해할 수 있습니다.`,
      en: `Modern molecular biology and genetics increasingly reveal the astonishing informational depth of biological machinery.

In 1973, Raël received the Elohim messages stating clearly: "All living forms on Earth were scientifically designed and engineered in sophisticated DNA laboratories."

### Insights of Contemporary Science
- **DNA as Code**: The quaternary chemical code (A, T, G, C) operates with computational fidelity.
- **Emergence of Synthetic Biology**: Human scientists have already created synthetic organisms. If human science has reached this threshold in centuries, advanced civilizations millions of years ahead did so with mastery.
- **Demythologizing Gods**: Ancient peoples lacked technical vocabularies and mistook aerospace travelers for supernatural deities.`
    },
    category: 'science',
    author: '과학 철학 연구팀',
    date: '2026-03-02',
    readTime: '5 min',
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=900&auto=format&fit=crop&q=80',
    tags: ['지적설계', '과학', 'DNA', '생명공학'],
    isFeatured: true,
    status: 'published',
    views: 980
  },
  {
    id: 'post-3',
    title: {
      ko: '부탄의 국민행복지수(GNH)와 라엘리안 감각명상의 아름다운 조화',
      en: 'Gross National Happiness (GNH) & Sensual Meditation: A Harmonious Synergy'
    },
    summary: {
      ko: '물질 만능주의를 넘어 인간의 순수한 행복과 감각의 깨어있음을 중시하는 부탄의 가치는 라엘리안의 행복 철학과 완벽히 궤를 같이합니다.',
      en: 'Bhutan’s world-renowned prioritization of happiness resonates deeply with the Raëlian philosophy of inner awakening and sensual meditation.'
    },
    content: {
      ko: `부탄은 경제 성장률(GDP) 대신 국민총행복(GNH)을 국가 발전의 지표로 삼는 세계에서 유일무이한 나라입니다.

라엘리안 무브먼트의 핵심 실천 철학인 **감각명상(Sensual Meditation)**은 오감을 온전히 일깨우고, 뇌 속의 신경전달물질과 엔도르핀을 활성화하여 지금 이 순간 존재하는 기쁨을 맛보는 과학적 명상 기법입니다.

### 조화의 세 가지 기둥
1. **자연과의 일체감**: 히말라야의 청정자연 속에서 호흡하며 우주와 세포의 연결을 실감합니다.
2. **탈폭력과 평화주의**: 어떠한 살상과 전쟁도 거부하며 인간 존엄성을 최우선시합니다.
3. **웃음과 감사의 삶**: 매일 아침 거울을 보고 웃으며 내 몸의 수십조 개 세포에게 감사를 전하는 일상 속의 행복 혁명.`,
      en: `Bhutan stands alone in the world by measuring national progress not through gross domestic product, but through Gross National Happiness.

Raëlian Sensual Meditation awakens each of the senses, balancing neural pathways to experience pure presence and appreciation.

### Three Pillars of Harmony
1. **Union with Nature**: Breathing clean Himalayan air while connecting individual consciousness with the infinite cosmos.
2. **Absolute Non-Violence**: Unconditional rejection of warfare and reverence for living beings.
3. **Joy and Gratitude**: Awakening neural dopamine pathways through daily laughter and bodily thankfulness.`
    },
    category: 'philosophy',
    author: '명상 지도자 텐진',
    date: '2026-02-24',
    readTime: '4 min',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop&q=80',
    tags: ['감각명상', '행복', '부탄GNH', '마음챙김'],
    isFeatured: false,
    status: 'published',
    views: 740
  },
  {
    id: 'post-4',
    title: {
      ko: '왜 부탄이 엘로힘 대사관 유치의 이상적인 평화 성지인가?',
      en: 'Why Bhutan is an Ideal Sanctuary for the Extraterrestrial Embassy'
    },
    summary: {
      ko: '비동맹 중립성, 탄소 네거티브 청정 자연, 평화를 사랑하는 순수한 국민성은 인류 최초의 외계 공관을 건설하기에 최적의 요건을 갖추고 있습니다.',
      en: 'Non-alignment, carbon-negative ecology, and deeply peaceful culture position Bhutan as an extraordinary candidate for the Elohim Embassy.'
    },
    content: {
      ko: `엘로힘은 대사관이 들어설 나라에 대해 몇 가지 중요한 조건을 제시했습니다:
- 비동맹 중립적 국가일 것
- 모든 군사적 분쟁과 대량살상무기로부터 자유롭고 평화를 실천하는 지역일 것
- 치외법권과 자유로운 상공 비행권을 보장할 수 있는 정부의 합의

부탄 왕국은 탄소 배출량보다 흡수량이 많은 세계 유일의 탄소 네거티브 국가이자, 군사적 침략 야욕이 전혀 없는 진정한 평화의 수호자입니다.

대사관이 부탄에 유치된다면, 부탄은 전 세계 과학자와 평화주의자들이 방문하는 글로벌 과학·영성 허브로 도약하게 될 것입니다.`,
      en: `The Elohim specified essential prerequisites for the nation hosting their Embassy:
- Diplomatic neutrality and non-aligned status
- A demonstrable commitment to international peace without weapons of mass destruction
- Guarantees of extraterritoriality and sovereign neutral airspace

Bhutan is the world's only carbon-negative nation, prioritizing ecology, cultural serenity, and non-aggression.

Hosting the embassy would position Bhutan as an epicenter of advanced green technologies and global cosmic diplomacy.`
    },
    category: 'embassy',
    author: '국제 대사관 추진위원회',
    date: '2026-02-15',
    readTime: '4 min',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80',
    tags: ['대사관', '외계인', '평화협정', '미래'],
    isFeatured: false,
    status: 'published',
    views: 1530
  }
];

export const defaultEvents: EventItem[] = [
  {
    id: 'evt-1',
    title: {
      ko: '팀푸 주말 감각명상 & 평화 워크숍',
      en: 'Thimphu Weekend Sensual Meditation & Peace Workshop'
    },
    location: {
      ko: '팀푸 평화문화센터 대강당 (Norzin Lam)',
      en: 'Thimphu Peace Cultural Hall (Norzin Lam)'
    },
    date: '2026-04-12',
    time: '14:00 - 17:00 (GMT+6)',
    description: {
      ko: '오감의 정화, 뇌파 안정화, 그리고 우주적 사랑의 파동을 느끼는 감각명상 실습 및 무료 도서 증정.',
      en: 'Hands-on sensual meditation practice, neural relaxation, cosmic love vibrations, and complimentary book gifting.'
    },
    isOnline: false,
    status: 'upcoming'
  },
  {
    id: 'evt-2',
    title: {
      ko: '2026 엘로힘 대사관 프로젝트 글로벌 온라인 포럼',
      en: '2026 Global Online Forum: Elohim Embassy Project'
    },
    location: {
      ko: 'Zoom 화상 회의실 (온라인)',
      en: 'Zoom Conference Hall (Online)'
    },
    date: '2026-04-26',
    time: '20:00 - 22:00 (KST / GMT+9)',
    description: {
      ko: '대사관 건축 조감도 공개 및 아시아 각국 대표단의 부탄 대사관 비전 발표 및 질의응답.',
      en: 'Architectural blueprint presentations and international delegations discussing the Asian embassy vision.'
    },
    isOnline: true,
    meetingLink: 'https://zoom.us/j/bhutan-rael-peace',
    status: 'upcoming'
  },
  {
    id: 'evt-3',
    title: {
      ko: '파로 계곡 평화 걷기 & 지적설계 북 콘서트',
      en: 'Paro Valley Peace Walk & Intelligent Design Book Salon'
    },
    location: {
      ko: '파로 도심 커뮤니티 정원',
      en: 'Paro Downtown Community Garden'
    },
    date: '2026-05-09',
    time: '10:00 - 13:00 (GMT+6)',
    description: {
      ko: '자연과 하나 되는 호흡 명상과 더불어 지적설계 책의 주요 쟁점을 자유롭게 토론하는 야외 살롱.',
      en: 'Outdoor walking mindfulness and an open discussion salon on the fundamental points of Intelligent Design.'
    },
    isOnline: false,
    status: 'upcoming'
  }
];

export const defaultBooks: BookItem[] = [
  {
    id: 'book-1',
    title: {
      ko: '지적설계: 우주인으로부터의 메시지',
      en: 'Intelligent Design: Message from the Designers'
    },
    author: '라엘 (Raël)',
    description: {
      ko: '1973년과 1975년 엘로힘으로부터 직접 구술받은 인류의 기원, 인류 역사의 비밀, 그리고 지구의 미래를 담은 필독서.',
      en: 'The seminal book recounting the direct encounters with the Elohim in 1973 and 1975, detailing the scientific origin of mankind.'
    },
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    downloadUrl: 'https://www.rael.org/books/intelligent-design.pdf',
    pageCount: 384,
    languages: ['한국어', 'English', 'Français', 'Español', '日本語']
  },
  {
    id: 'book-2',
    title: {
      ko: '감각명상: 행복과 각성을 위한 명상법',
      en: 'Sensual Meditation: Awakening the Senses'
    },
    author: '라엘 (Raël)',
    description: {
      ko: '죄의식 없는 기쁨, 오감의 온전한 개발, 뇌 신경세포 활성화를 통해 지금 이 순간 무한한 행복을 체험하는 지침서.',
      en: 'A profound guide to experiencing infinite joy without guilt, activating neural happiness pathways through sensual mindfulness.'
    },
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    downloadUrl: 'https://www.rael.org/books/sensual-meditation.pdf',
    pageCount: 220,
    languages: ['한국어', 'English', 'Français', 'Deutsch']
  },
  {
    id: 'book-3',
    title: {
      ko: '천재정치 (Geniocracy): 지성과 평화의 사회 시스템',
      en: 'Geniocracy: Government by Intellect and Compassion'
    },
    author: '라엘 (Raël)',
    description: {
      ko: '인류의 생존과 번영을 위해 감정적 정치 대신 지성과 인류애를 갖춘 이들이 봉사하는 미래형 거버넌스 제안.',
      en: 'A visionary socio-political blueprint advocating a democratic governance system guided by genuine compassion and intellect.'
    },
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
    downloadUrl: 'https://www.rael.org/books/geniocracy.pdf',
    pageCount: 190,
    languages: ['한국어', 'English', 'Français']
  }
];

export const defaultFaqs = [
  {
    q: {
      ko: '엘로힘(Elohim)은 누구인가요?',
      en: 'Who are the Elohim?'
    },
    a: {
      ko: '엘로힘은 고대 히브리어 복수형 단어로 "하늘에서 온 사람들"을 뜻합니다. 수천 년 전 지구에 도착하여 고도의 DNA 생명공학 기술로 인류를 비롯한 모든 지구 생명체를 창조한 고도로 발달한 외계 문명의 존재들입니다.',
      en: 'Elohim is an ancient Hebrew plural noun translating to "those who came from the sky." They are an advanced extraterrestrial civilization who scientifically designed and created all forms of life on Earth using advanced genetics.'
    }
  },
  {
    q: {
      ko: '라엘리안 무브먼트는 종교인가요?',
      en: 'Is the Raëlian Movement a religion?'
    },
    a: {
      ko: '라엘리안 무브먼트는 초자연적인 신이나 영혼을 믿지 않는 무신론적·과학적 철학 단체입니다. 신비주의 대신 이성과 과학, 생명에 대한 사랑과 평화를 실천하는 비영리 평화 운동입니다.',
      en: 'The Raëlian Movement is an atheistic and scientifically grounded philosophical movement. We reject supernatural deities and superstition, embracing reason, scientific inquiry, unconditional love, and human rights.'
    }
  },
  {
    q: {
      ko: '외계인 대사관은 왜 꼭 필요한가요?',
      en: 'Why is the Extraterrestrial Embassy necessary?'
    },
    a: {
      ko: '엘로힘은 인간의 자유의지를 절대적으로 존중합니다. 침략자나 지배자가 아닌 손님으로서 초대받기를 원하며, 공식적인 환영의 표시로서 외교적 치외법권과 중립성이 보장된 대사관을 준비했을 때 평화롭게 착륙하겠다고 밝혔습니다.',
      en: 'The Elohim respect human free will completely. They refuse to arrive as invaders or rulers; rather, they wish to be welcomed as cherished parents and guests once humanity builds an official diplomatic embassy guaranteeing extraterritorial neutral safety.'
    }
  },
  {
    q: {
      ko: '부탄 왕국과 라엘리안 철학은 어떤 연관이 있나요?',
      en: 'How does Bhutan relate to Raëlian philosophy?'
    },
    a: {
      ko: '부탄의 "국민총행복(GNH)" 정책과 비폭력 생명 존중 정신은 라엘리안의 "감각명상과 행복 철학"과 완벽히 공명합니다. 부탄은 환경 보존과 평화에 앞장서는 세계의 모범 국가로서 대사관 후보지로서 크나큰 영감을 줍니다.',
      en: 'Bhutan’s Gross National Happiness (GNH) and commitment to environmental serenity and non-violence harmonize seamlessly with Raëlian values of mindfulness, joy, and demilitarization.'
    }
  },
  {
    q: {
      ko: '모임이나 세미나에 참여하려면 비용이 드나요?',
      en: 'Is there any fee to attend gatherings or seminars?'
    },
    a: {
      ko: '아닙니다. 라엘리안 무브먼트의 정기 명상 모임과 도서 다운로드는 모든 대중에게 100% 무료로 개방되어 있습니다.',
      en: 'No. Regular peace meditation sessions, public forums, and digital book downloads are 100% free and open to everyone.'
    }
  }
];
