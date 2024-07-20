import { Box, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const History = ({ renderHistoryData }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("history"));
    setHistory(data);
    console.log(data);
  }, [localStorage.getItem("history")]);

  console.log(history);

  function setData(index) {
    renderHistoryData(
      history[index]?.inputPost,
      history[index]?.outputGenerated
    );
  }

  return (
    <Box mt={"3rem"} w={"auto"} pb={"1rem"}>
      <Box bgColor={"#f2f2f2"} pt={"0.7rem"} pb={"0.7rem"} pl={"1rem"}>
        <Text fontSize={"1.1rem"} fontWeight={600}>
          <i class="fa-solid fa-clock-rotate-left"></i> History
        </Text>
      </Box>
      {/* History items */}
      <VStack alignItems={"flex-start"} mt={"1rem"} spacing={"0.5rem"}>
        {history?.map((e, index) => {
          return (
            <Box
              cursor={"pointer"}
              bgColor={"#f7f7f7"}
              borderRadius={'0.5rem'}
              _hover={{ bgColor: "#f1f1f1" }}
              w={"100%"}
              pl={"1rem"}
              pt={"0.5rem"}
              pb={"0.5rem"}
              onClick={(e) => {
                console.log(index);
                setData(index);
              }}
            >
              <Text>
                {e.inputPost.substr(0, 100) +
                  (e.inputPost.length > 100 ? "..." : "")}
              </Text>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default History;
