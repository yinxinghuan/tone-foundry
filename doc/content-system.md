# Tone Foundry — 内容系统与模块资产合同

## 1. 系统目标

这份文档定义“有什么内容，以及内容之间为什么可以或不可以组合”。它不定义玩家如何抽取、解锁、付费或获得模组；获取机制在下一阶段设计。

内容系统需要同时支持：

- 首次接触者凭外形和试听理解差异。
- 吉他爱好者能读出结构与文化来源。
- SVG 模块可以安全组合，不出现遮挡、受力或弦路错误。
- 音色参数具有可解释因果，不沦为随机 preset。
- 收藏条目能讲述年份、工艺、改装与演奏历史。
- 公共琴墙可以按文化、结构和声音维度筛选。
- 后续加入超现实内容时不破坏真实基调。

## 2. 内容对象层级

```text
Culture Scene（文化场景）
└── Instrument Family（原型家族）
    ├── Construction Recipe（结构配方）
    ├── Compatible Module Pools（兼容模组池）
    ├── Finish & Wear Grammar（饰面与磨损语法）
    ├── Tone Tendency（声音倾向）
    └── Lore Vocabulary（收藏叙事词汇）

Guitar Instance（玩家吉他实例）
├── Family + Modules
├── Finish + Wear + Provenance
├── Deterministic Tone Genome
├── SVG Assembly Seed
└── Ownership / Riff / Remix Records
```

## 3. 原型家族字段

每个家族内容项必须具备：

- `familyId`：原创稳定 ID。
- `displayName` / `displayNameZh`：原创公开名。
- `eraStart` / `eraTags`：出现年代与主要复兴年代。
- `cultureTags`：关联流派与场景，至少 2 项，不超过 6 项。
- `construction`：solid、chambered、semi-hollow、hollow、acoustic、resonator。
- `neckJoint`：bolt-on、set-neck、neck-through、headless-joint。
- `scaleClass`：short、medium、long、baritone、multiscale。
- `stringCounts`：允许的弦数集合。
- `bodySocketSet`：琴颈、桥、拾音器、控制区、护板、背带点的锚点版本。
- `defaultToneTendency`：只表达倾向，不直接覆盖具体部件。
- `requiredTraits`：缺失后不再属于该家族的结构特征。
- `forbiddenTraits`：会造成工程或文化矛盾的部件。
- `finishFamilies`：可信饰面集合。
- `wearMapId`：允许出现磨损的区域图。
- `loreDeckId`：收藏描述与历史提示池。
- `silhouetteRiskNotes`：与真实品牌识别轮廓保持距离的修改规则。

## 4. 模组分类

### 4.1 强结构模组

这些模组改变锚点、比例或弦路，必须先决定：

1. 琴体家族与 construction。
2. 弦数：6、7、8、12。
3. 尺度：24–25 英寸级短尺度、约 25 英寸中尺度、25.5 英寸级长尺度、27–30 英寸 baritone、multiscale。
4. 琴颈连接：bolt-on、set-neck、neck-through、headless。
5. 桥类别：固定、分体桥尾、传统颤音、浮动颤音、锁弦双摇、独立 headless 鞍。

强结构模组发生变化时，系统必须重新验证整个兼容链，不能只更换图层。

### 4.2 中结构模组

- 拾音器类型与数量。
- 拾音器安装尺寸与位置。
- 护板轮廓。
- 控制板、旋钮数量、拨档与滑钮。
- f 孔、模拟 f 孔或无音孔。
- 尾钩、摇把、桥盖与拾音器罩。
- 琴头 3+3、6-inline、reverse-inline、12-string、headless。

中结构模组不能改变琴的基本受力框架，但会显著影响文化识别和声音。

### 4.3 表面与叙事模组

- 木材视觉、漆面、burst、metallic、sparkle、transparent stain、oil finish。
- 包边、镶嵌、旋钮帽、开关帽、金属镀层。
- 年代氧化、漆裂、边缘磨损、前臂磨损、腰带扣痕。
- 贴纸、胶带、手绘、维修章、琴盒标签、巡演标记。

