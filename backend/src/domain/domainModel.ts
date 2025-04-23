export abstract class DomainModel<
  TTableAttributes = void,
  TDependencies = void,
  Attributes = void,
  TDTO = void
> {
  abstract toDTO(): TDTO;
  abstract getAttributes(): Attributes;
}
