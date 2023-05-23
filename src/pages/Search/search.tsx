import { useState } from "react";
import { Container, Box } from "@mui/system";
import { database } from "../../firebase";
import { collection, addDoc, getDoc, doc, where, query, getDocs } from "firebase/firestore"; 
import { TextField, InputBase, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

export const Search = () => {
    const [patientQuery, setPatientQuery] = useState<string>()
    async function searchUser() {
        try {
          const newQ = query(collection(database, "patients"), where("first", "==", patientQuery?.split(' ')[0]), 
          where("last", "==", patientQuery?.split(' ')[1]));
          const querySnapshot = await getDocs(newQ)
          if(querySnapshot.empty) {
            console.log("Patient not found");
          }
          else {
            console.log("Patient found");
          }
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
    return (
        <>
            <Container>
                <Box sx={{width: '50rem', height: '5rem', border: '2px solid', display: 'flex', alignItems: 'center', borderRadius: '16px'}}>
                    <InputBase placeholder="Patient Name..." sx={{ml: 1}} onChange={(e) => {setPatientQuery(e.target.value)}}/>
                    <IconButton type="submit" sx={{ml: "auto", p: 2}} onClick={searchUser}>
                        <SearchIcon />
                    </IconButton>
                </Box>
                <TableContainer component={Paper} style={{marginTop: '1rem'}}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient Name</TableCell>
                        <TableCell align="right">Diagnosis</TableCell>
                        <TableCell align="right">Send Result</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          {patientQuery}
                        </TableCell>
                        <TableCell align="right">
                          {/* Display the diagnosis here */}
                          COVID-19
                        </TableCell>
                        <TableCell align="right">
                          <IconButton type="submit">
                            {/* <SendIcon /> */}
                            Send Result
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
            </Container>
        </>
    )
}