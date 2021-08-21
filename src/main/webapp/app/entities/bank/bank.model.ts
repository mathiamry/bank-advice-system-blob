import { IAdvisor } from 'app/entities/advisor/advisor.model';

export interface IBank {
  id?: number;
  name?: string;
  address?: string;
  contact?: string | null;
  email?: string;
  advisors?: IAdvisor[] | null;
}

export class Bank implements IBank {
  constructor(
    public id?: number,
    public name?: string,
    public address?: string,
    public contact?: string | null,
    public email?: string,
    public advisors?: IAdvisor[] | null
  ) {}
}

export function getBankIdentifier(bank: IBank): number | undefined {
  return bank.id;
}
