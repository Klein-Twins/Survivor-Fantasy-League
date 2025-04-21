// --- Imports ---
import { SurvivorsAttributes } from '../models/survivors/Survivors';
import { DomainModel } from './domainModel';
import { Survivor as SurvivorDTO } from '../generated-api/models/survivor';
import { Transaction } from 'sequelize';
import { models } from '../config/db';
import { SurvivorBasic } from '../generated-api';
import { Transactional } from './Transactional';

// --- Type Definitions ---
export type SurvivorProperties = {
  id: SurvivorsAttributes['id'];
  name: string;
  firstName: SurvivorsAttributes['firstName'];
  lastName: SurvivorsAttributes['lastName'];
  nickName: SurvivorsAttributes['nickName'];
  fromCity: SurvivorsAttributes['fromCity'];
  fromState: SurvivorsAttributes['fromState'];
  fromCountry: SurvivorsAttributes['fromCountry'];
};

// --- Class Definition ---
export class Survivor
  implements
    DomainModel<
      SurvivorsAttributes,
      Pick<
        SurvivorDTO,
        | 'id'
        | 'firstName'
        | 'lastName'
        | 'fromCity'
        | 'fromState'
        | 'fromCountry'
        | 'nickName'
      >
    >
{
  // --- Core Properties ---
  protected id: SurvivorsAttributes['id'];
  protected name: string;
  protected firstName: SurvivorsAttributes['firstName'];
  protected lastName: SurvivorsAttributes['lastName'];
  protected nickName: SurvivorsAttributes['nickName'];
  protected fromCity: SurvivorsAttributes['fromCity'];
  protected fromState: SurvivorsAttributes['fromState'];
  protected fromCountry: SurvivorsAttributes['fromCountry'];

  // --- Constructor ---
  constructor(survivorPropertyValues: SurvivorProperties) {
    this.id = survivorPropertyValues.id;
    this.name = survivorPropertyValues.name;
    this.firstName = survivorPropertyValues.firstName;
    this.lastName = survivorPropertyValues.lastName;
    this.nickName = survivorPropertyValues.nickName || null;
    this.fromCity = survivorPropertyValues.fromCity;
    this.fromState = survivorPropertyValues.fromState;
    this.fromCountry = survivorPropertyValues.fromCountry;
  }

  // --- Static Methods ---
  /**
   * Create a Survivor instance from attributes.
   */
  static fromAttributes(attributes: SurvivorsAttributes): Survivor {
    return new Survivor({
      id: attributes.id,
      name: attributes.firstName + ' ' + attributes.lastName,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      nickName: attributes.nickName,
      fromCity: attributes.fromCity || null,
      fromState: attributes.fromState,
      fromCountry: attributes.fromCountry,
    });
  }

  /**
   * Fetch a Survivor by ID.
   */
  protected static async fetchSurvivorById(
    id: SurvivorsAttributes['id']
  ): Promise<Survivor> {
    const survivorData = await models.Survivors.findByPk(id);
    if (!survivorData) {
      throw new Error(`Survivor with ID ${id} not found`);
    }

    return Survivor.fromAttributes(survivorData);
  }

  // --- Instance Methods ---
  /**
   * Save the Survivor instance to the database.
   */
  @Transactional()
  async save(transaction?: Transaction): Promise<void> {
    await models.Survivors.upsert(
      {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        nickName: this.nickName,
        fromCity: this.fromCity || null,
        fromState: this.fromState,
        fromCountry: this.fromCountry,
      },
      { transaction: transaction }
    );
  }

  /**
   * Get the attributes of the Survivor instance.
   */
  getAttributes(): SurvivorsAttributes {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      nickName: this.nickName,
      fromCity: this.fromCity || null,
      fromState: this.fromState,
      fromCountry: this.fromCountry,
    };
  }

  /**
   * Convert the Survivor instance to a DTO.
   */
  toDTO(
    params: void
  ): Pick<
    SurvivorDTO,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'fromCity'
    | 'fromState'
    | 'fromCountry'
    | 'nickName'
  > {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fromCity: this.fromCity || null,
      fromState: this.fromState,
      fromCountry: this.fromCountry,
      nickName: this.nickName,
    };
  }

  /**
   * Convert the Survivor instance to a basic DTO.
   */
  toDTOBasic(params: void): SurvivorBasic {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      name: this.name,
    };
  }
}
