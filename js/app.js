const { createApp } = Vue;

createApp({
  data() {
    return {
      page: 'home',
      mobileOpen: false,
      scrolled: false,
      galleryFilter: '全部',
      lightbox: null,

      // ====== 你之後主要修改這裡的資料 ======
      gallery: [
        { id: 1, name: '開學典禮', category: '學院活動', image: 'images/gallery/開學典禮.png' },
        { id: 2, name: '毒蛇大合照', category: '校園日常', image: 'images/gallery/毒蛇大合照.png' },
        { id: 3, name: '地震中', category: '校園日常', image: 'images/gallery/地震.jpg' },
        { id: 4, name: '第一次班會紀錄', category: '校園日常', image: 'images/gallery/班會.png' },
        { id: 5, name: '歷史課', category: '課堂側拍', image: 'images/gallery/歷史課.png' },
        { id: 6, name: '魔法理論課', category: '課堂側拍', image: 'images/gallery/魔法理論課.png' }
      ],

      people: [
        { id: 1, type: 'faculty', name: '歐克 • 科布拉', title: '教授', bio: '負責學院教學與學生指導。', image: 'images/teachers/teacher-01.jpg' },
        { id: 2, type: 'faculty', name: '比莉 • 艾利殊', title: '教授', bio: '負責課程規劃與學院事務。', image: 'images/teachers/teacher-02.jpg' },
        { id: 3, type: 'leader', name: '優莉安娜．溫特貝爾', title: '班長', bio: '協助教授管理班級與維持團隊秩序。', image: 'images/students/優莉安娜．溫特貝爾.png' },
        { id: 4, type: 'leader', name: '茶漓．阿斯特', title: '副班長', bio: '協助班長處理班務與學生事務。', image: 'images/students/茶漓．阿斯特.png' },
        { id: 5, type: 'student', name: '心肝 • 普林西斯', title: '學生', image: 'images/students/心肝 • 普林西斯.png' },
        { id: 6, type: 'student', name: '伊凡•莫爾', title: '學生', image: 'images/students/伊凡•莫爾.png' },
        { id: 7, type: 'student', name: '吉米 • 湯馬斯', title: '學生', image: 'images/students/吉米 • 湯馬斯.png' },
        { id: 8, type: 'student', name: '杜威・庫柏恩', title: '學生', image: 'images/students/杜威・庫柏恩.png' },
        { id: 9, type: 'student', name: '芙莉．佛力', title: '學生', image: 'images/students/芙莉．佛力.png' },
        { id: 10, type: 'student', name: '夏綠蒂．華倫', title: '學生', image: 'images/students/夏綠蒂．華倫.png' },
        { id: 11, type: 'student', name: '烏拉菈•艾寶', title: '學生', image: 'images/students/烏拉菈•艾寶.png' },
        { id: 22, type: 'student', name: '烏魯魯奇雅．瑪拉', title: '學生', image: 'images/students/烏魯魯奇雅．瑪拉.png' },
        { id: 12, type: 'student', name: '莉絲·菲伊', title: '學生', image: 'images/students/莉絲·菲伊.png' },
        { id: 21, type: 'student', name: '凱文．諾瓦克', title: '學生', image: 'images/students/凱文．諾瓦克.png' },
        { id: 13, type: 'student', name: '愛・洛溫斯特', title: '學生', image: 'images/students/愛・洛溫斯特.png' },
        { id: 14, type: 'student', name: '溫加·癲拉唯啊撒', title: '學生', image: 'images/students/溫加·癲拉唯啊撒.png' },
        { id: 15, type: 'student', name: '雷歐．提力斯', title: '學生', image: 'images/students/雷歐．提力斯.png' },
        { id: 16, type: 'student', name: '福瑞．布萊梅', title: '學生', image: 'images/students/福瑞．布萊梅.png' },
        { id: 17, type: 'student', name: '維恩．阿斯特', title: '學生', image: 'images/students/維恩．阿斯特.png' },
        { id: 18, type: 'student', name: '蕾貝卡．羅溫', title: '學生', image: 'images/students/蕾貝卡．羅溫.png' },
        { id: 19, type: 'student', name: '蹦．撤卡拉卡', title: '學生', image: 'images/students/蹦．撤卡拉卡.png' },
        { id: 20, type: 'student', name: '鵝嵋珊 • 荷歡珊', title: '學生', image: 'images/students/鵝嵋珊 • 荷歡珊.png' },
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
    faculty() {
      return this.people.filter(x => x.type === 'faculty');
    },
    leaders() {
      return this.people.filter(x => x.type === 'leader');
    },
    students() {
      return this.people.filter(x => x.type === 'student');
    }
  },

  mounted() {
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
      this.page = target;
      this.mobileOpen = false;
      this.lightbox = null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    openLightbox(item) {
      this.lightbox = item;
      document.body.style.overflow = 'hidden';
    },

    closeLightbox() {
      this.lightbox = null;
      document.body.style.overflow = '';
    },

    nextPhoto() {
      const list = this.filteredGallery;
      if (!this.lightbox || !list.length) return;
      const i = list.findIndex(x => x.id === this.lightbox.id);
      this.lightbox = list[(i + 1) % list.length];
    },

    prevPhoto() {
      const list = this.filteredGallery;
      if (!this.lightbox || !list.length) return;
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
