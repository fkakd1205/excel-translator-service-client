import {useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';

import { excelTranslatorDataConnect } from '../../data_connect/excelTranslatorDataConnect';
import ExcelTranslatorControlBar from './ExcelTranslatorControlBar';
import ExcelTranslatorDownloadDataBoard from './ExcelTranslatorDownloadExcelDataBoard';
import ExcelTranslatorUploadDataBoard from './ExcelTranslatorUploadDataBoard';

class TranslatedData {
    constructor() {
        this.id = uuidv4();
        this.translatedData = {
            details : []
        };
    }

    toJSON() {
        return {
            id: this.id,
            translatedData: this.translatedData,
        }
    }
}

const ExcelTranslatorMain = () => {
    const [excelTranslatorHeaderList, setExcelTranslatorHeaderList] = useState([]);
    const [uploadedExcelData, setUploadedExcelData] = useState(null);

    useEffect(() => {
        async function fetchInit() {
            await __handleDataConnect().searchExcelTranslatorHeader();
        }

        fetchInit();
    }, [])

    const __handleDataConnect = () => {
        return {
            searchExcelTranslatorHeader: async function () {
                await excelTranslatorDataConnect().searchList()
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            setExcelTranslatorHeaderList(res.data.data);
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.data?.message);
                    });
            },
            createTranslatorHeaderTitle: async function (headerTitle) {
                await excelTranslatorDataConnect().postOne(headerTitle)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            alert('저장되었습니다.');
                            this.searchExcelTranslatorHeader();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.data?.message);
                    });
            },
            uploadExcelFile: async function (uploadedFormData) {
                await excelTranslatorDataConnect().postFile(uploadedFormData)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            setUploadedExcelData(res.data.data);
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.data?.message);
                    })
            }
        }
    }

    const __handleEventControl = () => {
        return {
            translatorHeaderTitle: function () {
                return {
                    submit: async function (headerTitle) {
                        await __handleDataConnect().createTranslatorHeaderTitle(headerTitle);
                    }
                }
            },
            uploadExcelData: function () {
                return {
                    submit: async function (uploadedFormData) {
                        await __handleDataConnect().uploadExcelFile(uploadedFormData);
                    },
                    reset: function () {
                        setUploadedExcelData(null);
                    }
                }
            },
            downloadTranslatedExcelFile: function () {
                return {
                    submit: async function (downloadHeaderDetail) {
                        // 다운로드 양식으로 변경
                        let excelData = downloadHeaderDetail.map(r => {
                            return uploadedExcelData.map((data, idx) => {
                                if(idx === 0) {
                                    // 다운로드 헤더 이름 설정
                                    let details = {
                                        colData: r.headerName,
                                        cellType: 'String'
                                    }
                                    return details;
                                }else{
                                    // 고정값 컬럼이라면
                                    if(r.targetCellNumber === -1) {
                                        let details = {
                                            colData: r.fixedValue,
                                            cellType: 'String'
                                        };
                                        return details;
                                    }else {
                                        return data.uploadedData.details[r.targetCellNumber];
                                    }
                                }
                            });
                        });

                        // dto로 변경
                        let translatedDetail = excelData.map(r => {
                            let data = new TranslatedData().toJSON();
                            data.translatedData.details = r;
                            return data;
                        })

                        await __handleDataConnect().downloadTranslatedExcelFile(translatedDetail);
                    }
                }
            }
        }
    }

    return (
        <>
            {/* 엑셀 변환기 컨트롤 바 */}
            <ExcelTranslatorControlBar
                excelTranslatorHeaderList={excelTranslatorHeaderList}

                createTranslatorHeaderTitleControl={(headerTitle) => __handleEventControl().translatorHeaderTitle().submit(headerTitle)}
                uploadExcelFileControl={(uploadedFormData) => __handleEventControl().uploadExcelData().submit(uploadedFormData)}
                downloadTranslatedExcelFileControl={(downloadHeaderDetail) => __handleEventControl().downloadTranslatedExcelFile().submit(downloadHeaderDetail)}
                resetUploadExcelFileControl={() => __handleEventControl().uploadExcelData().reset()}
            ></ExcelTranslatorControlBar>

            {/* 업로드 헤더 및 데이터 보드 */}
            <ExcelTranslatorUploadDataBoard
                
            ></ExcelTranslatorUploadDataBoard>

            {/* 다운로드 헤더 보드 */}
            <ExcelTranslatorDownloadDataBoard
            
            ></ExcelTranslatorDownloadDataBoard>
        </>
    )
}

export default ExcelTranslatorMain;