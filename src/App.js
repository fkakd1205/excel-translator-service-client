import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import { ThemeProvider } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme } from '@material-ui/core/styles';
import ExcelTranslatorMain from './component/excel_translator/ExcelTranslatorMain';

const theme = unstable_createMuiStrictModeTheme();

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
          {/* 엑셀 변환기 */}
            {/* <Route path="/excel-translator" exact element={<ExcelTranslatorMain />}></Route> */}
            <Route path="/excel-translator" exact component={ExcelTranslatorMain}></Route>
      </ThemeProvider>
    </Router>
  );
}

export default App;
