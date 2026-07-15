export type ModularSetBodyId = 'carved' | 'centerblock' | 'thin-horn'
export type ModularSetNeckId = 'dot-bound' | 'trapezoid-bound'
export type ModularSetPickupId = 'covered-humbuckers' | 'soapbar-p90' | 'mini-humbuckers'
export type ModularSetBridgeId = 'stopbar' | 'trapeze' | 'short-vibrola'
export type ModularSetFinishId = 'cherry' | 'gold' | 'ebony' | 'natural'

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
}

export const MODULAR_SET_FINISHES: Record<ModularSetFinishId, { top:string; mid:string; edge:string; side:string; guard:string; binding:string }> = {
  cherry: { top:'#cf624b', mid:'#9d2f28', edge:'#4a1518', side:'#351012', guard:'#171719', binding:'#ead7b3' },
  gold: { top:'#ebc56f', mid:'#bd8737', edge:'#6b3c20', side:'#3d2118', guard:'#3a261c', binding:'#eee0bc' },
  ebony: { top:'#4d4a45', mid:'#1b1a19', edge:'#070707', side:'#050505', guard:'#e5dcc8', binding:'#e8dcc0' },
  natural: { top:'#e0b775', mid:'#b87543', edge:'#623427', side:'#3b211c', guard:'#34231d', binding:'#f0dfbd' },
}

export const SET_BODY_BRIDGES: Record<ModularSetBodyId, ModularSetBridgeId[]> = {
  carved: ['stopbar'],
  centerblock: ['stopbar','trapeze'],
  'thin-horn': ['stopbar','short-vibrola'],
}

export const SET_BODY_PICKUPS: Record<ModularSetBodyId, ModularSetPickupId[]> = {
  carved: ['covered-humbuckers','soapbar-p90','mini-humbuckers'],
  centerblock: ['covered-humbuckers','soapbar-p90','mini-humbuckers'],
  'thin-horn': ['covered-humbuckers','soapbar-p90'],
}

export const MODULAR_SET_PRESETS: Array<{ id:string; name:{zh:string;en:string}; era:string; config:ModularSetNeckConfig }> = [
  { id:'carved-59', name:{zh:'琥珀雕面 59',en:'Amber Carve 59'}, era:'1959 SET-NECK', config:{body:'carved',neck:'trapezoid-bound',pickups:'covered-humbuckers',bridge:'stopbar',finish:'cherry'} },
  { id:'gold-soapbar', name:{zh:'金顶皂条 56',en:'Gold Soapbar 56'}, era:'1956 CLUB LANGUAGE', config:{body:'carved',neck:'trapezoid-bound',pickups:'soapbar-p90',bridge:'stopbar',finish:'gold'} },
  { id:'centerblock-58', name:{zh:'樱桃中心块 58',en:'Cherry Centerblock 58'}, era:'1958 CENTERBLOCK', config:{body:'centerblock',neck:'dot-bound',pickups:'covered-humbuckers',bridge:'stopbar',finish:'cherry'} },
  { id:'natural-trapeze', name:{zh:'自然色梯形尾件',en:'Natural Trapeze Study'}, era:'JAZZ CLUB STUDY', config:{body:'centerblock',neck:'dot-bound',pickups:'mini-humbuckers',bridge:'trapeze',finish:'natural'} },
  { id:'thin-horn-61', name:{zh:'深红薄双角 61',en:'Deep Cherry Horn 61'}, era:'1961 THIN SOLID', config:{body:'thin-horn',neck:'trapezoid-bound',pickups:'covered-humbuckers',bridge:'stopbar',finish:'cherry'} },
  { id:'black-vibrola', name:{zh:'黑色短板颤音实验',en:'Black Vibrola Study'}, era:'ALTERNATE 1964', config:{body:'thin-horn',neck:'trapezoid-bound',pickups:'soapbar-p90',bridge:'short-vibrola',finish:'ebony'} },
]
