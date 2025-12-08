import React from "react";
import SortDropdown from "./SortDropdown";

export default function SortBar({ setSort }) {
  return (
    <div className="flex justify-end mb-6">
      <SortDropdown setSort={setSort} />
    </div>
  );
}
