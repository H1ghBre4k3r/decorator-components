import { Clazz } from "./clazz.d";

/**
 * Declare a class property as an observed HTML attribute. Changing this poperty will redraw the shadow dom.
 */
export const Property = (target: Clazz, propertyKey: string | symbol) => {
  // eslint-disable-next-line no-param-reassign
  target.observedAttributes = target.observedAttributes || [];
  target.observedAttributes?.push(propertyKey as string);

  Object.defineProperty(target, propertyKey, {
    get() {
      return this[`__${String(propertyKey)}`];
    },
    set(v) {
      this[`__${String(propertyKey)}`] = v;
      this.redrawShadow?.();
    },
  });
};
