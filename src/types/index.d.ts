declare module "*.html" {
  const content: string;
  export default content;
}

type ValueOf<T> = T[keyof T];
