export type ModularSetBodyId = 'carved' | 'centerblock' | 'thin-horn' | 'v-wing' | 'angular' | 'archtop'
export type ModularSetNeckId = 'dot-bound' | 'trapezoid-bound'
export type ModularSetPickupId = 'covered-humbuckers' | 'soapbar-p90' | 'mini-humbuckers'
export type ModularSetBridgeId = 'stopbar' | 'trapeze' | 'short-vibrola'
export type ModularSetFinishId = 'cherry' | 'gold' | 'ebony' | 'natural' | 'wine' | 'silver' | 'tobacco' | 'cream'

export interface ModularSetNeckConfig {
  body: ModularSetBodyId
  neck: ModularSetNeckId
  pickups: ModularSetPickupId
  bridge: ModularSetBridgeId
  finish: ModularSetFinishId
}

export const MODULAR_SET_NECK_GEOMETRY = {
  viewBox: '0 0 600 1200',
  centerX: 300,
  nutY: 205,
  neckJointY: 650,
  boardEndY: 704,
  saddleY: 900,
  tailpieceY: 968,
  scaleLength: 695,
  nutX: [279, 287.4, 295.8, 304.2, 312.6, 321],
  bridgeX: [275, 285, 295, 305, 315, 325],
  tunerPoints: [[268,169],[270,130],[273,91],[327,91],[330,130],[332,169]] as const,
} as const

export const MODULAR_SET_BODY_PATHS: Record<ModularSetBodyId, string> = {
  carved: 'M278 635 C244 609 205 609 176 633 C148 656 141 695 157 732 C170 761 166 790 145 820 C119 858 112 913 124 966 C139 1031 184 1080 246 1093 C302 1105 370 1093 414 1051 C453 1014 472 958 467 904 C463 858 443 823 416 798 C397 780 396 754 410 724 C426 690 416 662 388 650 C363 638 335 642 321 663 C309 682 315 707 331 720 C319 734 303 739 291 727 C283 719 283 676 287 650 Z',
  centerblock: 'M278 650 C254 624 239 600 205 596 C170 592 140 620 138 660 C136 696 157 722 185 744 C211 762 214 778 198 795 C170 820 145 850 130 890 C102 967 130 1053 205 1099 C252 1128 316 1137 372 1114 C453 1080 484 1002 470 918 C461 865 438 825 402 795 C386 778 389 762 415 744 C443 722 464 696 462 660 C460 620 430 592 395 596 C361 600 346 624 322 650 L320 690 L280 690 Z',
  'thin-horn': 'M280 690 L280 648 C259 645 248 625 239 603 C230 581 211 557 193 560 C176 563 174 586 182 610 C191 637 179 661 154 684 C132 704 125 728 143 747 C164 769 179 789 171 817 C155 868 136 922 141 973 C147 1038 217 1080 300 1088 C383 1080 453 1038 459 973 C464 922 445 868 429 817 C421 789 436 769 457 747 C475 728 468 704 446 684 C421 661 409 637 418 610 C426 586 424 563 407 560 C389 557 370 581 361 603 C352 625 341 645 320 648 L320 690 Z',
  'v-wing': 'M278 675 L278 644 C258 642 246 624 232 601 C220 580 200 565 183 570 C166 575 168 600 180 621 L250 793 L139 1047 C130 1065 145 1081 164 1076 L300 1039 L436 1076 C455 1081 470 1065 461 1047 L350 793 L420 621 C432 600 434 575 417 570 C400 565 380 580 368 601 C354 624 342 642 322 644 L322 675 Z',
  angular: 'M278 676 L278 646 C255 644 241 628 229 605 C217 583 198 572 183 579 C169 586 173 608 191 628 L270 734 L133 945 C119 967 124 998 147 1012 L239 1068 C258 1079 278 1062 285 1044 L322 946 L434 1038 C454 1053 478 1040 477 1016 L465 794 C463 766 447 744 423 735 L330 701 C320 697 320 684 322 676 Z',
  archtop: 'M278 642 C252 610 219 595 188 610 C154 626 143 665 154 708 C163 744 179 774 177 810 C175 853 152 884 139 923 C119 985 140 1046 197 1081 C243 1110 307 1116 360 1099 C423 1079 459 1030 462 968 C465 912 444 864 420 824 C404 797 410 768 427 734 C443 702 447 668 430 640 C415 615 388 607 366 620 C347 631 342 653 332 672 C321 692 305 698 291 688 C281 681 281 657 278 642 Z',
}

export const MODULAR_SET_FINISHES: Record<ModularSetFinishId, { top:string; mid:string; edge:string; side:string; guard:string; binding:string }> = {
  cherry: { top:'#cf624b', mid:'#9d2f28', edge:'#4a1518', side:'#351012', guard:'#171719', binding:'#ead7b3' },
  gold: { top:'#ebc56f', mid:'#bd8737', edge:'#6b3c20', side:'#3d2118', guard:'#3a261c', binding:'#eee0bc' },
  ebony: { top:'#4d4a45', mid:'#1b1a19', edge:'#070707', side:'#050505', guard:'#e5dcc8', binding:'#e8dcc0' },
  natural: { top:'#e0b775', mid:'#b87543', edge:'#623427', side:'#3b211c', guard:'#34231d', binding:'#f0dfbd' },
  wine: { top:'#a94c51', mid:'#63202b', edge:'#240d15', side:'#1b090e', guard:'#171719', binding:'#ead7b3' },
  silver: { top:'#d3d8d3', mid:'#929b9a', edge:'#3d4748', side:'#222a2c', guard:'#1b1c1c', binding:'#e5e1d4' },
  tobacco: { top:'#d69c49', mid:'#854321', edge:'#2b1512', side:'#1a0f0d', guard:'#f1e3c3', binding:'#ead7b3' },
  cream: { top:'#eee1bf', mid:'#cbb176', edge:'#6b5130', side:'#412f1d', guard:'#34231d', binding:'#f5e8c8' },
}

