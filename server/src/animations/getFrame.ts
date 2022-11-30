import {
  Animation, FrameProps,
} from '@eternaltwin/labrute-core/types';
import maleBruteIddle1 from './male-brute/iddle/1.js';
import maleBruteIddle2 from './male-brute/iddle/2.js';
import maleBruteIddle3 from './male-brute/iddle/3.js';
import maleBruteIddle4 from './male-brute/iddle/4.js';
import maleBruteIddle5 from './male-brute/iddle/5.js';
import maleBruteIddle6 from './male-brute/iddle/6.js';
import maleBruteIddle7 from './male-brute/iddle/7.js';
import maleBruteIddle8 from './male-brute/iddle/8.js';
import maleBruteIddle9 from './male-brute/iddle/9.js';
import maleBruteIddle10 from './male-brute/iddle/10.js';
import maleBruteIddle11 from './male-brute/iddle/11.js';
import maleBruteIddle12 from './male-brute/iddle/12.js';
import maleBruteIddle13 from './male-brute/iddle/13.js';
import maleBruteIddle14 from './male-brute/iddle/14.js';
import maleBruteIddle15 from './male-brute/iddle/15.js';
import maleBruteIddle16 from './male-brute/iddle/16.js';
import maleBruteIddle17 from './male-brute/iddle/17.js';
import maleBruteIddle18 from './male-brute/iddle/18.js';
import maleBruteIddle19 from './male-brute/iddle/19.js';
import maleBruteIddle20 from './male-brute/iddle/20.js';
import maleBruteIddle21 from './male-brute/iddle/21.js';
import maleBruteIddle22 from './male-brute/iddle/22.js';
import maleBruteIddle23 from './male-brute/iddle/23.js';
import maleBruteIddle24 from './male-brute/iddle/24.js';
import maleBruteIddle25 from './male-brute/iddle/25.js';
import maleBruteIddle26 from './male-brute/iddle/26.js';
import maleBruteIddle27 from './male-brute/iddle/27.js';
import maleBruteIddle28 from './male-brute/iddle/28.js';
import maleBruteIddle29 from './male-brute/iddle/29.js';
import maleBruteIddle30 from './male-brute/iddle/30.js';
import maleBruteIddle31 from './male-brute/iddle/31.js';
import maleBruteIddle32 from './male-brute/iddle/32.js';
import maleBruteIddle33 from './male-brute/iddle/33.js';
import maleBruteIddle34 from './male-brute/iddle/34.js';
import maleBruteIddle35 from './male-brute/iddle/35.js';
import maleBruteIddle36 from './male-brute/iddle/36.js';
import maleBruteIddle37 from './male-brute/iddle/37.js';
import maleBruteIddle38 from './male-brute/iddle/38.js';
import maleBruteIddle39 from './male-brute/iddle/39.js';
import maleBruteRun1 from './male-brute/run/1.js';
import maleBruteRun2 from './male-brute/run/2.js';
import maleBruteRun3 from './male-brute/run/3.js';
import maleBruteRun4 from './male-brute/run/4.js';
import maleBruteRun5 from './male-brute/run/5.js';
import maleBruteRun6 from './male-brute/run/6.js';
import maleBruteRun7 from './male-brute/run/7.js';

export const FRAMES: Record<
  'male' | 'female',
  Record<
    Animation,
    // eslint-disable-next-line no-unused-vars
    (((props: FrameProps) => string) | null)[]
  >
> = {
  male: {
    'arrive-end': [],
    'arrive-start': [],
    attack: [],
    block: [],
    death: [],
    drink: [],
    eat: [],
    equip: [],
    evade: [],
    grab: [],
    grabbed: [],
    hit: [],
    'hit-0': [],
    'hit-1': [],
    'hit-2': [],
    'hit-3': [],
    iddle: [
      maleBruteIddle1, maleBruteIddle2, maleBruteIddle3,
      maleBruteIddle4, maleBruteIddle5, maleBruteIddle6,
      maleBruteIddle7, maleBruteIddle8, maleBruteIddle9,
      maleBruteIddle10, maleBruteIddle11, maleBruteIddle12,
      maleBruteIddle13, maleBruteIddle14, maleBruteIddle15,
      maleBruteIddle16, maleBruteIddle17, maleBruteIddle18,
      maleBruteIddle19, maleBruteIddle20, maleBruteIddle21,
      maleBruteIddle22, maleBruteIddle23, maleBruteIddle24,
      maleBruteIddle25, maleBruteIddle26, maleBruteIddle27,
      maleBruteIddle28, maleBruteIddle29, maleBruteIddle30,
      maleBruteIddle31, maleBruteIddle32, maleBruteIddle33,
      maleBruteIddle34, maleBruteIddle35, maleBruteIddle36,
      maleBruteIddle37, maleBruteIddle38, maleBruteIddle39,
    ],
    launch: [],
    'monk-loop': [],
    'monk-start': [],
    'prepare-throw': [],
    run: [
      maleBruteRun1, maleBruteRun2, maleBruteRun3,
      maleBruteRun4, maleBruteRun5, maleBruteRun6,
      maleBruteRun7,
    ],
    slash: [],
    stolen: [],
    steal: [],
    strengthen: [],
    throw: [],
    train: [],
    'trapped-loop': [],
    'trapped-start': [],
    trash: [],
    win: [],
    fist: [],
    estoc: [],
    whip: [],
  },
  female: {
    'arrive-end': [],
    'arrive-start': [],
    attack: [],
    block: [],
    death: [],
    drink: [],
    eat: [],
    equip: [],
    evade: [],
    grab: [],
    grabbed: [],
    hit: [],
    'hit-0': [],
    'hit-1': [],
    'hit-2': [],
    'hit-3': [],
    iddle: [],
    launch: [],
    'monk-loop': [],
    'monk-start': [],
    'prepare-throw': [],
    run: [],
    slash: [],
    stolen: [],
    steal: [],
    strengthen: [],
    throw: [],
    train: [],
    'trapped-loop': [],
    'trapped-start': [],
    trash: [],
    win: [],
    fist: [],
    estoc: [],
    whip: [],
  },
};

const getFrame = (
  animation: Animation,
  model: 'male' | 'female',
  frame: number,
) => FRAMES[model][animation][frame];

export default getFrame;