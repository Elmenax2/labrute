import { MoveStep } from '@labrute/core';
import { Easing, Tweener } from 'pixi-tweener';
import { Application } from 'pixi.js';
import changeAnimation from './changeAnimation';
import findFighter, { AnimationFighter } from './findFighter';

const moveTo = async (
  app: Application,
  fighters: AnimationFighter[],
  step: MoveStep,
) => {
  const fighter = findFighter(fighters, step.fighter);
  if (!fighter) {
    throw new Error('Fighter not found');
  }
  const target = findFighter(fighters, step.target);
  if (!target) {
    throw new Error('Target not found');
  }

  // Set animation to `run`
  changeAnimation(app, fighter, 'run');

  // Move fighter to the position
  await Tweener.add({
    target: fighter.currentAnimation,
    duration: 0.5,
    ease: Easing.linear
  }, {
    x: target.team === 'right'
      ? target.currentAnimation.x
        - target.currentAnimation.width / 2
        - fighter.currentAnimation.width / 2
      : target.currentAnimation.x
        + target.currentAnimation.width / 2
        + fighter.currentAnimation.width / 2,
    y: target.currentAnimation.y,
  });

  // Set animation to `idle`
  changeAnimation(app, fighter, 'idle');
};

export default moveTo;