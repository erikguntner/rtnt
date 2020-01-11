import React from "react";

const examples = () => {
  // boolean
  const isOpen: boolean = true;
  // string
  const firstName: string = "Scott";
  // number
  const mayAge: number = 34.34;
  // array of numbers
  const aList: number[] = [0, 1, 2, 3];
  // array of different known values
  const me: [string, number, boolean] = ["erik", 28, false];

  enum Job {
    WebDev,
    WebDesigner,
    PM
  }

  const job: Job = Job.WebDev;

  // any type
  const phone: any = "Pixel";
  const tablet: any = 3;

  //Functions in Typescript. Parameter types and return types
  const sayWord = (word: string): string => {
    return word;
  };

  sayWord("Scott");

  //Functions in Typescript. Parameter types and return types
  // ? for optional params
  // const sayWordOptional = (word?: string): string => {
  //   console.log(word);
  //   return word;
  // };

  // sayWordOptional("Scott");

  // Default params
  const sayDefault = (word = "Hello", ...otherStuff: string[]): string => {
    return word;
  };

  // Implicit types
  let newName: string = "Erik";
  newName = "Wes";
  // newName = 10;

  // Union Types with |
  let nameTwo: string | boolean = "Erik";
  nameTwo = false;

  const makeMargin = (x: string | number): string => {
    return `margin: ${x}px`;
  };

  makeMargin(10);
  makeMargin("Scott");
  // makeMargin(false); // error

  // Null Types
  let dog: string;
  dog = "Lucie";
  dog = null;
  dog = undefined;
 

  // Interfaces
  interface Person {
    name: string;
    age?: number; // ? Optional param
  }

  const sayAName = ({ name, age }: Person): string => {
    return name;
  };

  // This works too!
  // const sayAName = ({ name, age }: Person): Person => {
  //   console.log(name, age);
  //   return { name, age };
  // };

  sayAName({ name: "Erik", age: 32 });
  sayAName({ age: 32, name: "Erik" });

  return <div>Typescript examples</div>;
};

export default examples;
