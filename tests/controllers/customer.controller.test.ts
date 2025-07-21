import { CustomerController } from "../../src/controller";
import {
  ICreateCustomerUseCase,
  IFindCustomerUseCase,
} from "../../src/useCases/interfaces/customer.usecase.interface";
import { CreateUserRequestDTO } from "../../src/dtos/create-customer.dto";
import { Customer } from "../../src/models/customer.model";
import { mockDeep } from "jest-mock-extended";

describe("CustomerController", () => {
  let customerController: CustomerController;
  let mockCreateCustomerUseCase: jest.Mocked<ICreateCustomerUseCase>;
  let mockFindCustomerUseCase: jest.Mocked<IFindCustomerUseCase>;

  beforeEach(() => {
    mockCreateCustomerUseCase = mockDeep<ICreateCustomerUseCase>();
    mockFindCustomerUseCase = mockDeep<IFindCustomerUseCase>();

    customerController = new CustomerController(
      mockCreateCustomerUseCase,
      mockFindCustomerUseCase
    );
  });

  describe("createCustomer", () => {
    it("deve criar um cliente com sucesso", async () => {
      const customerData: CreateUserRequestDTO = {
        name: "João Silva",
        cpf: "123.456.789-00",
        email: "joao@exemplo.com",
      };

      const expectedCustomer: Customer = {
        id: 1,
        ...customerData,
      };

      mockCreateCustomerUseCase.createCustomer.mockResolvedValue(
        expectedCustomer
      );

      const result = await customerController.createCustomer(customerData);

      expect(mockCreateCustomerUseCase.createCustomer).toHaveBeenCalledWith(
        customerData
      );
      expect(mockCreateCustomerUseCase.createCustomer).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCustomer);
    });

    it("deve propagar erro do use case quando falha na criação", async () => {
      const customerData: CreateUserRequestDTO = {
        name: "João Silva",
        cpf: "123.456.789-00",
        email: "joao@exemplo.com",
      };

      const errorMessage = "Usuário já existe!";
      mockCreateCustomerUseCase.createCustomer.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(
        customerController.createCustomer(customerData)
      ).rejects.toThrow(errorMessage);

      expect(mockCreateCustomerUseCase.createCustomer).toHaveBeenCalledWith(
        customerData
      );
      expect(mockCreateCustomerUseCase.createCustomer).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCustomer", () => {
    it("deve buscar um cliente pelo CPF com sucesso", async () => {
      const cpf = "123.456.789-00";
      const expectedCustomer: Customer = {
        id: 1,
        name: "João Silva",
        cpf: cpf,
        email: "joao@exemplo.com",
      };

      mockFindCustomerUseCase.findCustomer.mockResolvedValue(expectedCustomer);

      const result = await customerController.getCustomer(cpf);

      expect(mockFindCustomerUseCase.findCustomer).toHaveBeenCalledWith(cpf);
      expect(mockFindCustomerUseCase.findCustomer).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCustomer);
    });

    it("deve propagar erro do use case quando cliente não é encontrado", async () => {
      const cpf = "999.999.999-99";
      const errorMessage = `Usuário com cpf ${cpf} não encontrado!`;
      mockFindCustomerUseCase.findCustomer.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(customerController.getCustomer(cpf)).rejects.toThrow(
        errorMessage
      );

      expect(mockFindCustomerUseCase.findCustomer).toHaveBeenCalledWith(cpf);
      expect(mockFindCustomerUseCase.findCustomer).toHaveBeenCalledTimes(1);
    });
  });
});
