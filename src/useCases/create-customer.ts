import { inject, injectable } from "inversify";
import { ICreateCustomerUseCase } from "./interfaces/customer.usecase.interface";
import { CustomerRepository } from "../repository/customer.repository.interface";
import { CreateUserRequestDTO } from "../dtos/create-customer.dto";

@injectable()
export class CreateCustomerUseCase implements ICreateCustomerUseCase {
  constructor(
    @inject("CustomerRepository")
    private readonly repository: CustomerRepository
  ) {}

  async createCustomer(userDTO: CreateUserRequestDTO) {
    try {
      const { cpf, email, name } = userDTO;
      const exists = await this.repository.findOne({ cpf });

      if (exists) {
        throw new Error(
          JSON.stringify({ message: "Usuário já existe!", status: 400 })
        );
      }

      return await this.repository.save({ cpf, email, name });
    } catch (error) {
      throw error;
    }
  }
}
