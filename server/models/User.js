// @flow

// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from 'regenerator-runtime'; // required for async
import bcrypt from 'bcrypt';
import getConnection from '../SqlDatabase';

const HASH_ROUNDS = 10;

export default class User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  creationDate: Date;

  constructor(
    id: number, username: string, firstName: string, lastName: string,
    email: string, creationDate: Date,
  ) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.creationDate = creationDate;
  }

  static async create(
    username: string, password: string, firstName: string, lastName: string,
    email: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, HASH_ROUNDS);

    const creationDate = new Date();
    try {
      const connection = await getConnection();
      const result =
        await connection.query(
          'INSERT INTO users SET ?, creation_date = now()',
          {
            username,
            password: hashedPassword,
            first_name: firstName,
            last_name: lastName,
            email,
          },
        );

      return new User(
        result[0].insertId, firstName, lastName, username, email,
        creationDate,
      );
    } catch (e) {
      console.error(e.message);
      throw new Error('Could not create user');
    }
  }


  static async getForId(id: number): Promise<User> {
    try {
      const connection = await getConnection();
      const rows =
      (await connection.query(
        'SELECT id, first_name, last_name, username, email, creation_date ' +
        'FROM users ' +
        'WHERE id = ?',
        [id],
      ))[0];
      connection.release();

      if (rows.length > 2) {
        throw new Error(`User ID ${id} returned ${rows.length} users`);
      }

      if (rows.length === 0) {
        throw new Error(`No user with ID ${id}`);
      }

      const user = rows[0];

      return new User(
        user.id, user.first_name, user.last_name, user.username,
        user.email, user.creation_date,
      );
    } catch (e) {
      console.error(e.message);
      throw new Error('Could not get user');
    }
  }
}
