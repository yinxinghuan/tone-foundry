import { MODULAR_BODY_PATHS, type ModularBodyId } from '../../guitar-system/modularBoltOnPlatform'

export function ModularBoltOnBodySvg({ prefix, body }: { prefix: string; body: ModularBodyId }) {
  const path = MODULAR_BODY_PATHS[body]
  return (
    <g data-guitar-module={`bolt-on-body-${body}`}>
      <defs>
        <clipPath id={`${prefix}-side-window`}>
          <path d="M300 670 H520 V1135 H95 V850 H300 Z" />
        </clipPath>
        <clipPath id={`${prefix}-body-clip`}><path d={path} /></clipPath>
      </defs>
      <ellipse cx="302" cy="1104" rx="186" ry="34" fill={`url(#${prefix}-shadow)`} />
      <path d={path} transform="translate(8 10)" clipPath={`url(#${prefix}-side-window)`} fill={`url(#${prefix}-body-side)`} />
      <path d={path} fill={`url(#${prefix}-body-top)`} stroke={`url(#${prefix}-body-edge)`} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <g clipPath={`url(#${prefix}-body-clip)`}>
        {[-110, -82, -54, -26, 2, 30, 58, 86, 114].map((dx, index) => <path key={dx} d={`M${300 + dx} 620 C${292 + dx} 760 ${309 + dx} 928 ${296 + dx} 1115`} fill="none" stroke={index % 2 ? '#2c1c12' : '#fff0c7'} strokeWidth={index % 2 ? 1.2 : .75} opacity={index % 2 ? .12 : .085} />)}
        <path d="M125 724 C184 645 250 635 322 655 C244 687 196 779 181 891 C167 997 214 1069 281 1100 C193 1090 133 1044 117 970 C100 888 103 790 125 724 Z" fill="#fff" opacity=".065" />
        <path d="M352 642 C425 670 454 732 430 798 C412 847 422 920 468 1000 C448 1055 399 1083 348 1094 C404 1020 409 913 392 817 C380 749 365 686 352 642 Z" fill="#120b08" opacity=".11" />
      </g>
      <path d={path} fill="none" stroke="#f0dfbd" strokeWidth=".7" opacity=".22" vectorEffect="non-scaling-stroke" />
    </g>
  )
}
