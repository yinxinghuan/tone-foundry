# Tone Foundry / 音色铸造所 — Technical

> 本文依据 2026-07-16 的实际代码编写，覆盖内容评审台与玩家完整循环。

## 1. 技术栈

- React 18 + TypeScript 5 + Less，Vite 5 多页面构建；`base: './'`，输出 `dist/index.html`、`dist/review.html` 与独立的 `dist/ui-directions.html`。正式玩家 UI 与候选评审 UI 都由 DOM / Less 绘制，不依赖不可缩放的界面截图。
- 乐器使用内联模块化 SVG，统一 `600 × 1200` 坐标系。玩家制琴使用互不混接的 `25.5 in bolt-on` 与 `24.75 in set-neck` 两个平台。
- 音频使用 Web Audio API 与程序化拨弦采样；`ToneEngine` 提供 Clean / Drive、六弦拨奏、标准试听和音序器触发。
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

- `BuildRun` 状态机包含 `start → sealed → choose → tone → complete → riff / collection / wall / detail`。玩家入口不再包裹工作区导航或技术状态栏；制琴中只常驻五个无文字进度点。每局随机平台，依次完成琴体、琴颈、拾音器、琴桥、饰面五步；候选固定 2–3 张且不可刷新。每步揭示的候选会存入本局 `choiceBank`，调音页按五组同时渲染；点击兼容候选直接写入配置、刷新音色和播放比较句，不产生新抽取或跳转。
- `choose` 阶段通过 `previewConfig = applyOffer(config, stage, selectedOffer)` 生成临时装配结果；点候选会立即重绘 SVG，但只有“就选这个”才写入正式 `config`，因此试装可逆且不会污染存档。
- `AssemblyGuitarPreview` 同位叠加两份生产 SVG：下层统一转为冷灰工程描线，上层按 `body / neck / pickups / bridge / finish` 的确认进度逐组显影。六个模块根节点使用 `tf-module-body / neck / hardware` 语义类，硬件内部继续用 `data-guitar-part` 区分拾音器、琴桥、尾件与控制件。
- 候选页依据当前 `BuildStage` 给同一 SVG 容器附加 `is-focus-*` 类，使用 GPU `transform` 在 560 ms 内推近对应部位；sealed 状态移除聚焦类并退回整琴。`prefers-reduced-motion` 会取消过渡但保留最终构图与状态。
- 制作预览只保留试听与触摸查看器的备用缩放控制；完整的 Clean / Drive、六维音色与比较句只在五部件完成后的全屏 `tone` 状态出现。调音页中每个已揭示候选是直接试装按钮：点击后立即更新合成源、音色指标和舞台吉他，并自动触发比较句。
- `audio/effects.ts` 定义可保存的 `boost / overdrive / chorus / tape-echo` 链，`EffectPedal.tsx` 用四套独立 SVG 硬件结构渲染单块，而不是颜色变体。`ToneEngine` 在琴体合成和全局空间混响之间按链顺序插入效果节点；Riff、比较句、标准试听和 Remix 后的草稿均读取同一 `effects` 数组。
- 正式玩家界面采用 Sonic Index：`BuildRun.less` 以暖白纸面、石墨黑细线、Signal Green、Rust 索引和瑞士式无衬线构成入口、制琴、独立调音页、音序器、琴架、琴墙与详情。真实木纹、漆面和金属只存在于吉他 SVG，旧版收据、印章、手写、琴盒、皮革和金属渐变按钮已退出生产 UI。
- `components/ModularGuitarViewport.tsx` 是制作舞台与墙详情共用的触摸查看器：单指在放大后平移、双指缩放、滚轮缩放、双击缩放 / 复位；控制按钮是独立覆盖层，不拦截画布手势。
- 移动端可读性规则固化在生产样式中：候选名称 14 px、候选行 52–54 px、主要按钮 13–14 px、可读索引 11–12 px；只有序号和步号等纯辅助数字允许 10 px。短屏设备增加选择区高度而不是继续缩小文字。
- `buildTone.ts` 从平台母版出发，再按琴颈、拾音器、琴桥和饰面逐项叠加 attack、decay、brightness、noise、filter、drive、body resonance 与空间参数；因此相同琴身的不同组件组合也会产生不同采样。`ToneEngine.playComparison` 播放固定 2.4 秒四音短句，便于前后候选直接比较。
- `buildRun.ts` 直接读取两个模块平台的兼容矩阵。更换琴体时会修正失配的拾音器与琴桥，最终保存 Guitar ID、五步等级和稀有分。
- 等级概率为 Workshop 68%、Select 27%、Archive 5%。机械测试连续模拟 2500 局，检查候选数、唯一 ID、最终兼容性及概率区间。
- `useFoundrySave` 按 `useGameSave` 规范只从 `savedData` 初始化一次，之后所有读取、收藏和发布都通过同一 `mirror`；每次持久化包含完整 `collection` 与 `published`，防止第二次发布覆盖第一次。
- Riff 为 6 弦 × 16 或 32 步，单格循环关闭 / 普通 / 重音 / 闷音；手机端每页只渲染 4 列。32 步的八小节作品通过两个四小节页切换，格子和页切换均保持至少 44 px。`RIFF_PRESETS` 记录推荐效果链、长度、BPM 与原创音符事件；抽取时根据当前 `effects` 数组选择得分最高的一组，避免把长延迟预设随机塞给干声。播放调度使用递归 `setTimeout`，每一步从 `riffRef.current` 读取最新格子和 BPM，且循环长度读取当前轨的真实步数，因此播放中编辑会在播放头下一次到达时生效。90、120、150 BPM 均支持，普通 / 重音 / 闷音力度分别映射为 0.72、1.0、0.38。
- `useGuitarWall` 对每个保存行执行 `for (const guitar of save.published)`，不只取第一条；墙组件把本地发布立即合并进社区结果并按 `guitar.id` 去重。社区作者显示头像 + 名称，并在 Aigram 内打开其主页。
- 琴墙卡片的 `onClick` 打开独立 `GuitarWallDetail`，而不是复用简化成琴页；详情包含可缩放生产 SVG、作者与主页入口、Guitar ID、稀有分、五部件清单、六维音色、First Riff BPM、播放/停止和 6×16 / 6×32 Riff 带。非本人作品可直接发起 Remix：复制其模块配置与 Riff 到新的本地草稿，生成新 Guitar ID，并在发布对象的 `remix` 来源字段中保留原作品、原琴和作者；墙卡与详情会显示这条来源关系。
- 英文是设计主语言；首次启动会依据 `navigator.language` 自动选择 `zh / en`，`localStorage.game_locale` 可明确覆盖该判断。入口使用 `AssemblyGuitarPreview` 的零确认状态呈现灰银工程轮廓和五模块提示，不会提前显示实体成琴。内部 `review.html` 继续保留自由拼装、八把校准母版、缩放观察和音色表。
- `ui-directions.html` 是与生产状态机隔离的方向评审入口。它复用真实 `ModularGuitarPreview` 展示入口、制琴和档案三种状态；C / Sonic Index 已选中并同步为正式 `doc/visual.md` 与 `BuildRun.less` 的生产系统。

