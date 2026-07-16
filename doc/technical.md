# Tone Foundry / 音色铸造所 — Technical

> 本文依据 2026-07-16 的实际代码编写，覆盖内容评审台与玩家完整循环。

## 1. 技术栈

- React 18 + TypeScript 5 + Less，Vite 5 多页面构建；`base: './'`，输出 `dist/index.html` 与 `dist/review.html`。玩家 UI 的工单纸张、蓝墨印刷、检验章、琴盒、皮革和金属工具全部由 DOM / Less 绘制，不依赖不可缩放的界面截图。
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
    gameplay/buildRun.ts             # 工单、抽取、等级、兼容与成琴
    gameplay/buildTone.ts            # 五类模块到合成参数与六维音色的映射
    gameplay/save.ts                 # 收藏、发布、Riff 数据结构
    hooks/useFoundrySave.ts          # 单次 seed 的本地镜像存档
    hooks/useGuitarWall.ts           # 全档案展开、作者资料、公共墙刷新
    audio/ToneEngine.ts              # Web Audio 播弦与试听
    components/BuildRun.tsx          # 玩家状态机、同屏音色检视、即时试装与音序器
    components/AssemblyGuitarPreview.tsx # 工程轮廓、实体模块显影与部位镜头状态
    components/PublicWall.tsx        # 自己 + 社区的乐器墙
    components/GuitarWallDetail.tsx  # 完整乐器、作者、声音档案与 First Riff 详情
    components/ModularGuitarPreview.tsx
    components/modules/              # 可换琴体、琴颈与硬件 SVG
scripts/
  test-build-runs.ts                 # 2500 局概率与兼容性机械测试
```

## 3. 核心模块

- `BuildRun` 状态机包含 `start → sealed → choose → complete → riff / collection / wall / detail`。玩家入口不再包裹工作区导航或技术状态栏；制琴中只常驻五个无文字进度点。每局随机平台，依次完成琴体、琴颈、拾音器、琴桥、饰面五步；候选固定 2–3 张且不可刷新。
- `choose` 阶段通过 `previewConfig = applyOffer(config, stage, selectedOffer)` 生成临时装配结果；点候选会立即重绘 SVG，但只有“就选这个”才写入正式 `config`，因此试装可逆且不会污染存档。
- `AssemblyGuitarPreview` 同位叠加两份生产 SVG：下层统一转为冷灰工程描线，上层按 `body / neck / pickups / bridge / finish` 的确认进度逐组显影。六个模块根节点使用 `tf-module-body / neck / hardware` 语义类，硬件内部继续用 `data-guitar-part` 区分拾音器、琴桥、尾件与控制件。
- 候选页依据当前 `BuildStage` 给同一 SVG 容器附加 `is-focus-*` 类，使用 GPU `transform` 在 620 ms 内推近对应部位；sealed 状态移除聚焦类并退回整琴。`prefers-reduced-motion` 会取消过渡但保留最终构图与状态。
- 预览窗右侧保留五键检视轨：音色面板、试听、缩小、100% 复位、放大；左侧音色面板只在需要时展开，显示 Clean / Drive 与六维声音指纹。面板覆盖预览区而不增加页面层级，关闭后继续当前选件。
- 玩家界面采用双材料层：`BuildRun.less` 中的琴盒毡布、皮革、黄铜和烤漆金属形成拟物空间；米白收据、靛蓝表格线、票据序号、QC 章与黑色手圈承载工单和选择。入口工单、开箱底单、候选封签、成琴检验单、音序器、琴架 / 琴墙卡片和声音档案共享同一组 CSS 语义色与排版规则。
- `buildTone.ts` 从平台母版出发，再按琴颈、拾音器、琴桥和饰面逐项叠加 attack、decay、brightness、noise、filter、drive、body resonance 与空间参数；因此相同琴身的不同组件组合也会产生不同采样。`ToneEngine.playComparison` 播放固定 2.4 秒四音短句，便于前后候选直接比较。
- `buildRun.ts` 直接读取两个模块平台的兼容矩阵。更换琴体时会修正失配的拾音器与琴桥，最终保存 Guitar ID、五步等级和稀有分。
- 等级概率为 Workshop 68%、Select 27%、Archive 5%。机械测试连续模拟 2500 局，检查候选数、唯一 ID、最终兼容性及概率区间。
- `useFoundrySave` 按 `useGameSave` 规范只从 `savedData` 初始化一次，之后所有读取、收藏和发布都通过同一 `mirror`；每次持久化包含完整 `collection` 与 `published`，防止第二次发布覆盖第一次。
- Riff 为 6 弦 × 16 步，单格循环关闭 / 普通 / 重音 / 闷音；手机端以 I–IV 四个小节页展示，每页只渲染 4 列，保证格子至少 44 px 且没有横向裁切。支持 90、120、150 BPM、播放头循环和一键示范节奏，力度分别映射为 0.72、1.0、0.38。
- `useGuitarWall` 对每个保存行执行 `for (const guitar of save.published)`，不只取第一条；墙组件把本地发布立即合并进社区结果并按 `guitar.id` 去重。社区作者显示头像 + 名称，并在 Aigram 内打开其主页。
- 琴墙卡片的 `onClick` 打开独立 `GuitarWallDetail`，而不是复用简化成琴页；详情包含可缩放生产 SVG、作者与主页入口、Guitar ID、稀有分、五部件清单、六维音色、First Riff BPM、播放/停止和 6×16 Riff 带。
- 中文 / 英文由现有轻量 i18n 选择；独立评审页继续保留自由拼装、八把校准母版、缩放观察和音色表。

## 4. 扩展点

- 改概率、候选数量、平台抽取：`gameplay/buildRun.ts`。
- 新增模块或兼容关系：两个 `guitar-system/modular*Platform.ts` 与对应 `components/modules/`。
- 改收藏容量或发布容量：`hooks/useFoundrySave.ts`。
- 扩展四小节、和弦印章、品位与撤销：`gameplay/save.ts` 与 `components/BuildRun.tsx`。
- 增加 Remix、试听统计或排序：`components/PublicWall.tsx` 与 `hooks/useGuitarWall.ts`。
- 换音色模型或放大器通道：`audio/pluckModel.ts` 与 `audio/ToneEngine.ts`。
- 调整组件对音色的真实影响：`gameplay/buildTone.ts`；调整同屏试听面板与检视轨：`components/BuildRun.tsx` / `BuildRun.less`。
- 继续精修母版比例和材质：`components/*GuitarSvg.tsx`、`components/modules/` 与 `review.html` 评审流程。
