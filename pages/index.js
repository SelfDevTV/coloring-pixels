import GameCanvas from "../components/GameCanvas";
import { useEffect, useState } from "react";
import supabaseClient from "../config/supabase";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      try {
        const { data, error, status } = await supabaseClient
          .from("pixelboard")
          .select();

        setBoards(data);

        console.log("data is: ", data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  if (loading) return <p>Loading..</p>;

  return (
    <div>
      <h1>Coloring Pixels</h1>

      <GameCanvas pixelBoard={boards[0]} />
    </div>
  );
}
