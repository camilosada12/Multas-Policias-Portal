import { BackendMenuItem } from "../../components/sidebar.config";


export interface User {
  id: number;
  fullName: string ;
  email: string;
  roles: string[];
  menu: BackendMenuItem[];
  personId?: number; // Optional for safety
}