export const SET_BODY_BRIDGES: Record<ModularSetBodyId, ModularSetBridgeId[]> = {
  carved: ['stopbar'],
  centerblock: ['stopbar','trapeze'],
  'thin-horn': ['stopbar','short-vibrola'],
  'v-wing': ['stopbar'],
  angular: ['stopbar'],
  archtop: ['trapeze'],
}

export const SET_BODY_PICKUPS: Record<ModularSetBodyId, ModularSetPickupId[]> = {
  carved: ['covered-humbuckers','soapbar-p90','mini-humbuckers'],
  centerblock: ['covered-humbuckers','soapbar-p90','mini-humbuckers'],
  'thin-horn': ['covered-humbuckers','soapbar-p90'],
  'v-wing': ['covered-humbuckers','soapbar-p90','mini-humbuckers'],
  angular: ['covered-humbuckers','soapbar-p90','mini-humbuckers'],
  archtop: ['covered-humbuckers','mini-humbuckers'],
}

export const MODULAR_SET_PRESETS: Array<{ id:string; name:{zh:string;en:string}; era:string; config:ModularSetNeckConfig }> = [
  { id:'carved-59', name:{zh:'琥珀雕面 59',en:'Amber Carve 59'}, era:'1959 SET-NECK', config:{body:'carved',neck:'trapezoid-bound',pickups:'covered-humbuckers',bridge:'stopbar',finish:'cherry'} },
  { id:'gold-soapbar', name:{zh:'金顶皂条 56',en:'Gold Soapbar 56'}, era:'1956 CLUB LANGUAGE', config:{body:'carved',neck:'trapezoid-bound',pickups:'soapbar-p90',bridge:'stopbar',finish:'gold'} },
  { id:'centerblock-58', name:{zh:'樱桃中心块 58',en:'Cherry Centerblock 58'}, era:'1958 CENTERBLOCK', config:{body:'centerblock',neck:'dot-bound',pickups:'covered-humbuckers',bridge:'stopbar',finish:'cherry'} },
  { id:'natural-trapeze', name:{zh:'自然色梯形尾件',en:'Natural Trapeze Study'}, era:'JAZZ CLUB STUDY', config:{body:'centerblock',neck:'dot-bound',pickups:'mini-humbuckers',bridge:'trapeze',finish:'natural'} },
  { id:'thin-horn-61', name:{zh:'深红薄双角 61',en:'Deep Cherry Horn 61'}, era:'1961 THIN SOLID', config:{body:'thin-horn',neck:'trapezoid-bound',pickups:'covered-humbuckers',bridge:'stopbar',finish:'cherry'} },
  { id:'black-vibrola', name:{zh:'黑色短板颤音实验',en:'Black Vibrola Study'}, era:'ALTERNATE 1964', config:{body:'thin-horn',neck:'trapezoid-bound',pickups:'soapbar-p90',bridge:'short-vibrola',finish:'ebony'} },
  { id:'v-wing-58', name:{zh:'象牙 V 翼 58',en:'Ivory V-Wing 58'}, era:'1958 STAGE SOLID', config:{body:'v-wing',neck:'dot-bound',pickups:'covered-humbuckers',bridge:'stopbar',finish:'natural'} },
  { id:'angular-76', name:{zh:'乌木前卫角型 76',en:'Ebony Angular 76'}, era:'1976 FORWARD BODY', config:{body:'angular',neck:'trapezoid-bound',pickups:'covered-humbuckers',bridge:'stopbar',finish:'ebony'} },
  { id:'archtop-51', name:{zh:'日落全空心 51',en:'Sunset Archtop 51'}, era:'1951 HOLLOW CLUB', config:{body:'archtop',neck:'dot-bound',pickups:'mini-humbuckers',bridge:'trapeze',finish:'natural'} },
  { id:'wine-carved', name:{zh:'酒红雕面',en:'Wine Carve Study'}, era:'DEEP NITRO', config:{body:'carved',neck:'trapezoid-bound',pickups:'covered-humbuckers',bridge:'stopbar',finish:'wine'} },
  { id:'silver-angular', name:{zh:'银雾角型',en:'Silver Angular 76'}, era:'ALUMINUM GLEAM', config:{body:'angular',neck:'dot-bound',pickups:'mini-humbuckers',bridge:'stopbar',finish:'silver'} },
  { id:'tobacco-archtop', name:{zh:'烟草拱面',en:'Tobacco Archtop'}, era:'SMOKE BURST', config:{body:'archtop',neck:'dot-bound',pickups:'mini-humbuckers',bridge:'trapeze',finish:'tobacco'} },
  { id:'cream-vwing', name:{zh:'奶油 V 翼',en:'Cream V-Wing'}, era:'AGED CREAM', config:{body:'v-wing',neck:'trapezoid-bound',pickups:'covered-humbuckers',bridge:'stopbar',finish:'cream'} },
]
