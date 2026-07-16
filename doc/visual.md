# Tone Foundry — Visual Bible

## 1. Visual thesis

- **Game and audience**：面向喜欢吉他、精致物件、收藏与轻量音乐创作的手机用户；懂琴的人能读出结构，不懂琴的人也能凭轮廓、材质与声音理解差异。
- **Emotional promise**：像在深夜 custom shop 的检验台上，第一次看到并听见一把刚完成、只属于自己的琴。
- **One-sentence visual thesis**：一把收藏级模块化 SVG 吉他躺在打开的深绿琴盒中，玩家在一张张米白工单、靛蓝印章和黑色手写检验记号上完成选择，像亲手跟随一家老式 custom shop 的真实制造档案。
- **Signature visual moment**：换琴后工作灯沿琴头到琴桥缓慢扫过，木纹、雕面、镀铬和六根弦依次显形，随后第一根弦被拨响。
- **Three required qualities**：精密、可触、克制。
- **Three directions to avoid**：霓虹合成器皮肤、廉价卡通乐器、用大量 blur / glow 冒充高级质感。

## 2. Composition and camera

- **Orientation and aspect ratios**：手机竖屏 360–430 px 为主；测试台使用响应式 DOM，吉他 SVG 保持 `1:2` 自然画布。桌面最大内容宽度 1120 px。
- **Camera and perspective**：吉他接近正视的 2.5D 产品视角，整琴允许约 3 度倾斜和极轻透视暗示；所有模块共享同一视角。
- **Playfield focal area**：制琴态手机以约 `56–62dvh` 的完整吉他舞台为核心，下方仅容纳当前包裹或 2–3 个候选与确认动作；桌面仍保持单一居中仪式构图，不再使用左琴右后台控制台。试音态手机上方 58–66% 为吉他与六弦直接交互区。
- **Foreground**：金属硬件、琴弦、漆面高光和可交互触弦反馈。
- **Midground**：完整吉他、软垫支撑与检验标签。
- **Background**：深绿琴盒毡布、皮革包边、低对比缝线和局部暖灯，不出现工程软件网格或抢眼装饰。
- **HUD safe areas**：顶部保留 `max(16px, env(safe-area-inset-top))`；底部控制区保留 `max(18px, env(safe-area-inset-bottom))`。
- **Attention path**：完整吉他 → 当前被试装的部件差异 → 唯一主动作。工单、平台、编号和概率不得抢占前三层注意力。
- **Instrument inspector**：整琴视图为 `100%`，细节视图允许 `100%–350%` 连续缩放；琴始终在带裁切的毡布检验台内移动，工具条不随琴缩放。

## 3. Color

- **Bench Black** `#141210`：页面背景与最暗木纹。
- **Walnut** `#2A211A`：工作台主面。
- **Case Felt** `#2D352F`：琴盒 / 检验台衬布。
- **Bone** `#E9E0CD`：主要文字与琴枕类浅色。
- **Muted Linen** `#9D9485`：次级文字。
- **Nickel** `#B8B5AD`：金属硬件基础。
- **Brass** `#B78A42`：选择、高级铭牌与重要刻度。
- **Signal Amber** `#E5B85C`：播放头、聚焦和实时触弦。
- **Error Oxide** `#A65342`：错误与不可用状态。
- **Success Patina** `#6E9A79`：保存和音频就绪。
- **Receipt Stock** `#EEE3CB`：工单、候选封签、声音档案与琴墙卡片。
- **Carbon Ink** `#211F1B`：手写圈选、批注与主正文。
- **Workshop Blue** `#1752A6`：单色印刷、表格线、编号、选中章和主要动作。
- **Usage ratio**：背景与中性材料 72%，吉他饰面 20%，功能强调 8%。
- **Forbidden combinations**：大面积纯黑配高饱和霓虹；紫蓝粉渐变；黄铜色同时承担所有按钮状态。

八把校准母版的主体色：

