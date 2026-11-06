# 地理与内容来源

获取日期：2026-11-06—07。矢量与高程栅格均重投影到统一的简化经纬度平面；页面读取本地静态文件，运行时不请求在线瓦片。

## 自然地理

Natural Earth，公有领域：

- [使用条款](https://www.naturalearthdata.com/about/terms-of-use/)
- [50m land 原始数据](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson)
- [50m rivers and lake centerlines 原始数据](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_rivers_lake_centerlines.geojson)

`scripts/build-physical.py` 生成 `geography.js`：保留全球陆地外环，河流和湖泊提取经度 60—150、纬度 -2—62，坐标保留四位小数。河流与海岸是现代概览，不是古河道复原。湖泊来自同一版本 Natural Earth 的 `ne_50m_lakes.geojson`。

## 现代政区

geoBoundaries gbOpen，固定版本 `9469f09`。

| 层级 | API 标识 | 参考年 | 原始许可证 |
| --- | --- | --- | --- |
| 省级 | CHN-ADM1-43563684 | 2019 | Public Domain |
| 县级 | CHN-ADM2-17275852 | 2017 | Open Data Commons PDDL v1.0 |

- [省级元数据](https://www.geoboundaries.org/api/current/gbOpen/CHN/ADM1/)
- [县级元数据](https://www.geoboundaries.org/api/current/gbOpen/CHN/ADM2/)
- [省级 geoJSON 固定版本](https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/9469f09/releaseData/gbOpen/CHN/ADM1/geoBoundaries-CHN-ADM1.geojson)
- [县级 geoJSON 固定版本](https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/9469f09/releaseData/gbOpen/CHN/ADM2/geoBoundaries-CHN-ADM2.geojson)
- [geoBoundaries 项目](https://www.geoboundaries.org/)

县级源的 `boundaryCanonical` 明确为 `County Level`，不将 ADM2 误称为地级市。源数据 34 个省级、2391 个县级要素，经 `scripts/build-admin.py` 在经度 68—142、纬度 3—56 范围内处理，保留四位小数，全部源要素写入 `modern-admin.js`。数字是源要素数量，不是当前行政单位统计。多边形环保留，不进行历史语义加工。来源县名为转写，页面没有擅自批量翻译；省名与故事地点的今名在 `atlas-data.js`、`app.js` 另作标注。

省界原始来源记为 geoBoundaries / Wikimedia Commons；县界元数据记为 National Administration of Surveying, Mapping and Geoinformation of China / Revolutionary GIS。页面明确标注参考年份，不能据此声称为 2026 实时现行区划。

## 古代政区与地点

`atlas-data.js` 中 3 州、15 郡的轮廓是本项目手绘教学示意，**不是数字化历史地图、测绘边界或考证成果**。县治与隶属框架参考《后汉书·郡国志》等历史地理常识，使用旧东汉框架；对晚汉分郡变化另作提示。没有古代逐县边界数据。

荆州与今天的荆州市、汉九江郡与今天的九江市、吴县与吴郡等层级在详情中区分。夏口、樊口、汉津、赤壁等不一律标成县。赤壁与华容道以常见定位作示意；华容道未直接套用今天湖南华容县城。地点坐标不用于精确定位古城址、古河道、军营或行军道路。

本轮调查了 CHGIS、有关历史地图数据目录及江山时序等项目；因历史几何的用途许可、可再分发范围或来源精度不足，**未导入这些项目的历史 GIS 数据**，也未描摹商业历史地图的边界。

## 故事与史实对照

`story-data.js` 收录《三国演义》第 40—50 回的 26 个事件。现代说明文字为本项目概述，小说原文入口逐事件链接；没有复制影视剧素材或商业人物画像。

- [《三国演义》](https://zh.wikisource.org/wiki/三國演義)：章回链接格式 `三國演義/第046回` 等。
- [《三国志》](https://zh.wikisource.org/wiki/三國志)：`data.js` 与 `story-data.js` 提供武帝纪、先主传、诸葛亮传、周瑜鲁肃吕蒙传、吴主传、关张马黄赵传等入口，`historyReferences` 将事件映射至相关卷次。
- [《后汉书》](https://zh.wikisource.org/wiki/後漢書)：郡国志框架的原典入口。不能把这个文字来源当成手绘边界的精度担保。

小说按章回次序组织，事件标签、前因后果为阅读解释；人物连线是小说相关地点的连接，不是史实行迹证明。所谓“演义故事”与“史实对照”在界面中独立呈现。

## 全国地形与城池（2026-11-07）

第三版取消长江中下游裁剪：现代省级数据保留全部 34 个源要素，县级保留 2391 个源要素，范围为经度 68—142、纬度 3—56。数字表示源数据条目，不是 2026 年行政单位统计。Natural Earth 陆地使用全球外环，河流与湖泊提取经度 60—150、纬度 -2—62；自然底图可在全国视野和赤壁视野之间连续缩放。

地形来源：[Mapzen Terrain Tiles / AWS Open Data](https://registry.opendata.aws/terrain-tiles/)，读取日期 2026-11-07。按照[官方 Terrarium 格式说明](https://github.com/tilezen/joerd/blob/master/docs/formats.md)，将 PNG 高程编码解码为米，重投影到与矢量相同的经纬度栅格，通过高程分层设色和坡度光照生成晕渲。

- 全国：经度 68—142、纬度 16—56，z6 数据，3200×1977 WebP。
- 赤壁：经度 106—124、纬度 25—38，z8 数据，2400×1981 WebP。
- 脚本：`scripts/build-terrain.py`。上游瓦片复用 `~/Code/agents-docs/_public-assets/terrain-tiles/terrarium/` 缓存。
- 署名：Mapzen / Tilezen；global GMTED2010 and SRTM terrain data courtesy of the U.S. Geological Survey；global ETOPO1 terrain data U.S. National Oceanic and Atmospheric Administration。完整条款见[数据提供者署名说明](https://github.com/tilezen/joerd/blob/master/docs/attribution.md)。

晕渲使用现代高程，仅供认识山脉、盆地、平原和河谷；不是古代高程、古河道、精确军事地形或城防复原。色阶含视觉处理，不用来读取精确点高程。南海小图的东沙、西沙、中沙、南沙标签表示岛群约位，不绘制推测疆界。

新增历史城池与绿洲地名为地理索引，约位参考今地；城墙、城楼、船形、旗帜为原创 SVG 分类符号，不是城址平面或建筑复原。秣陵保留 208 年名称；[南京地方志资料](https://dfz.nanjing.gov.cn/gzdt/202403/t20240315_4186987.html)记载 211 年徙治秣陵、次年改名建业，故不提前使用后来的城名。全国地理覆盖不意味着已复原全部汉末政权与疆界，古州郡详图仍限于赤壁专题。

## 人物生平摘录（2026-11-07）

`biographies.js` 为 28 位人物提供 92 条生平摘录，与 `story-data.js` 的 26 个小说事件分开维护。每个人物关联《三国志》卷次的维基文库原典入口，现代概述为本项目编写；包含裴松之注转引的材料时在人物条目中注明，例如蒋干见卷 54 注引《江表传》。小说中的盗书、献连环计、华容放曹等不转写为人生史实节点。

来源卷次包括卷 1、6、9、14、17、32—37、47、52—55。该版为生平选摘与阅读索引，尚非完整、逐条校勘的研究数据库。年代不确定的条目采用时期或范围，地点未确定的条目设为 `null`，地图仅显示有约位地点的节点。诸葛亮南征、刘备早年徐州活动等区域行动未强行压缩为一座城。

`landscape-data.js` 新增 29 个地理索引点，加上原有 15 个共 44 个。同一地点在不同年代使用的名称可由生平条目的 `siteName` 标注，例如孙权定都建业与吴都武昌；这些名称不会提前覆盖 208 年的故事地图。人物地图的连线为选摘节点之间的示意联系，不是考证的行军道路。


## 人物分段故事（2026-11-07）

`biography-stories.js` 将现有 28 位人物的 92 个节点扩写为 276 段正文，每条约 270—370 字，合计约 2.8 万字（不含摘要、标题和来源说明）。现代叙述由本项目编写；背景和影响包含阅读解说，不伪造古人对白、内心独白或精确行程。每篇给出史籍卷次与篇目链接，有需要时附材料层次说明。

本轮核对的原典为维基文库所载《三国志》卷 1、6、9、10、14、17、32、33、34、35、36、37、47、52、53、54、55，共 17 卷。卷 10 荀彧传补充曹操迎奉献帝、官渡粮食危机等背景；其他人物采用本传及相关列传互参。所据古籍为公有领域文本，未使用现代商业传记的表述。

正文注明《云别传》《江表传》《汉晋春秋》《吴书》《魏略》等裴注引书，避免与陈寿正文混同；赵云汉水、蒋干游说、刘禅在洛阳的宴会等均交代来源层次。阚泽献诈降书、蒋干盗书、庞统赤壁连环计等小说任务仍放在小说事件中。蔡瑁、张允、甘氏等记载有限的人物以已知经历与关联背景展开，不补造个人细节。

核对中同步调整三处旧摘要或年表：鲁肃联络刘备按卷 54 定为当阳区域，而非以江夏驻地替代会面地；甘宁濡须夜袭的本传没有单独系年，改用「建安年间」；甘氏本传写「葬于南郡」，因此改正旧摘要的「卒于南郡」，不由葬地推定死亡地点。


## 前三篇史籍故事（184—207）

新增 42 个事件、22 位人物、44 篇分段事迹和 23 个地点，分别存于 `period-1.js`、`period-2.js`、`period-3.js`。现代中文正文为项目概述，史籍与小说对照分开呈现。原典链接随事件和事迹提供，背景与影响包含解说，不伪造对白、逐日行程或精确兵力。

- 黄巾与汉廷危机：核对《后汉书》孝灵帝纪、孝献帝纪、卢植传、何进传、皇甫嵩朱儁列传、董卓列传，并参照《三国志》相关纪传。
- 群雄逐鹿：核对《三国志》卷 1、6、7、8、10、32、46、54 及《后汉书》卷 66。董卓迁都与焚城放入 190 年；袁术称帝、公孙瓒败亡分别放入 197、199 年；吕布败亡标作建安三年冬，并说明跨 198—199 的历法边界。
- 官渡与北方整合：核对《三国志》武帝纪、袁绍传、郭嘉传、先主传、吴主传等。关羽斩颜良与文丑战死分别叙述；郭嘉的“十胜十败”标注为裴注引《傅子》；207 年辽东仍由公孙氏掌握，不画成曹操直辖领土。

新地点使用现代区域约位；汉末黄河故道、古城治所、营地与行军道路均未精确复原。新篇没有套用赤壁的州郡边界或势力多边形。控制点只表示当前事件涉及的据点，不等于完整疆域。人物「本篇故事」地图仅显示关联地点，不证明人物到场；个人行迹使用生平节点单独呈现。
