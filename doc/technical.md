# Tone Foundry / 音色铸造所 — Technical

> 本文依据 2026-07-17 的实际代码编写，覆盖内容评审台与玩家完整循环。

## 1. 技术栈

- React 18 + TypeScript 5 + Less，Vite 5 多页面构建；`base: './'`，输出 `dist/index.html`、`dist/review.html` 与独立的 `dist/ui-directions.html`。正式玩家 UI 与候选评审 UI 都由 DOM / Less 绘制，不依赖不可缩放的界面截图。
- 乐器使用内联模块化 SVG，统一 `600 × 1200` 坐标系。玩家制琴使用互不混接的 `25.5 in bolt-on` 与 `24.75 in set-neck` 两个平台。
- 音频使用 Web Audio API 与程序化拨弦采样；`ToneEngine` 提供六弦拨奏、标准试听、效果器链和音序器触发。
- 存档使用本地同步 + Aigram 平台云存档；永久 UUID 为 `681b691b-2316-4b45-8154-bfbb0325d387`。
- 公共琴墙通过 Aigram `get/data/list` 读取最近用户的完整发布档案，并通过用户信息接口补齐头像与名称。

## 2. 目录结构

```text
src/
  game-id.ts                         # 永久平台 UUID
  shared/runtime/                    # Aigram bridge、profile 与 UUID
  shared/save/                       # useGameSave 云端/本地存档
  ToneFoundry/
    ToneFoundry.tsx                  # 极简玩家入口，仅挂载完整制琴状态机
    ReviewPage.tsx                   # 内部视觉与模块校准页
    UIDirectionsPage.tsx             # 三套候选 UI 的交互式评审页
    UIDirectionsPage.less            # 三套方向评审；C 为已选生产方向
    gameplay/buildRun.ts             # 工单、抽取、等级、兼容与成琴
    gameplay/buildTone.ts            # 五类模块到合成参数与六维音色的映射
    gameplay/save.ts                 # 收藏、发布、Riff 数据结构
    hooks/useFoundrySave.ts          # 单次 seed 的本地镜像存档
    hooks/useGuitarWall.ts           # 全档案展开、作者资料、公共墙刷新
    audio/ToneEngine.ts              # Web Audio 播弦与试听
    components/EffectPedal.tsx       # 四种独立硬件原型的拟物单块 SVG
    guitar-system/modular*Platform.ts # 两个电吉他平台的 11 种琴体、16 种饰面与兼容矩阵
    components/AcousticFamilyGuitarSvg.tsx # Grand Concert / Auditorium / Super Jumbo 三种独立原声琴母版
    doc/body-family-art.md           # 扩展琴体的实物结构对照、Object Card 与三轮检查
    doc/skeuomorphic-object-svg.md   # 所有拟物机械 / 电子小物件的 SVG 绘制基准
    components/BuildRun.tsx          # 玩家状态机、同屏音色检视、即时试装与音序器
    components/AssemblyGuitarPreview.tsx # 工程轮廓、实体模块显影与部位镜头状态
    components/PublicWall.tsx        # 自己 + 社区的乐器墙
    components/GuitarWallDetail.tsx  # 完整乐器、作者、声音档案与 First Riff 详情
    components/ModularGuitarPreview.tsx
    components/modules/              # 可换琴体、琴颈与硬件 SVG
scripts/
  test-build-runs.ts                 # 2500 局概率与兼容性机械测试
ui-directions.html                   # UI 重置评审入口，不替换正式游戏
```

## 3. 核心模块

