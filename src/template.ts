export enum ButtonType {
  Normal,
  Directional,
  Special,
  Menu,
}

export type SingleTemplateButton = { x: number; y: number; r: number; type?: ButtonType }

export type TemplateButton = SingleTemplateButton | SingleTemplateButton[]

// NOTE(tec27): Template buttons are ordered as:
// a
// b
// x
// y
// lb
// rb
// lt
// rt
// back
// start
// ls
// rs
// up
// down
// left
// right
// home
//
// Buttons that aren't present can be replaced with an empty array if in the middle of this list,
// or omitted entirely if at the end of the list.

export const HAUTE_T16: TemplateButton[] = [
  { x: 302, y: 206, r: 30 },
  { x: 370, y: 178, r: 30 },
  { x: 308, y: 132, r: 30 },
  { x: 376, y: 102, r: 30 },
  { x: 526, y: 112, r: 30 },
  { x: 452, y: 104, r: 30 },
  { x: 520, y: 186, r: 30 },
  { x: 446, y: 178, r: 30 },
  { x: 537, y: 31, r: 14, type: ButtonType.Menu },
  { x: 577, y: 31, r: 14, type: ButtonType.Menu },
  [
    { x: 316, y: 58, r: 30, type: ButtonType.Special },
    { x: 200, y: 282, r: 30, type: ButtonType.Special },
  ],
  { x: 362, y: 254, r: 30, type: ButtonType.Special },
  [
    { x: 275, y: 298, r: 30, type: ButtonType.Directional },
    { x: 190, y: 58, r: 30, type: ButtonType.Directional },
  ],
  { x: 174, y: 130, r: 30, type: ButtonType.Directional },
  { x: 99, y: 130, r: 30, type: ButtonType.Directional },
  { x: 241, y: 162, r: 30, type: ButtonType.Directional },
  { x: 497, y: 31, r: 14, type: ButtonType.Menu },
]