- Blackguard Standard：aged butterscotch `#C59A50` + single-ply black phenolic `#171615`。
- Carved Crown：amber-to-oxblood burst `#D08B3C → #54231F`。
- Offset Current：aged sea glass `#6F9B92` + aged parchment `#DED4B8`；浅护板用于保持经典 offset 上角和双电路区域在暗背景中的结构可读性。
- Timber Dreadnought：aged spruce `#D8A65C → #B87335` + mahogany side `#5A2F20` + ebony `#211A16`；面板高光服从纵向云杉纹理，音孔保持近黑空气腔，不使用金属拾音器高光。
- Contour SSS：aged olympic white `#D7D2B8` + mint guard `#D9DDC8` + rosewood `#33231E`；轮廓双切、三单线圈和同步颤音必须在缩略图中同时可辨。
- Centerblock Semi-Hollow：heritage cherry `#9E3528 → #4A1715` + cream binding `#E4D5B4`；双 f 孔、中央实心结构语义、双线圈和分体桥尾构成识别核心。
- Thin Double-Horn：deep cherry `#9C3028 → #4B1518` + full-face black guard `#171719`；薄桃花心木双角、颈接近琴体高位和大护板不能被画成普通对称双切。
- Concert Nylon：cedar amber `#C68C4B → #8E5430` + rosewood `#34201B`；十二品接柄、宽琴枕、开槽 3+3 琴头、花环音孔和系弦桥必须形成与钢弦木吉他的结构差异。

## 4. Typography

- **Receipt headline**：`Arial Narrow`, `Avenir Next Condensed`, `PingFang SC`, sans-serif；用于工单大标题、包裹编号和主要动作，20–42 px，700–800 weight，采用靛蓝单色印刷的紧凑节奏。
- **Culture / provenance**：`Songti SC`, `STSong`, serif；只用于琴名、年代说明与文化注释，16–22 px，避免整页都像技术面板。
- **UI / body**：`Avenir Next`, `Helvetica Neue`, `PingFang SC`, `Microsoft YaHei`, sans-serif；移动端正文至少 16 px，部件按钮 13–15 px，500–650 weight。
- **Numeric / technical**：`SFMono-Regular`, `Roboto Mono`, monospace；BPM、编号和频率使用 tabular numerals。
- **Handwritten annotation**：只用于已选择、检验通过和一次性批注，优先系统手写 / 楷体回退 `"Kaiti SC", "STKaiti", cursive`；不承担正文，也不下载装饰性网络字体。
- **Case rules**：英文技术标签使用 0.08em tracking 的 uppercase；中文不加字距。
- **Outline rules**：文字不使用描边、发光或金属渐变。

## 5. Shape, material, and lighting

- **Dominant shapes**：吉他曲线与真实硬件几何是主角；信息 UI 使用收据矩形、细表格线、圆形 / 菱形检验章、票据编号和手写圈选；工具仍使用窄金属铭牌、刻度槽与机械拨档。
- **Corner language**：普通面板 8–12 px；金属铭牌 3–5 px；胶木旋钮为圆形。禁止所有容器统一 20+ px 大圆角。
- **Borders and shadows**：边框以 1 px 暗边 + 1 px 内高光表达厚度；整体阴影偏左下，模糊半径受控在 8–24 px。
- **Materials**：胡桃木、皮革、开放木蜡、硝基漆感高光、龟纹护板、胶木、镍、铬、黄铜、棉布和琴盒毡构成空间；无涂层米白纸、褪色蓝墨、黑铅笔 / 记号笔构成信息层。纸张使用细纤维、压痕、轻翘边和接触阴影，禁止均匀噪点覆盖。
- **Light**：主光从左上 28–35 度照入，暖中性 `#F3DEB2`；右下有极弱冷反射。每个 SVG 模块必须服从这一方向。
- **Texture rule**：纹理描述材料结构，不作为随机噪声覆盖。木纹随琴体长轴与雕面弯曲；金属拉丝方向一致；磨损只出现在接触区域。
- **Calibration-master parity**：后四把不得使用“通用琴颈 + 通用胶囊硬件 + 单一 body gradient”的低保真组合。每把至少需要 body-depth、top / bevel、finish-light、neck、headstock-back hardware、fingerboard、frets、markers、pickguard / binding、pickup / soundhole、bridge、tailpiece / tie block、controls、strings 与 fastener 层；100% 时结构成立，350% 时仍能解释装配关系。

