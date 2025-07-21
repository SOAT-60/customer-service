import { CreateUserRequestDTO } from "../../dtos/create-customer.dto";
import { Customer } from "../../models/customer.model";

export interface ICreateCustomerUseCase {
  createCustomer(customerData: CreateUserRequestDTO): Promise<Customer>;
}

export interface IFindCustomerUseCase {
  findCustomer(cpf: string): Promise<Customer>;
}
