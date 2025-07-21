import { FindCustomerUseCase } from "../../src/useCases/find-customer";
import { CustomerRepository } from "../../src/repository/customer.repository.interface";
import { Customer } from "../../src/models/customer.model";

describe("FindCustomerUseCase", () => {
  let findCustomerUseCase: FindCustomerUseCase;
  let mockRepository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
    };

    findCustomerUseCase = new FindCustomerUseCase(mockRepository);
  });

  describe("findCustomer", () => {
    const validCpf = "123.456.789-00";

    it("deve encontrar um cliente pelo CPF com sucesso", async () => {
      const expectedCustomer: Customer = {
        id: 1,
        name: "Ana Silva",
        cpf: validCpf,
        email: "ana@exemplo.com",
      };

      mockRepository.findOne.mockResolvedValue(expectedCustomer);

      const result = await findCustomerUseCase.findCustomer(validCpf);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ cpf: validCpf });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCustomer);
    });

    it("deve lançar erro quando cliente não é encontrado", async () => {
      const cpf = "999.999.999-99";
      mockRepository.findOne.mockResolvedValue(undefined);

      await expect(findCustomerUseCase.findCustomer(cpf)).rejects.toThrow(
        `Usuário com cpf ${cpf} não encontrado!`
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({ cpf });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it("deve propagar erro do repositório", async () => {
      const repositoryError = new Error("Erro de conexão com banco");
      mockRepository.findOne.mockRejectedValue(repositoryError);

      await expect(findCustomerUseCase.findCustomer(validCpf)).rejects.toThrow(
        "Erro de conexão com banco"
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({ cpf: validCpf });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it("deve lançar erro com formato JSON correto quando cliente não encontrado", async () => {
      const cpf = "111.111.111-11";
      mockRepository.findOne.mockResolvedValue(undefined);

      try {
        await findCustomerUseCase.findCustomer(cpf);
        fail("Deveria ter lançado um erro");
      } catch (error: any) {
        const errorData = JSON.parse(error.message);
        expect(errorData.message).toBe(
          `Usuário com cpf ${cpf} não encontrado!`
        );
        expect(errorData.status).toBe(404);
      }

      expect(mockRepository.findOne).toHaveBeenCalledWith({ cpf });
    });

    it("deve retornar o customer exato do repositório", async () => {
      const customerFromDb: Customer = {
        id: 99,
        name: "Cliente Teste",
        cpf: validCpf,
        email: "teste@exemplo.com",
      };

      mockRepository.findOne.mockResolvedValue(customerFromDb);

      const result = await findCustomerUseCase.findCustomer(validCpf);

      expect(result).toBe(customerFromDb);
      expect(result.id).toBe(99);
      expect(result.name).toBe("Cliente Teste");
    });
  });
});
