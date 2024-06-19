import {
  adminOptionMapping,
  chefOptionMapping,
  employeeOptionMapping,
} from "./roleOptionMapping";
export const getFunctionsByRole = (roleName: string) => {
  switch (roleName) {
    case "employee":
      return employeeOptionMapping;
    case "admin":
      return adminOptionMapping;
    case "chef":
      return chefOptionMapping;
    default:
      return null;
  }
};
