function toSingleLine(message) {
  return String(message).replace(/\s+/g, ' ').trim();
}

export class ArgumentError extends Error {
  constructor(message) {
    super(toSingleLine(message));
    this.name = 'ArgumentError';
    this.userFacing = true;
  }
}

export class InputError extends Error {
  constructor(message) {
    super(toSingleLine(message));
    this.name = 'InputError';
    this.userFacing = true;
  }
}
