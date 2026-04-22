export const Colors = {
  cream:   '#F5F0E8',
  creamD:  '#EDE5D8',
  sand:    '#E4D9C8',
  sandD:   '#D5C8B4',
  teal:    '#2A9D8F',
  tealD:   '#1d7a6e',
  tealL:   '#E4F4F2',
  blue:    '#2C6E8A',
  blueL:   '#E3EEF4',
  ink:     '#1A1714',
  brown:   '#7A5C45',
  muted:   '#8C7B6B',
  border:  '#DDD0BF',
  white:   '#FDFAF6',
  green:   '#16A34A',
  greenL:  '#DCFCE7',
  red:     '#D62839',
  redL:    '#FEE2E2',
  amber:   '#F59E0B',
  amberL:  '#FEF3C7',
};

export const roleColor = (role: 'morador' | 'comercio') =>
  role === 'morador' ? Colors.teal : Colors.blue;

export const roleColorLight = (role: 'morador' | 'comercio') =>
  role === 'morador' ? Colors.tealL : Colors.blueL;