## 6. Characters, environments, and assets

- 本游戏无角色立绘；核心“角色”是吉他本身。
- 完整吉他 SVG 使用 `viewBox="0 0 600 1200"`，详情态显示实际六弦、品丝、固定螺丝和控制件。
- 首个切片制作 Blackguard Standard、Carved Crown、Offset Current 与 Timber Dreadnought；F01 作为经典板式单切金标准，忠实校准正面结构比例与琴头类别轮廓，但不复制真实 logo、签名或序列号。
- F01 使用统一正交比例尺：`25.5 in / 648 mm ≈ 711 SVG units`，从琴枕量至黄铜弦鞍接触点，不把弦穿孔误计为有效弦长；官方 `1.650 in / 42 mm` 琴枕宽映射为约 `46–48` units，琴颈袋 `2-3/16 in / 55.56 mm` 映射为约 `63–65` units。
- F01 的琴体曲率和硬件相对位置以 Fender 1951 Blackguard 官方服务图的正视线稿为校准层；五孔护板参考 Warmoth 1:1 模板；控制板按 Fender `6.27 × 1.26 in`、桥板按 vintage `3.93 × 3.148 in` 尺寸约束。
- Carved Crown 以 Gibson 官方 1959 Reissue 正面图与规格建立“雕面单切”语言：`24.75 in / 628.65 mm` 弦长、`1.69 in / 42.85 mm` 琴枕、`2.24 in / 56.89 mm` 指板末端、22 品、胶合琴颈、3+3 弦钮、双封闭线圈、ABR 类桥、铝质止弦尾件和四旋钮。仅校准家族比例与装配，不绘制官方品牌字样或签名。
- Offset Current 已以 Fender 官方 1966 Jazzmaster 正面图与规格校准：`25.5 in / 648 mm` 弦长、`1.650 in / 42 mm` 琴枕、21 品、包边圆贴玫瑰木指板、宽单线圈、螺纹弦鞍浮动桥、长弦尾浮动颤音和 rhythm / lead 双电路。最终资产保持去品牌化。
- Timber Dreadnought 以 Martin 官方 Dreadnought 文化说明和 D-14 Fret 规格建立通用声学语言：`25.4 in` 弦长、20 品、14 品接柄、宽下腹和深箱体，结构使用云杉面板、桃花心木背侧板、X 音梁语义、实心 3+3 琴头、乌木指板、圆音孔、多圈 rosette、belly bridge、补偿弦枕与六枚弦钉；只校准家族结构，不绘制品牌字样、型号或头标。
- Contour SSS 以 Fender 官方 Standard / Player Stratocaster 规格校准：`25.5 in / 648 mm` 弦长、`42–42.86 mm` 琴枕、21–22 品、四螺栓枫木琴颈、六联琴头、三枚单线圈、五档拨片、三旋钮和同步颤音桥。轮廓必须表现非对称双切、上角延伸和前臂 / 腹部倒角语义，不绘制品牌字样。
- Centerblock Semi-Hollow 以 Gibson 官方 ES-335 规格校准：`24.75 in / 628.65 mm` 弦长、`43.05 mm` 琴枕、22 品、胶合桃花心木琴颈、3+3 琴头、枫木中央实心块、双 f 孔、双线圈、ABR 类桥和止弦尾件。只保留类别结构，不复制头标。
- Thin Double-Horn 以 Gibson 官方 SG Standard 规格校准：`24.75 in / 628.65 mm` 弦长、`43.05 mm` 琴枕、22 品、长榫胶合颈、薄桃花心木双角琴体、3+3 琴头、双线圈、Tune-O-Matic 类桥、止弦尾件与四旋钮；双角深浅、琴颈接入高度和全幅护板不得泛化。
- Concert Nylon 以 Yamaha 官方 CG 系列规格校准：`650 mm` 弦长、`490 mm` 箱体长度、`52 mm` 琴枕、约 `94–100 mm` 箱深、十二品接柄、平指板、开槽 3+3 琴头、圆音孔花环和系弦桥。尼龙高音弦与缠绕低音弦使用不同明暗，且不出现钢弦弦钉。
- Neck module 另以用户提供的 Tele 类实拍正面近景校准：琴头宽高、六枚封闭式弦钮的斜排、矩形压弦片、琴枕厚度、指板 `1.65 → 2.2 in` 近似锥度、品位点和圆角 heel 均优先服从实物比例。
- 参考用于类别准确性、模块尺寸与正面装配方向：最终 SVG 不包含品牌 logo、商标字样、签名或官方序列号。
- 模块保留语义化分组：shadow、body-depth、body-top、binding、neck、fingerboard、pickguard、pickups、bridge、controls、strings、finish-light、wear。
- `25.5 in bolt-on` 拼装平台必须共享同一套可视锚点：琴枕 `y=205`、琴颈袋中心线 `x=300`、桥弦鞍线 `y=916`、琴身底部约 `y=1105`。拼装台更换琴身、琴颈、拾音器和桥时不移动相机、不缩放单件；正确接口由连续弦路、琴颈袋接缝和桥位对齐共同证明。
- `24.75 in set-neck` 拼装平台使用独立锚点：琴枕约 `y=220`、22 品指板末端约 `y=690`、桥弦鞍线约 `y=910`、尾件区约 `y=970`。其 3+3 琴头、包边指板、胶合颈根和桥尾关系不得复用或缩放 bolt-on 六联琴颈；平台切换必须让插槽铭牌、模块清单和兼容数量同时更新。
- Set-neck 三种琴体继续服从相同正视镜头和左上主光，但保留各自制造语义：雕面单切使用弧面高光与窄腰；半空心使用完整奶油包边、双 f 孔与中心块；薄双角使用边缘 bevel 和大护板。模块变体只能改变真实可替换结构，不把 f 孔、雕面或琴体厚度当成饰面开关。
- 拼装台使用“爆炸图式换件反馈”而不是魔法变形：旧模块在 `140 ms` 内降低明度并离开 `6 px`，新模块从对应插槽方向进入，在 `220 ms` 内锁定；装配完成时锚点刻线短亮一次。减少动态效果时直接替换并保留文字状态。
- 模块叠层遵循实体装配：body → pickguard → neck pocket shadow → neck / fingerboard → frets / markers → pickups / bridge → strings；护板不得覆盖指板根部，琴弦必须位于品丝和琴枕上方。
- 枫木指板以一整块木料渲染，横向明暗只表达圆弧转面，中心与两侧色差不超过约 `12%`；品丝使用非缩放细线，`350%` 下仍不能读成白色梯子。
- 六联琴头按琴枕、导弦器、弦钮轴心建立连续弦路；正面只显示落在木料内部的垫圈、锁紧螺母、弦柱和绕弦。旋钮与传动结构位于琴头背层，只能从外缘后方露出，正视图不得画出横跨木板表面的连接轴，也不允许用装饰线串联六个弦钮。
- 经典基准琴的琴头必须忠实表现右手琴正面的六联方向、斜排轴心、低音侧轮廓和端部配重；原创琴型才允许改变轮廓。所有琴头均不绘制品牌 logo、签名或序列号。
- 缩略图 160×160 下必须看出家族轮廓和至少一个识别部件；微划痕可以消失，结构不能消失。
- 新增四把完成前必须输出同名 `whole-100`、`headstock-350`、`hardware-350` 证据；若与 Blackguard 的全身缩略图并排时明显像图标或示意图，则仍视为 P1，不能以“后续再精修”通过。
- 超现实资产后续沿用同一视角、光源和密度，只允许一个主要越界材料命题。

