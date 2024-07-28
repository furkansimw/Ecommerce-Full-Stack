export interface ICategory {
  link: string;
  name: string;
  subcategories: {
    link: string;
    name: string;
    subcategoryitems: {
      link: string;
      name: string;
    }[];
  }[];
}
