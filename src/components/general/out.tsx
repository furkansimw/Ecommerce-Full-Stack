import React from "react";
import OutsideClickHandler from "react-outside-click-handler";

type Props = {
  children: React.ReactNode;
  tap: () => void;
};

function Out({ children, tap }: Props) {
  return <OutsideClickHandler children={children} onOutsideClick={tap} />;
}

export default Out;
