import { CreateCustomerUseCase } from "../../src/useCases/create-customer";
import { CustomerRepository } from "../../src/repository/customer.repository.interface";
import { CreateUserRequestDTO } from "../../src/dtos/create-customer.dto";
import { Customer } from "../../src/models/customer.model";

describe("CreateCustomerUseCase", () => {
  let createCustomerUseCase: CreateCustomerUseCase;
  let mockRepository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
    };

    createCustomerUseCase = new CreateCustomerUseCase(mockRepository);
  });

  describe("createCustomer", () => {
    const validCustomerData: CreateUserRequestDTO = {
      name: "Maria Silva",
      cpf: "123.456.789-00",
      email: "maria@exemplo.com",
    };

    it("deve criar um cliente com sucesso quando não existe", async () => {
      const expectedCustomer: Customer = {
        id: 1,
        ...validCustomerData,
      };

      mockRepository.findOne.mockResolvedValue(undefined);
      mockRepository.save.mockResolvedValue(expectedCustomer);

      const result = await createCustomerUseCase.createCustomer(
        validCustomerData
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        cpf: validCustomerData.cpf,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(validCustomerData);
      expect(result).toEqual(expectedCustomer);
    });

    it("deve lançar erro quando cliente já existe", async () => {
      const existingCustomer: Customer = {
        id: 1,
        ...validCustomerData,
      };

      mockRepository.findOne.mockResolvedValue(existingCustomer);

      await expect(
        createCustomerUseCase.createCustomer(validCustomerData)
      ).rejects.toThrow("Usuário já existe!");

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        cpf: validCustomerData.cpf,
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("deve propagar erro do repositório na busca", async () => {
      const repositoryError = new Error("Erro de conexão com banco");
      mockRepository.findOne.mockRejectedValue(repositoryError);

      await expect(
        createCustomerUseCase.createCustomer(validCustomerData)
      ).rejects.toThrow("Erro de conexão com banco");

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        cpf: validCustomerData.cpf,
      });
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it("deve propagar erro do repositório no save", async () => {
      const repositoryError = new Error("Erro ao salvar no banco");
      mockRepository.findOne.mockResolvedValue(undefined);
      mockRepository.save.mockRejectedValue(repositoryError);

      await expect(
        createCustomerUseCase.createCustomer(validCustomerData)
      ).rejects.toThrow("Erro ao salvar no banco");

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        cpf: validCustomerData.cpf,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(validCustomerData);
    });

    it("deve extrair corretamente os dados do DTO", async () => {
      const customerData: CreateUserRequestDTO = {
        name: "João Santos",
        cpf: "987.654.321-00",
        email: "joao.santos@exemplo.com",
      };

      const expectedCustomer: Customer = {
        id: 2,
        ...customerData,
      };

      mockRepository.findOne.mockResolvedValue(undefined);
      mockRepository.save.mockResolvedValue(expectedCustomer);

      await createCustomerUseCase.createCustomer(customerData);

      expect(mockRepository.save).toHaveBeenCalledWith({
        cpf: customerData.cpf,
        email: customerData.email,
        name: customerData.name,
      });
    });
  });
});
