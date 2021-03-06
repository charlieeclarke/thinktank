import React, { useMemo, useState } from "react";
import { useNavigate} from 'react-router-dom';
import HeadingHome from "../components/banner";
import { TextInput } from "../components/input";
import { Alert } from "../components/alert";
import { db } from "../firebase/firebase";
import { Center, Spinner, Box, Button, Text } from "@chakra-ui/react";
import { Copylink } from "../components/copylink";

const Home = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState({ isLoading: false, id: null});
  
  const handleCreateThinkTank = async () => {
    // if the question length exists, we don't create a document
    // and may want to show an error or disable the button
    if (!question.length) {
      console.log("no question!");
      return;
    }

    setResponse({ isLoading: true, id: null });
    // otherwise, create a new document in the ThinkTanks collection
    // then set the document id to state so we can identify the ThinkTank
    await db
      .collection("ThinkTanks")
      .add({
        question,
      })
      .then((data) => {
        console.log(`woooo new document created with id ${data.id}`);
        setResponse({ isLoading: false, id: data.id });
      });
  };

  const navigate = useNavigate();
  const answerPage = () => {
    navigate(`/${response.id}`)
  }


  const renderPage = useMemo(() => {
    if (!response.id && !response.isLoading) {
      return (
        <>
          <TextInput
            question={question}
            setQuestion={setQuestion}
            onClick={handleCreateThinkTank}
          />
          <Alert />
        </>
      );
    } else if (!response.id && response.isLoading) {
      return (
        <Center p="50">
          <Spinner
            thickness="4px"
            speed="1s"
            emptyColor="gray.200"
            color="teal"
            size="lg"
          />
        </Center>
      );
    } else {
      return (
        <Box h="60%">
          <Center>
            <Box paddingTop={10} maxWidth={300}>
              <Text color='gray.700' textAlign='center' noOfLines={2}>Project setup complete! Share the below to continue.</Text>
              <Copylink />
            </Box>
            <Box pos="fixed" bottom="25%">
              <Button
                bgColor="gray.700"
                color="white"
                variant="solid"
                size="lg"
                onClick={answerPage}
              >
                Continue
              </Button>
            </Box>
          </Center>
        </Box>
      );
    }
  }, [question, response.id, response.isLoading]);

  return (
    <>
     <Box pt={10}>
      <HeadingHome />
      {renderPage}
      </Box>
    </>
    
  );
};

export default Home;
