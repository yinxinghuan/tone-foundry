# Tone Foundry / 音色铸造所 — Technical

> 本文依据 2026-07-16 的实际代码编写，覆盖内容评审台与玩家完整循环。

## 1. 技术栈

- React 18 + TypeScript 5 + Less，Vite 5 多页面构建；`base: './'`，输出 `dist/index.html` 与 `dist/review.html`。
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
    ToneFoundry.tsx                  # 玩家制琴 / 试音工作区
    ReviewPage.tsx                   # 内部视觉与模块校准页
    gameplay/buildRun.ts             # 工单、抽取、等级、兼容与成琴
    gameplay/save.ts                 # 收藏、发布、Riff 数据结构
    hooks/useFoundrySave.ts          # 单次 seed 的本地镜像存档
    hooks/useGuitarWall.ts           # 全档案展开、作者资料、公共墙刷新
    audio/ToneEngine.ts              # Web Audio 播弦与试听
    components/BuildRun.tsx          # 玩家多页面状态机与 16 步音序器
    components/PublicWall.tsx        # 自己 + 社区的乐器墙
    components/ModularGuitarPreview.tsx
    components/modules/              # 可换琴体、琴颈与硬件 SVG
scripts/
  test-build-runs.ts                 # 2500 局概率与兼容性机械测试
```

## 3. 核心模块

- `BuildRun` 状态机包含 `start → sealed → choose → complete → riff / collection / wall`。每局随机平台，依次完成琴体、琴颈、拾音器、琴桥、饰面五步；候选固定 2–3 张且不可刷新。
- `buildRun.ts` 直接读取两个模块平台的兼容矩阵。更换琴体时会修正失配的拾音器与琴桥，最终保存 Guitar ID、五步等级和稀有分。
- 等级概率为 Workshop 68%、Select 27%、Archive 5%。机械测试连续模拟 2500 局，检查候选数、唯一 ID、最终兼容性及概率区间。
- `useFoundrySave` 按 `useGameSave` 规范只从 `savedData` 初始化一次，之后所有读取、收藏和发布都通过同一 `mirror`；每次持久化包含完整 `collection` 与 `published`，防止第二次发布覆盖第一次。
- Riff 为 6 弦 × 16 步，单格循环关闭 / 普通 / 重音 / 闷音；支持 90、120、150 BPM、播放头循环和一键示范节奏。力度分别映射为 0.72、1.0、0.38。
- `useGuitarWall` 对每个保存行执行 `for (const guitar of save.published)`，不只取第一条；墙组件把本地发布立即合并进社区结果并按 `guitar.id` 去重。社区作者显示头像 + 名称，并在 Aigram 内打开其主页。
- 中文 / 英文由现有轻量 i18n 选择；独立评审页继续保留自由拼装、八把校准母版、缩放观察和音色表。

## 4. 扩展点

- 改概率、候选数量、平台抽取：`gameplay/buildRun.ts`。
- 新增模块或兼容关系：两个 `guitar-system/modular*Platform.ts` 与对应 `components/modules/`。
- 改收藏容量或发布容量：`hooks/useFoundrySave.ts`。
- 扩展四小节、和弦印章、品位与撤销：`gameplay/save.ts` 与 `components/BuildRun.tsx`。
- 增加 Remix、试听统计或排序：`components/PublicWall.tsx` 与 `hooks/useGuitarWall.ts`。
- 换音色模型或放大器通道：`audio/pluckModel.ts` 与 `audio/ToneEngine.ts`。
- 继续精修母版比例和材质：`components/*GuitarSvg.tsx`、`components/modules/` 与 `review.html` 评审流程。
