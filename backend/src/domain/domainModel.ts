export abstract class DomainModel<
  TTableAttributes = void,
  TDependencies = void,
  TDTO = void
> {
  abstract toDTO(): TDTO;
  abstract getAttributes(): TTableAttributes & TDependencies;
}
