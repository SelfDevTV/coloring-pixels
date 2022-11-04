import { Box, Heading } from "@chakra-ui/react";
import GameCanvas from "../components/GameCanvas";

const CreatePixelBoard = () => {
  return (
    <Box w="calc(100vw)" h="calc(100vh)" bgColor="orange.400">
      <Heading size="4xl" textAlign="center">
        Create a new Pixel Art
      </Heading>
      <Heading mt={4} opacity={0.7} textAlign="center" size="lg">
        The stage is yours...
      </Heading>

      <GameCanvas />
    </Box>
  );
};

export default CreatePixelBoard;
