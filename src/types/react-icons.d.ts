/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "react-icons" {
  import * as React from "react";
  export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
  }
  export type IconType = React.ComponentType<IconBaseProps>;
  const content: IconType;
  export default content;
}

declare module "react-icons/lib" {
  import * as React from "react";
  export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
    children?: React.ReactNode;
    size?: string | number;
    color?: string;
    title?: string;
  }
  export type IconType = React.ComponentType<IconBaseProps>;
  const content: IconType;
  export default content;
}

declare module "react-icons/*";