这些内容可以丰富收藏差异，但不能伪装成主要音色来源。

## 5. 拾音器内容库

### P01 — Narrow Single / 窄线圈

- 快速起音、明亮高频、动态直接。
- 文化关联：country、surf、funk、blues、indie。
- 弱点：高增益下噪声更明显；噪声不是 bug，可成为文化性格。
- SVG：六枚 pole pieces、窄线圈壳、开放或有罩版本。

### P02 — Broad Single / 宽线圈

- 比窄单线圈更厚的中频，仍保留单线圈触弦感。
- 文化关联：early rock、punk、blues、garage。
- SVG：宽肥皂盒或 dog-ear 安装耳，但使用原创外壳比例。

### P03 — Twin Coil / 双线圈

- 抑制工频噪声、输出更高、中频更饱满。
- 文化关联：blues、classic rock、hard rock、metal、jazz。
- SVG：双排 pole / screw、开放线圈、金属罩三种表面层。

### P04 — Clear Twin / 清晰双线圈

- 较低输出、起音清楚、低频不拥挤，兼具 hum cancellation。
- 文化关联：rockabilly、country、hollow-body、indie。
- SVG：窄双排与独特框架，但避免复制真实 Filter’Tron 外观。

### P05 — Lipstick Tube / 管式单线圈

- 明亮、轻薄、带独特空心感。
- 文化关联：budget vintage、surf、garage、indie。
- SVG：圆头金属管状罩，原创开孔与固定方式。

### P06 — Foil Plate / 箔片式

- 泛音复杂、微松散、lo-fi 个性强。
- 文化关联：pawn-shop guitar、garage、experimental、indie。
- SVG：压纹金属面、网格或箔片视觉，但不使用真实商标图案。

### P07 — Active Block / 主动式

- 输出稳定、噪声低、压缩明显、低频紧。
- 文化关联：modern metal、studio precision、extended range。
- SVG：无 pole 的密封矩形、低调标记、独立电池/电路叙事。

### P08 — Piezo Bridge / 压电桥

- 强调弦与桥的瞬态，适合 acoustic-like、hybrid 与实验琴。
- 不应像磁性拾音器一样放在弦下画一个块；表现应集成到桥鞍或桥下结构。

## 6. 琴桥与尾部系统

| ID | 类型 | 结构效果 | 文化语义 | 兼容重点 |
|---|---|---|---|---|
| B01 | Hardtail Plate | 起音直接、稳定 | workhorse、country、punk | 常与 bolt-on slab 搭配 |
| B02 | Bridge + Stop Tail | 延音与稳定 | carved single-cut、semi-hollow | 必须保持两件距离与弦角 |
| B03 | Wraparound | 简单、触感直接 | student、garage、junior | 桥同时承担尾部锚定 |
| B04 | Vintage Synchronized Vibrato | 可轻度颤音 | blues、surf、rock | 需要弹簧腔与摇把 |
| B05 | Floating Offset Vibrato | 细腻晃动、长尾余弦 | surf、indie、shoegaze | 桥与尾钮距离是身份核心 |
| B06 | Roller / Big-body Vibrato | 柔和颤音、视觉强 | rockabilly、hollow-body | 需尾部承载区与足够琴体长度 |
| B07 | Locking Double Trem | 大幅升降音 | hot-rod、virtuoso、metal | 锁弦枕与桥微调必须成套 |
| B08 | Individual Headless | 精密、紧凑 | modern ergonomic | 每弦独立锚点与调弦结构 |
| B09 | Floating Archtop + Tailpiece | 空气感、结构传统 | jazz、full hollow | 琴桥不能看似固定进面板 |

## 7. 琴颈、指板与弦

### 琴颈属性

