import { z } from "zod";

export interface CreateUserRequestDTO {
  name: string;
  cpf: string;
  email: string;
}

export const CreateUserValidator = {
  validate(input: any): CreateUserRequestDTO {
    const schema = z.object({
      name: z
        .string({
          error: "Nome deve ser uma string",
        })
        .min(1, "Nome obrigatório"),
      cpf: z
        .string({
          error: "CPF é obrigatório",
        })
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
          message: "CPF deve estar no formato 999.999.999-99",
        }),
      email: z.email({
        error: "Email inválido",
      }),
    });

    return schema.parse(input);
  },
};