## 7. UI and icons

- **Icon family**：自绘 24×24、1.75 stroke 的圆角机械线性 SVG；播放三角、暂停、音量、A/B、信息、返回和设置保持统一。
- **Buttons**：主要试听按钮为黄铜边框的深胶木按键，至少 48 px 高；次级切换使用放大器式拨档或刻度槽。
- **Panels**：参数、候选、收藏和档案像真实检验卡 / 收据压在工作台或琴盒边缘；采用米白纸、靛蓝表格线、编号、盖章与少量黑色手写圈选。试听 / 缩放仍是黑色金属控制条，形成“纸负责判断、机器负责操作”的清晰分工。
- **Builder screen contract**：玩家制琴占满安全视口，外层项目标题、工作区导航、页脚和试音实验入口全部隐藏。一个状态只回答一个问题：打开包裹，或选择并确认一个部件。
- **Builder hierarchy**：第一焦点永远是整把吉他；第二层是当前包裹或候选；第三层才是安静的 5 点进度。弦长平台、工单号、兼容数量、锚点、manifest 与步骤名称均不常驻。
- **Cultural signature**：舞台来自打开的硬壳琴盒——深绿绒布、皮革包边、窄黄铜、局部暖灯；底部是一张被夹在琴盒边缘的制造工单。候选像工单上的 2–3 张可撕封签，选中后出现不完全规整的黑色手写圈和蓝色检验章，而不是发光卡片或 SaaS 面板。
- **Inspection rail**：试听、缩放和复位集成在舞台右侧一条窄黑金属控制条内；44 px 自绘 SVG 按键像放大器面板，不展开成新的导航层。自动部位推镜和手动缩放叠加，复位只重置手动倍率。
- **Wall detail**：详情页像一张打开的 custom-shop 检验档案：上半部为可缩放成琴，下半部为作者铭牌、模块清单、六维音色和 Riff 穿孔纸带。它必须明显比墙卡丰富，也不能退回结算页的按钮布局。
- **Trial-fit contract**：候选按下后立刻把该部件临时装上主吉他；候选的选中轮廓、主吉他的局部亮度变化和确认按钮同时响应。切换候选不得等到下一步才更新吉他。
- **Progress**：仅显示 5 个 `4–6 px` 圆点；已完成点使用 muted brass，当前点略宽或提高亮度，禁止数字、步骤名和整行 tab。
- **Start state**：只保留品牌小标、短标题、一个“开始制琴”按钮；琴架与公共琴墙成为底部低强调文字入口，概率折叠为一行可选说明。
- **States**：pressed 下沉 1 px 且内阴影加深；focus 使用 2 px Signal Amber 外环；disabled 降低对比但保留标签；loading 用机械表针式进度；error 显示 Oxide 边线和恢复文案；success 以 Patina 点灯表示。
- **Targets**：所有触控目标至少 44×44 CSS px。
- **Inspect / Play split**：检视态使用手掌拖动、双指缩放和桌面滚轮；演奏态将单指输入交给琴弦。两个模式使用显式分段按钮，不依赖隐藏手势。
- **Recovery**：缩放条常驻显示倍率，并提供缩小、放大、复位三项 44 px 控件；双击在 `100% / 200%` 间快速切换，避免拖丢乐器。
- **Emoji policy**：功能图标绝不使用 Emoji。

