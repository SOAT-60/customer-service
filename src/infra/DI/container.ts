import { Container } from "inversify";
import { CustomerController } from "../../controller";
import { CustomerRepository } from "../../repository/customer.repository.interface";
import { CustomerRepositoryImpl } from "../DynamoDB/repository/customer.repository";
import {
  ICreateCustomerUseCase,
  IFindCustomerUseCase,
} from "../../useCases/interfaces/customer.usecase.interface";
import { CreateCustomerUseCase } from "../../useCases/create-customer";
import { FindCustomerUseCase } from "../../useCases/find-customer";

const container = new Container();
container.bind<CustomerController>("CustomerController").to(CustomerController);
container
  .bind<CustomerRepository>("CustomerRepository")
  .to(CustomerRepositoryImpl);
container
  .bind<ICreateCustomerUseCase>("CreateCustomerUseCase")
  .to(CreateCustomerUseCase);
container
  .bind<IFindCustomerUseCase>("FindCustomerUseCase")
  .to(FindCustomerUseCase);
export { container };
