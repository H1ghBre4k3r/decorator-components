interface Clazz {
  new (...arg: any[]): HTMLElement & { render(): string };
  observedAttributes?: string[];
}

const Property = (target: Clazz, propertyKey: string | symbol) => {
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

const Component = (tag: string) => (Target: Clazz) => {
  const observedAttributes: string[] =
    Target.prototype.observedAttributes || [];

  const ExtendedComponent = class extends Target {
    private shadow = this.attachShadow({ mode: "open" });

    constructor(...args: any[]) {
      super(...args);

      observedAttributes.forEach((attributeKey) => {
        this[attributeKey] = this.getAttribute(attributeKey);
      });
      this.render();
    }

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
  };

  customElements.define(tag, ExtendedComponent);
};