- 连接方式是家族身份的一部分，不作为纯 kosmetics。
- 琴颈 profile 的 C、V、U、thin-flat 影响收藏叙事和演奏手感，但首版声音只做微弱响应修饰。
- 指板 radius 与品丝规格影响 bending、和弦舒适度和现代感。
- 21 / 22 / 24 品改变颈拾音器可放置位置；不能增加品数却保持原拾音器位置不动。

### 弦属性

- Nickel roundwound：现代电吉他通用基线。
- Pure nickel：起音较柔、复古语义更强。
- Stainless steel：更亮、更硬、更现代。
- Flatwound：高频收敛、滑音平顺，连接 jazz、early pop 与特殊 clean tone。
- Heavy gauge：张力感、低频稳定、blues / jazz / down-tuning 语义。
- Light gauge：推弦容易、起音灵敏、solo / pop 语义。
- 12-string paired set：必须改变弦数、弦钮、桥鞍和声音模型，不能作为普通弦材质。

## 8. 电子与控制布局

首版控制内容：

- 1 Volume。
- 1 Volume + 1 Tone。
- 2 Volume + 2 Tone + 3-way toggle。
- Master Volume + Pickup Volumes。
- 5-way blade + Volume + 2 Tone。
- Rhythm / Lead dual circuit。
- Coil split、series / parallel、phase reverse 作为后续高级电路。

文化真实性规则：

- 旋钮数量必须与可用电路一致。
- 开关位置和功能需要在试听时可见反馈。
- “复杂”不自动更稀有；简单单拾音器、单旋钮也可以是文化核心。
- 电子变化对音色的影响大于装饰性木纹变化。

## 9. 饰面与工艺内容库

### 木与透明饰面

- Natural ash grain：直或开放纹理，连接 workhorse 与 1970s natural culture。
- Mahogany stain：深暖、细密，不使用夸张虎纹。
- Flame / quilt maple cap：只在具有 top cap 结构的琴体出现。
- Open-pore oil：低反射、触感导向，连接 boutique 与 modern ergonomic。

### 不透明与金属饰面

- Butterscotch / blonde：允许底层木纹轻微透出。
- TV-like pale yellow：带历史感的暖黄，不复制具体品牌命名。
- Surf pastel：seafoam、foam blue、shell pink、aged white，配合 offset / contour 家族。
- Metallic / candy：需要底层金属颗粒与透明色层的视觉逻辑。
- Sparkle：颗粒方向与密度受光源控制，适合 atomic-age 与舞台琴。
- Black tuxedo：黑漆、浅色包边、金色硬件，但使用原创镶嵌。

### Burst 家族

- Two-tone tobacco。
- Three-tone warm burst。
- Cherry-to-amber fade。
- Silver-to-black burst。
- Burst 必须顺随琴体外缘与雕面，不是简单中心径向渐变。

### 镀层与老化

- Nickel：偏暖银色，随时间变暗。
- Chrome：更冷、更镜面，耐久度高。
- Gold plate：高点磨损后露出底层 nickel，不能均匀变棕。
- Black hardware：现代、工业，但边缘损伤应露出金属底。

## 10. 磨损语法

每个琴体需要一张 `wear map`，至少包含：

- `armContact`：右手前臂接触区。
- `pickArc`：拨片扫过区。
- `beltContact`：琴背腰带接触区。
- `edgeImpact`：琴体下缘和角部磕碰区。
- `controlTouch`：旋钮和开关周围油光。
- `fretUseLow` / `fretUseHigh`：低把位和高把位使用区。
- `standContact`：琴头或琴颈支架接触区。
- `oxidationMetal`：手汗常接触金属区。

磨损内容由原因生成，不由随机噪声生成。一个“长期节奏琴手”的磨损模式应不同于“高把位主音玩家”或“长期收藏未演奏”的琴。

## 11. 声音语义权重

内容层只定义因果优先级，不在此决定最终 DSP 数值：

### 强影响

