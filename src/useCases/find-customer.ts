import { inject, injectable } from "inversify";
import { IFindCustomerUseCase } from "./interfaces/customer.usecase.interface";
import { CustomerRepository } from "../repository/customer.repository.interface";
import { Customer } from "../models/customer.model";
import { CustomError } from "../errors/custom.error";

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
        throw new CustomError(`Usuário com cpf ${cpf} não encontrado!`, 404);
      }

      return product;
    } catch (error) {
      throw error;
    }
  }
}
