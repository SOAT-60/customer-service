import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { CustomerRepository } from "../../../repository/customer.repository.interface";
import { CreateUserRequestDTO } from "../../../dtos/create-customer.dto";
import { Customer } from "../../../models/customer.model";
import { injectable } from "inversify";
import { DynamoDocClient } from "../config";

@injectable()
export class CustomerRepositoryImpl implements CustomerRepository {
  private tableName: string = "customers";

  constructor() {}

  async save(data: CreateUserRequestDTO) {
    await DynamoDocClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: data,
      })
    );

    return data;
  }

  async findOne(key: { cpf: string }) {
    const { Item } = await DynamoDocClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: key,
      })
    );

    return Item as Customer | undefined;
  }
}
