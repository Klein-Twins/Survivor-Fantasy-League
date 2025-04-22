export abstract class DomainModel<
  TAttributes extends object,
  TDependencies extends object,
  TDTO = void
> {
  protected attributes: TAttributes;
  protected dependencies: TDependencies;

  constructor(attributes: TAttributes, dependencies?: Partial<TDependencies>) {
    this.attributes = attributes;

    // Initialize dependencies with defaults (empty arrays or null)
    this.dependencies = {
      ...this.getDefaultDependencies(),
      ...dependencies,
    } as TDependencies;
  }

  // Abstract method to enforce implementation in subclasses
  abstract toDTO(): TDTO;

  // Abstract method to enforce default dependencies in subclasses
  protected abstract getDefaultDependencies(): TDependencies;

  // Optionally, you can add shared methods here
  getAttributes(): TAttributes {
    return this.attributes;
  }

  getDependencies(): TDependencies {
    return this.dependencies;
  }
}

export abstract class DomainModel2<
  TTableAttributes = void,
  TDependencies = void,
  TDTO = void
> {
  abstract toDTO(): TDTO;
  abstract getAttributes(): TTableAttributes & TDependencies;
}