## 4. 扩展点

- 改概率、候选数量、平台抽取：`gameplay/buildRun.ts`。
- 新增模块或兼容关系：两个 `guitar-system/modular*Platform.ts` 与对应 `components/modules/`。
- 改收藏容量或发布容量：`hooks/useFoundrySave.ts`。
- 新增或重绘效果器：先遵循 `doc/effect-pedal-art.md` 的原型与三轮缩小检查，再编辑 `audio/effects.ts`、`components/EffectPedal.tsx` 与 `audio/ToneEngine.ts`。
- 扩展四小节、和弦印章、品位与撤销：`gameplay/save.ts` 与 `components/BuildRun.tsx`。
- 增加 Remix、试听统计或排序：`components/PublicWall.tsx` 与 `hooks/useGuitarWall.ts`。
- 换音色模型或放大器通道：`audio/pluckModel.ts` 与 `audio/ToneEngine.ts`。
- 调整组件对音色的真实影响：`gameplay/buildTone.ts`；调整同屏试听面板与检视轨：`components/BuildRun.tsx` / `BuildRun.less`。
- 继续精修母版比例和材质：`components/*GuitarSvg.tsx`、`components/modules/` 与 `review.html` 评审流程。
- 调整 Sonic Index 的生产视觉、字号与响应式规则：`doc/visual.md`、`components/BuildRun.less`；评审原型仍在 `UIDirectionsPage.less`，不能反向覆盖生产可读性下限。
