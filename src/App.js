import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import { ThemeProvider } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';
import ExcelTranslatorMain from './component/excel-translator/ExcelTranslatorMain';

const theme = unstable_createMuiStrictModeTheme();

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Routes>
            {/* 엑셀 변환기 */}
            {/* <Route path="/excel-translator" exact element={<ExcelTranslatorMain />}></Route> */}
            {/* <Route path="/excel-translator" exact component={ExcelTranslatorMain}></Route> */}
            <Route path="" exact element={<ExcelTranslatorMain />} />
          </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
