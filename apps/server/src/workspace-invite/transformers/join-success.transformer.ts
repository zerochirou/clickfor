export class JoinSuccessTransformer {
  isSuccess: boolean;

  constructor(partial: Partial<JoinSuccessTransformer>) {
    Object.assign(this, partial);
  }
}
