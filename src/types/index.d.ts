declare module "*.html" {
  const content: string;
  export default content;
}

declare module "*.json" {
  const value: any;
  export default value;
}

// type ValueOf<T> = T[keyof T];

/* global THREE */
