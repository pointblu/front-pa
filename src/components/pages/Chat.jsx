import React, { useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export const Chat = () => {
  return (
    <div>
      {/* Content Wrapper. Contains page content */}

      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-12">
                <h1
                  className="m-0 App-header focus-in-contract alphi-8"
                  style={{ backgroundColor: "black" }}
                >
                  PQR CHAT
                </h1>
              </div>
            </div>
          </div>
        </div>

        <section className="content products">
          <div className="container-fluid">
            <Box
              position={"absolute"}
              left={"50%"}
              w={{
                base: "100%",
                md: "80%",
                lg: "750px",
              }}
              p={4}
              transform={"translateX(-50%)"}
            >
              <Flex
                gap={4}
                flexDirection={{
                  base: "column",
                  md: "row",
                }}
                maxW={{
                  sm: "400px",
                  md: "full",
                }}
                mx={"auto"}
              >
                <Flex
                  flex={30}
                  gap={2}
                  flexDirection={"column"}
                  maxW={{ sm: "250px", md: "full" }}
                  mx={"auto"}
                >
                  <Text
                    fontWeight={700}
                    color={useColorModeValue("gray.600", "gray.400")}
                  >
                    Tus conversaciones
                  </Text>
                  <form>
                    <Flex alignItems={"center"} gap={2}>
                      <Input placeholder="Search for a use" />
                      <Button size={"sm"}>
                        <SearchIcon />
                      </Button>
                    </Flex>
                  </form>
                </Flex>
                <Flex flex={70}>Mensajes</Flex>
              </Flex>
            </Box>
          </div>
        </section>
      </div>
    </div>
  );
};
