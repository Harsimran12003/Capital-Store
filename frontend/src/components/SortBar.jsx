import React from "react";
import SortDropdown from "./SortDropdown";

export default function SortBar({ setSort , mobile }) {
  return (
    <div className={`w-full ${mobile ? "text-sm" : "text-base"} `}>
      <SortDropdown setSort={setSort} />
    </div>
  );
}
