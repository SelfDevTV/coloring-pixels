import {
  Box,
  Heading,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Tooltip,
  SliderMark,
} from "@chakra-ui/react";

import { useState } from "react";
import GameCanvas from "../components/GameCanvas";

const CreatePixelBoard = () => {
  const [tileSize, setTileSize] = useState(75);
  const [sliderVal, setSliderVal] = useState(25);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSliderChange = (val) => {
    setSliderVal(val);
    setTileSize(Math.round(100 - val));
  };

  const getTileGap = () => {
    if (sliderVal === 25) {
      return 2;
    } else {
      return 3;
    }
  };

  return (
    <Box bgColor="orange.400">
      <Heading size="4xl" textAlign="center">
        Create a new Pixel Art
      </Heading>
      <Heading mt={4} opacity={0.7} textAlign="center" size="lg">
        The stage is yours...
      </Heading>
      <Slider
        aria-label="slider-ex-1"
        defaultValue={sliderVal}
        step={25}
        onChange={handleSliderChange}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderMark value={25} mt="1" ml="-2.5" fontSize="sm">
          Small
        </SliderMark>
        <SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
          Medium
        </SliderMark>
        <SliderMark value={75} mt="1" ml="-2.5" fontSize="sm">
          Large
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>

        <SliderThumb />
      </Slider>

      <GameCanvas tileSize={tileSize} tileGap={getTileGap()} />
    </Box>
  );
};

export default CreatePixelBoard;
