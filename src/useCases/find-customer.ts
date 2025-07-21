import { inject, injectable } from "inversify";
import { IFindCustomerUseCase } from "./interfaces/customer.usecase.interface";
import { CustomerRepository } from "../repository/customer.repository.interface";
import { Customer } from "../models/customer.model";

@injectable()
export class FindCustomerUseCase implements IFindCustomerUseCase {
  constructor(
    @inject("CustomerRepository")
    private readonly repository: CustomerRepository
  ) {}

  async findCustomer(cpf: string): Promise<Customer> {
    try {
      const product = await this.repository.findOne({ cpf });

      if (!product) {
        throw new Error(
          JSON.stringify({
            message: `Usuário com cpf ${cpf} não encontrado!`,
            status: 404,
          })
        );
      }

      return product;
    } catch (error) {
      throw error;
    }
  }
}
