import { Routes, Route } from "react-router-dom";
import StakeGame from "../pages/StakeGame";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StakeGame />} />
    </Routes>
  );
}