- 拾音器类型、位置与切换方式。
- 弦材料、粗细、弦数与定弦。
- scale length 与实际音高。
- 琴桥、尾部和颤音结构。
- volume / tone 电路、主动或被动电子。
- amp channel、gain、speaker 与效果链。
- 演奏 articulation：拨弦位置、力度、闷音、扫弦方向。

### 中影响

- solid / chambered / semi-hollow / hollow construction。
- 琴颈连接与整体刚度。
- 拾音器安装方式与离弦高度。

### 轻微影响或收藏叙事优先

- 同一结构中的木材视觉品种。
- 漆面颜色。
- 镶嵌、包边、旋钮帽和贴纸。
- 纯视觉老化。

游戏可以为了可听辨识度适度放大差异，但必须遵守以上相对顺序。

## 12. 内容稀有层（不含获取机制）

稀有层描述“为什么值得收藏”，不直接对应概率或价格。

### Shop Standard / 工坊标准

- 经典、可靠、文化上常见的基础组合。
- 不是低品质；它是玩家建立听觉参照的基线。

### Custom Order / 定制订单

- 少见但可信的颜色、拾音器、控制布局或硬件组合。
- 价值来自明确的使用目标，而非堆叠装饰。

### Road Story / 公路故事

- 带有可解释的演奏磨损、维修与出处记录。
- 同一结构可能因故事成为高收藏价值内容。

### Archive Spec / 档案规格

- 某一年代、工艺或短暂设计思想的完整组合。
- 需要成套出现，不能把一个“年份标签”贴给随机部件。

### Impossible Prototype / 不可能原型

- 超现实材料或声音行为，但工程与演奏逻辑仍可信。
- 每把只突出一个主要越界点，其他部分保持克制。

## 13. 首发内容底座建议

首发不追求把所有 12 个家族同时做完。为保证每个家族的 SVG、声音和文化内容足够深，建议首个内容库包含：

### 6 个完整家族

1. Blackguard Standard（F01 经典板式单切参考）。
2. Contour Three。
3. Carved Crown。
4. Offset Current。
5. Centerline Semi。
6. Ballroom Hollow。

这六个家族覆盖工作琴、通用双切、厚单切、另类 offset、半空心和全空心，已经形成明显的外形、音色与文化跨度。

### 结构模组规模

- 6 琴体家族。
- 3 scale classes。
- 4 琴颈 profile。
- 5 指板材质视觉。
- 6 拾音器类型、14 个具体外壳变体。
- 7 琴桥 / 尾部系统。
- 8 控制布局。
- 12 基础饰面、8 个 burst / metallic 变体。
- 4 镀层。
- 6 镶嵌系统。
- 5 磨损故事包。
- 2 Impossible Prototype 材料包。

这些数字是内容制作容量，不代表首局同时向玩家展示的选项数量。

## 14. 模组兼容矩阵原则

### 硬阻止

- 12 弦琴颈搭配 6 弦桥。
- headless 琴颈搭配传统琴头弦钮。
- floating archtop bridge 搭配没有尾钩的琴体。
- full hollow 上安装要求大面积后腔的 locking trem。
- 24 品琴颈侵入颈拾音器位置却不移动拾音器。
- multiscale 指板搭配水平单体桥。

### 可允许但需解释

- Workhorse slab 安装 twin coil：作为 hot-rod 改装，并改变护板或桥板。
- Offset 安装高输出拾音器：作为 alternative / noise 改装。
- Hollow body 使用高增益：允许，但内容应表现反馈风险与控制手段。
- Carved single-cut 使用单拾音器 wraparound：进入 stripped-down student / punk 分支。

### 纯外观自由

- 合理范围内的漆色。
- 旋钮帽与开关帽。
- 原创贴纸和维修标签。
- 金属镀层，但需遵循磨损逻辑。

## 15. SVG 模块资产合同

### 15.1 统一画布

