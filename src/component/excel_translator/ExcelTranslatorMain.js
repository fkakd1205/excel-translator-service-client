import { useState, useEffect, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';
import styled from "styled-components";

import { excelTranslatorDataConnect } from '../../data_connect/excelTranslatorDataConnect';
import ExcelTranslatorControlBar from './ExcelTranslatorControlBar';
import ExcelTranslatorDownloadExcelDataBoard from './ExcelTranslatorDownloadExcelDataBoard';
import ExcelTranslatorDownloadDataBoard from './ExcelTranslatorDownloadExcelDataBoard';
import ExcelTranslatorUploadDataBoard from './ExcelTranslatorUploadDataBoard';

const Container = styled.div`
    height: 100vh;
    background-color: #f2f5ff;
`;

class TranslatedData {
    constructor() {
        this.id = uuidv4();
        this.translatedData = {
            details: []
        };
    }

    toJSON() {
        return {
            id: this.id,
            translatedData: this.translatedData,
        }
    }
}

const ExcelTranslatorMain = (props) => {

    const [excelTranslatorHeaderList, setExcelTranslatorHeaderList] = useState(null);
    const [uploadedExcelData, setUploadedExcelData] = useState(null);
    const [isObjectSubmitted, setIsObjectSubmitted] = useState({
        createdHeader: false,
        createdUploadHeader: false,
        createdDownloadHeader: false
    });

    useEffect(() => {
        async function fetchInit() {
            await __handleDataConnect().searchExcelTranslatorHeader();
        }

        fetchInit();
    }, [])

    useEffect(()=>{
        setUploadedExcelData(null);
    },[props.location])

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
            modifyTranslatorHeaderTitle: async function (headerTitle) {
                await excelTranslatorDataConnect().putOne(headerTitle)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            alert('수정되었습니다.');
                            this.searchExcelTranslatorHeader();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.data?.message);
                    });
            },
            deleteTranslatorHeaderTitle: async function (headerId) {
                await excelTranslatorDataConnect().deleteOne(headerId)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            alert('삭제되었습니다.');
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
            },
            createUploadHeaderDetails: async function (uploadHeaderDetails) {
                await excelTranslatorDataConnect().createUploadHeaderDetail(uploadHeaderDetails)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            alert('저장되었습니다.');
                            this.searchExcelTranslatorHeader();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.data?.message);
                    })
            },
            createDownloadHeaderDetails: async function (downloadHeaderDetails) {
                await excelTranslatorDataConnect().createDownloadHeaderDetails(downloadHeaderDetails)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            alert('저장되었습니다.');
                            this.searchExcelTranslatorHeader();
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.data?.message);
                    })
            },
            downloadTranslatedExcelFile: async function (translatedDetail) {
                await excelTranslatorDataConnect().downloadTranslatedExcelFile(translatedDetail)
                    .then(res => {
                        const url = window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
                        const link = document.createElement('a');
                        link.href = url;

                        link.setAttribute('download', '엑셀변환기 다운로드.xlsx');
                        document.body.appendChild(link);
                        link.click();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    }

    const __handleEventControl = () => {
        return {
            translatorHeaderTitle: function () {
                return {
                    submit: async function (headerTitle) {
                        if(!isObjectSubmitted.createdHeader) {
                            setIsObjectSubmitted({
                                ...isObjectSubmitted,
                                createdHeader: true
                            });

                            await __handleDataConnect().createTranslatorHeaderTitle(headerTitle);

                            setIsObjectSubmitted({
                                ...isObjectSubmitted,
                                createdHeader: false
                            });
                        }
                    },
                    modify: async function (headerTitle) {
                        await __handleDataConnect().modifyTranslatorHeaderTitle(headerTitle);
                    },
                    delete: async function (headerId) {
                        await __handleDataConnect().deleteTranslatorHeaderTitle(headerId);
                    }
                }
            },
            uploadExcelData: function () {
                return {
                    submit: async function (uploadedFormData) {
                        if(!isObjectSubmitted.createdUploadHeader) {
                            setIsObjectSubmitted({
                                ...isObjectSubmitted,
                                createdUploadHeader: true
                            });

                            await __handleDataConnect().uploadExcelFile(uploadedFormData);

                            setIsObjectSubmitted({
                                ...isObjectSubmitted,
                                createdUploadHeader: false
                            });
                        }
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
                                if (idx === 0) {
                                    // 다운로드 헤더 이름 설정
                                    let details = {
                                        colData: r.headerName,
                                        cellType: 'String'
                                    }
                                    return details;
                                } else {
                                    // 고정값 컬럼이라면
                                    if (r.targetCellNumber === -1) {
                                        let details = {
                                            colData: r.fixedValue,
                                            cellType: 'String'
                                        };
                                        return details;
                                    } else {
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

                        if(!isObjectSubmitted.createdDownloadHeader) {
                            setIsObjectSubmitted({
                                ...isObjectSubmitted,
                                createdDownloadHeader: true
                            });

                            await __handleDataConnect().downloadTranslatedExcelFile(translatedDetail);

                            setIsObjectSubmitted({
                                ...isObjectSubmitted,
                                createdDownloadHeader: false
                            });
                        }

                    }
                }
            },
            createUploadHeaderDetails: function () {
                return {
                    submit: async function (uploadHeaderDetails) {
                        await __handleDataConnect().createUploadHeaderDetails(uploadHeaderDetails);
                    }
                }
            },
            createDownloadHeaderDetails: function () {
                return {
                    submit: async function (downloadHeaderDetails) {
                        await __handleDataConnect().createDownloadHeaderDetails(downloadHeaderDetails);
                    }
                }
            }
        }
    }

    return (
        <>
            <Container>
                {/* 엑셀 변환기 컨트롤 바 */}
                <ExcelTranslatorControlBar
                    excelTranslatorHeaderList={excelTranslatorHeaderList}
                    uploadedExcelData={uploadedExcelData}

                    createTranslatorHeaderTitleControl={(headerTitle) => __handleEventControl().translatorHeaderTitle().submit(headerTitle)}
                    modifyTranslatorHeaderTitleControl={(headerTitle) => __handleEventControl().translatorHeaderTitle().modify(headerTitle)}
                    deleteTranslatorHeaderTitleControl={(headerId) => __handleEventControl().translatorHeaderTitle().delete(headerId)}
                    uploadExcelFileControl={(uploadedFormData) => __handleEventControl().uploadExcelData().submit(uploadedFormData)}
                    downloadTranslatedExcelFileControl={(downloadHeaderDetail) => __handleEventControl().downloadTranslatedExcelFile().submit(downloadHeaderDetail)}
                    resetUploadExcelFileControl={() => __handleEventControl().uploadExcelData().reset()}
                    changeSelectedHeaderTitleControl={(headerTitle) => __handleEventControl().translatorHeaderTitle().changeSelectedHeaderTitle(headerTitle)}
                ></ExcelTranslatorControlBar>

                {/* 업로드 헤더 및 데이터 보드 */}
                <ExcelTranslatorUploadDataBoard
                    excelTranslatorHeaderList={excelTranslatorHeaderList}
                    uploadedExcelData={uploadedExcelData}

                    createUploadHeaderDetailsControl={(uploadDetails) => __handleEventControl().createUploadHeaderDetails().submit(uploadDetails)}
                ></ExcelTranslatorUploadDataBoard>

                {/* 다운로드 헤더 보드 */}
                <ExcelTranslatorDownloadExcelDataBoard
                    excelTranslatorHeaderList={excelTranslatorHeaderList}

                    createDownloadHeaderDetailsControl={(downloadDetails) => __handleEventControl().createDownloadHeaderDetails().submit(downloadDetails)}
                ></ExcelTranslatorDownloadExcelDataBoard>
            </Container>
        </>
    )
}

export default ExcelTranslatorMain;