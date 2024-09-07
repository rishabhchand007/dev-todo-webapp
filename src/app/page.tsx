"use client";
import { rectSortingStrategy } from "@dnd-kit/sortable";
import { MultipleContainers } from "./components/MultipleContainers";
import Board from "./views/Board";
import Navbar from "./views/Navbar";

export default function Page() {
  return (
    <>
      <Navbar />
      <Board />

      <MultipleContainers
        itemCount={5}
        strategy={rectSortingStrategy}
        vertical
      />
    </>
  );
}