- 完整吉他使用 `viewBox="0 0 600 1200"`。
- 琴颈中心线为 `x = 300`。
- 琴枕参考线为 `y = 165`，琴颈连接参考线为 `y = 670`，桥参考线为 `y = 905`。
- 每个家族可以在允许范围内偏移琴桥和连接点，但必须通过 socket metadata 声明。
- 预览默认保持接近正视的 2.5D 产品角度；整把琴可以轻微倾斜，单个部件不能各自使用不同透视。

### 15.2 图层顺序

1. 地面投影。
2. 琴体侧面 / 厚度。
3. 琴体主面与雕面。
4. 包边、音孔与腔体暗部。
5. 琴颈背部与琴头。
6. 指板、品丝与镶嵌。
7. 护板与控制板。
8. 拾音器及安装框。
9. 琴桥、尾部、旋钮与开关。
10. 六至十二根琴弦。
11. 漆面高光、边缘磨损与微划痕。
12. 可交互热点与焦点轮廓；热点本身不进入导出视觉。

### 15.3 材质规则

- 木纹使用受控的 path / pattern / mask，不使用无法随琴体轮廓变化的平铺噪声。
- 漆面体积主要通过 2–4 层 gradient、高光带和边缘暗部表达。
- 金属至少区分底色、窄高光、暗边和环境反射；chrome、nickel、gold、black chrome 不能只换色相。
- 塑料护板具有轻微厚度暗边和螺丝固定点。
- 弦在 160 px 缩略图中允许合并为高低两组视觉线，但详情图必须显示实际弦数。
- 阴影只用于接触、层级和整体悬浮；禁止用大面积 blur 掩盖轮廓问题。

### 15.4 代码与浏览器规则

- 每个实例的 gradient、mask、clipPath、filter ID 必须带实例前缀，避免公共琴墙同时渲染多把琴时发生 ID 冲突。
- 可变模块优先保留语义化 `<g>`、`<path>`、`<rect>`、`<circle>`，不要把整琴压成单一路径。
- 所有 standalone SVG 必须有 `viewBox` 和 `xmlns`，不写固定像素宽高。
- 不依赖编辑器 metadata、外部字体、`xlink:href` 或根绝对资源路径。
- SVG 作为装饰预览时使用空 alt；作为吉他作品主体时提供包含琴名、家族和主要材质的可访问名称。
- `prefers-reduced-motion` 下关闭高光扫动、弦振动和视差，只保留状态变化。

## 16. 公共琴墙内容字段

一条公开内容至少需要：

- 吉他名称与原创家族名。
- 正面 SVG 缩略图。
- 3 个主要收藏标签，例如 `Offset / Broad Single / Road Story`。
- 6 维音色指纹的紧凑摘要。
- First Riff 的时长、BPM 和播放按钮。
- 作者头像、名字与主页入口；自己显示 YOU / 你。
- 创建时间、收藏编号、原作或 Remix 来源。
- “为什么它特别”的一句具体描述，优先来自结构、工艺或历史，不使用空泛 rarity 文案。

公共琴墙数据必须允许同一作者出现多把琴和多首作品；去重单位是作品 Entry ID。

## 17. 内容 QA 清单

每一把可发布吉他至少通过以下检查：

- 所有弦从桥 / 尾部经过琴枕到达正确弦钮。
- 弦数、弦钮数、桥鞍数一致。
- 琴桥、尾部与琴体 construction 兼容。
- 拾音器位于弦下，外壳尺寸与安装方式可信。
- 旋钮和开关与实际音色控制一致。
- 磨损位置可以由演奏或搬运行为解释。
- 文化标签不是单一刻板印象，且至少有一个结构依据。
- 声音主要差异来自强 / 中影响属性，而非漆色。
- 缩略图 160×160 下能辨认家族轮廓和一个独特部件。
- 详情图中不存在 gradient / mask ID 冲突、断裂弦或错误遮挡。
- 没有真实 logo、型号字样、签名、受保护琴头或 1:1 经典控制布局。
- 超现实琴只有一个主要越界命题，且仍可想象被实际演奏。
