const { createApp } = Vue;

createApp({
  data() {
    return {
      page: 'home',
      mobileOpen: false,
      scrolled: false,
      galleryFilter: '全部',
      stoneFilter: '全部',
      stoneSearch: '',
      lightbox: null,
      infoOpen: false,
      infoPages: ['gathering', 'stones', 'professors'],
      passwordModal: false,
      passwordInput: '',
      passwordError: '',
      showPassword: false,
      pendingInfoPage: null,
      infoSessionKey: 'snakeAcademyInfoAuth',
      infoSessionDuration: 30 * 60 * 1000,
      sessionCheckTimer: null,

      // ====== 你之後主要修改這裡的資料 ======
      gallery: [
        { id: 1, name: '開學典禮', category: '學院活動', image: 'images/gallery/開學典禮.png' },
        { id: 2, name: '毒蛇大合照', category: '校園日常', image: 'images/gallery/毒蛇大合照.png' },
        { id: 3, name: '地震中', category: '校園日常', image: 'images/gallery/地震.jpg' },
        { id: 4, name: '第一次班會紀錄', category: '校園日常', image: 'images/gallery/班會.png' },
        { id: 5, name: '歷史課', category: '課堂側拍', image: 'images/gallery/歷史課.png' },
        { id: 6, name: '魔法理論課', category: '課堂側拍', image: 'images/gallery/魔法理論課.png' },
        { id: 7, name: '粉紅泡泡隊', category: '學院活動', image: 'images/gallery/粉紅泡泡隊.png' },
        { id: 8, name: '灰蛇厲害隊', category: '學院活動', image: 'images/gallery/灰蛇厲害隊.png' },
        { id: 9, name: '團康遊戲', category: '學院活動', image: 'images/gallery/團康遊戲.png' },
      ],

      gatheringSpots: [
        { id: 1, name: '水晶蘑菇', type: 'Crystal Mushroom', use: '可用於基礎藥劑、料理與部分魔法配方。', location: '待補', image: './images/material/Crystal_Mushroom.png', mapImage: 'images/intel/gathering/mushroom-map.png', actualImage: 'images/intel/gathering/' },
        { id: 2, name: '魔力泉水', type: 'Magical Spring Water', use: '可用於基礎藥劑、料理與部分魔法配方。', location: '活米村右側森林處', image: './images/material/Magical_Spring_Water.png', mapImage: 'images/map/water-map.png', actualImage: 'images/map/water.png' },
        { id: 3, name: '魔法之花', type: 'Magic Flower', use: '可用於基礎藥劑、料理與部分魔法配方。', location: '待補', image: './images/material/Magic_Flower.png', mapImage: 'images/intel/gathering/holy-water-map.png', actualImage: 'images/intel/gathering/' },
        { id: 4, name: '妖精花粉', type: 'Fairy Pollen', use: '可用於基礎藥劑、料理與部分魔法配方。', location: '待補', image: './images/material/Fairy_Pollen.png', mapImage: 'images/intel/gathering/holy-water-map.png', actualImage: 'images/intel/gathering/' }
      ],

      magicStones: [
        {
          id: 1,
          name: '控血術',
          kind: '攻擊魔法',
          tags: ['控血'],
          use: '操縱目標體內的血液流動，可用於造成內傷使其跪下。',
          image: './images/rock/red.png'
        },
        {
          id: 2,
          name: '噬魔術',
          kind: '攻擊魔法',
          tags: ['噬魔'],
          use: '吞噬與消解敵方的魔力。',
          image: './images/rock/red.png'
        },
        {
          id: 3,
          name: '衝擊波',
          kind: '攻擊魔法',
          tags: ['衝擊'],
          use: '釋放強烈的魔力震盪，能產生衝擊力擊退敵人。',
          image: './images/rock/red.png'
        },
        {
          id: 4,
          name: '遲緩術',
          kind: '輔助控制魔法',
          tags: ['遲緩'],
          use: '降低目標的移動速度與反應力，有效減緩敵方的戰鬥節奏與行動能力。',
          image: './images/rock/blue.png'
        },
        {
          id: 5,
          name: '煙幕術',
          kind: '輔助控制魔法',
          tags: ['煙幕'],
          use: '召喚遮蔽視線與魔力感知的濃煙，適合用於干擾敵方判斷、偵查與潛行掩護，亦可與指定目標交換位置。',
          image: './images/rock/blue.png'
        },
        {
          id: 6,
          name: '擊倒術',
          kind: '輔助控制魔法',
          tags: ['擊倒'],
          use: '利用瞬間爆發的魔力衝擊破壞目標重心，使其摔倒在地並製造控場空檔。',
          image: './images/rock/blue.png'
        },
        {
          id: 7,
          name: '加速術',
          kind: '咒術魔法',
          tags: ['加速'],
          use: '大幅提升目標的移動速度與行動頻率，在戰鬥中獲得先手與閃避優勢。',
          image: './images/rock/purple.png'
        },
        {
          id: 8,
          name: '開鎖術',
          kind: '咒術魔法',
          tags: ['開鎖'],
          use: '以精準的魔力震盪解開各類機械鎖頭、魔導鎖或基礎封印結構。',
          image: './images/rock/purple.png'
        },
        {
          id: 9,
          name: '高躍術',
          kind: '咒術魔法',
          tags: ['高躍'],
          use: '增強腿部爆發力或施加輕量重力效果，使施法者能夠跳躍至高處或跨越障礙。',
          image: './images/rock/purple.png'
        },
        {
          id: 10,
          name: '黑妝術',
          kind: '咒術魔法',
          tags: ['黑妝'],
          use: '將暗影魔力附著於體表以遮蔽面貌，大幅提升在夜間與陰影中的隱匿能力。',
          image: './images/rock/purple.png'
        }
      ],

      people: [
        { id: 32, type: 'faculty', intelOnly: true, name: '彼得楊', title: '校長', expertise: '學院行政與治理', bio: '總管學院行政與各項重大決策，統籌全院運作。', image: 'images/teachers/teacher-03.jpg' },
        { id: 39, type: 'faculty', intelOnly: true, name: '芭別 • 喬', title: '訓導老師', expertise: '學生生活輔導', bio: '負責學生生活常規與紀律管理。', image: 'images/teachers/teacher-10.jpg' },
        { id: 40, type: 'faculty', intelOnly: true, name: '克羅斯 • 蘭斯洛特', title: '訓導老師', expertise: '學生生活輔導', bio: '負責學生生活常規與紀律管理。', image: 'images/teachers/teacher-11.jpg' },
        { id: 41, type: 'faculty', intelOnly: true, name: '魯迪烏斯．格雷拉特', title: '訓導老師', expertise: '學生生活輔導', bio: '負責學生生活常規與紀律管理。', image: 'images/teachers/teacher-12.jpg' },
        { id: 42, type: 'faculty', intelOnly: true, name: '卡能傑 • 丁格', title: '訓導老師', expertise: '學生生活輔導', bio: '負責學生生活常規與紀律管理。', image: 'images/teachers/teacher-13.jpg' },
        { id: 43, type: 'faculty', intelOnly: true, name: '奈爾 • 奧斯本', title: '訓導老師', expertise: '學生生活輔導', bio: '負責學生生活常規與紀律管理。', image: 'images/teachers/teacher-14.jpg' },
        { id: 38, type: 'faculty', intelOnly: true, name: '洛克 • K', title: '課程教授', expertise: '雙手劍', bio: '教授雙手劍術，注重實戰技巧與體能訓練。', image: 'images/teachers/teacher-09.jpg' },
        { id: 33, type: 'faculty', intelOnly: true, house: '凍狼學院', name: '洛恩 • 維特斯', title: '課程教授', expertise: '魔藥學', bio: '任教於凍狼學院，專精魔藥調配與藥理研究。', image: 'images/teachers/teacher-04.jpg' },
        { id: 34, type: 'faculty', intelOnly: true, house: '老虎學院', name: '艾莉森 • 奧爾洛夫', title: '課程教授', expertise: '魔藥學', bio: '任教於老虎學院，擅長進階魔藥配方設計。', image: 'images/teachers/teacher-05.jpg' },
        { id: 35, type: 'faculty', intelOnly: true, house: '凍狼學院', name: '約翰 • 康斯坦丁', title: '課程教授', expertise: '攻擊魔法', bio: '任教於凍狼學院，專精攻擊性魔法的施展與教學。', image: 'images/teachers/teacher-06.jpg' },
        { id: 36, type: 'faculty', intelOnly: true, house: '鳳凰學院', name: '貝爾 • 奧利安', title: '課程教授', expertise: '攻擊魔法', bio: '任教於鳳凰學院，致力於培養學生的實戰魔法能力。', image: 'images/teachers/teacher-07.jpg' },
        { id: 37, type: 'faculty', intelOnly: true, house: '鳳凰學院', name: '傑克 • 唐 • 祖利亞', title: '課程教授', expertise: '咒術學', bio: '任教於鳳凰學院，專精咒術學的理論與應用。', image: 'images/teachers/teacher-08.jpg' },


        { id: 1, type: 'faculty', house: 'snake', name: '歐克 • 科布拉', title: '教授', bio: '負責學院教學與學生指導。', expertise: '魔法理論、實戰指導', image: 'images/teachers/teacher-01.jpg' },
        { id: 2, type: 'faculty', house: 'snake', name: '比莉 • 艾利殊', title: '教授', bio: '負責課程規劃與學院事務。', expertise: '歷史、戰術與課程規劃', image: 'images/teachers/teacher-02.jpg' },
        { id: 3, type: 'leader', name: '優莉安娜．溫特貝爾', title: '班長', bio: '協助教授管理班級與維持團隊秩序。', image: 'images/students/優莉安娜．溫特貝爾.png', liveUrl: 'https://www.twitch.tv/loveuu_uu' },
        { id: 4, type: 'leader', name: '茶漓．阿斯特', title: '副班長', bio: '協助班長處理班務與學生事務。', image: 'images/students/茶漓．阿斯特.png' },
        { id: 5, type: 'student', name: '心肝 • 普林西斯', title: '學生', image: 'images/students/心肝 • 普林西斯.png' },
        { id: 6, type: 'student', name: '伊凡•莫爾', title: '學生', image: 'images/students/伊凡•莫爾.png' },
        { id: 7, type: 'student', name: '吉米 • 湯馬斯', title: '學生', image: 'images/students/吉米 • 湯馬斯.png' },
        { id: 8, type: 'student', name: '杜威・庫柏恩', title: '學生', image: 'images/students/杜威・庫柏恩.png' },
        { id: 9, type: 'student', name: '芙莉．佛力', title: '學生', image: 'images/students/芙莉．佛力.png' },
        { id: 10, type: 'student', name: '夏綠蒂．華倫', title: '學生', image: 'images/students/夏綠蒂．華倫.png', liveUrl: 'https://www.twitch.tv/amuam3u' },
        { id: 11, type: 'student', name: '烏拉菈•艾寶', title: '學生', image: 'images/students/烏拉菈•艾寶.png', liveUrl: 'https://www.twitch.tv/rr_leice' },
        { id: 22, type: 'student', name: '烏魯魯奇雅．瑪拉', title: '學生', image: 'images/students/烏魯魯奇雅．瑪拉.png' },
        { id: 12, type: 'student', name: '莉絲·菲伊', title: '學生', image: 'images/students/莉絲·菲伊.png', liveUrl: 'https://www.twitch.tv/1nom1' },
        { id: 21, type: 'student', name: '凱文．諾瓦克', title: '學生', image: 'images/students/凱文．諾瓦克.png', liveUrl: 'https://www.twitch.tv/capricornxiang' },
        { id: 13, type: 'student', name: '愛・洛溫斯特', title: '學生', image: 'images/students/愛・洛溫斯特.png', liveUrl: 'https://www.twitch.tv/arielacc3' },
        { id: 14, type: 'student', name: '溫加·癲拉唯啊撒', title: '學生', image: 'images/students/溫加·癲拉唯啊撒.png' },
        { id: 15, type: 'student', name: '雷歐．提力斯', title: '學生', image: 'images/students/雷歐．提力斯.png', liveUrl: 'https://www.twitch.tv/pug_tw' },
        { id: 16, type: 'student', name: '福瑞．布萊梅', title: '學生', image: 'images/students/福瑞．布萊梅.png' },
        { id: 17, type: 'student', name: '維恩．阿斯特', title: '學生', image: 'images/students/維恩．阿斯特.png' },
        { id: 18, type: 'student', name: '蕾貝卡．羅溫', title: '學生', image: 'images/students/蕾貝卡．羅溫.png' },
        { id: 19, type: 'gifted', name: '蹦．撤卡拉卡', title: '資優生', bio: '負責教學弟們搭訕。', image: 'images/students/蹦．撤卡拉卡.png' },
        { id: 20, type: 'student', name: '鵝嵋珊 • 荷歡珊', title: '學生', image: 'images/students/鵝嵋珊 • 荷歡珊.png' },
        { id: 23, type: 'gifted', name: '伊芙琳．克羅伊斯', title: '資優生', bio: '負責細心呵護學弟妹們。', image: 'images/students/伊芙琳．克羅伊斯.png' },
        { id: 24, type: 'student', name: '莉絲·羅文', title: '學生', image: 'images/students/莉絲·羅文.png', liveUrl: 'https://www.twitch.tv/yidhra0727' },
        { id: 25, type: 'student', name: '亞瑟 • 金斯利', title: '學生', image: 'images/students/亞瑟 • 金斯利.png' },
        { id: 26, type: 'student', name: '哈比·麥·貴度', title: '學生', image: 'images/students/哈比·麥·貴度.png', liveUrl: 'https://www.twitch.tv/tnyuuta' },
        { id: 27, type: 'student', name: '熙振．泰瑞托', title: '學生', image: 'images/students/熙振．泰瑞托.png' },
        { id: 28, type: 'student', name: '伊莉莎．霍普', title: '學生', image: 'images/students/伊莉莎．霍普.png' },
        { id: 29, type: 'student', name: '露娜．索爾貝克', title: '學生', image: 'images/students/露娜．索爾貝克.png', liveUrl: 'https://www.twitch.tv/boss_guan' },
        { id: 30, type: 'student', name: '凱斯·凱爾采', title: '學生', image: 'images/students/凱斯·凱爾采.png' },
        { id: 31, type: 'faculty', house: '老虎學院', name: '哈爾 • 詹金斯', title: '教授', image: 'images/students/1.png' },

        // ====== 情報區「教授們相關」新增資料 ======
        // intelOnly: true 表示這些人只出現在「情報區→教授們相關」頁面，
        // 不列入「師生名錄」與首頁「師生資料」統計數字

      ]
    };
  },

  computed: {
    galleryCategories() {
      return ['全部', ...new Set(this.gallery.map(x => x.category))];
    },
    filteredGallery() {
      if (this.galleryFilter === '全部') return this.gallery;
      return this.gallery.filter(x => x.category === this.galleryFilter);
    },
    stoneCategories() {
      return ['全部', ...new Set(this.magicStones.map(x => x.kind))];
    },
    // 1. 本院教授 (專門給「師生名錄」頁面使用)
    faculty() {
      return this.people.filter(x => x.type === 'faculty' && !x.intelOnly && (x.house === 'snake' || !x.house));
    },

    // 首頁「師生資料」統計數字專用：只算毒蛇學院本院師生，
    // 外學院（house 為 老虎學院/凍狼學院/鳳凰學院 等）不列入，
    // 「情報區→教授們相關」額外新增的教授（intelOnly）也不列入
    academyPeopleCount() {
      return this.people.filter(x => !x.intelOnly && (x.house === 'snake' || !x.house)).length;
    },

    // 2. 全部教授 (專門給「情報區」頁面使用)
    allProfessors() {
      return this.people.filter(x => x.type === 'faculty');
    },
    filteredMagicStones() {
      const keyword = this.stoneSearch.trim().toLowerCase();
      return this.magicStones.filter(stone => {
        const matchCategory = this.stoneFilter === '全部' || stone.kind === this.stoneFilter;
        const searchable = [
          stone.name,
          stone.kind,
          stone.use,
          ...(stone.tags || [])
        ].join(' ').toLowerCase();
        return matchCategory && (!keyword || searchable.includes(keyword));
      });
    },
    leaders() {
      return this.people.filter(x => x.type === 'leader');
    },
    // 延伸新增：資優學生 / 專案代表
    giftedLeaders() {
      return this.people.filter(x => x.type === 'gifted');
    },
    students() {
      return this.people.filter(x => x.type === 'student');
    }
  },

  mounted() {
    // 情報區登入有效期：30 分鐘。使用 localStorage 讓重新整理頁面後仍保留登入狀態。
    this.sessionCheckTimer = window.setInterval(() => {
      this.checkInfoSession();
    }, 1000);

    window.addEventListener('beforeunload', () => {
      if (this.sessionCheckTimer) window.clearInterval(this.sessionCheckTimer);
    });

    window.addEventListener('scroll', () => {
      this.scrolled = window.scrollY > 20;
    });

    window.addEventListener('keydown', e => {
      if (!this.lightbox) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.prevPhoto();
      if (e.key === 'ArrowRight') this.nextPhoto();
    });
  },

  methods: {
    go(target) {
      // 情報區登入在 30 分鐘內有效，期間切換情報頁面不需重新輸入密碼。
      if (this.infoPages.includes(target)) {
        if (this.isInfoSessionValid()) {
          this.navigateTo(target);
          return;
        }
        this.pendingInfoPage = target;
        this.passwordInput = '';
        this.passwordError = '';
        this.showPassword = false;
        this.passwordModal = true;
        this.mobileOpen = false;
        this.$nextTick(() => {
          this.$refs.passwordInput?.focus();
        });
        return;
      }

      this.navigateTo(target);
    },

    navigateTo(target) {
      this.page = target;
      this.mobileOpen = false;
      this.infoOpen = false;
      this.lightbox = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    toggleInfoMenu() {
      this.infoOpen = !this.infoOpen;
    },

    isInfoSessionValid() {
      const loginAt = Number(localStorage.getItem(this.infoSessionKey));
      if (!loginAt || Number.isNaN(loginAt)) return false;
      const valid = Date.now() - loginAt < this.infoSessionDuration;
      if (!valid) localStorage.removeItem(this.infoSessionKey);
      return valid;
    },

    checkInfoSession() {
      if (this.infoPages.includes(this.page) && !this.isInfoSessionValid()) {
        const target = this.page;
        this.page = 'home';
        this.pendingInfoPage = target;
        this.passwordInput = '';
        this.passwordError = '情報區登入已逾時，請重新驗證身分。';
        this.showPassword = false;
        this.passwordModal = true;
        this.$nextTick(() => {
          this.$refs.passwordInput?.focus();
        });
      }
    },

    verifyPassword() {
      if (this.passwordInput === 'bigsnake') {
        // 登入成功後開始計算 30 分鐘有效期。
        localStorage.setItem(this.infoSessionKey, String(Date.now()));
        const target = this.pendingInfoPage;
        this.passwordModal = false;
        this.passwordInput = '';
        this.passwordError = '';
        this.pendingInfoPage = null;
        this.showPassword = false;

        if (target) {
          this.navigateTo(target);
        }
        return;
      }

      this.passwordError = '你是間諜吧？密碼不對喔。';
      this.passwordInput = '';
      this.$nextTick(() => {
        this.$refs.passwordInput?.focus();
      });
    },

    closePasswordModal() {
      this.passwordModal = false;
      this.passwordInput = '';
      this.passwordError = '';
      this.pendingInfoPage = null;
      this.showPassword = false;
    },

    openLightbox(item) {
      this.lightbox = { ...item, mode: 'gallery' };
      document.body.style.overflow = 'hidden';
    },

    openImageLightbox(image, name, category) {
      this.lightbox = {
        image,
        name,
        category,
        mode: 'single'
      };
      document.body.style.overflow = 'hidden';
    },

    closeLightbox() {
      this.lightbox = null;
      document.body.style.overflow = '';
    },

    nextPhoto() {
      if (!this.lightbox || this.lightbox.mode !== 'gallery') return;
      const list = this.filteredGallery;
      if (!list.length) return;
      const i = list.findIndex(x => x.id === this.lightbox.id);
      this.lightbox = list[(i + 1) % list.length];
    },

    prevPhoto() {
      if (!this.lightbox || this.lightbox.mode !== 'gallery') return;
      const list = this.filteredGallery;
      if (!list.length) return;
      const i = list.findIndex(x => x.id === this.lightbox.id);
      this.lightbox = list[(i - 1 + list.length) % list.length];
    },

    safeFileName(name) {
      return `${name || 'snake-academy-photo'}.jpg`;
    },

    imageFallback(event) {
      // 尚未放入實際照片時，顯示漂亮的深色佔位圖
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
          <rect width="800" height="600" fill="#0b2119"/>
          <circle cx="400" cy="300" r="170" fill="none" stroke="#c8a45b" stroke-width="2" opacity=".35"/>
          <text x="400" y="285" text-anchor="middle" fill="#c8a45b" font-size="74">🐍</text>
          <text x="400" y="365" text-anchor="middle" fill="#eee7d7" font-size="24">SNAKE ACADEMY</text>
          <text x="400" y="405" text-anchor="middle" fill="#829087" font-size="16">請將實際照片放入 images 資料夾</text>
        </svg>`;
      event.target.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
      event.target.onerror = null;
    }
  }
}).mount('#app');