## 8. Motion and VFX

- **Motion personality**：机械、克制、有重量，不弹跳卖萌。
- **Tokens**：fast 120 ms、standard 220 ms、settle 360 ms、reveal 1200 ms；主要 easing `cubic-bezier(.22,.8,.24,1)`。
- **换琴**：旧琴降低 4% 明度并向下 6 px，160 ms；新琴从上方 8 px 进入并在 360 ms 内稳定。
- **装配轮廓**：未确认模块使用双层工程描线——外层冷灰 `#87928D`、内层近黑 `#151A18`，填充透明度不超过 `0.06`。它必须读成制琴模具 / 结构图，而不是禁用态或一把已经完成的灰色琴。
- **部位推镜**：候选页使用同一个 SVG 图层做 `transform + opacity` 镜头动画，不切换位图、不改变 viewBox。整琴到部位特写用 `620 ms cubic-bezier(.22,.82,.22,1)`；确认后退镜 `420 ms`。琴体 / 饰面约 `1.55×`，琴颈约 `1.65×`，拾音器 / 琴桥约 `1.8×`。动效减弱模式直接切换构图。
- **实体显影**：点击候选的同一帧先点亮选择环，随后当前模块在 `240 ms` 内由 `opacity .25 / grayscale(1)` 过渡到真实漆面或金属；已确认模块保持实体，未来模块仍为结构轮廓。
- **拨弦**：目标弦在 90–180 ms 内做 1.5–3 px 衰减振动，高光点在拨弦位置短暂出现；不晃动整把琴。
- **扫弦**：按经过顺序逐弦触发，视觉与声音间隔一致。
- **音色 A/B**：铭牌刻度指针 220 ms 滑向目标，声音使用短交叉过渡。
- **Reveal**：一条窄高光 900 ms 从琴头扫至琴桥，六弦以 35 ms 间隔出现。
- **Particles**：常规操作无粒子；稀有成琴后续可使用 6–12 个黄铜尘点，寿命不超过 700 ms。
- **Reduced motion**：取消位移、扫光、弦振动与尘点，只保留即时颜色 / 轮廓状态。

