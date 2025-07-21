import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { CustomerRepository } from "../../../repository/customer.repository.interface";
import { CreateUserRequestDTO } from "../../../dtos/create-customer.dto";
import { Customer } from "../../../models/customer.model";

export class CustomerRepositoryImpl implements CustomerRepository {
  private tableName: string;
  constructor(private client: DynamoDBDocumentClient) {
    this.tableName = "customers";
  }

  async save(data: CreateUserRequestDTO) {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: data,
      })
    );

    return data;
  }

  async findOne(key: { cpf: string }) {
    const { Item } = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: key,
      })
    );

    return Item as Customer | undefined;
  }
}
