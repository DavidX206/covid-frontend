import { useState, useEffect, useContext } from 'react'
import { database } from '../../firebase';
import { collection, addDoc, getDoc, doc, where, query, getDocs } from "firebase/firestore"; 
import axios from 'axios'
import { Button, Grid, Input, Paper } from '@mui/material';
import { flexbox } from '@mui/system';
import { ArrowForward } from "@mui/icons-material";
import SearchContext from '../../../context';


const Diagnose = () => {
    const [prediction, setPrediction] = useState<any>(null);
    const [imageSrc, setImageSrc] = useState('');
    const [file, setFile] = useState<any>(null)
    const [accuracy, setAccuracy] = useState<any>(null);
    const [xray, setXray] = useState<any>(null)
    const [showPrediction, setShowPrediction] = useState(false);
    const setIsSearch = useContext(SearchContext)
  
    const handleFormSubmit: any = (event: Event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append('file', file);
      console.log(formData)
      axios.post('http://192.168.240.193:5000/diagnose', formData, { responseType: 'json' })
        .then(res => {
          const base64ImageData = res.data.image_data
          const binaryImageData = atob(base64ImageData);
  
          // Create a typed array from the binary string
          const bytes = new Uint8Array(binaryImageData.length);
          for (let i = 0; i < binaryImageData.length; i++) {
            bytes[i] = binaryImageData.charCodeAt(i);
          }
  
          // Create a Blob object from the typed array
          const blob = new Blob([bytes], { type: 'image/png' });
          const imageUrl = URL.createObjectURL(blob);
          setImageSrc(imageUrl);
          setPrediction(res.data.pred);
          setAccuracy(res.data.accuracy*100)
          setShowPrediction(true)
        })
        .catch(err => {
          console.error(err.response.data);
        });
    }
  
    // useEffect(() => {
    //   // axios.get('https://dryleaves.pythonanywhere.com/data')
    //   axios.get('http://10.0.24.173:5000/data')
    //     .then(res => {
    //       setPrediction(res.data.pred);
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     });
    // }, []);
  
    async function addUser() {
      try {
        const newQ = query(collection(database, "users"), where("first", "==", "Ada"));
        const querySnapshot = await getDocs(newQ)
        if(querySnapshot.empty) {
          const docRef = await addDoc(collection(database, "users"), {
            first: "Ada",
            last: "Lovelace",
            born: 1815
          });
          console.log("Document written with ID: ", docRef.id);
        }
        else {
          console.log("Data already present in the database");
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
    
    const displayResult = (pred: string) => {
        console.log(prediction);
        switch(pred) {
          case 'COVID-19':
            return 'The patient has COVID-19';
            break;
          case 'Non-COVID Disease':
            return 'The patient is infected with some other disease, possibly pneumonia';
            break;
          case 'Normal':
            return 'The patient is COVID-19 negative';
            break;
        }
    }
  
    const refresh = () => {
      // Set showPrediction to false to hide the prediction and accuracy
      setShowPrediction(false);
    };
  
   
    return (
      <>
        <form action="">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Input 
                type='file'
                fullWidth
                onChange={(event) => {
                  console.log((event.target as HTMLInputElement)?.files?.[0])
                  setFile((event.target as HTMLInputElement)?.files?.[0]);
                }}
                onClick = {refresh}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                onClick={handleFormSubmit}
              >
                Diagnose
              </Button>
            </Grid>
          </Grid>
        </form>
        {showPrediction && <div className='container' style={{display: 'flex', alignItems: 'center', marginTop: '1rem'}}>
          {<img src={URL.createObjectURL(file)} alt=""  style={{width: '300px', height: '300px'}}/>}
          {<ArrowForward/>}
          {<img src={imageSrc} alt="Grad-CAM" style={{width: '300px', height: '300px'}}/>}
        </div>}
        
        {showPrediction && <Paper sx={{marginTop: '1rem', height: '10rem', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <h3>{prediction && displayResult(prediction)}</h3>
          <h3>Accuracy: {accuracy}</h3>
        </Paper>}
  
        {showPrediction && <Button
                variant='contained'
                color='primary'
                style={{width: '50%', marginTop: '1rem'}}
                onClick={() => setIsSearch(true)}
              >
                Search Patient
              </Button>} 
        {/* <Search/> */}
      </>
    )
  }
  
  export default Diagnose