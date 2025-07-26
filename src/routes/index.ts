import cors from "cors";
import { Router } from "express";
import { container } from "../infra/DI/container";
import { CustomerController } from "../controller";
import { CreateUserValidator } from "../dtos/create-customer.dto";
import { ZodError } from "zod";
import { CustomError } from "../errors/custom.error";

const router = Router();
router.use(cors());

const customerController =
  container.get<CustomerController>("CustomerController");

router.get("/health", (_, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

router.post("/customer/create", async (req, res) => {
  try {
    const body = req.body;
    const validatedCustomer = CreateUserValidator.validate(body);

    const customer = await customerController.createCustomer(validatedCustomer);
    res
      .status(200)
      .json({ message: "Cliente criado com sucesso!", response: customer });
  } catch (error: any) {
    // Verifica se o erro tem as propriedades do CustomError
    if (
      error &&
      typeof error.status === "number" &&
      typeof error.message === "string"
    ) {
      return res.status(error.status).json({ message: error.message });
    } else if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Erro validação",
        errors: error.message,
      });
    }

    res.status(500).json({ message: "Erro ao criar cliente" });
  }
});

router.get("/customer/:cpf", async (req, res) => {
  try {
    const { cpf } = req.params;

    if (typeof cpf !== "string")
      return res
        .status(400)
        .json({ message: "Obrigatório o envio do ID do cliente" });

    const customer = await customerController.getCustomer(cpf);

    res
      .status(200)
      .json({ message: "Cliente recuperado com sucesso!", response: customer });
  } catch (error: any) {
    // Verifica se o erro tem as propriedades do CustomError
    if (
      error &&
      typeof error.status === "number" &&
      typeof error.message === "string"
    ) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: "Erro ao buscar cliente" });
  }
});

export const routes = router;
