import { Clazz } from "./clazz.d";

/**
 * Declare a class as a custom element.
 *
 * @param tag tag under which this component will be accessible.
 */
export const Component = (tag: string) => (Target: Clazz) => {
  // get list of observed HTML attributes
  const observedAttributes: string[] =
    Target.prototype.observedAttributes || [];

  // extend the decorated class to implement WebComponent specific methods
  const ExtendedComponent = class extends Target {
    private shadow = this.attachShadow({ mode: "open" });

    constructor(...args: any[]) {
      super(...args);

      observedAttributes.forEach((attributeKey) => {
        this[attributeKey] = this.getAttribute(attributeKey);
      });
      this.render();
    }

    /**
     * Callback to changes of the HTML attributes.
     */
    public attributeChangedCallback(
      name: string,
      _oldValue: string,
      newValue: string
    ): void {
      if (observedAttributes.includes(name)) {
        this[name as keyof this] = newValue;
      }
    }

    private redrawShadow() {
      this.shadow.innerHTML = this.render();
    }

    public connectedCallback() {
      this.redrawShadow();
    }

    public toString(): string {
      // we delegate this to the super class
      return super.toString();
    }
  };

  // register the extended component under the specified tag
  customElements.define(tag, ExtendedComponent);
};
