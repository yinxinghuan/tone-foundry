export type ModularBodyId = 'slab' | 'contour' | 'offset' | 'thinline' | 'reverse'
export type ModularNeckId = 'maple-inline' | 'rosewood-inline'
export type ModularPickupId = 'dual-single' | 'sss' | 'hss' | 'wide-dual'
export type ModularBridgeId = 'three-saddle' | 'tremolo' | 'hardtail' | 'floating'
export type ModularFinishId = 'blonde' | 'sunburst' | 'black' | 'surf' | 'copper' | 'ice' | 'walnut' | 'ivory'

export interface ModularBoltOnConfig {
  body: ModularBodyId
  neck: ModularNeckId
  pickups: ModularPickupId
  bridge: ModularBridgeId
  finish: ModularFinishId
}

export const MODULAR_BOLT_ON_GEOMETRY = {
  viewBox: '0 0 600 1200',
  centerX: 300,
  nutY: 211,
  neckPocketY: 650,
  neckHeelY: 738,
  saddleY: 922,
  scaleLength: 711,
  nutX: [279, 287.4, 295.8, 304.2, 312.6, 321],
  bridgeX: [270, 282, 294, 306, 318, 330],
  tunerPoints: [[280, 184], [287, 157], [294, 130], [301, 103], [309, 76], [318, 49]] as const,
} as const

export const MODULAR_BODY_PATHS: Record<ModularBodyId, string> = {
  slab: 'M274 666 C247 652 214 644 184 652 C151 661 143 687 154 721 C166 756 181 776 178 805 C175 834 158 861 143 889 C125 924 120 970 131 1009 C145 1057 190 1084 252 1091 C305 1097 373 1090 416 1068 C460 1045 479 1007 473 962 C469 927 450 897 430 869 C414 846 411 813 417 782 C422 755 441 726 445 696 C449 668 437 647 417 643 C394 639 371 653 360 674 C352 690 348 711 331 723 C317 733 301 730 289 715 C279 703 277 683 274 666 Z',
  contour: 'M273 688 C259 666 250 637 230 617 C211 598 187 596 168 611 C150 626 151 650 164 675 C178 702 187 724 179 752 C171 779 151 797 135 824 C110 867 106 925 119 981 C134 1045 182 1085 247 1096 C300 1105 361 1098 411 1070 C455 1045 481 998 480 946 C479 899 461 858 438 826 C419 800 414 775 422 746 C430 718 450 693 454 663 C458 637 446 615 426 606 C404 596 383 604 368 625 C352 648 346 677 329 697 C315 714 290 712 273 688 Z',
  offset: 'M276 690 C250 690 225 680 204 660 C187 643 176 628 167 623 C155 621 148 631 150 644 C153 661 160 676 168 690 C177 707 182 722 183 739 C185 754 187 769 184 783 C180 816 158 842 144 874 C125 919 120 965 143 1002 C168 1042 213 1068 266 1075 C323 1083 390 1070 434 1048 C465 1032 477 1008 474 984 C471 958 459 936 447 929 C436 922 431 905 426 893 C418 874 417 856 422 838 C429 814 439 789 442 765 C445 741 437 719 428 710 C411 695 389 691 369 698 C351 705 343 719 335 727 C326 735 315 735 303 729 C291 723 284 707 281 690 Z',
  thinline: 'M276 664 C251 648 215 644 183 657 C150 670 144 702 157 736 C168 766 184 783 181 812 C178 842 159 870 145 898 C126 936 124 979 139 1017 C159 1068 209 1090 270 1096 C330 1102 395 1090 432 1060 C465 1033 475 996 463 958 C452 925 429 902 418 875 C406 846 410 817 420 786 C431 753 444 724 435 691 C428 666 410 652 388 656 C364 660 349 678 340 700 C332 720 323 729 303 728 C285 727 282 680 276 664 Z',
  reverse: 'M274 686 C252 674 229 651 211 627 C198 609 181 595 165 601 C145 608 145 634 157 657 C170 682 181 705 178 730 C175 754 161 781 145 807 C119 849 109 908 122 967 C137 1035 190 1080 256 1091 C314 1101 379 1093 425 1062 C465 1034 483 987 471 941 C459 893 431 855 399 830 C383 818 381 800 395 780 C414 753 436 729 443 701 C452 668 437 642 415 635 C392 628 370 641 353 662 C339 679 324 694 308 697 C294 700 282 693 274 686 Z',
}