- `BuildRun` 状态机包含 `start → sealed → choose → tone → complete → riff / collection / wall / detail`。玩家入口不再包裹工作区导航或技术状态栏；制琴中只常驻五个无文字进度点。每局随机平台，依次完成琴体、琴颈、拾音器、琴桥、饰面五步；候选固定 2–3 张且不可刷新。密封箱与候选区明确标出这是“本局随机抽取”，并提示下一局会出现不同候选，避免把局内池误解为完整目录。每步揭示的候选会存入本局 `choiceBank`，调音页按五组同时渲染；点击兼容候选直接写入配置、刷新音色和播放比较句，不产生新抽取或跳转。
- `choose` 阶段通过 `previewConfig = applyOffer(config, stage, selectedOffer)` 生成临时装配结果；点候选会立即重绘 SVG，但只有“就选这个”才写入正式 `config`，因此试装可逆且不会污染存档。
- `AssemblyGuitarPreview` 同位叠加两份生产 SVG：下层统一转为冷灰工程描线，上层按 `body / neck / pickups / bridge / finish` 的确认进度逐组显影。六个模块根节点使用 `tf-module-body / neck / hardware` 语义类，硬件内部继续用 `data-guitar-part` 区分拾音器、琴桥、尾件与控制件。
- 候选页依据当前 `BuildStage` 给同一 SVG 容器附加 `is-focus-*` 类，使用 GPU `transform` 在 560 ms 内推近对应部位；sealed 状态移除聚焦类并退回整琴。`prefers-reduced-motion` 会取消过渡但保留最终构图与状态。
- 制作预览只保留试听与触摸查看器的备用缩放控制；六维音色、效果器链与比较句只在五部件完成后的全屏 `tone` 状态出现。调音页中每个已揭示候选是直接试装按钮：点击后立即更新合成源、音色指标和舞台吉他，并自动触发比较句；原始声始终是试听底座，效果器链是唯一的额外处理入口。
- `audio/effects.ts` 定义可保存的 `boost / overdrive / chorus / tape-echo` 链，`EffectPedal.tsx` 用四套独立 SVG 硬件结构渲染单块，而不是颜色变体。`ToneEngine` 在琴体合成和全局空间混响之间按链顺序插入效果节点；Riff、比较句、标准试听和 Remix 后的草稿均读取同一 `effects` 数组。
- 正式玩家界面采用 Sonic Index：`BuildRun.less` 以暖白纸面、石墨黑细线、Signal Green、Rust 索引和瑞士式无衬线构成入口、制琴、独立调音页、音序器、琴架、琴墙与详情。真实木纹、漆面和金属只存在于吉他 SVG，旧版收据、印章、手写、琴盒、皮革和金属渐变按钮已退出生产 UI。
- `components/ModularGuitarViewport.tsx` 是制作舞台与墙详情共用的触摸查看器：单指在放大后平移、双指缩放、滚轮缩放、双击缩放 / 复位；控制按钮是独立覆盖层，不拦截画布手势。
- 移动端可读性规则固化在生产样式中：候选名称 14 px、候选行 52–54 px、主要按钮 13–14 px、可读索引 11–12 px；只有序号和步号等纯辅助数字允许 10 px。短屏设备增加选择区高度而不是继续缩小文字。
- 两个平台目前共有 11 种可玩琴体：bolt-on 的 slab、contour、offset、thinline、reverse，以及 set-neck 的 carved、centerblock、thin-horn、v-wing、angular、archtop。`buildRun.ts` 从对应兼容矩阵中抽取 2–3 项；更换琴体时会修正失配的拾音器与琴桥，最终保存 Guitar ID、五步等级和稀有分。
- `buildTone.ts` 从平台母版出发，再按琴体、琴颈、拾音器、琴桥和饰面逐项叠加合成参数；`BODY_DELTAS` 为薄空心、反向偏移、V 翼、角型和拱面提供各自的共鸣 / 空间 / 驱动倾向。两个平台各有 8 种可抽取饰面，饰面同时改变音色微调和 SVG 表面层。`ToneEngine.playComparison` 播放固定 2.4 秒四音短句，便于前后候选直接比较。
- 等级概率为 Workshop 68%、Select 27%、Archive 5%。机械测试连续模拟 2500 局，检查候选数、唯一 ID、最终兼容性及概率区间。
- `useFoundrySave` 按 `useGameSave` 规范只从 `savedData` 初始化一次，之后所有读取、收藏、发布和点赞都通过同一 `mirror`；初始化时会给旧存档补齐 `likedGuitarIds`。每次持久化包含完整 `collection`、`published` 与喜欢的 Guitar ID，防止第二次写入覆盖既有条目或点赞。
- Riff 为 6 弦 × 16 或 32 步，单格循环关闭 / 普通 / 重音 / 闷音；手机端每页只渲染 4 列。32 步的八小节作品通过两个四小节页切换，格子和页切换均保持至少 44 px。`RIFF_PRESETS` 记录推荐效果链、长度、BPM 与原创音符事件；抽取时根据当前 `effects` 数组选择得分最高的一组，避免把长延迟预设随机塞给干声。播放调度使用递归 `setTimeout`，每一步从 `riffRef.current` 读取最新格子和 BPM，且循环长度读取当前轨的真实步数，因此播放中编辑会在播放头下一次到达时生效。90、120、150 BPM 均支持，普通 / 重音 / 闷音力度分别映射为 0.72、1.0、0.38。
- `useGuitarWall` 对每个保存行执行 `for (const guitar of save.published)`，不只取第一条；读取墙数据时也汇总其他用户 `likedGuitarIds` 为每把琴的远端点赞数。墙组件把本地发布立即合并进社区结果并按 `guitar.id` 去重，自己刚点击的赞在界面层乐观叠加。社区作者显示头像 + 名称，并在 Aigram 内打开其主页。
- 琴墙卡片的 `onClick` 打开独立 `GuitarWallDetail`，而不是复用简化成琴页；详情包含可缩放生产 SVG、作者与主页入口、Guitar ID、稀有分、五部件清单、六维音色、发布时按链路顺序渲染的拟物效果器、First Riff BPM、播放/停止、点赞和 6×16 / 6×32 Riff 带。播放使用递增 token 防止 `AudioContext.enable()` 的异步返回在详情关闭后重新启动循环；返回墙页会递增 token、清除待播放定时器、停止所有音源并复位播放头。非本人作品可直接发起 Remix：复制其模块配置与 Riff 到新的本地草稿，生成新 Guitar ID；同时为五个部件生成“原件 + 兼容替换件”的 2–3 项 `choiceBank`，所以调音页立即可试装、试听与保存。发布对象的 `remix` 来源字段保留原作品、原琴和作者；墙卡与详情会显示这条来源关系。
- 英文是设计主语言；首次启动会依据 `navigator.language` 自动选择 `zh / en`，`localStorage.game_locale` 可明确覆盖该判断。入口使用 `AssemblyGuitarPreview` 的零确认状态呈现灰银工程轮廓和五模块提示，不会提前显示实体成琴。内部 `review.html` 继续保留自由拼装、十一把校准母版、缩放观察和音色表；`AcousticFamilyGuitarSvg` 为 Grand Concert、Grand Auditorium 与 Super Jumbo 各自建立琴体轮廓、护板、桥型、rosette、3+3 琴头、品位与连续弦路，`ToneEngine` / `pluckModel` 以 94–132 Hz 箱体峰值和不同空气腔模态区分它们的动态。
- `ui-directions.html` 是与生产状态机隔离的方向评审入口。它复用真实 `ModularGuitarPreview` 展示入口、制琴和档案三种状态；C / Sonic Index 已选中并同步为正式 `doc/visual.md` 与 `BuildRun.less` 的生产系统。

