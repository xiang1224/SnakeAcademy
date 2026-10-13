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
      infoPages: ['gathering', 'monsters', 'stones', 'professors', 'tablets'],
      // 情報區內需要密碼才能進入的頁面。
      // 「教授們相關」目前不需要密碼，故不列在這裡；其餘情報頁維持上鎖。
      lockedInfoPages: ['gathering', 'monsters', 'stones', 'tablets'],
      passwordModal: false,
      passwordInput: '',
      passwordError: '',
      showPassword: false,
      pendingInfoPage: null,
      infoSessionKey: 'snakeAcademyInfoAuth',
      infoSessionDuration: 30 * 60 * 1000,
      sessionCheckTimer: null,
      showRecipes: false,
      // 資料較多的頁面：預設只顯示前幾筆，每按一次「展開更多」再多載入一批，不會一次全開。
      // previewCounts = 一開始顯示幾筆；stepCounts = 每次點擊多顯示幾筆。
      visibleCounts: { students: 3, gallery: 6, stones: 6, professors: 3, tablets: 3 },
      previewCounts: { students: 3, gallery: 6, stones: 6, professors: 3, tablets: 3 },
      stepCounts: { students: 6, gallery: 6, stones: 6, professors: 3, tablets: 3 },
      highlightedMaterial: null,
      // 採集相關改成文字清單：圖片只在「滑鼠移入預覽」或「點擊展開」時才會建立並讀取。
      gatherSearch: '',     // 採集清單搜尋關鍵字
      openGatherId: null,   // 目前點擊展開的採集物 id
      gatherHover: null,    // 滑鼠目前停留的項目與座標：{ item, x, y }

      // ====== 你之後主要修改這裡的資料 ======
      gallery: [
        { id: 1, name: '開學典禮', category: '學院活動', image: 'images/gallery/開學典禮.webp' },
        { id: 2, name: '毒蛇大合照', category: '校園日常', image: 'images/gallery/毒蛇大合照.webp' },
        { id: 3, name: '地震中', category: '校園日常', image: 'images/gallery/地震.webp' },
        { id: 4, name: '第一次班會紀錄', category: '校園日常', image: 'images/gallery/班會.webp' },
        { id: 5, name: '歷史課', category: '課堂側拍', image: 'images/gallery/歷史課.webp' },
        { id: 6, name: '魔法理論課', category: '課堂側拍', image: 'images/gallery/魔法理論課.webp' },
        { id: 7, name: '粉紅泡泡隊', category: '學院活動', image: 'images/gallery/粉紅泡泡隊.webp' },
        { id: 8, name: '灰蛇厲害隊', category: '學院活動', image: 'images/gallery/灰蛇厲害隊.webp' },
        { id: 9, name: '團康遊戲', category: '學院活動', image: 'images/gallery/團康遊戲.webp' },
        { id: 10, name: '迷霧術課程', category: '課堂側拍', image: 'images/gallery/迷霧術.webp' },
        { id: 11, name: '毒蛇雞同鴨講(布崔黑水派)', category: '學院活動', image: 'images/gallery/布崔黑水派.gif' },
        { id: 12, name: '毒蛇雞同鴨講(純潔天使)', category: '學院活動', image: 'images/gallery/純潔天使.gif' },
        { id: 13, name: '毒蛇雞同鴨講(晚安啾啾)', category: '學院活動', image: 'images/gallery/晚安啾啾.gif' },
        { id: 14, name: '優莉安娜生日會', category: '學院活動', image: 'images/gallery/優莉安娜生日會.webp' },
        { id: 15, name: '遊艇舞會', category: '學院活動', image: 'images/gallery/遊艇舞會.webp' },
        { id: 16, name: '舞會合照', category: '學院活動', image: 'images/gallery/舞會合照.webp' },
      ],

      // 魔物圖鑑：圖片只有在被選中時才會讀取。image 路徑請對應 images/monsters/ 內的檔名。
      selectedMonsterId: 1,
      monsters: [
        {
          "id": 1,
          "name": "斷首屠夫",
          "alias": "白刃監刑者",
          "category": "地牢異變種・重裝近戰型",
          "stars": 4,
          "danger": "高危險",
          "levelLabel": "四級警戒",
          "level": 4,
          "stats": {
            "力量": 10,
            "速度": 4,
            "防禦": 8,
            "感知": 5,
            "魔力": 2,
            "智慧": 4
          },
          "features": [
            "裝備巨型砍刀，具備正面壓制、重擊可破盾、攻擊範圍廣，步伐沉重但耐久驚人。"
          ],
          "weaknesses": [
            "身體與收刀速度慢，揮砍後有明顯硬直。",
            "膝部與持刀手腕防護不足。",
            "狹窄障礙可限制其揮刀。"
          ],
          "tactic": "近距離**極危險**，中距離可周旋；建議 3-4 名受訓巫師協同牽制，切勿正面硬拚。",
          "warning": "切勿與其在狹窄走廊正面交鋒。",
          "image": "images/monsters/Executioner.webp"
        },
        {
          "id": 2,
          "name": "噬音長喉",
          "alias": "地牢哀鳴者",
          "category": "深淵寄生種・近戰獵殺型",
          "stars": 4,
          "danger": "高危險",
          "levelLabel": "四級警戒",
          "level": 4,
          "stats": {
            "力量": 7,
            "速度": 6,
            "防禦": 7,
            "感知": 9,
            "魔力": 5,
            "智慧": 4
          },
          "features": [
            "無眼感知，依賴震動與聲音定位。",
            "長喉伸縮突襲、尖刺皮甲。",
            "擅長黑暗伏擊，會模仿求聲引誘獵物靠近，再以環狀利齒吞噬。"
          ],
          "weaknesses": [
            "強光會干擾其感知。",
            "高頻鐘鳴聲使其短暫僵直。",
            "頭部伸展時腹側甲片裸露。",
            "轉身緩慢。"
          ],
          "tactic": "近距離**極危險**，中距離**可控**；建議 3-4 名受訓巫師協同處理。",
          "warning": "切勿回應地牢中的求救聲。",
          "image": "images/monsters/Long-Throat.webp"
        },
        {
          "id": 3,
          "name": "噬聲裂冠",
          "alias": "地牢回音者",
          "category": "深淵擬聲種・近戰伏擊型",
          "stars": 4,
          "danger": "高危險",
          "levelLabel": "四級警戒",
          "level": 4,
          "stats": {
            "力量": 7,
            "速度": 7,
            "防禦": 6,
            "感知": 9,
            "魔力": 4,
            "智慧": 5
          },
          "features": [
            "無眼感知，依賴震動與聲音定位。",
            "裂冠口器可瞬間張開，近距離撕咬。",
            "能模仿同伴或求救聲誘敵。",
            "四肢細長，擅長貼牆潛伏與突然襲擊。"
          ],
          "weaknesses": [
            "強光會干擾其聲波定位。",
            "鐘鳴、金屬共振等高頻持續噪音會使其短暫失衡。",
            "張開口器準備撲咬時，胸腹部甲膜暴露出。",
            "轉向速度慢，不擅長在開闊地追擊。"
          ],
          "tactic": "近距離**極危險**，中距離**可控**；建議 3-4 名受訓巫師協同處理。",
          "warning": "切勿回應地牢中的求救聲。",
          "image": "images/monsters/Rift-Crown.webp"
        },
        {
          "id": 4,
          "name": "腐蝕行者",
          "alias": "腐肉寄生體",
          "category": "變異生物・寄生感染型",
          "stars": 4,
          "danger": "高危險",
          "levelLabel": "三級警戒",
          "level": 3,
          "stats": {
            "力量": 7,
            "速度": 5,
            "防禦": 6,
            "感知": 8,
            "魔力": 7,
            "智慧": 3
          },
          "features": [
            "寄生孢子：可感染生物造成持續腐蝕傷害。",
            "再生能力：部分肢體快速再生。",
            "異常感知。",
            "長時間潛伏（不主動攻擊）。",
            "腐蝕血液：接觸後造成組織壞死。"
          ],
          "weaknesses": [
            "高溫火焰可燒毀孢子與外層組織。",
            "聖光與淨化魔法能有效抑制感染。",
            "頭部與心臟雖難以攻擊但可致命。"
          ],
          "tactic": "近距離**高危險**，中遠距離**中等危險**；建議 3-4 名受訓巫師協同作戰，並攜帶火焰魔法或淨化道具。",
          "warning": "孢子感染具有高度傳染性，切勿靠近或觸碰。",
          "image": "images/monsters/Corrosion-Walker.webp"
        },
        {
          "id": 5,
          "name": "灰影狼人",
          "alias": "月眠者",
          "category": "變異生物・夜行獵殺型",
          "stars": 4,
          "danger": "高危險",
          "levelLabel": "三級警戒",
          "level": 3,
          "stats": {
            "力量": 8,
            "速度": 9,
            "防禦": 7,
            "感知": 8,
            "魔力": 5,
            "智慧": 6
          },
          "features": [
            "人形、狼形態可切換，敏捷迅速、擅長長距離突襲。",
            "具備強大再生能力、群體協同作戰能力與極佳夜間視力。"
          ],
          "weaknesses": [
            "強光照射（使視力暫時失明）。",
            "聖光與神聖魔法（抑制效果）。",
            "心臟與頭部（致命打擊）。",
            "水屬性魔法（降低速度與再生能力）。"
          ],
          "tactic": "近距離**極危險**，中距離**高危險**；建議 3-5 名受訓巫師協同應對，並攜帶照明術與聖光魔法。",
          "warning": "月圓之夜活動頻繁，請避免單獨前往山林。",
          "image": "images/monsters/Grey-Werewolf.webp"
        },
        {
          "id": 6,
          "name": "亡骸行者",
          "alias": "枯骨遊魂",
          "category": "不死系・亡靈型・近戰突襲型",
          "stars": 4,
          "danger": "高危險",
          "levelLabel": "四級警戒",
          "level": 4,
          "stats": {
            "力量": 7,
            "速度": 6,
            "防禦": 7,
            "感知": 8,
            "魔力": 4,
            "智慧": 2
          },
          "features": [
            "融合多具屍骨的畸變體，披著破爛兜帽與殘破布甲，以亡骸為裝飾與武器。",
            "動作詭異但攻擊迅速，擅長群體行動，對聲音與血腥氣味極為敏感。"
          ],
          "weaknesses": [
            "頭部核心（黏體本體）。",
            "神聖魔法與光屬性攻擊。",
            "火焰與淨化類咒語效果顯著。",
            "破壞其骨骼結構可暫時癱瘓。",
            "群體同時攻擊可降低威脅。"
          ],
          "tactic": "近距離**高危險**，中距離**中等危險**；建議 3 人以上組隊應對，優先集中攻擊頭部以避免被包圍，注意地形切勿在狹窄空間作戰。",
          "warning": "常以群體出現，切勿單獨進入禁域地牢。",
          "image": "images/monsters/Bone-Walker.webp"
        },
        {
          "id": 7,
          "name": "墓園翼魔",
          "alias": "沉默夜梟",
          "category": "不死系・亡靈型・飛行襲擊型",
          "stars": 4,
          "danger": "高危險",
          "levelLabel": "四級警戒",
          "level": 4,
          "stats": {
            "力量": 6,
            "速度": 9,
            "防禦": 5,
            "感知": 10,
            "魔力": 6,
            "智慧": 3
          },
          "features": [
            "巨型蝙蝠外形具高度飛行能力，擁有極佳夜視與聽覺感知。",
            "能在空中無聲接近目標，擅長以爪擊捕抓獵物帶至高空。",
            "對聲音極為敏感，成群行動常在墓園與高塔盤旋。"
          ],
          "weaknesses": [
            "強光 / 火焰有明顯克制。",
            "噪音干擾使其行動遲緩。",
            "頭部與胸口為主要弱點。",
            "翅膜脆弱，受攻擊易失去飛行能力。",
            "畏懼聖屬性魔法與驅魔咒。",
            "在陽光下活動力大幅下降。"
          ],
          "tactic": "近距離**中等危險**，中距離與遠距離皆為**高危險**；建議 3-4 名受訓巫師協同作戰，優先使用光源、火焰與驅魔咒，避免在黑暗環境中單獨行動。",
          "warning": "聽見翅聲時，立即尋找光源並保持安靜，切勿抬頭移動！",
          "image": "images/monsters/Graveyard-Wyvern.webp"
        },
        {
          "id": 8,
          "name": "夜影追獵者",
          "alias": "墓園鴉翼",
          "category": "不死系・亡靈型・飛行突襲型",
          "stars": 4,
          "danger": "高危險",
          "levelLabel": "四級警戒",
          "level": 4,
          "stats": {
            "力量": 7,
            "速度": 9,
            "防禦": 6,
            "感知": 8,
            "魔力": 7,
            "智慧": 6
          },
          "features": [
            "擁有巨大蝙蝠翅膀能高速飛行，寂靜無聲的空中突襲。",
            "戴著破舊帽子與長風衣，腐壞的面容散發死靈氣息。",
            "喜歡從黑暗高處監視獵物，擅長抓取並帶走目標，出現時常伴隨陰風與低語。"
          ],
          "weaknesses": [
            "強光照射會短暫失去行動。",
            "聖屬性魔法效果顯著。",
            "頭部是主要弱點。",
            "翅膀受損會大幅降低飛行能力。",
            "對火焰、光明系咒語特別脆弱。"
          ],
          "tactic": "近距離與中距離皆為**高危險**，遠距離為**中等危險**；建議 3-5 名受訓巫師協同作戰，優先利用光源與聖屬性魔法進行壓制，避免單獨行動。",
          "warning": "天空陰影出現時，立即尋找遮蔽物並保持光源！",
          "image": "images/monsters/Night-Stalker.webp"
        }
      ],

      gatheringSpots: [
        { id: 1, name: '水晶蘑菇', type: 'Crystal Mushroom', use: '降低、穩定精神及魔力活動，可用來製作魅惑藥水。', location: '地圖活米村上方墓園處', image: './images/material/Crystal_Mushroom.webp', mapImage: 'images/map/mushroom-map.webp', actualImage: 'images/map/mushroom.webp' },
        { id: 2, name: '魔力泉水', type: 'Magical Spring Water', use: '可用於基礎藥劑、料理與部分魔法配方。', location: '地圖活米村左上側森林處', image: './images/material/Magical_Spring_Water.webp', mapImage: 'images/map/water-map.webp', actualImage: 'images/map/water.webp' },
        { id: 3, name: '魔法之花', type: 'Magic Flower', use: '可用於基礎藥劑、料理與部分魔法配方。', location: '地圖活米村右下側公園處(有個恐龍)', image: './images/material/Magic_Flower.webp', mapImage: './images/map/flower-map.webp', actualImage: 'images/map/flower.webp' },
        { id: 4, name: '妖精花粉', type: 'Fairy Pollen', use: '促進身體代謝，可用於基礎藥劑、料理與部分魔法配方。', location: '霍格華茲正門噴水池', image: './images/material/Fairy_Pollen.webp', mapImage: 'images/map/pollen-map.webp', actualImage: 'images/map/pollen.webp' },
        { id: 5, name: '龍血藤', type: 'Dragon Blood', use: '刺激身體及魔力活動，可用來製作腎上腺素。', location: '地圖魁地奇球場右上方', image: './images/material/Dragon_Blood.webp', mapImage: 'images/map/blood-map.webp', actualImage: 'images/map/blood.webp' },
        { id: 6, name: '蜂王蜜', type: 'Honey', use: '可用來製作沉睡藥水。', location: '活米村北方', image: './images/material/Honey.webp', mapImage: 'images/map/honey-map.webp', actualImage: 'images/map/honey.webp' },
        { id: 7, name: '水晶花', type: 'Crystal Flower', use: '尚未知曉用途。', location: '花園', image: './images/material/Ice-Flower.webp', mapImage: 'images/map/ice-flower-map.webp', actualImage: 'images/map/ice-flower.webp' },
        { id: 8, name: '尖叫草', type: 'Scream Flower', use: '能夠放大其他材料的魔力效果，可用來製作特級藥水。', location: '很南方的巨石陣', image: './images/material/scream.webp', mapImage: 'images/map/scream-map.webp', actualImage: 'images/map/scream.webp' },
        // ↓↓↓ 這兩筆是合成表新增的材料，圖片與地點還沒補上實際資料，先用預留檔名，記得之後把對應圖片放進 images 資料夾
        { id: 9, name: '怪物精華', type: 'Monster Essence', use: '啟動或活化藥劑中的魔力，擊敗怪物後掉落，可用於各類藥水合成。', location: '擊殺地圖標記處之魔物均有機率掉落', image: './images/material/marrow.webp', mapImage: 'images/map/monster-map.webp', actualImage: 'images/map/monster.webp' },
        { id: 10, name: '魔石', type: 'Magic Stone', use: '可用於各類藥水合成。', location: '擊殺地圖標記處之魔物均有機率掉落', image: './images/material/magicrock.webp', mapImage: 'images/map/monster-map.webp', actualImage: 'images/map/monster.webp' },
        { id: 11, name: '靜心草', type: 'Tranquility-Herb', use: '尚未知曉用途。', location: '地圖活米村右下側公園處(有個恐龍)', image: './images/material/Tranquility-Herb.webp', mapImage: './images/map/flower-map.webp', actualImage: 'images/map/flower.webp', chance: true },
        { id: 12, name: '搔癢草', type: 'Itching-Powder-Herb', use: '尚未知曉用途。', location: '地圖活米村右下側公園處(有個恐龍)', image: './images/material/Itching-Powder-Herb.webp', mapImage: './images/map/flower-map.webp', actualImage: 'images/map/flower.webp', chance: true },
        { id: 13, name: '灰岩苔', type: 'Limestone-Moss', use: '尚未知曉用途。', location: '地圖活米村右下側公園處(有個恐龍)', image: './images/material/Limestone-Moss.webp', mapImage: './images/map/flower-map.webp', actualImage: 'images/map/flower.webp', chance: true },
        { id: 14, name: '月光草', type: 'Moonlight-Herb', use: '尚未知曉用途。', location: '地圖活米村右下側公園處(有個恐龍)', image: './images/material/Moonlight-Herb.webp', mapImage: './images/map/flower-map.webp', actualImage: 'images/map/flower.webp', chance: true },
        { id: 15, name: '腐心草', type: 'Rotheart-Herb', use: '尚未知曉用途。', location: '地圖活米村右下側公園處(有個恐龍)', image: './images/material/Rotheart-Herb.webp', mapImage: './images/map/flower-map.webp', actualImage: 'images/map/flower.webp', chance: true },
        { id: 16, name: '烈焰花', type: 'Flame-Flower', use: '尚未知曉用途。', location: '花園', image: './images/material/Flame-Flower.webp', mapImage: 'images/map/ice-flower-map.webp', actualImage: 'images/map/ice-flower.webp', chance: true },
        { id: 17, name: '迴聲花瓣', type: 'Echo-Petal', use: '尚未知曉用途。', location: '花園', image: './images/material/Echo-Petal.webp', mapImage: 'images/map/ice-flower-map.webp', actualImage: 'images/map/ice-flower.webp', chance: true },
        { id: 18, name: '混亂藤', type: 'Chaos-Vine', use: '尚未知曉用途。', location: '地圖魁地奇球場右上方', image: './images/material/Chaos-Vine.webp', mapImage: 'images/map/blood-map.webp', actualImage: 'images/map/blood.webp', chance: true },
        { id: 19, name: '學舌草', type: 'Mimic-Herb', use: '尚未知曉用途。', location: '地圖活米村右下側公園處(有個恐龍)', image: './images/material/Mimic-Herb.webp', mapImage: './images/map/flower-map.webp', actualImage: 'images/map/flower.webp', chance: true },
        { id: 20, name: '陽光果', type: 'Sunfruit', use: '尚未知曉用途。', location: '地圖活米村上方墓園處', image: './images/material/Sunfruit.webp', mapImage: 'images/map/mushroom-map.webp', actualImage: 'images/map/mushroom.webp', chance: true },
        { id: 21, name: '火椒果', type: 'Firepepper-Fruit', use: '尚未知曉用途。', location: '地圖活米村上方墓園處', image: './images/material/Firepepper-Fruit.webp', mapImage: 'images/map/mushroom-map.webp', actualImage: 'images/map/mushroom.webp', chance: true },
      ],

      // 藥水合成表：採集相關頁面使用
      craftingRecipes: [
        { id: 1, name: '魔力恢復藥水', materials: [{ name: '怪物精華', qty: 2 }, { name: '魔法之花', qty: 2 }, { name: '魔石', qty: 2 }] },
        { id: 2, name: '能量護盾藥水', materials: [{ name: '怪物精華', qty: 2 }, { name: '魔法之花', qty: 2 }, { name: '魔石', qty: 2 }] },
        { id: 3, name: '強力心臟藥水', materials: [{ name: '怪物精華', qty: 2 }, { name: '魔法之花', qty: 2 }, { name: '魔石', qty: 2 }] },
        { id: 4, name: '回復藥水', materials: [{ name: '怪物精華', qty: 2 }, { name: '魔法之花', qty: 2 }, { name: '魔石', qty: 2 }] },
        { id: 5, name: '腎上腺素', materials: [{ name: '怪物精華', qty: 2 }, { name: '龍血藤', qty: 2 }, { name: '魔石', qty: 2 }] },
        { id: 6, name: '特效瀉藥', materials: [{ name: '怪物精華', qty: 2 }, { name: '妖精花粉', qty: 2 }, { name: '魔石', qty: 2 }] },
        { id: 7, name: '特級能量護盾藥水', materials: [{ name: '怪物精華', qty: 2 }, { name: '尖叫草', qty: 2 }, { name: '魔石', qty: 2 }, { name: '能量護盾藥水', qty: 1 }] },
        { id: 8, name: '特級強力心臟藥水', materials: [{ name: '怪物精華', qty: 2 }, { name: '尖叫草', qty: 2 }, { name: '魔石', qty: 2 }, { name: '強力心臟藥水', qty: 1 }] },
        { id: 9, name: '特級回復藥水', materials: [{ name: '怪物精華', qty: 2 }, { name: '尖叫草', qty: 2 }, { name: '魔石', qty: 2 }, { name: '回復藥水', qty: 1 }] },
        { id: 10, name: '魅惑藥水', materials: [{ name: '怪物精華', qty: 2 }, { name: '水晶蘑菇', qty: 2 }, { name: '魔石', qty: 2 }] },
        { id: 11, name: '沉睡藥水', materials: [{ name: '怪物精華', qty: 2 }, { name: '水晶蘑菇', qty: 2 }, { name: '魔石', qty: 2 }, { name: '蜂王蜜', qty: 2 }] }
      ],

      // mana（魔力消耗）、cooldown（冷卻時間）：填數字會自動加單位（冷卻為「秒」），也可填字串如 '3 分鐘'；null 會顯示「待補充」。
      magicStones: [
        {
          id: 1,
          name: '控血術',
          kind: '攻擊魔法',
          tags: ['控血'],
          use: '操縱目標體內的血液流動，可用於造成內傷使其跪下。',
          source: '課堂取得',
          mana: 15,
          cooldown: 15,
          image: './images/rock/red.webp'
        },
        {
          id: 2,
          name: '噬魔術',
          kind: '攻擊魔法',
          tags: ['噬魔'],
          use: '吞噬與消解敵方的魔力。',
          source: '課堂取得',
          mana: 25,
          cooldown: 13,
          image: './images/rock/red.webp'
        },
        {
          id: 3,
          name: '衝擊波',
          kind: '攻擊魔法',
          tags: ['衝擊'],
          use: '釋放強烈的魔力震盪，能產生衝擊力擊退敵人。',
          source: '課堂取得',
          mana: 15,
          cooldown: 10,
          image: './images/rock/red.webp'
        },
        {
          id: 4,
          name: '遲緩術',
          kind: '輔助控制魔法',
          tags: ['遲緩'],
          use: '降低目標的移動速度與反應力，有效減緩敵方的戰鬥節奏與行動能力。',
          source: '課堂取得',
          mana: 20,
          cooldown: 30,
          image: './images/rock/blue.webp'
        },
        {
          id: 5,
          name: '煙幕術',
          kind: '輔助控制魔法',
          tags: ['煙幕'],
          use: '召喚遮蔽視線與魔力感知的濃煙，適合用於干擾敵方判斷、偵查與潛行掩護，亦可與指定目標交換位置。',
          source: '課堂取得',
          mana: 20,
          cooldown: 8,
          image: './images/rock/blue.webp'
        },
        {
          id: 6,
          name: '擊倒術',
          kind: '輔助控制魔法',
          tags: ['擊倒'],
          use: '利用瞬間爆發的魔力衝擊破壞目標重心，使其摔倒在地並製造控場空檔。',
          source: '課堂取得',
          mana: 10,
          cooldown: 10,
          image: './images/rock/blue.webp'
        },
        {
          id: 7,
          name: '加速術',
          kind: '咒術魔法',
          tags: ['加速'],
          use: '大幅提升目標的移動速度與行動頻率，在戰鬥中獲得先手與閃避優勢。',
          source: '課堂取得',
          mana: 15,
          cooldown: 30,
          image: './images/rock/purple.webp'
        },
        {
          id: 8,
          name: '開鎖術',
          kind: '咒術魔法',
          tags: ['開鎖'],
          use: '以精準的魔力震盪解開各類機械鎖頭、魔導鎖或基礎封印結構。',
          source: '流浪商人販售',
          mana: 20,
          cooldown: 7,
          image: './images/rock/purple.webp'
        },
        {
          id: 9,
          name: '高躍術',
          kind: '咒術魔法',
          tags: ['高躍'],
          use: '增強腿部爆發力或施加輕量重力效果，使施法者能夠跳躍至高處或跨越障礙。',
          source: '課堂取得',
          mana: 20,
          cooldown: 10,
          image: './images/rock/purple.webp'
        },
        {
          id: 10,
          name: '黑妝術',
          kind: '咒術魔法',
          tags: ['黑妝'],
          use: '將暗影魔力附著於體表以遮蔽面貌，大幅提升在夜間與陰影中的隱匿能力。',
          source: '流浪商人販售',
          mana: null,
          cooldown: null,
          image: './images/rock/purple.webp'
        },
        {
          id: 11,
          name: '迷霧術',
          kind: '輔助控制魔法',
          tags: ['迷霧'],
          use: '展開大範圍大霧遮蔽戰場視線，干擾視野以爭取逃脫時間或進行戰術轉移。',
          source: '課堂取得',
          mana: 20,
          cooldown: 30,
          image: './images/rock/blue.webp'
        },
        {
          id: 12,
          name: '火球術',
          kind: '攻擊魔法',
          tags: ['火焰', '爆破'],
          use: '凝聚熾熱的高溫火球投擲向敵人，擊中時會引發範圍爆裂與持續灼燒傷害。',
          source: '課堂取得',
          mana: 35,
          cooldown: 35,
          image: './images/rock/red.webp'
        },
        {
          id: 13,
          name: '牽引術',
          kind: '咒術魔法',
          tags: ['牽引'],
          use: '釋放無形魔力，將距離自己最近的敵人強力彈開，迅速拉開安全距離。',
          source: '課堂取得',
          mana: 20,
          cooldown: 60,
          image: './images/rock/purple.webp'
        },
        {
          id: 14,
          name: '繳械術',
          kind: '咒術魔法',
          tags: ['繳械'],
          use: '發射精準的魔力衝擊，強行打落敵方手中持有的武器或魔導器具，削弱其攻擊能力。',
          source: '課堂取得',
          mana: 20,
          cooldown: 8,
          image: './images/rock/purple.webp'
        },
        {
          id: 15,
          name: '炸彈術',
          kind: '輔助控制魔法',
          tags: ['爆炸'],
          use: '發動後靠近目標將引發魔力共振強制定身對方，但強烈的反作用力也會使施法者自身同時陷入定身。',
          source: '課堂取得',
          mana: 40,
          cooldown: 30,
          image: './images/rock/blue.webp'
        },
        {
          id: 16,
          name: '水柱術',
          kind: '攻擊魔法',
          tags: ['水柱'],
          use: '召喚螺旋升騰的高壓水龍捲，強烈的水流衝擊能將範圍內的敵人捲入半空並造成傷害。',
          source: '課堂取得',
          mana: 40,
          cooldown: 30,
          image: './images/rock/red.webp'
        },
        {
          id: 17,
          name: '魔力盾',
          kind: '治療防禦魔法',
          tags: ['盾'],
          use: '凝聚密實的魔力屏障環繞全身，能在短時間內完全免疫所有來自敵方的魔法傷害與效果。',
          source: '課堂取得',
          mana: 45,
          cooldown: 120,
          image: './images/rock/green.webp'
        },
        {
          id: 18,
          name: '回春術',
          kind: '治療防禦魔法',
          tags: ['回春'],
          use: '導引溫和的自然魔力滋養傷口，為目標恢復少量的生命值。',
          source: '流浪女巫販售',
          mana: null,
          cooldown: null,
          image: './images/rock/green.webp'
        },
        {
          id: 19,
          name: '岩石術',
          kind: '攻擊魔法',
          tags: ['岩石'],
          use: '凝聚堅硬岩塊攻擊目標，命中軀幹可造成強力的單體傷害；若命中腳部則會引發地裂造成群體傷害。',
          source: '課堂取得',
          mana: 35,
          cooldown: 40,
          image: './images/rock/red.webp'
        },
        {
          id: 20,
          name: '照明術',
          kind: '咒術魔法',
          tags: ['照明'],
          use: '凝聚純淨光球懸浮於空中或跟隨自身，照亮周圍黑暗環境。',
          source: '歐克教授隨心情取得',
          mana: 10,
          cooldown: 0,
          image: './images/rock/purple.webp'
        },
        {
          id: 21,
          name: '致盲術',
          kind: '輔助控制魔法',
          tags: ['致盲'],
          use: '釋放暗影遮蔽目標視覺，使對方短暫陷入失明狀態並大幅降低命中率。',
          source: '課堂取得',
          mana: 40,
          cooldown: 30,
          image: 'images/rock/blue.webp'
        },
        {
          id: 22,
          name: '閃步術',
          kind: '輔助控制魔法',
          tags: ['閃步'],
          use: '壓縮空間進行短距離瞬間移動，能靈巧地躲避敵方攻擊或瞬間拉開/逼近距離。',
          source: '課堂取得',
          mana: 25,
          cooldown: 6,
          image: 'images/rock/blue.webp'
        },
        {
          id: 23,
          name: '暴風雪',
          kind: '攻擊魔法',
          tags: ['暴風雪'],
          use: '在指定區域召喚小範圍狂暴冰雪，對區域內的敵人造成冰霜傷害。',
          source: '課堂取得',
          mana: 40,
          cooldown: 35,
          image: 'images/rock/red.webp'
        },
        {
          id: 24,
          name: '召喚術',
          kind: '咒術魔法',
          tags: ['召喚'],
          use: '以法杖指向目標並鎖定魔力，強制將遠處被指到的敵人或目標瞬間拉至自己面前。',
          source: '課堂取得',
          mana: 40,
          cooldown: 30,
          image: 'images/rock/purple.webp'
        },
        {
          id: 25,
          name: '回血術',
          kind: '治療防禦魔法',
          tags: ['回血'],
          use: '調動細緻的魔力溫和包裹全身，能快速癒合身體表面所有的微小傷口並穩定傷勢。',
          source: '課堂取得',
          mana: 30,
          cooldown: 300,
          image: './images/rock/green.webp'
        },
        {
          id: 26,
          name: '失衡術',
          kind: '輔助控制魔法',
          tags: ['失衡'],
          use: '干擾目標前庭感官與肢體協調，使其瞬間喪失平衡能力並癱軟在地，持續約10秒無法正常行動。',
          source: '課堂取得',
          mana: 35,
          cooldown: 60,
          image: 'images/rock/blue.webp'
        }
      ],

      // 情報區「禁忌的石碑」：世界觀失落歷史碎片
      // 共 7 塊，傳說中或許存在第 8 塊（真偽未證實）
      // discovered: false 代表尚未尋獲的石碑，之後找到內容時把 discovered 改成 true 並補上 subtitle / lines 即可
      totalTabletsCount: 7,
      forbiddenTablets: [
        {
          id: 1,
          discovered: true,
          subtitle: '失落的歷史',
          lines: [
            '王選擇把自己的靈魂撕裂。',
            '化作七道墜落世界的流星。'
          ]
        },
        {
          id: 2,
          discovered: true,
          subtitle: '失落的歷史',
          lines: [
            '森林被挖空。',
            '河流失去光芒。',
            '魔族死於沒有魔素的夜晚。'
          ]
        },
        {
          id: 3,
          discovered: true,
          subtitle: '失落的歷史',
          lines: [
            '人類駕船穿越黑海。',
            '他們不是為了和平而來。',
            '而是為了掠奪力量。'
          ]
        },
        {
          id: 4,
          discovered: true,
          subtitle: '失落的歷史',
          lines: [
            '願千年後族人幫助復甦。',
            '人族因掠奪魔素打造魔法王國。'
          ]
        },
        {
          id: 5,
          discovered: true,
          subtitle: '失落的歷史',
          lines: [
            '第五位英雄試圖阻止人類，最終反被四位英雄殺害。',
            '因此，他的名字被從歷史中抹去。'
          ]
        },
        {
          id: 6,
          discovered: true,
          subtitle: '失落的歷史',
          lines: [
            '魔族沒有選擇反抗到底。',
            '王選擇犧牲自己。'
          ]
        },
        {
          id: 7,
          discovered: false
        }
      ],

      people: [
        // ====== 教師群(校長 → 訓導老師 → 教授們)，編號獨立於學生 ======
        { id: 1, type: 'faculty', intelOnly: true, name: '彼得 • 楊', title: '校長', expertise: '學院行政與治理', bio: '總管學院行政與各項重大決策，統籌全院運作。', image: 'images/teachers/彼得 • 楊.webp' },

        { id: 2, type: 'faculty', intelOnly: true, name: '芭別 • 喬', title: '訓導老師', expertise: '學生生活輔導', bio: '負責學生生活常規與紀律管理。', image: 'images/teachers/teacher-10.webp' },
        { id: 3, type: 'faculty', intelOnly: true, name: '克羅斯 • 蘭斯洛特', title: '訓導老師', expertise: '學生生活輔導', bio: '負責學生生活常規與紀律管理。', image: 'images/teachers/teacher-11.webp' },
        { id: 4, type: 'faculty', intelOnly: true, name: '魯迪烏斯．格雷拉特', title: '訓導老師', expertise: '學生生活輔導', bio: '負責學生生活常規與紀律管理。', image: 'images/teachers/魯迪烏斯．格雷拉特.webp' },
        { id: 5, type: 'faculty', intelOnly: true, name: '卡能傑 • 丁格', title: '訓導老師', expertise: '學生生活輔導', bio: '負責學生生活常規與紀律管理。', image: 'images/teachers/teacher-13.webp' },
        { id: 6, type: 'faculty', intelOnly: true, name: '奈爾 • 奧斯本', title: '訓導老師', expertise: '學生生活輔導', bio: '負責學生生活常規與紀律管理。', image: 'images/teachers/teacher-14.webp' },
        { id: 7, type: 'faculty', intelOnly: true, name: '帕比 • 索恩維亞', title: '訓導老師', expertise: '學生生活輔導', bio: '負責學生生活常規與紀律管理。', image: 'images/teachers/帕比．索恩維亞.webp' },

        { id: 8, type: 'faculty', intelOnly: true, name: '洛克 • K', title: '課程教授', expertise: '雙手劍', bio: '教授雙手劍術，注重實戰技巧與體能訓練。', image: 'images/teachers/洛克•K.webp', liveUrl: 'https://www.twitch.tv/mrbird2000' },
        { id: 9, type: 'faculty', intelOnly: true, house: '凍狼學院', name: '洛恩 • 維特斯', title: '課程教授', expertise: '魔藥學', bio: '任教於凍狼學院，專精魔藥調配與藥理研究。', image: 'images/teachers/洛恩 • 維特斯.webp', liveUrl: 'https://www.twitch.tv/abcabc0620' },
        { id: 10, type: 'faculty', intelOnly: true, house: '凍狼學院', name: '約翰 • 康斯坦丁', title: '課程教授', expertise: '攻擊魔法', bio: '任教於凍狼學院，專精攻擊性魔法的施展與教學。', image: 'images/teachers/約翰•康斯坦丁.webp' },
        { id: 11, type: 'faculty', intelOnly: true, house: '老虎學院', name: '艾莉森 • 奧爾洛夫', title: '課程教授', expertise: '魔藥學', bio: '任教於老虎學院，擅長進階魔藥配方設計。', image: 'images/teachers/艾莉森 • 奧爾洛夫.webp', liveUrl: 'https://www.twitch.tv/ume_zz' },
        { id: 12, type: 'faculty', house: '老虎學院', name: '哈爾 • 詹金斯', title: '教授', image: 'images/students/1.webp' },
        { id: 13, type: 'faculty', intelOnly: true, house: '鳳凰學院', name: '貝爾 • 奧利安', title: '課程教授', expertise: '攻擊魔法', bio: '任教於鳳凰學院，致力於培養學生的實戰魔法能力。', image: 'images/teachers/貝爾•奧利安.webp' },
        { id: 14, type: 'faculty', intelOnly: true, house: '鳳凰學院', name: '傑克 • 唐 • 祖利亞', title: '課程教授', expertise: '咒術學', bio: '任教於鳳凰學院，專精咒術學的理論與應用。', image: 'images/teachers/傑克 • 唐 • 祖利亞.webp' },

        { id: 15, type: 'faculty', house: 'snake', name: '歐克 • 科布拉', title: '教授', bio: '負責學院教學與學生指導。', expertise: '魔法理論、實戰指導', image: 'images/teachers/teacher-01.webp', liveUrl: 'https://www.twitch.tv/kosh1106' },
        { id: 16, type: 'faculty', house: 'snake', name: '比莉 • 艾利殊', title: '教授', bio: '負責課程規劃與學院事務。', expertise: '歷史、戰術與課程規劃', image: 'images/teachers/teacher-02.webp' },

        // ====== 學生群，編號與教師群分開，各自從 1 開始 ======
        { id: 1, type: 'student', name: '優莉安娜．溫特貝爾', title: '學生', image: 'images/students/優莉安娜．溫特貝爾.webp', liveUrl: 'https://www.twitch.tv/loveuu_uu' },
        { id: 2, type: 'leader', name: '茶漓．阿斯特', title: '班長', bio: '協助教授管理班級與維持團隊秩序。', image: 'images/students/茶漓．阿斯特.webp' },
        { id: 3, type: 'student', name: '心肝 • 普林西斯', title: '學生', image: 'images/students/心肝 • 普林西斯.webp' },
        { id: 4, type: 'student', name: '伊凡•莫爾', title: '學生', committee: '風紀委員會', image: 'images/students/伊凡•莫爾.webp' },
        { id: 5, type: 'student', name: '吉米 • 湯馬斯', title: '學生', image: 'images/students/吉米 • 湯馬斯.webp' },
        { id: 6, type: 'student', name: '杜威・庫柏恩', title: '學生', committee: '風紀委員會', image: 'images/students/杜威・庫柏恩.webp', liveUrl: 'https://www.twitch.tv/djiang_duuuku' },
        { id: 7, type: 'student', name: '芙莉．佛力', title: '學生', image: 'images/students/芙莉．佛力.webp' },
        { id: 8, type: 'leader', name: '夏綠蒂．華倫', title: '副班長', bio: '協助班長管理班級與維持團隊秩序。', image: 'images/students/夏綠蒂．華倫.webp', liveUrl: 'https://www.twitch.tv/amuam3u' },
        { id: 9, type: 'student', name: '烏拉菈•艾寶', title: '學生', image: 'images/students/烏拉菈•艾寶.webp', liveUrl: 'https://www.twitch.tv/rr_leice' },
        { id: 10, type: 'student', name: '烏魯魯奇雅．瑪拉', title: '學生', image: 'images/students/烏魯魯奇雅．瑪拉.webp' },
        { id: 11, type: 'student', name: '莉絲·菲伊', title: '學生', image: 'images/students/莉絲·菲伊.webp', liveUrl: 'https://www.twitch.tv/1nom1' },
        { id: 12, type: 'student', name: '凱文．諾瓦克', title: '學生', image: 'images/students/凱文．諾瓦克.webp', liveUrl: 'https://www.twitch.tv/capricornxiang' },
        { id: 13, type: 'student', name: '愛・洛溫斯特', title: '學生', image: 'images/students/愛・洛溫斯特.webp', liveUrl: 'https://www.twitch.tv/arielacc3' },
        { id: 14, type: 'student', name: '溫加·癲拉唯啊撒', title: '學生', image: 'images/students/溫加·癲拉唯啊撒.webp' },
        { id: 15, type: 'student', name: '雷歐．提力斯', title: '學生', image: 'images/students/雷歐．提力斯.webp', liveUrl: 'https://www.twitch.tv/pug_tw' },
        { id: 16, type: 'student', name: '福瑞．布萊梅', title: '學生', image: 'images/students/福瑞．布萊梅.webp', liveUrl: 'https://www.twitch.tv/ishikumason' },
        { id: 17, type: 'student', name: '維恩．阿斯特', title: '學生', image: 'images/students/維恩．阿斯特.webp' },
        { id: 18, type: 'student', name: '蕾貝卡．羅溫', title: '學生', image: 'images/students/蕾貝卡．羅溫.webp', liveUrl: 'https://www.twitch.tv/wxyz_000' },
        { id: 19, type: 'gifted', name: '蹦．撤卡拉卡', title: '資優生', bio: '負責教學弟們搭訕。', image: 'images/students/蹦．撤卡拉卡.webp', liveUrl: 'https://www.twitch.tv/kaleo_c' },
        { id: 20, type: 'student', name: '鵝嵋珊 • 荷歡珊', title: '學生', image: 'images/students/鵝嵋珊 • 荷歡珊.webp' },
        { id: 21, type: 'gifted', name: '伊芙琳．克羅伊斯', title: '資優生', bio: '負責細心呵護學弟妹們。', image: 'images/students/伊芙琳．克羅伊斯.webp', liveUrl: 'https://www.twitch.tv/hachi0u0' },
        { id: 22, type: 'student', name: '莉絲·羅文', title: '學生', image: 'images/students/莉絲·羅文.webp', liveUrl: 'https://www.twitch.tv/yidhra0727' },
        { id: 23, type: 'student', name: '亞瑟 • 金斯利', title: '學生', image: 'images/students/亞瑟 • 金斯利.webp' },
        { id: 24, type: 'student', name: '哈比·麥·貴度', title: '學生', committee: '風紀委員會', image: 'images/students/哈比·麥·貴度.webp', liveUrl: 'https://www.twitch.tv/tnyuuta' },
        { id: 25, type: 'student', name: '熙振．泰瑞托', title: '學生', image: 'images/students/熙振．泰瑞托.webp' },
        { id: 26, type: 'student', name: '伊莉莎．霍普', title: '學生', image: 'images/students/伊莉莎．霍普.webp' },
        { id: 27, type: 'student', name: '露娜．索爾貝克', title: '學生', committee: '風紀委員會', image: 'images/students/露娜．索爾貝克.webp', liveUrl: 'https://www.twitch.tv/boss_guan' },
        { id: 28, type: 'student', name: '凱斯·凱爾采', title: '學生', image: 'images/students/凱斯·凱爾采.webp' },
        { id: 29, type: 'student', name: '史崔克·東', title: '學生', image: 'images/students/史崔克·東.webp', liveUrl: 'https://www.twitch.tv/hirnmampfer' },
        { id: 30, type: 'student', name: '肯尼‧佛斯特', title: '學生', image: 'images/students/肯尼‧佛斯特.webp' },
        { id: 31, type: 'student', name: '萊恩‧衛斯理', title: '學生', image: 'images/students/萊恩‧衛斯理.webp' },
        { id: 32, type: 'student', name: '愛德華‧ 艾力克', title: '學生', image: 'images/students/愛德華‧ 艾力克.webp' },
        { id: 33, type: 'student', name: '沃特·溫特貝爾', title: '學生', image: 'images/students/沃特·溫特貝爾.webp', liveUrl: 'https://www.twitch.tv/waterday0930' },
        { id: 34, type: 'student', name: '派‧溫特貝爾', title: '學生', image: 'images/students/派‧溫特貝爾.webp', liveUrl: 'https://www.twitch.tv/waterday0930' },
        { id: 35, type: 'student', name: '吳繫', title: '學生', image: 'images/students/吳繫.webp' },
        { id: 36, type: 'student', name: '狄龍 ‧ 海爾', title: '學生', image: 'images/students/狄龍 ‧ 海爾.webp' },
        { id: 37, type: 'student', name: '哈利．波波', title: '學生', image: 'images/students/哈利．波波.webp' },
        { id: 38, type: 'student', name: '威廉．梵卓', title: '學生', image: 'images/students/威廉．梵卓.webp' },
        { id: 39, type: 'student', name: '約翰・亨特', title: '學生', image: 'images/students/約翰・亨特.webp' },
        { id: 40, type: 'student', name: '崔弗 • 崔老尼', title: '學生', image: 'images/students/崔弗 • 崔老尼.webp' },
        { id: 41, type: 'student', name: '奧爾菲斯 • 瑞斗', title: '學生', image: 'images/students/奧爾菲斯 • 瑞斗.webp' },
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
    currentMonster() {
      return this.monsters.find(m => m.id === this.selectedMonsterId) || null;
    },
    filteredGatheringSpots() {
      const keyword = this.gatherSearch.trim().toLowerCase();
      if (!keyword) return this.gatheringSpots;
      return this.gatheringSpots.filter(item =>
        [item.name, item.type, item.use, item.location].join(' ').toLowerCase().includes(keyword)
      );
    },
    filteredMagicStones() {
      const keyword = this.stoneSearch.trim().toLowerCase();
      return this.magicStones.filter(stone => {
        const matchCategory = this.stoneFilter === '全部' || stone.kind === this.stoneFilter;
        const searchable = [
          stone.name,
          stone.kind,
          stone.use,
          stone.source,
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
    },
    // 浮動預覽的位置：跟著滑鼠，靠近視窗邊緣時自動翻到另一側
    gatherPopStyle() {
      const h = this.gatherHover;
      if (!h) return {};
      const w = Math.min(600, window.innerWidth - 24);
      const estH = 250, gap = 22, pad = 12;
      let left = h.x + gap;
      if (left + w > window.innerWidth - pad) left = h.x - w - gap;
      left = Math.max(pad, Math.min(left, window.innerWidth - w - pad));
      let top = h.y + gap;
      if (top + estH > window.innerHeight - pad) top = h.y - estH - gap;
      top = Math.max(pad, top);
      return { width: w + 'px', left: left + 'px', top: top + 'px' };
    },
    discoveredTabletsCount() {
      return this.forbiddenTablets.filter(x => x.discovered).length;
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

  watch: {
    // 切換相簿分類、魔法石分類時，回到收合狀態
    galleryFilter() { this.collapse('gallery'); },
    stoneFilter() { this.collapse('stones'); },
    page() { this.gatherHover = null; },
    gatherSearch() { this.gatherHover = null; }
  },

  methods: {
    // ====== 點擊展開（分批載入） ======
    isSearchingStones(key) {
      return key === 'stones' && this.stoneSearch.trim() !== '';
    },
    canToggle(list, key) {
      return !this.isSearchingStones(key) && list.length > this.previewCounts[key];
    },
    preview(list, key) {
      if (this.isSearchingStones(key)) return list;
      return list.slice(0, this.visibleCounts[key]);
    },
    remaining(list, key) {
      return Math.max(0, list.length - this.visibleCounts[key]);
    },
    isExpanded(key) {
      return this.visibleCounts[key] > this.previewCounts[key];
    },
    showMore(key) {
      this.visibleCounts[key] += this.stepCounts[key];
    },
    collapse(key) {
      this.visibleCounts[key] = this.previewCounts[key];
    },
    moreLabel(list, key, unit) {
      const left = this.remaining(list, key);
      const next = Math.min(left, this.stepCounts[key]);
      return `展開更多（再顯示 ${next} ${unit}，還有 ${left} ${unit}）↓`;
    },

    go(target) {
      // 情報區登入在 30 分鐘內有效，期間切換情報頁面不需重新輸入密碼。
      if (this.lockedInfoPages.includes(target)) {
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
      if (this.lockedInfoPages.includes(this.page) && !this.isInfoSessionValid()) {
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

    // ====== 採集清單：滑鼠移入預覽 / 點擊展開 ======
    gatherPics(item) {
      return [
        { label: '採集物', src: item.image },
        { label: '地圖位置', src: item.mapImage },
        { label: '實際位置', src: item.actualImage }
      ];
    },
    toggleGather(item) {
      this.openGatherId = this.openGatherId === item.id ? null : item.id;
      if (this.openGatherId === item.id) this.gatherHover = null;
    },
    // 只有滑鼠（pointerType === 'mouse'）才顯示浮動預覽；觸控裝置改用點擊展開
    showGatherPreview(item, e) {
      if (e.pointerType !== 'mouse') return;
      this.gatherHover = { item, x: e.clientX, y: e.clientY };
    },
    moveGatherPreview(e) {
      if (e.pointerType !== 'mouse' || !this.gatherHover) return;
      this.gatherHover.x = e.clientX;
      this.gatherHover.y = e.clientY;
    },
    hideGatherPreview() {
      this.gatherHover = null;
    },

    // 點擊合成表材料標籤，捲動到對應的採集物卡片，
    // 若材料本身是另一款藥水（例如特級系列用到的基礎藥水），則捲動到該藥水的合成卡片
    scrollToMaterial(name) {
      const find = () => document.getElementById('gather-' + name) || document.getElementById('recipe-' + name);
      const run = el => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.highlightedMaterial = name;
        setTimeout(() => {
          if (this.highlightedMaterial === name) this.highlightedMaterial = null;
        }, 1600);
      };
      const el = find();
      if (el) return run(el);
      // 目標被搜尋條件過濾掉時，清除搜尋再捲動
      if (this.gatherSearch && this.gatheringSpots.some(x => x.name === name)) {
        this.gatherSearch = '';
        this.$nextTick(() => { const e2 = find(); if (e2) run(e2); });
      }
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
      return `${name || 'snake-academy-photo'}.webp`;
    },

    // ====== 魔物圖鑑 ======
    selectMonster(monster) {
      this.selectedMonsterId = monster.id;
      // 窄螢幕時名單在上、詳細資料在下，選取後自動捲到詳細資料
      if (window.innerWidth <= 960) {
        this.$nextTick(() => {
          this.$refs.monsterDetail?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    },
    // 把「近距離**極危險**」這種字串切成 [{ text, bold }]，避免使用 v-html
    splitBold(str) {
      return String(str).split('**').map((text, i) => ({ text, bold: i % 2 === 1 })).filter(x => x.text);
    },

    // 魔力消耗 / 冷卻時間顯示：未填顯示「待補充」，數字自動補單位
    statText(value, unit = '') {
      if (value === null || value === undefined || value === '') return '待補充';
      return typeof value === 'number' ? `${value}${unit}` : String(value);
    },
    isStatBlank(value) {
      return value === null || value === undefined || value === '';
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