export const MODULAR_FINISHES: Record<ModularFinishId, { top: string; mid: string; edge: string; side: string; guard: string }> = {
  blonde: { top: '#e1bd74', mid: '#c7994f', edge: '#8a6031', side: '#5b3b22', guard: '#171615' },
  sunburst: { top: '#e2a54b', mid: '#a74a27', edge: '#3d1816', side: '#241312', guard: '#3a211b' },
  black: { top: '#3d3b37', mid: '#171716', edge: '#090909', side: '#080807', guard: '#e0d7c3' },
  surf: { top: '#94bcb1', mid: '#6f9b92', edge: '#3f6962', side: '#294b47', guard: '#ded4b8' },
  copper: { top: '#e99161', mid: '#a8452d', edge: '#4a1b1b', side: '#321519', guard: '#f0e0c4' },
  ice: { top: '#c7e5ed', mid: '#79aebd', edge: '#345f75', side: '#1c4053', guard: '#e5e0d2' },
  walnut: { top: '#bf8247', mid: '#724027', edge: '#2c1714', side: '#1d100f', guard: '#171615' },
  ivory: { top: '#f0e2bd', mid: '#d3c093', edge: '#8a704a', side: '#544128', guard: '#4b463d' },
}

export const BODY_BRIDGES: Record<ModularBodyId, ModularBridgeId[]> = {
  slab: ['three-saddle', 'hardtail'],
  contour: ['tremolo', 'hardtail'],
  offset: ['floating', 'hardtail'],
  thinline: ['three-saddle', 'hardtail'],
  reverse: ['floating', 'hardtail'],
}

export const BODY_PICKUPS: Record<ModularBodyId, ModularPickupId[]> = {
  slab: ['dual-single', 'hss'],
  contour: ['sss', 'hss'],
  offset: ['wide-dual', 'hss'],
  thinline: ['dual-single', 'hss'],
  reverse: ['wide-dual', 'hss'],
}

export const MODULAR_PRESETS: Array<{ id: string; name: { zh: string; en: string }; era: string; config: ModularBoltOnConfig }> = [
  { id: 'slab-52', name: { zh: '荒原板式 52', en: 'Prairie Slab 52' }, era: '1952 LANGUAGE', config: { body: 'slab', neck: 'maple-inline', pickups: 'dual-single', bridge: 'three-saddle', finish: 'blonde' } },
  { id: 'contour-57', name: { zh: '日落轮廓 57', en: 'Sunset Contour 57' }, era: '1957 LANGUAGE', config: { body: 'contour', neck: 'maple-inline', pickups: 'sss', bridge: 'tremolo', finish: 'sunburst' } },
  { id: 'hot-rod-72', name: { zh: '黑色热改 72', en: 'Black Hot Rod 72' }, era: '1972 MOD CULTURE', config: { body: 'contour', neck: 'rosewood-inline', pickups: 'hss', bridge: 'tremolo', finish: 'black' } },
  { id: 'offset-62', name: { zh: '海雾偏移 62', en: 'Sea Mist Offset 62' }, era: '1962 LANGUAGE', config: { body: 'offset', neck: 'rosewood-inline', pickups: 'wide-dual', bridge: 'floating', finish: 'surf' } },
  { id: 'slab-custom', name: { zh: '午夜板式改装', en: 'Midnight Slab Custom' }, era: 'CUSTOM SHOP LOGIC', config: { body: 'slab', neck: 'rosewood-inline', pickups: 'hss', bridge: 'hardtail', finish: 'black' } },
  { id: 'offset-hardtail', name: { zh: '硬尾偏移实验', en: 'Hardtail Offset Study' }, era: 'ALTERNATE HISTORY', config: { body: 'offset', neck: 'maple-inline', pickups: 'hss', bridge: 'hardtail', finish: 'sunburst' } },
  { id: 'thinline-69', name: { zh: '琥珀薄空心 69', en: 'Amber Thinline 69' }, era: '1969 HOLLOW LANGUAGE', config: { body: 'thinline', neck: 'maple-inline', pickups: 'dual-single', bridge: 'three-saddle', finish: 'blonde' } },
  { id: 'reverse-65', name: { zh: '反向海雾 65', en: 'Reverse Sea Mist 65' }, era: '1965 OFFSET STUDY', config: { body: 'reverse', neck: 'rosewood-inline', pickups: 'wide-dual', bridge: 'floating', finish: 'surf' } },
  { id: 'copper-contour', name: { zh: '铜火轮廓', en: 'Copper Fire Contour' }, era: 'METALLIC LACQUER', config: { body: 'contour', neck: 'rosewood-inline', pickups: 'hss', bridge: 'hardtail', finish: 'copper' } },
  { id: 'ice-offset', name: { zh: '冰蓝偏移', en: 'Ice Blue Offset' }, era: 'COOL METALLIC', config: { body: 'offset', neck: 'maple-inline', pickups: 'wide-dual', bridge: 'floating', finish: 'ice' } },
  { id: 'walnut-thinline', name: { zh: '胡桃薄空心', en: 'Walnut Thinline' }, era: 'TRANSLUCENT GRAIN', config: { body: 'thinline', neck: 'rosewood-inline', pickups: 'dual-single', bridge: 'hardtail', finish: 'walnut' } },
  { id: 'ivory-slab', name: { zh: '旧象牙板式', en: 'Aged Ivory Slab' }, era: 'NITRO AGING', config: { body: 'slab', neck: 'maple-inline', pickups: 'dual-single', bridge: 'three-saddle', finish: 'ivory' } },
]
