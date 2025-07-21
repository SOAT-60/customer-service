import { inject, injectable } from "inversify";
import { CreateUserRequestDTO } from "../dtos/create-customer.dto";
import {
  ICreateCustomerUseCase,
  IFindCustomerUseCase,
} from "../useCases/interfaces/customer.usecase.interface";

@injectable()
export class CustomerController {
  constructor(
    @inject("CreateCustomerUseCase")
    private readonly createCustomerUseCase: ICreateCustomerUseCase,
    @inject("FindCustomerUseCase")
    private readonly findCustomerUseCase: IFindCustomerUseCase
  ) {}

  async createCustomer(customerData: CreateUserRequestDTO) {
    const customer = await this.createCustomerUseCase.createCustomer(
      customerData
    );

    return customer;
  }

  async getCustomer(cpf: string) {
    const customer = await this.findCustomerUseCase.findCustomer(cpf);
    return customer;
  }
}