## 9. References translated into principles

- **高端吉他产品摄影**：用单一受控光线揭示雕面、漆层和硬件；不复制具体品牌布景。
- **Custom shop inspection bench**：让标签、编号和工具说明工艺过程；不把界面做成真实电商商品页。
- **Vintage amplifier control plate**：把播放、通道与参数做成可触机械对象；不牺牲移动端可读性。
- **Old workshop receipt / studio proof**：使用米白纸、靛蓝单色印刷、窄体标题、极细框线和上下对齐的字段建立秩序；手写只覆盖玩家最终选择，不能变成整页装饰字体。
- **Rubber inspection stamps**：圆形、椭圆、菱形和票据章用来表达 Archive、通过、编号与所有权；边缘略有印刷缺口，但不得牺牲文字清晰度。
- **Museum instrument display**：将乐器作为文化对象并提供出处；不做冰冷白盒展柜。
- **Hard case interior**：用毡布、金属扣和检验卡建立收藏仪式；不让每张墙卡都变成厚重相框。

## 10. Anti-patterns

- 禁止真实品牌 logo、型号字样、签名和序列号；经典基准琴允许准确表达类别轮廓，原创琴不得冒充具体品牌型号。
- 禁止 Emoji、混用填充卡通图标和线性技术图标。
- 禁止所有部件使用各自独立的光源、透视和高光方向。
- 禁止用强 blur、bloom、glassmorphism 和 neon glow 掩盖 SVG 细节不足。
- 禁止随机木纹、全表面均匀划痕、无因果 relic。
- 禁止把音色雷达图做成比吉他更抢眼的 dashboard。
- 禁止在 360 px 宽屏上塞入 16 个小于 44 px 的音序器格；测试切片不实现完整音序器。
- 手机音序器以“一次一小节”为视觉单位：四个 `44 px` 以上的拍点占满可用宽度，I / II / III / IV 小节选择器只承担换页，不把 16 列压缩或裁切在屏幕外。
- 成琴页不使用四宫格同权 CTA。First Riff 是唯一实心主按钮；试听、收架、再做一把使用低对比文字动作，制造等级默认折叠。
- 禁止让八把校准母版只通过颜色区分；电吉他必须在轮廓、桥、拾音器与控制上不同，两把木吉他必须通过接柄、琴枕宽度、琴头、桥和弦的固定方式形成结构级差异。
- 禁止把“模块化”表现为完整琴图片列表或只换 body fill；评审页必须提供可独立操作的槽位，并在预设中至少改变琴身、琴颈、拾音器和琴桥中的两类结构。
- 禁止在玩家制琴时常驻展示项目大标题、工作区导航、工单编号、平台规格、五个文字步骤和技术 manifest。
- 禁止候选选择只改变卡片样式而不改变主吉他预览；用户确认前必须看见该候选真实装配后的整琴。
- 禁止新工单一开始展示带完整漆面、硬件和投影的成琴；禁止用突跳或重新挂载 SVG 伪装镜头切换；禁止为了“精致”增加无意义玻璃卡、霓虹泛光和大量金边。
- 禁止大面积规则网格、重复 1 px 分隔线、全大写技术标签和四级等权矩形同时出现；它们会把开箱仪式退化为工程后台。
- 禁止试听按钮只播放与候选无关的母版音色；禁止把缩放工具删除后只保留自动镜头；禁止墙卡详情只显示一把琴和四个结算按钮。
- 禁止把参考图直接复制成平面海报：纸张只承载工单和档案，吉他舞台仍必须保留琴盒、皮革、木头、黄铜与金属的拟物空间。
- 禁止用大量随意旋转、污渍、咖啡渍、撕裂和假手写制造“复古”；每一枚章、圈选和磨损都必须对应一次真实选择或工坊状态。

