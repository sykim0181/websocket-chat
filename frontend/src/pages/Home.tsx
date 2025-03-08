import { Button } from "@mui/material";
import { Link } from "react-router";

const Home = () => {
  return (
    <main>
      <Button>
        <Link to="/rooms">시작하기</Link>
      </Button>
    </main>
  );
};

export default Home;
