import { Request, Response } from 'express';
import DB from '../db/connect.js';
import auth from '../utils/auth.js';

const Brutes = {
  list: async (req: Request, res: Response) => {
    try {
      await DB.connect();
      await auth(req);

      const result = await DB.query('select * from brutes');
      const { rows } = result;

      await DB.close();
      res.status(200).send(rows);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  get: async (req: Request, res: Response) => {
    try {
      await DB.connect();
      await auth(req);

      const result = await DB.query(
        'select * from brutes where name like $1',
        { params: [req.params.name] },
      );
      const { rows } = result;

      await DB.close();
      if (!rows || rows.length === 0) {
        res.status(404).send({ message: 'brute not found' });
      } else {
        res.status(200).send(rows[0]);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

export default Brutes;