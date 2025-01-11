import React, { useState } from 'react';
import axios from 'axios';
import Header from './elements/header';
import FileUploader from './elements/fileupload'
function App() {
  

  return (
    <>
      <Header/>
      <FileUploader/>
    </>
  );
}

export default App;
