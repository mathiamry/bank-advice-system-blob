export interface IBank {
  id?: number;
  name?: string;
  address?: string;
  contact?: string | null;
  email?: string;
}

export class Bank implements IBank {
  constructor(public id?: number, public name?: string, public address?: string, public contact?: string | null, public email?: string) {}
}

export function getBankIdentifier(bank: IBank): number | undefined {
  return bank.id;
}
