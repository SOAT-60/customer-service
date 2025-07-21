import { CreateUserRequestDTO } from "../dtos/create-customer.dto";
import { Customer } from "../models/customer.model";

export interface CustomerRepository {
  save: (data: CreateUserRequestDTO) => Promise<Customer>;
  findOne: (key: { cpf: string }) => Promise<Customer | undefined>;
}