## 4. 扩展点

- 改概率、候选数量、平台抽取：`gameplay/buildRun.ts`。
- 新增模块或兼容关系：两个 `guitar-system/modular*Platform.ts` 与对应 `components/modules/`。
- 改收藏容量或发布容量：`hooks/useFoundrySave.ts`。
- 新增或重绘拟物小物件：先遵循 `doc/skeuomorphic-object-svg.md` 的 Object Card、分层和三轮检查；效果器再叠加 `doc/effect-pedal-art.md` 的专用规则。涉及声音时再编辑 `audio/effects.ts`、`components/EffectPedal.tsx` 与 `audio/ToneEngine.ts`。
- 扩展四小节、和弦印章、品位与撤销：`gameplay/save.ts` 与 `components/BuildRun.tsx`。
- 增加 Remix、试听统计或排序：`components/PublicWall.tsx` 与 `hooks/useGuitarWall.ts`。
- 换音色模型或放大器通道：`audio/pluckModel.ts` 与 `audio/ToneEngine.ts`。
- 调整组件对音色的真实影响：`gameplay/buildTone.ts`；调整同屏试听面板与检视轨：`components/BuildRun.tsx` / `BuildRun.less`。
- 继续精修母版比例和材质：先更新 `doc/body-family-art.md` 的 Object Card 与实物对照，再修改 `components/*GuitarSvg.tsx`、`components/modules/`，并用 `review.html` 和 `_qa/ui/` 的同尺寸截图复验。
- 调整 Sonic Index 的生产视觉、字号与响应式规则：`doc/visual.md`、`components/BuildRun.less`；评审原型仍在 `UIDirectionsPage.less`，不能反向覆盖生产可读性下限。
