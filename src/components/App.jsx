import { Box, Button, HStack, Text, Textarea } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import History from "./History";
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const generateAnswer = async (prompt) => {
  const promptNew =
    "Act as a LinkedIn professional post generator. I will provide you a post, you need to elaborate in such a way that it must sound simple,professional,intresting and should contain various hashtags related to topic.The length of the output should not be more than 30 lines. Make it look like it is composed by a human and not by an AI. Don't use common patterns like 'Exciting News' or 'I am thrilled to announce' like these formats. Give a bit of build up for the post. Below is the post that you need to elaborate.\n" +
    prompt;
  const result = await model.generateContent(promptNew);
  const response = result.response;
  const text = response.text();
  console.log(text);
  return text;
};

const App = () => {
  const [inputPost, setInputPost] = useState("");
  const [copiedOutput, setCopiedOutput] = useState("");
  // const [inputLength, setInputLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const currRef = useRef();
  const toast = useToast();
  const id = "test-toast";

  let outputGenerated;

  useEffect(() => {
    if (!localStorage.getItem("history")) {
      localStorage.setItem("history", "[]");
    }
  }, []);

  function renderHistoryData(query, answer) {
    setInputPost(query);
    document.getElementById("input").value = query;
    document.getElementById("textArea").value = answer;
  }

  function preventDuplicateToast() {
    if (toast.isActive(id)) {
      return;
    }
    toast({
      position: ["top"],
      title: "Copied to clipboard",
      variant: "subtle",
      status: "info",
      duration: 1000,
      isClosable: false,
      id,
    });

    console.log(copiedOutput);
    navigator.clipboard.writeText(copiedOutput);
  }

  function saveInput() {
    // localStorage.setItem("history", copiedOutput);
    let data = JSON.parse(localStorage.getItem("history"));
    data.push({ inputPost, outputGenerated });
    localStorage.setItem("history", JSON.stringify(data));
  }
  // saveInput();

  async function getReq() {
    if (!inputPost) {
      return;
    }
    setLoading(true);

    try {
      const response = await generateAnswer(inputPost);
      let n = response.length;
      console.log(n);
      setCopiedOutput(response);
      outputGenerated = response;
      currRef.current.value = response;
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    saveInput();
  }

  return (
    <Box
      w={"100vw"}
      minH={"100vh"}
      bgGradient={"linear-gradient(to right, #F0FCFE, #ffffff)"}
      pl={{ lg: "12rem", md: "8rem", sm: "5rem" }}
      pr={{ lg: "12rem", md: "8rem", sm: "5rem" }}
      className="mainDiv"
    >
      {/* Navbar Section */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        pt={"0.5rem"}
      >
        <Box cursor={"pointer"}>
          <Text fontSize={"1.8rem"} fontWeight={"900"} color={"#0077CF"}>
            <i>LinkPost</i>
          </Text>
        </Box>
        <Box
          bgColor={"#000"}
          p={"0.3rem"}
          pl={"1.3rem"}
          pr={"1.3rem"}
          borderRadius={"1rem"}
          cursor={"pointer"}
        >
          <Text fontSize={"1.1rem"} color={"#fff"}>
            <a
              //href="https://github.com/amit-077?tab=repositories"
              //target="_blank"
            >
              GitHub
            </a>
          </Text>
        </Box>
      </Box>
      {/* Middle Section */}
      <Box textAlign={"center"} mt={"1rem"}>
        <Box>
          <Text
            fontSize={"2.5rem"}
            fontWeight={"900"}
            color={"#000"}
            fontFamily={" Poppins, sans-serif"}
          >
            LinkedIn Post Generator
          </Text>
        </Box>
        <Box>
          <Text color={"#707375"} mt={"0.5rem"} fontSize={"1.1rem"}>
            <p>Generate LinkedIn Post within seconds</p>
          </Text>
        </Box>
      </Box>
      {/* Input - Output section */}
      <Box mt={"2.5rem"}>
        <HStack spacing={"2.5rem"} wrap={"wrap"} justifyContent={"center"}>
          <Box
            w={"20rem"}
            color={"#000"}
            bgColor={"#fff"}
            p={"1rem"}
            borderRadius={"0.5rem"}
            position={"relative"}
          >
            <Box>
              <Text fontSize={"1.4rem"} fontWeight={"600"}>
                Topic
              </Text>
            </Box>
            <Box>
              <Text color={"#707375"}>Write your post here</Text>
            </Box>
            <Box mt={"0.5rem"} mb={"0.3rem"} position={"relative"}>
              <Text fontSize={"0.87rem"} position={"absolute"} right={"0.5rem"}>
                {inputPost.length > 0 ? inputPost.length : "0"}/400
              </Text>
            </Box>
            <Box mt={"2rem"}>
              <Textarea
                id="input"
                rows={"20"}
                resize={"none"}
                maxLength={400}
                value={inputPost}
                onChange={(e) => {
                  setInputPost(e.target.value);
                }}
              />
            </Box>
            <Box mt={"1rem"}>
              <Button
                w={"100%"}
                colorScheme="blue"
                onClick={getReq}
                isLoading={loading}
              >
                Generate
              </Button>
            </Box>
          </Box>
          {/* Right side box */}
          <Box
            w={"33rem"}
            color={"#000"}
            bgColor={"#fff"}
            p={"1rem"}
            borderRadius={"0.5rem"}
            position={"relative"}
          >
            <Box>
              <Text fontSize={"1.4rem"} fontWeight={"700"}>
                AI Output
              </Text>
            </Box>
            <Box
              mb={"1rem"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Text color={"#707375"}>Generated output will appear here</Text>
              <Box cursor={"pointer"}>
                <Text
                  mr={"2rem"}
                  fontSize={"1.3rem"}
                  pt={"0.3rem"}
                  pb={"0.3rem"}
                  pl={"0.6rem"}
                  pr={"0.6rem"}
                  borderRadius={"0.5rem"}
                  _hover={{ bgColor: "#eee" }}
                  className="copyIcon"
                  onClick={preventDuplicateToast}
                >
                  <i class="fa-solid fa-copy"></i>
                </Text>
              </Box>
            </Box>
            <Box>
              <Textarea
                resize={"none"}
                h={"33rem"}
                id="textArea"
                ref={currRef}
                textAlign={"justify"}
              ></Textarea>
            </Box>
          </Box>
        </HStack>
        <History renderHistoryData={renderHistoryData} />
      </Box>
    </Box>
  );
};

export default App;
