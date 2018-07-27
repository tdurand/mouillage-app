import { Enum } from 'enumify';

export class STEPS extends Enum {}
STEPS.initEnum({
  SET_ANCHOR_LOCATION: {
    get title() { return "Anchor location" },
    get ctaLabel() { return "Set anchor position"},
    get next() { return STEPS.SET_RADIUS }
  },
  SET_RADIUS: {
    get title() { return "Adjust radius" },
    get ctaLabel() { return "Start alarm"},
    get next() { return STEPS.MONITOR },
    get previous() { return STEPS.SET_ANCHOR_LOCATION }
  },
  MONITOR: {
    get title() { return "Watching anchor" },
    get ctaLabel() { return "Stop monitoring"},
    get stop() { return STEPS.SET_ANCHOR_LOCATION }
  }
});
