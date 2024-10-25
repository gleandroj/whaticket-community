import { Scopes } from "sequelize-typescript";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/ban-types
export function CompanyScope(target: Function) {
  Scopes(() => ({
    companyId: (companyId: number) => {
      return companyId ? { where: { companyId } } : {};
    }
  }))(target);
}
