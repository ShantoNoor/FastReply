import { ModeToggle } from "./ui/mode-toggle";
import NavButton from "./NavButton";
import {
  BotMessageSquare,
  Brain,
  ListPlus,
  ListRestart,
  TextSearch,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useData from "@/hooks/useData";

const Sidebar = () => {
  const { reload } = useData();
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col items-center h-full">
        <div className="flex-1 flex flex-col gap-1 items-center">
          <NavButton
            tooltip="Reload Replies"
            onClick={() => {
              setTimeout(() => reload(), 1);
              navigate("/replies");
            }}
          >
            <ListRestart />
          </NavButton>

          <Link to="/replies">
            <NavButton tooltip="All Replies">
              <TextSearch />
            </NavButton>
          </Link>

          <Link to="/add">
            <NavButton tooltip="Add Reply">
              <ListPlus />
            </NavButton>
          </Link>

          <Link to="/">
            <NavButton tooltip="Gemini">
              <Brain />
            </NavButton>
          </Link>

          <Link to="/groq">
            <NavButton tooltip="Groq">
              <BotMessageSquare />
            </NavButton>
          </Link>
        </div>
        <ModeToggle />
      </div>
    </>
  );
};

export default Sidebar;
