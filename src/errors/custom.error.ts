export class CustomError extends Error {
  public readonly isCustomError = true;
  constructor(public message: string, public status: number) {
    super(message);
  }
}
