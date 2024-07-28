import { ICategory } from "@/interfaces/ICategory";
import sreq from "./sreq";

export class RCategory {
  static path = "/category";
  static getHeader() {
    return sreq<ICategory[]>(this.path + "/header").then((r) => r.data);
  }
}
