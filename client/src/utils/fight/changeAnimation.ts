/* eslint-disable no-param-reassign */
import { Animation } from '@labrute/core';
import { GlowFilter } from '@pixi/filter-glow';
import { AnimatedSprite, Application } from 'pixi.js';
import { AnimationFighter } from './findFighter';
import setupSprite from './setupSprite';
import { updateWeaponFrame } from './updateWeapons';
import { BevelFilter } from '@pixi/filter-bevel';

const getSprite = (
  app: Application,
  fighter: AnimationFighter,
  animation: Animation,
  speed: React.MutableRefObject<number>,
) => {
  // Do nothing if the game was stopped
  if (!app.loader) {
    return;
  }

  // Get sprite
  const newAnimation = setupSprite(
    app,
    fighter,
    animation,
    fighter.team,
    speed,
  );

  if (!newAnimation) {
    throw new Error(`New animation not found: ${animation}`);
  }

  // Set old animation to invisible
  fighter.currentAnimation.visible = false;

  // Add Bevel filter
  newAnimation.filters = [new BevelFilter()];

  // Set new animation to visible
  newAnimation.visible = true;

  // Remove old animation
  fighter.container.removeChild(fighter.currentAnimation);
  fighter.currentAnimation.destroy();

  // Update current animation
  fighter.currentAnimation = newAnimation;
  fighter.container.addChild(newAnimation);

  // Update weapon frame
  if (fighter.activeWeapon?.sprite) {
    updateWeaponFrame(fighter);
  }

  if (newAnimation instanceof AnimatedSprite) {
    // Setup weapon frame change on animation frame change
    newAnimation.onFrameChange = () => {
      if (fighter.activeWeapon?.sprite) {
        updateWeaponFrame(fighter);
      }
    };
  }

  // Play new animation
  if ((newAnimation as AnimatedSprite).play) {
    (newAnimation as AnimatedSprite).play();
  }
};

export const handleEffects = (
  fighter: AnimationFighter,
) => {
  if (!fighter.currentAnimation.filters) {
    fighter.currentAnimation.filters = [];
  }

  if (fighter.activeEffects.includes('fierceBrute')) {
    fighter.currentAnimation.filters.push(new GlowFilter({
      color: 0xff0000,
      outerStrength: 1,
    }));
  }
};

const changeAnimation = (
  app: Application,
  fighter: AnimationFighter,
  animation: Animation,
  speed: React.MutableRefObject<number>,
) => {
  // Cancel previous animation changes
  if ((fighter.currentAnimation as AnimatedSprite).play) {
    (fighter.currentAnimation as AnimatedSprite).off('complete');
  }

  // Handle idle differently for monks
  if (animation === 'idle' && fighter.skills && fighter.skills.includes('monk')) {
    // Load the animation start
    getSprite(app, fighter, 'monk-start', speed);

    // Wait for animation to end
    (fighter.currentAnimation as AnimatedSprite).onComplete = () => {
      if (fighter.currentAnimation.name === 'monk-start') {
        // Load the animation loop
        getSprite(app, fighter, 'monk-loop', speed);
      }
    };
  } else {
    getSprite(app, fighter, animation, speed);
  }

  handleEffects(fighter);
};

export default changeAnimation;