## 11. Vertical-slice acceptance

- **Entry / idle**：玩家入口无需登录即可开始制琴；新工单首先看到完整但未实体化的冷灰结构轮廓。内部 `review.html` 仍以完整 Blackguard Standard 作为校准架默认琴。
- **Gameplay / content test**：玩家可切换八把校准母版、直接拨六根弦、划动扫弦、切换 Clean / Drive，并播放同一标准试听句；两把木吉他在 Clean 下保持各自箱体与弦材特征，Drive 仅作为对照实验。
- **Detail inspection**：玩家可在不离开检验台的情况下放大到 `350%`，拖动查看琴头、品丝、拾音器、琴桥、控制件和漆面；切换琴型后视图自动回到 `100%`。
- **High-feedback moment**：换琴后工作灯 reveal 与第一声拨弦同步，木纹、金属和弦振动清楚但克制。
- **Completion / comparison**：玩家可进入 A/B 比较，固定同一试听句和输出电平查看六维音色差异。
- **Narrow mobile**：360×740 下吉他不被裁切，主要按钮可触，说明文本不溢出，琴型选择可横向滚动但点击不阻断滚动。
- **Visual QA**：在 360×740、390×844、430×932、1024×768 四个尺寸截图；P0/P1 必须修复并同状态复验。
- **Assembly proof**：评审页能在同一 25.5 英寸装配台逐类换件，至少 6 个文化预设由相同生产模块实时生成；不兼容桥件有 disabled 状态和文字说明，360 px 下槽位横向滚动但不会误触换件。
- **Dual-platform proof**：评审页可在 `25.5 in bolt-on` 与 `24.75 in set-neck` 两块结构铭牌间切换；每个平台至少 6 个实时预设。切换平台后整琴、五个插槽、兼容数量和 manifest 必须同步，且不存在跨弦长 / 跨接柄模块。
- **Same-screen assembly proof**：390×844 与 1024×768 下，完整吉他主体、当前部件分类、至少两个具体选项和平台身份必须同时可见；切换五类零件与六个配方不产生页面级滚动，只有控制台内部内容允许滚动。
- **Progressive reveal proof**：玩家流程需截图覆盖空轮廓、琴体底漆、琴颈实体、拾音器实体、琴桥实体和饰面显色；进入每类候选时，镜头必须落在对应部位，未来模块不得提前实体化。
