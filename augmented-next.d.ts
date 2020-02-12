import 'next';
declare module 'next' {
  export interface NextPageContext {
    reduxStore: any;
  }
}
