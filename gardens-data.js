/* ============================================================
 * gardens-data.js — 共享数据层
 * 苏州园林志 · 全部核心页面（首页 / 列表 / 详情 / 沉浸场景页）共用同一数据源
 * 由 garden.html 抽取，保证单一事实来源，改一处全站同步。
 * ============================================================ */
(function(){
  // ===== 图片资源（Unsplash 图床 ID，本地 images/ 优先）=====
const IMG = [
  '1545569310-32c5bba7c0a3',
  '1518998053901-5348d3961a04',
  '1528115473883-4fa1c33c0105',
  '1565967511849-76a60a516170',
  '1582719471384-894fbb16e074',
  '1605429523419-d828acb941d8',
  '1583289139708-22fadd3d2a8f',
  '1542640244-7a672b1ca9b9',
  '1531259683007-016a943cdcdf',
  '1535139262971-5186b4810b3f',
  '1554253262-e3fb33b6ad73',
  '1568725259027-d99cc6a35b8a',
];
const url = (id, w=1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

const HERO_FN = {
  zhuozheng:'heroZhuozheng',
  liu:'heroLiu',
  wangshi:'heroWangshi',
  shizi:'heroShizi',
  canglang:'heroCanglang',
  yi:'heroYi',
  yipu:'heroYipu'
};

const SCENE_ILLU = {
  '远香堂':'sceneYuanXiangTang','小 飞 虹':'sceneXiaoFeiHong',
  '香 洲':'sceneXiangZhou','梧 竹 幽 居':'sceneWuZhu',
  '荷风四面亭':'sceneHeFengTing','小 沧 浪':'sceneXiaoCanglang',
  '涵碧山房':'sceneHanBiShanFang','冠 云 峰':'sceneGuanYunFeng',
  '楠 木 厅':'sceneNanMuTing','五峰仙馆':'sceneNanMuTing',
  '林泉耆硕之馆':'sceneHanBiShanFang','佳晴喜雨快雪之亭':'sceneCangLangTing',
  '殿 春 簃':'sceneDianChunYi','月到风来亭':'sceneYueDaoFengLai',
  '濯 缨 水 阁':'sceneXiaoCanglang','看松读画轩':'sceneKanShanLou',
  '引 静 桥':'sceneXiaoFeiHong','竹外一枝轩':'sceneWuZhu',
  '狮 子 峰':'sceneShiZiFeng','真 趣 亭':'sceneZhenQuTing',
  '燕 誉 堂':'sceneYanYuTang','指 柏 轩':'sceneWuZhu',
  '问 梅 阁':'sceneWenMeiGe','飞 瀑 亭':'sceneFeiPuTing',
  '沧 浪 亭':'sceneCangLangTing','五百名贤祠':'sceneDianChunYi',
  '看 山 楼':'sceneKanShanLou','面 水 轩':'sceneMianShuiXuan',
  '清 香 馆':'sceneDianChunYi','翠 玲 珑':'sceneWuZhu',
  '坡仙琴馆':'scenePoXian','拜 石 轩':'sceneBaiShiXuan',
  '锁 绿 轩':'sceneWuZhu','南 雪 亭':'sceneCangLangTing',
  '藕 香 榭':'sceneHeFengTing','碧梧栖凤':'sceneWuTongFeng',
  '别有洞天':'sceneYipuMoonGate','世 纶 堂':'sceneShiLunTang',
  '乳 鱼 亭':'sceneRuYuTing','思 嗜 轩':'sceneSiShiXuan',
  '延 光 阁':'sceneKanShanLou','芹 庐':'sceneBaiShiXuan',
  // 「六大名景」卡片用（features 的名称与 scenes 略有出入，单独补）
  '鱼 化 石':'sceneYuHuaShi','彩 霞 池':'sceneCaiXiaChi'
};

  const GARDENS = {
  zhuozheng: {
    name:'拙 政 园', alias:'江 南 园 林 之 冠 · 明 代 文 人 写 意 山 水 园',
    eyebrow:'第 一 园 · 明 代 · 一 五 一 三 年',
    heroImg:url(IMG[0], 1920),
    heroFocus:'center 52%',
    era:'明正德', founder:'王献臣', area:'约 78 亩', unesco:'1997',
    location:'苏州市姑苏区东北街178号',
    tags:['江南第一','文人写意','以水为骨'],
    introVerse:'绝怜人境无车马<br>信有山林在市城',
    introAuthor:'文徵明',
    scenes:[
      { name:'远香堂', alias:'荷 风 四 面 · 香 自 远 来', img:url(IMG[0]),
        verse:'堂前荷叶无穷碧，香远益清四望中',
        desc:'拙政园中部主厅，取周敦颐《爱莲说》"香远益清"之意。堂北临荷池，夏日荷花盛开，清香远溢，故名。四面轩敞，回廊四合，是园中最宏敞的厅堂。',
        mapX:50,mapY:55,
        hotspots:[
          {x:30,y:45,name:'荷 花 池',detail:'池广数亩，夏日"接天莲叶无穷碧，映日荷花别样红"。每至六月，游人如织。'},
          {x:72,y:60,name:'雪香云蔚亭',detail:'位于池东北山巅，亭名取自李白"雪香飞绿上"句，与远香堂遥相呼应。'}
        ]
      },
      { name:'小 飞 虹', alias:'廊 桥 分 水 · 一 虹 贯 隔', img:url(IMG[1]),
        verse:'廊 桥 卧 波 映 倒 影 · 恰 似 长 虹 饮 涧 来',
        desc:'拙政园唯一的廊桥，桥廊覆顶，桥下倒影如彩虹卧波，故名。"飞虹"喻其轻盈飘逸之意，是中部水景的视觉中心。',
        mapX:48,mapY:42,
        hotspots:[
          {x:50,y:50,name:'廊 桥 中 心',detail:'桥身三跨，木构覆顶，桥栏朱红，是拙政园最具标志性的建筑之一。'}
        ]
      },
      { name:'香 洲', alias:'舟 舫 临 水 · 观 鱼 听 雨', img:url(IMG[2]),
        verse:'画 舫 临 水 观 鱼 跃 · 静 听 雨 点 打 芭 蕉',
        desc:'拙政园中部画舫，仿舟形建筑，前舱、中舱、后舱三部分。登之如乘舟入画，是园中观景佳处。',
        mapX:38,mapY:50,
        hotspots:[
          {x:25,y:40,name:'观 荷 角',detail:'面荷池而设，夏日凭栏观荷，最得清凉之趣。'},
          {x:75,y:65,name:'后 舱 书 斋',detail:'旧时为园主读书处，窗外一株古梅，凌寒独开。'}
        ]
      },
      { name:'梧 竹 幽 居', alias:'梧 竹 成 阴 · 曲 廊 幽 僻', img:url(IMG[3]),
        verse:'面 皆 梧 竹 故 名 幽 居 · 小 轩 背 倚 曲 廊 宜 静',
        desc:'小轩四面皆梧竹，故名"梧竹幽居"。小轩面对山石，背倚曲廊，是中部庭院幽静所在。',
        mapX:62,mapY:48,
        hotspots:[
          {x:40,y:50,name:'梧 桐 树',detail:'庭中梧桐数株，夏日浓荫匝地，凤尾森森。'},
          {x:70,y:55,name:'修 竹 丛',detail:'翠竹成行，风过处沙沙作响，与梧桐相映成趣。'}
        ]
      },
      { name:'荷风四面亭', alias:'四 面 荷 风 · 亭 中 宜 夏', img:url(IMG[4]),
        verse:'四 面 荷 风 三 面 柳 · 半 潭 秋 水 一 亭 凉',
        desc:'池中六角亭，四面环水，夏日荷风扑面。亭有楹联"四壁荷花三面柳，半潭秋水一亭凉"，是观荷佳处。',
        mapX:55,mapY:60,
        hotspots:[
          {x:50,y:50,name:'亭 心',detail:'亭内悬匾"荷风四面"，柱联"四壁荷花三面柳，半潭秋水一亭凉"。'}
        ]
      },
      { name:'小 沧 浪', alias:'园 中 一 角 水 · 尺 幅 有 江 湖', img:url(IMG[5]),
        verse:'沧浪之水清兮，可以濯吾缨',
        desc:'拙政园东北部水院，取《楚辞》"沧浪"之意。一泓清水，四周轩窗环绕，是园中最幽静处。',
        mapX:70,mapY:38,
        hotspots:[
          {x:30,y:60,name:'小 沧 浪 亭',detail:'水院中央小亭，单檐六角，翼然水上。'},
          {x:75,y:40,name:'藕 香 榭',detail:'临水敞轩，旧时夏日于此品茗听荷，最得清凉。'}
        ]
      }
    ],
    history:[
      {era:'明正德八年',event:'御史王献臣辞官归田，于大弘寺旧址营建园林，聘文徵明参与设计。取潘岳《闲居赋》"拙者之为政"之意，名曰"拙政"。'},
      {era:'明嘉靖',event:'徐时泰得之东部，辟为"东园"，又得中部，复"西园"。三园合称"拙政园"。'},
      {era:'清顺治',event:'园归海宁陈之遴，旋入官署。'},
      {era:'清康熙',event:'徐乾学购为私园，名"徐园"，建"怀谢堂"纪念谢安。'},
      {era:'清乾隆',event:'蒋重光再修，吴蔚所得，光禄卿汪颂又得。屡易其主。'},
      {era:'清咸丰十年',event:'太平军进驻苏州，拙政园为忠王府。'},
      {era:'1952',event:'中华人民共和国成立后，全面修缮，对公众开放。'},
      {era:'1997',event:'联合国教科文组织列入《世界文化遗产名录》。'}
    ],
    features:[
      {no:'一',name:'远 香 堂',tag:'中部主厅',desc:'四面轩敞，夏日荷香远溢。堂北平台为赏荷佳处。'},
      {no:'二',name:'小 飞 虹',tag:'廊桥',desc:'木质廊桥卧波，朱红桥栏，倒影如虹。'},
      {no:'三',name:'香 洲',tag:'舫',desc:'仿舟形画舫，前舱、中舱、后舱三段式。'},
      {no:'四',name:'梧竹幽居',tag:'庭院',desc:'四面梧竹环绕，庭院幽深静谧。'},
      {no:'五',name:'荷风四面亭',tag:'亭',desc:'池中六角亭，四面来风。'},
      {no:'六',name:'小 沧 浪',tag:'水院',desc:'东部水院，三面轩窗，一泓清水。'}
    ],
    poems:[
      {text:'绝怜人境无车马<br>信有山林在市城',author:'文徵明 · 拙政园三十一咏'},
      {text:'四壁荷花三面柳<br>半潭秋水一亭凉',author:'清 · 荷风四面亭联'},
      {text:'虽由人作<br>宛自天开',author:'明 · 计成《园冶》'}
    ]
  },

  liu: {
    name:'留 园', alias:'建 筑 布 局 之 巅 · 清 代 艺 术 集 锦',
    eyebrow:'第 二 园 · 清 代 · 一 六 二 九 年',
    heroImg:url(IMG[1], 1920),
    heroFocus:'center 36%',
    era:'明嘉靖', founder:'徐时泰', area:'约 35 亩', unesco:'1997',
    location:'苏州市姑苏区留园路338号',
    tags:['建筑大家','冠云峰','留园三绝'],
    introVerse:'吴下名园此第一<br>冠云峰下久盘桓',
    introAuthor:'陈从周',
    scenes:[
      { name:'涵碧山房', alias:'高 轩 临 水 · 碧 波 在 底', img:url(IMG[1]),
        verse:'山房涵碧水，厅前对奇峰',
        desc:'留园中部主厅，因前临荷花池，池水涵碧，故名。厅堂宽敞明亮，左右对联，厅后一泓碧池，是园中最宜夏居之所。',
        mapX:50,mapY:55,
        hotspots:[
          {x:40,y:55,name:'荷 花 台',detail:'厅前石台临池，夏日"映日荷花别样红"。'},
          {x:75,y:45,name:'明 瑟 楼',detail:'取《水经注》"目对鱼鸟，水木明瑟"之意，二层小楼。'}
        ]
      },
      { name:'冠 云 峰', alias:'太 湖 石 孤 峰 · 皱 漏 瘦 透', img:url(IMG[6]),
        verse:'冠云峰高六丈五，皱漏瘦透甲天下',
        desc:'留园"三绝"之首，北宋花石纲遗物。高6.5米，集"皱、漏、瘦、透"四美于一身，是江南最大的湖石之一。',
        mapX:50,mapY:50,
        hotspots:[
          {x:50,y:50,name:'峰 顶',detail:'峰顶如云冠，故名"冠云"。四面可观，移步换形。'},
          {x:30,y:60,name:'冠 云 亭',detail:'亭依峰而立，与峰相映成趣。'},
          {x:80,y:75,name:'冠 云 台',detail:'台下观峰，如仰视云端，最得峰之神韵。'}
        ]
      },
      { name:'楠 木 厅', alias:'楠 木 为 材 · 兰 馨 满 室', img:url(IMG[7]),
        verse:'楠木厅中楠木柱，金砖铺地紫檀窗',
        desc:'留园"三绝"之一，全楠木构架。厅内楠木柱粗壮挺拔，色彩温润，是清代建筑精品。',
        mapX:62,mapY:45,
        hotspots:[
          {x:50,y:50,name:'楠 木 柱',detail:'楠木柱径尺余，通体无漆，木纹天成，气味清香。'}
        ]
      },
      { name:'五峰仙馆', alias:'五 石 罗 列 · 仿 倪 迂 画', img:url(IMG[8]),
        verse:'馆内五峰列如仙',
        desc:'留园"楠木厅"北院，馆内置五块湖石，象征"五岳"。取李白"五峰秀色"诗意。',
        mapX:65,mapY:48,
        hotspots:[
          {x:50,y:50,name:'五 峰',detail:'五块湖石列于馆中，姿态各异，仿倪云林山水画意。'}
        ]
      },
      { name:'林泉耆硕之馆', alias:'耆 旧 名 贤 · 悬 匾 纪 事', img:url(IMG[9]),
        verse:'林泉之趣，耆老所乐',
        desc:'留园"鸳鸯厅"代表作，南北两厅，一为冬日红木厅，一为夏日楠木厅。一厅两用，匠心独运。',
        mapX:55,mapY:50,
        hotspots:[
          {x:50,y:50,name:'南 厅',detail:'冬日红木厅，陈设古雅，悬有历代名贤画像。'},
          {x:75,y:45,name:'北 厅',detail:'夏日楠木厅，隔院相望，通风纳凉。'}
        ]
      },
      { name:'佳晴喜雨快雪之亭', alias:'三 时 之 景 · 亭 名 各 适', img:url(IMG[10]),
        verse:'佳晴喜雨快雪时，皆宜登此亭',
        desc:'留园西部亭名，取杜甫"久雨忽晴则喜"、"快雪时晴佳"诗意。亭临水池，三面环水。',
        mapX:35,mapY:62,
        hotspots:[
          {x:50,y:50,name:'亭 心',detail:'亭中悬匾，三面环水，晴雨雪各得其景。'}
        ]
      }
    ],
    history:[
      {era:'明嘉靖',event:'徐时泰建东园、西园，为留园前身。'},
      {era:'清嘉庆',event:'吴县东山富商刘恕购得东园部分，得宋代花石纲遗物"冠云峰"，改园名"寒碧庄"。'},
      {era:'清同治',event:'盛康购得此园，重加修葺，扩建为东西两部，更名"留园"。'},
      {era:'光绪年间',event:'园中建"林泉耆硕之馆"等建筑，园貌初定。'},
      {era:'1937',event:'日军占领苏州，留园部分建筑被毁。'},
      {era:'1953',event:'人民政府拨款全面修复，对公众开放。'},
      {era:'1997',event:'列入《世界文化遗产名录》。'}
    ],
    features:[
      {no:'一',name:'冠 云 峰',tag:'湖石峰',desc:'北宋花石纲遗物，高6.5米，集皱漏瘦透于一身。'},
      {no:'二',name:'楠 木 厅',tag:'楠木殿',desc:'全楠木构架，楠木柱通体无漆。'},
      {no:'三',name:'鱼 化 石',tag:'古化石',desc:'产于云南，置于楠木厅内，纹理清晰如鱼鳞。'},
      {no:'四',name:'涵碧山房',tag:'中部主厅',desc:'因前临荷花池，池水涵碧，故名。'},
      {no:'五',name:'林泉耆硕之馆',tag:'鸳鸯厅',desc:'南北两厅，冬夏两用，结构精巧。'},
      {no:'六',name:'佳晴喜雨快雪之亭',tag:'亭',desc:'亭名古雅，三面环水。'}
    ],
    poems:[
      {text:'吴下名园此第一<br>冠云峰下久盘桓',author:'陈从周 · 评留园'},
      {text:'片石山房述黄公<br>涵碧山房记刘恕',author:'清 · 留园题咏'}
    ]
  },

  wangshi: {
    name:'网 师 园', alias:'小 而 精 深 · 南 宋 文 人 雅 园',
    eyebrow:'第 三 园 · 南 宋 · 一 一 七 四 年',
    heroImg:url(IMG[2], 1920),
    heroFocus:'center 44%',
    era:'南宋淳熙', founder:'史正志', area:'约半亩余', unesco:'1997',
    location:'苏州市姑苏区友谊路15号',
    tags:['小巧精深','夜游独绝','以水为胜'],
    introVerse:'渔父濯缨沧浪水<br>网师借得半亩园',
    introAuthor:'— 网师园主人',
    scenes:[
      { name:'殿 春 簃', alias:'小 院 一 隅 · 芍 药 芭 蕉', img:url(IMG[2]),
        verse:'殿春小院深，芍药满阶开',
        desc:'网师园最著名的小院，因芍药花晚春盛开而得名"殿春"。是1980年美国大都会博物馆"明轩"的蓝本。',
        mapX:55,mapY:55,
        hotspots:[
          {x:50,y:50,name:'芍 药 台',detail:'院中芍药台，暮春芍药盛开，花瓣层层叠叠，清香四溢。'},
          {x:25,y:60,name:'芭 蕉',detail:'院中芭蕉一丛，雨打芭蕉声滴沥，最具文人意趣。'}
        ]
      },
      { name:'月到风来亭', alias:'水 中 之 亭 · 月 到 风 来', img:url(IMG[11]),
        verse:'月到天心，风来水面',
        desc:'亭名取自邵雍诗"月到天心处，风来水面时"。位于网师园彩霞池西北岸，是观月赏风佳处。',
        mapX:42,mapY:45,
        hotspots:[
          {x:50,y:50,name:'亭 心 望 月',detail:'夜游网师，至此亭最宜赏月，月光水光相映。'}
        ]
      },
      { name:'濯 缨 水 阁', alias:'临 水 而 建 · 濯 缨 沧 浪', img:url(IMG[5]),
        verse:'沧浪之水清兮，可以濯吾缨',
        desc:'网师园水阁名，取《孟子》"沧浪之水清兮，可以濯吾缨"之意。临水而筑，下临彩霞池。',
        mapX:45,mapY:55,
        hotspots:[
          {x:50,y:50,name:'水 阁',detail:'三面环水，夏日凭栏，最得清凉。'}
        ]
      },
      { name:'看松读画轩', alias:'观 松 读 画 · 满 轩 清 阴', img:url(IMG[3]),
        verse:'满 轩 古 松 伴 读 书 · 画 意 悠 然',
        desc:'轩名取"看松"与"读画"二意。轩前古松苍翠，轩内藏书画，是网师园主人读书处。',
        mapX:50,mapY:42,
        hotspots:[
          {x:30,y:55,name:'古 松',detail:'轩前古松一株，苍劲挺拔，已有百年。'}
        ]
      },
      { name:'引 静 桥', alias:'小 桥 引 静 · 一 径 通 深', img:url(IMG[4]),
        verse:'小桥取"引人入静"之意。',
        desc:'网师园最小的石拱桥，桥身三折，玲珑精巧。取"引人入静"之意。',
        mapX:48,mapY:50,
        hotspots:[
          {x:50,y:50,name:'桥 拱',detail:'拱桥倒影成圆，与水中月影相映。'}
        ]
      },
      { name:'竹外一枝轩', alias:'竹 外 一 枝 · 疏 影 横 斜', img:url(IMG[8]),
        verse:'竹外一枝斜更好',
        desc:'轩名取宋诗"竹外一枝斜更好"之意。轩前修竹数竿，斜枝探出窗外，取"一枝之趣"。',
        mapX:58,mapY:52,
        hotspots:[
          {x:50,y:55,name:'轩 前 修 竹',detail:'窗外修竹数竿，风过处沙沙作响。'}
        ]
      }
    ],
    history:[
      {era:'南宋淳熙元年',event:'史正志万卷堂故址，筑园名"万卷堂"。'},
      {era:'元',event:'废为寺。'},
      {era:'清乾隆',event:'宋宗元重建，借"渔父"之意，名"网师"。'},
      {era:'清嘉庆',event:'西部住宅区落成，与东部宅园相并，园制渐定。'},
      {era:'1941',event:'何亚农购得，请画家张善孖、张大千兄弟居住。'},
      {era:'1958',event:'全面整修，对公众开放。'},
      {era:'1980',event:'以"殿春簃"为蓝本，在美国大都会博物馆建"明轩"，开创中国园林海外移植先河。'}
    ],
    features:[
      {no:'一',name:'殿 春 簃',tag:'小院',desc:'网师园精华，芍药满阶，"明轩"蓝本。'},
      {no:'二',name:'彩 霞 池',tag:'池',desc:'网师园中心水面，池岸曲折，聚水为胜。'},
      {no:'三',name:'看松读画轩',tag:'轩',desc:'轩前古松，轩内藏画。'},
      {no:'四',name:'濯缨水阁',tag:'水阁',desc:'三面环水，取《孟子》意。'},
      {no:'五',name:'月到风来亭',tag:'亭',desc:'观月赏风佳处。'},
      {no:'六',name:'引 静 桥',tag:'桥',desc:'网师园最小石拱桥，造型精巧。'}
    ],
    poems:[
      {text:'殿春芍药香<br>小院深幽藏',author:'陈从周 · 评网师园'},
      {text:'月到天心处<br>风来水面时',author:'宋 · 邵雍《清夜吟》'}
    ]
  },

  shizi: {
    name:'狮 子 林', alias:'假 山 王 国 · 元 代 禅 意 石 园',
    eyebrow:'第 四 园 · 元 代 · 一 三 四 二 年',
    heroImg:url(IMG[3], 1920),
    heroFocus:'center 44%',
    era:'元至正', founder:'天如禅师', area:'约 15 亩', unesco:'1997',
    location:'苏州市姑苏区园林路23号',
    tags:['假山王国','禅意园林','乾隆六游'],
    introVerse:'人道我居城市里<br>我疑身在万山中',
    introAuthor:'— 元 · 狮子林',
    scenes:[
      { name:'狮 子 峰', alias:'湖 石 迭 峰 · 形 若 狮 舞', img:url(IMG[3]),
        verse:'狮子峰前万石蹲，禅房深处一灯悬',
        desc:'狮子林假山主峰，湖石形似狮子起舞，故名。元代禅僧天如禅师取"佛狮子"意命名。',
        mapX:55,mapY:48,
        hotspots:[
          {x:50,y:50,name:'狮 子 峰',detail:'峰高数丈，湖石嶙峋，状若群狮起舞。'},
          {x:25,y:60,name:'九 狮 台',detail:'台上可观九狮，故名。乾隆曾在此品题。'}
        ]
      },
      { name:'真 趣 亭', alias:'乾 隆 御 笔 · 真 趣 二 字', img:url(IMG[2]),
        verse:'真趣亭中赏奇峰，乾隆御笔留题',
        desc:'乾隆六下江南，必游狮子林。御笔题"真趣"二字，匾悬于亭中，至今高悬。',
        mapX:55,mapY:45,
        hotspots:[
          {x:50,y:50,name:'乾 隆 御 笔',detail:'亭匾"真趣"二字为乾隆御笔，至今高悬。'}
        ]
      },
      { name:'燕 誉 堂', alias:'大 厅 待 客 · 燕 誉 犹 存', img:url(IMG[1]),
        verse:'燕誉嘉宾，堂前紫薇',
        desc:'狮子林主厅，因堂前紫薇树，又名"紫薇堂"。取《诗经》"式燕且誉"之意。',
        mapX:40,mapY:42,
        hotspots:[
          {x:50,y:50,name:'紫 薇 树',detail:'堂前紫薇一株，花开烂熳，古人称"紫薇花下紫薇郎"。'}
        ]
      },
      { name:'指 柏 轩', alias:'古 柏 列 前 · 游 客 指 之', img:url(IMG[6]),
        verse:'指柏问禅，万石参悟',
        desc:'取禅宗"指柏"公案，轩前古柏苍翠。元代以来为禅僧参悟之处。',
        mapX:48,mapY:55,
        hotspots:[
          {x:30,y:50,name:'古 柏',detail:'轩前古柏参天，元代禅僧于此指柏参悟，故名。'}
        ]
      },
      { name:'问 梅 阁', alias:'以 梅 命 阁 · 暗 香 浮 动', img:url(IMG[5]),
        verse:'问梅消息，倚窗听寒',
        desc:'取"问梅"意，临窗种梅，阁中赏梅。狮子林"四季景物"代表建筑。',
        mapX:55,mapY:65,
        hotspots:[
          {x:50,y:50,name:'梅 树',detail:'阁前古梅一株，凌寒独放，暗香浮动。'}
        ]
      },
      { name:'飞 瀑 亭', alias:'假 山 叠 瀑 · 飞 流 直 下', img:url(IMG[4]),
        verse:'飞瀑亭前听泉响',
        desc:'狮子林西部亭，因亭前假山瀑布得名。瀑从石隙跌落，声如鸣琴。',
        mapX:35,mapY:65,
        hotspots:[
          {x:50,y:50,name:'瀑 布',detail:'飞瀑三叠，声如鸣琴，是园中"听"景佳处。'}
        ]
      }
    ],
    history:[
      {era:'元至正二年',event:'僧天如禅师惟则的弟子"买地结屋，以居其师"，因园中湖石多似狮子，且天如禅师得法于天目山狮子岩，故名"狮子林"。'},
      {era:'明洪武',event:'寺宇倾圮，仅存佛殿。'},
      {era:'明嘉靖',event:'王心一购得，改名"圣恩寺"，园林部分称"五松园"。'},
      {era:'清康熙',event:'黄熙之父出资修缮，恢复佛寺，称"画禅寺"。'},
      {era:'清乾隆六下江南',event:'每次必游狮子林，并题"真趣"匾。命画师绘狮子林图，回京后在承德避暑山庄、圆明园仿建。'},
      {era:'民国',event:'园中建筑渐有修葺，景致渐复。'},
      {era:'1952',event:'人民政府接管，全面修缮，对公众开放。'}
    ],
    features:[
      {no:'一',name:'狮 子 峰',tag:'假山主峰',desc:'湖石似狮起舞，是狮子林标志。'},
      {no:'二',name:'真 趣 亭',tag:'亭',desc:'乾隆御笔"真趣"匾悬于此。'},
      {no:'三',name:'燕 誉 堂',tag:'主厅',desc:'狮子林主厅，堂前紫薇。'},
      {no:'四',name:'指 柏 轩',tag:'禅室',desc:'取禅宗"指柏"公案命名。'},
      {no:'五',name:'问 梅 阁',tag:'赏梅',desc:'临窗种梅，四季皆景。'},
      {no:'六',name:'飞 瀑 亭',tag:'亭',desc:'亭前瀑布三叠，声如鸣琴。'}
    ],
    poems:[
      {text:'人道我居城市里<br>我疑身在万山中',author:'元 · 天如禅师'},
      {text:'狮子峰前万石蹲<br>禅房深处一灯悬',author:'清 · 乾隆御题'}
    ]
  },

  canglang: {
    name:'沧 浪 亭', alias:'苏 州 最 古 · 北 宋 借 水 成 景',
    eyebrow:'第 五 园 · 北 宋 · 一 零 四 四 年',
    heroImg:url(IMG[4], 1920),
    heroFocus:'center 34%',
    era:'北宋庆历', founder:'苏舜钦', area:'约 16 亩', unesco:'2000',
    location:'苏州市姑苏区三元坊',
    tags:['苏州最古','未入园先见水','以水取胜'],
    introVerse:'沧浪之水清兮<br>可以濯吾缨',
    introAuthor:'— 屈原《渔父》',
    scenes:[
      { name:'沧 浪 亭', alias:'方 亭 敞 朗 · 古 朴 不 华', img:url(IMG[4]),
        verse:'沧浪亭畔水悠悠，五百名贤刻石留',
        desc:'苏州现存最古老的园林主亭。北宋苏舜钦被劾罢官，以四万钱购得，构亭命名"沧浪"，取《孟子》《楚辞》意。',
        mapX:50,mapY:42,
        hotspots:[
          {x:50,y:50,name:'沧 浪 亭',detail:'亭为四方攒尖顶，石柱十六根，古朴庄严。'},
          {x:75,y:30,name:'石 碑',detail:'亭内碑刻"沧浪亭"三字，为清代名家俞樾所书。'}
        ]
      },
      { name:'五百名贤祠', alias:'五 百 名 贤 画 像 · 清 刻 千 秋', img:url(IMG[7]),
        verse:'五百名贤列壁间',
        desc:'祠内嵌自春秋至清代五百名贤石刻画像，自吴王阖闾、伍员，至清代顾炎武、于成龙等，共594人。',
        mapX:42,mapY:50,
        hotspots:[
          {x:50,y:50,name:'石 刻 画 像',detail:'祠内嵌春秋至清代名贤石刻画像五百九十四幅，跨两千年。'}
        ]
      },
      { name:'看 山 楼', alias:'园 中 最 高 · 远 望 城 廓', img:url(IMG[8]),
        verse:'看山楼上远山青',
        desc:'沧浪亭园中最高建筑，登之可远眺西南诸山。取"悠然见南山"意。',
        mapX:60,mapY:38,
        hotspots:[
          {x:50,y:50,name:'楼 顶 远 眺',detail:'登楼远眺，西南灵岩、天平诸山隐约可见。'}
        ]
      },
      { name:'面 水 轩', alias:'三 面 环 水 · 面 水 而 居', img:url(IMG[5]),
        verse:'面水轩前碧水流',
        desc:'临水敞轩，三面环水，是沧浪亭"借水"造景的代表作。轩名"面水"，意指正面对水。',
        mapX:35,mapY:60,
        hotspots:[
          {x:50,y:55,name:'轩 前 水 面',detail:'轩前水面开阔，是园外之水借入园内之处。'}
        ]
      },
      { name:'清 香 馆', alias:'前 栽 翠 竹 · 满 院 清 香', img:url(IMG[3]),
        verse:'满 院 金 桂 秋 香 · 暗 香 浮 动 自 然 清',
        desc:'馆名"清香"，因馆前多植桂树，秋天金桂飘香，故名"清香"。取"暗香浮动"诗意。',
        mapX:55,mapY:55,
        hotspots:[
          {x:50,y:50,name:'桂 花 树',detail:'馆前金桂数株，秋日花开满枝，香溢十里。'}
        ]
      },
      { name:'翠 玲 珑', alias:'三 株 翠 竹 · 玲 珑 剔 透', img:url(IMG[6]),
        verse:'翠竹三株，玲珑剔透',
        desc:'沧浪亭东南翠玲珑，为三面环廊围合小院，种植翠竹，翠影摇曳，最得幽趣。',
        mapX:48,mapY:55,
        hotspots:[
          {x:30,y:50,name:'翠 竹 丛',detail:'廊周翠竹丛生，翠影玲珑。'}
        ]
      }
    ],
    history:[
      {era:'北宋庆历四年',event:'苏舜钦被劾罢官，旅居苏州。以四万钱购得"草木郁然，崇阜广水"之池，构亭命名"沧浪"，取《孟子》《楚辞》意。'},
      {era:'南宋',event:'园林曾为将帅驻兵之地，后渐荒芜。'},
      {era:'明嘉靖',event:'苏州知府胡缵宗重建，更名"沧浪亭"。'},
      {era:'清道光',event:'巡抚梁章钜重修，建"五百名贤祠"。'},
      {era:'清咸丰',event:'太平军入苏，亭毁于战火。'},
      {era:'清同治',event:'巡抚张树声重修，恢复旧观。'},
      {era:'1955',event:'全面修缮，对公众开放。'},
      {era:'2000',event:'列入《世界文化遗产名录》（扩展项目）。'}
    ],
    features:[
      {no:'一',name:'沧 浪 亭',tag:'主亭',desc:'苏州现存最古园林主亭，北宋遗构。'},
      {no:'二',name:'五百名贤祠',tag:'祠',desc:'594位名贤石刻画像，跨越两千年。'},
      {no:'三',name:'看 山 楼',tag:'楼',desc:'园中最高建筑，可远眺诸山。'},
      {no:'四',name:'面 水 轩',tag:'水轩',desc:'三面环水，借水成景。'},
      {no:'五',name:'清 香 馆',tag:'馆',desc:'馆前种桂，秋日飘香。'},
      {no:'六',name:'翠 玲 珑',tag:'廊',desc:'廊周种竹，翠影玲珑。'}
    ],
    poems:[
      {text:'沧浪之水清兮<br>可以濯吾缨',author:'先秦 · 屈原《渔父》'},
      {text:'一径抱幽山<br>居然城市间',author:'宋 · 苏舜钦《沧浪亭》'}
    ]
  },

  yi: {
    name:'怡 园', alias:'晚 清 集 锦 · 格 调 清 雅 怡 情',
    eyebrow:'第 六 园 · 清 末 · 一 八 七 四 年',
    heroImg:url(IMG[5], 1920),
    heroFocus:'center 40%',
    era:'清同治', founder:'顾文彬', area:'约 9 亩', unesco:'—',
    location:'苏州市姑苏区人民路',
    tags:['晚清集锦','坡仙琴馆','格调清雅'],
    introVerse:'何必丝与竹<br>山水有清音',
    introAuthor:'— 古琴曲',
    scenes:[
      { name:'坡仙琴馆', alias:'藏 苏 轼 古 琴 · 玉 涧 流 泉', img:url(IMG[5]),
        verse:'坡仙琴馆藏玉涧，流泉一曲思东坡',
        desc:'怡园精华，馆内藏苏东坡"玉涧流泉"古琴。"坡仙"指苏东坡，"琴馆"为古琴陈列处。',
        mapX:50,mapY:45,
        hotspots:[
          {x:50,y:50,name:'玉涧流泉琴',detail:'苏东坡"玉涧流泉"古琴，怡园至宝。'},
          {x:30,y:60,name:'坡 仙 画 像',detail:'馆内东坡画像一轴，意境高古。'}
        ]
      },
      { name:'拜 石 轩', alias:'拜 石 成 癖 · 爱 石 之 癖', img:url(IMG[6]),
        verse:'拜石如拜友',
        desc:'取米芾"拜石"典故，米芾见奇石拜之，呼为"石兄"。轩前置奇石数块，可供赏拜。',
        mapX:45,mapY:55,
        hotspots:[
          {x:50,y:50,name:'奇 石',detail:'轩前奇石数株，形态各异，最宜静观。'}
        ]
      },
      { name:'锁 绿 轩', alias:'绿 树 成 墙 · 锁 住 一 院', img:url(IMG[3]),
        verse:'锁绿轩前绿满窗',
        desc:'轩名"锁绿"，意指窗外绿意被锁入室内。轩周种竹，翠影锁窗。',
        mapX:55,mapY:48,
        hotspots:[
          {x:50,y:55,name:'修 竹 窗',detail:'窗外修竹数竿，翠影入窗，如绿锁窗棂。'}
        ]
      },
      { name:'南 雪 亭', alias:'取 南 朝 雪 意 · 亭 小 境 清', img:url(IMG[10]),
        verse:'南雪亭前赏残雪',
        desc:'亭名取"南雪"意。冬日亭前残雪未消，是怡园冬景代表。',
        mapX:45,mapY:60,
        hotspots:[
          {x:50,y:50,name:'亭 心 望 雪',detail:'冬日登此亭，最宜赏雪。'}
        ]
      },
      { name:'藕 香 榭', alias:'临 水 荷 榭 · 藕 花 幽 香', img:url(IMG[2]),
        verse:'藕香榭里赏荷风',
        desc:'临水敞轩，夏日荷花盛开，藕香满榭，故名。是怡园夏日赏荷佳处。',
        mapX:38,mapY:62,
        hotspots:[
          {x:50,y:55,name:'荷 池',detail:'榭前荷池，夏日"接天莲叶无穷碧"。'}
        ]
      },
      { name:'碧梧栖凤', alias:'梧 叶 碧 影 · 梧 栖 凤 来', img:url(IMG[8]),
        verse:'碧梧栖凤待谁来',
        desc:'取"凤栖梧桐"意。庭中梧桐数株，古时为园主待客之所。',
        mapX:50,mapY:65,
        hotspots:[
          {x:50,y:50,name:'梧 桐',detail:'庭中梧桐数株，凤尾森森，浓荫匝地。'}
        ]
      }
    ],
    history:[
      {era:'清同治光绪年间',event:'宁绍道台顾文彬在明代尚书吴宽旧宅遗址上营建，历时五年方毕。'},
      {era:'清光绪八年',event:'怡园建成，取《论语》"兄弟怡怡"之"怡"，兼取"怡情悦性"之谓。'},
      {era:'民国',event:'顾氏后人对园林进行修缮，藏入大量金石书画。'},
      {era:'1949',event:'园归人民政府管理，园中建筑修缮一新。'},
      {era:'1980年',event:'全面修复后对外开放。'}
    ],
    features:[
      {no:'一',name:'坡仙琴馆',tag:'琴馆',desc:'藏苏东坡"玉涧流泉"古琴，怡园至宝。'},
      {no:'二',name:'拜 石 轩',tag:'轩',desc:'取米芾"拜石"典故，轩前置奇石。'},
      {no:'三',name:'锁 绿 轩',tag:'轩',desc:'轩周种竹，翠影锁窗。'},
      {no:'四',name:'南 雪 亭',tag:'亭',desc:'冬日亭前赏残雪。'},
      {no:'五',name:'碧 梧 栖 凤',tag:'庭院',desc:'取"凤栖梧桐"意，梧桐数株。'},
      {no:'六',name:'藕 香 榭',tag:'荷榭',desc:'临水荷榭，夏日藕香满座。'}
    ],
    poems:[
      {text:'何必丝与竹<br>山水有清音',author:'古琴曲意'},
      {text:'一片冰心在玉壶',author:'唐 · 王昌龄'}
    ]
  },

  yipu: {
    name:'艺 圃', alias:'世 界 文 化 遗 产 · 文 人 小 园 之 典 范',
    eyebrow:'第 七 园 · 明 · 一 五 三 四 年',
    heroImg:url(IMG[6], 1920),
    heroFocus:'center 42%',
    era:'明嘉靖', founder:'袁氏', area:'约 5 亩', unesco:'2000',
    location:'苏州市姑苏区文昌路',
    tags:['世遗名园','别有洞天','书卷气'],
    introVerse:'一门自有别<br>洞天别有天',
    introAuthor:'— 艺圃门楼',
    scenes:[
      { name:'别有洞天', alias:'砖 雕 门 楼 · 园 之 眼 目', img:url(IMG[6]),
        verse:'曲径通幽处，别有一洞天',
        desc:'艺圃的门户，砖雕门楼额刻"别有洞天"四字，为苏州园林砖雕之绝。穿过门洞，豁然开朗，遂入园境。',
        mapX:50,mapY:38,
        hotspots:[
          {x:50,y:45,name:'砖 雕 门 楼',detail:'门楼高逾丈许，砖雕仿木结构，额枋间饰人物花鸟，江南砖雕第一。'},
          {x:22,y:65,name:'芭 蕉',detail:'门侧芭蕉数株，取"蕉叶题诗"意，疏朗有致。'},
          {x:78,y:58,name:'古 树',detail:'门侧老树一株，枝干遒劲，与门楼互为映衬。'}
        ]
      },
      { name:'世 纶 堂', alias:'正 堂 敞 朗 · 悬 匾 生 辉', img:url(IMG[2]),
        verse:'世纶堂前坐春风',
        desc:'艺圃住宅的主厅，世纶堂之名出自《论语》"父子笃，兄弟睦，夫妇和，家之肥也"。堂内悬匾，肃穆雍容。',
        mapX:58,mapY:30,
        hotspots:[
          {x:50,y:45,name:'世 纶 堂 匾',detail:'堂内高悬"世纶堂"匾额，为园主自书，取宗族和睦之义。'},
          {x:28,y:55,name:'古 柏',detail:'堂前古柏两株，枝叶掩映，取"松柏常青"意。'},
          {x:75,y:50,name:'石 灯 笼',detail:'庭中石灯笼一盏，玲珑剔透。'}
        ]
      },
      { name:'乳 鱼 亭', alias:'池 中 小 亭 · 九 曲 通 幽', img:url(IMG[3]),
        verse:'乳鱼亭中观游鱼',
        desc:'艺圃西北隅的池上小亭，因池中旧有石雕乳鱼得名。亭在水中，以九曲桥与岸相连，小而精妙。',
        mapX:30,mapY:58,
        hotspots:[
          {x:50,y:50,name:'乳 鱼 亭',detail:'亭为四角攒尖顶，四周有围栏，凭栏可观游鱼戏藻。'},
          {x:25,y:35,name:'九 曲 桥',detail:'石桥九折，通向亭中，步步换景。'},
          {x:75,y:60,name:'荷 叶',detail:'池中荷叶田田，与小亭互为掩映。'}
        ]
      },
      { name:'思 嗜 轩', alias:'书 斋 小 院 · 曲 廊 绕 之', img:url(IMG[4]),
        verse:'思嗜轩前读好书',
        desc:'艺圃的书斋小院，绕以曲廊，院中植竹叠石，环境清幽。主人读书作画于此，是园中最文雅的一处。',
        mapX:72,mapY:52,
        hotspots:[
          {x:50,y:45,name:'思 嗜 轩',detail:'三间书斋，取"思嗜"命名，读书求道之所。'},
          {x:25,y:60,name:'湖 石 叠 峰',detail:'院中湖石叠成小峰，瘦皱漏透，姿态各异。'},
          {x:75,y:35,name:'修 竹',detail:'窗外修竹数竿，风过有声。'}
        ]
      },
      { name:'延 光 阁', alias:'园 中 高 处 · 望 尽 烟 水', img:url(IMG[5]),
        verse:'延光阁上望烟水',
        desc:'艺圃最高的楼阁，登之可俯瞰全园池馆与假山，把园中景致尽收眼底。',
        mapX:68,mapY:30,
        hotspots:[
          {x:50,y:45,name:'延 光 阁',detail:'楼阁两层，飞檐翘角，为艺圃的制高点。'},
          {x:28,y:58,name:'俯 视 全 园',detail:'凭栏四顾，池水假山，历历在目。'}
        ]
      },
      { name:'芹 庐', alias:'小 院 清 幽 · 蔬 畦 一 角', img:url(IMG[7]),
        verse:'芹庐小院种蔬菜',
        desc:'艺圃东北角的小院，曾为园中蔬圃所在，名"芹庐"。今虽改作居所，而疏淡田园之气犹存。',
        mapX:30,mapY:32,
        hotspots:[
          {x:50,y:50,name:'芹 庐 院',detail:'小院仅一隅，粉墙围合，朴素安静。'},
          {x:30,y:65,name:'古 树',detail:'院中老树一株，枝叶扶疏。'}
        ]
      }
    ],
    history:[
      {era:'明嘉靖年间',event:'袁氏于此建宅园，初名"醉颖堂"。'},
      {era:'清初',event:'孔氏购得，改名"药圃"，取《论语》"越小国如多，邾婁曰：彼哉！彼哉！非吾党之小卒"之义。'},
      {era:'清康熙',event:'大学士文洪购得，扩建修治，正式名"艺圃"。'},
      {era:'清乾隆末',event:'园归陆氏，增多亭轩，仍守旧观。'},
      {era:'民国',event:'庞元济购得，一度易主。'},
      {era:'1955年',event:'苏州工艺美术研究所迁入，园内辟作漆器工艺研究室。'},
      {era:'2000年',event:'列入《世界文化遗产名录》（扩展项目）。'}
    ],
    features:[
      {no:'一',name:'别 有 洞 天',tag:'砖雕门楼',desc:'江南砖雕之绝，园之门户与眼目。'},
      {no:'二',name:'世 纶 堂',tag:'正堂',desc:'住宅主厅，匾额高悬，取宗族和睦之义。'},
      {no:'三',name:'乳 鱼 亭',tag:'池亭',desc:'池中小亭，九曲桥通之。'},
      {no:'四',name:'思 嗜 轩',tag:'书斋',desc:'曲廊环绕，竹石清幽。'},
      {no:'五',name:'延 光 阁',tag:'楼阁',desc:'园中最高处，可俯瞰全园。'},
      {no:'六',name:'芹 庐',tag:'小院',desc:'东北隅小院，蔬圃旧址。'}
    ],
    poems:[
      {text:'曲径通幽处<br>别有一洞天',author:'艺圃 · 别有洞天'},
      {text:'世纶敦厚族<br>艺圃得书香',author:'清 · 艺圃旧题'},
      {text:'明月松间照<br>清泉石上流',author:'唐 · 王维《山居秋暝》'}
    ]
  }
};

  // ===== 派生索引 =====
  const GARDEN_ORDER = ['zhuozheng','liu','wangshi','shizi','canglang','yi','yipu'];

  window.GP_DATA = { IMG, url, HERO_FN, SCENE_ILLU, GARDENS, GARDEN_ORDER };
})();
