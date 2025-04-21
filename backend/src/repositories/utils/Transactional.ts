import { Transaction } from 'sequelize';
import sequelize from '../../config/db';

export function Transactional() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): void {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Find the transaction parameter (assume it's the last argument or optional)
      const transaction: Transaction | undefined = args.find(
        (arg) => arg instanceof Transaction
      );
      const t = transaction || (await sequelize.transaction());
      let committed = false;

      try {
        // Pass all arguments to the original method
        const result = await originalMethod.apply(this, [...args]);
        if (!transaction) {
          await t.commit();
          committed = true;
        }
        return result;
      } catch (error) {
        if (!committed && !transaction) {
          await t.rollback();
        }
        throw error;
      }
    };
  };
}
