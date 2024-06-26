import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { excelTranslatorDataConnect } from '../../data-connect/excelTranslatorDataConnect';
import BackdropLoading from '../loading/BackdropLoading';
import { Container } from './styles/Body.styled';
import ControlBarMain from './control-bar/ControlBarMain';
import UploadContainerMain from './upload-container/UploadContainerMain';
import DownloadContainerMain from './download-container/DownloadContainerMain';
import { dateToYYMMDD } from '../../handler/dateHandler';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import ControlBarMainV2 from './control-bar-v2/ControlBarMain';

export default function ExcelTranslatorMain(props) {
    const location = useLocation();
    const query = queryString.parse(location.search);

    const [excelTranslatorHeaderList, setExcelTranslatorHeaderList] = useState(null);
    const [uploadedExcelData, setUploadedExcelData] = useState(null);
    const [backdropLoading, setBackdropLoading] = useState(false);
    const [selectedTranslator, setSelectedTranslator] = useState(null);

    useEffect(() => {
        async function fetchInit() {
            await __handleDataConnect().searchExcelTranslatorHeader();
        }

        fetchInit();
    }, [])

    useEffect(() => {
        if(!excelTranslatorHeaderList) {
            return;
        }

        if(!(query && query.headerId)) {
            return;
        }

        let translator = excelTranslatorHeaderList.find(r => r.id === query.headerId);
        setSelectedTranslator(translator)
    }, [excelTranslatorHeaderList, query])

    useEffect(() => {
        if(!selectedTranslator) {
            return
        }

        setUploadedExcelData(null);
    }, [selectedTranslator])

    const __handleDataConnect = () => {
        return {
            searchExcelTranslatorHeader: async function () {
                await excelTranslatorDataConnect().searchAll()
                    .then(res => {
                        if (res.status === 200) {
                            setExcelTranslatorHeaderList(res?.data?.data);
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.data?.message);
                    });
            },
            uploadExcelFile: async function (uploadedFormData) {
                await excelTranslatorDataConnect().uploadFile(uploadedFormData)
                    .then(res => {
                        if (res.status === 200) {
                            setUploadedExcelData(res?.data?.data);
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.data?.message);
                    })
            },
            updateUploadHeaderDetails: async function (uploadHeaderDetails) {
                await excelTranslatorDataConnect().updateUploadHeaderDetail(selectedTranslator.id, uploadHeaderDetails)
                    .then(res => {
                        if (res.status === 200) {
                            alert('완료되었습니다.');
                            setUploadedExcelData(null);
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.data?.message);
                    })
            },
            updateDownloadHeaderDetails: async function (downloadHeaderDetails) {
                await excelTranslatorDataConnect().updateDownloadHeaderDetails(selectedTranslator.id, downloadHeaderDetails)
                    .then(res => {
                        if (res.status === 200) {
                            alert('저장되었습니다.');
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.data?.message);
                    })
            },
            downloadTranslatedExcelFile: async function (uploadedData) {
                let date = new Date()
                let fileName = `[${dateToYYMMDD(date)}]${selectedTranslator.uploadHeaderTitle}_${selectedTranslator.downloadHeaderTitle}`

                await excelTranslatorDataConnect().downloadTranslatedExcelFile(selectedTranslator.id, uploadedData)
                    .then(res => {
                        const url = window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
                        const link = document.createElement('a');
                        link.href = url;

                        link.setAttribute('download', `${fileName}.xlsx`);
                        document.body.appendChild(link);
                        link.click();
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            downloadUploadedHeaderDetails: async function () {
                let date = new Date()
                let fileName = `[${dateToYYMMDD(date)}]${selectedTranslator.uploadHeaderTitle}_양식_샘플`

                await excelTranslatorDataConnect().downloadUploadedHeaderDetails(selectedTranslator.id)
                    .then(res => {
                        const url = window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));
                        const link = document.createElement('a');
                        link.href = url;

                        link.setAttribute('download',  `${fileName}.xlsx`);
                        document.body.appendChild(link);
                        link.click();
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
    }

    const handleUploadExcelData = async (data) => {
        setBackdropLoading(true);
        await __handleDataConnect().uploadExcelFile(data);
        setBackdropLoading(false);   
    }

    const handleDownloadTranslatedExcelFile = async () => {
        await __handleDataConnect().downloadTranslatedExcelFile(uploadedExcelData);
    }

    const handleUpdateUploadForm = async (uploadHeaderDetails) => {
        setBackdropLoading(true);
        await __handleDataConnect().updateUploadHeaderDetails(uploadHeaderDetails);
        await __handleDataConnect().searchExcelTranslatorHeader();
        setBackdropLoading(false);
    }

    const handleDownloadForUploadForm = async () => {
        setBackdropLoading(true);
        await __handleDataConnect().downloadUploadedHeaderDetails();
        await __handleDataConnect().searchExcelTranslatorHeader();
        setBackdropLoading(false);
    }

    const handleUpdateDownloadForm = async (downloadHeaderDetails) => {
        setBackdropLoading(true);
        await __handleDataConnect().updateDownloadHeaderDetails(downloadHeaderDetails);
        await __handleDataConnect().searchExcelTranslatorHeader();
        setBackdropLoading(false)
    }

    return (
        <>
            <Container>
                {/* 엑셀 변환기 컨트롤 바 */}
                <ControlBarMain
                    excelTranslatorHeaderList={excelTranslatorHeaderList}
                    uploadedExcelData={uploadedExcelData}

                    handleUploadExcelData={handleUploadExcelData}
                    handleDownloadTranslatedExcelFile={handleDownloadTranslatedExcelFile}

                    __searchTranslatorHeaderList={__handleDataConnect().searchExcelTranslatorHeader}
                />

                {/* 엑셀 변환기 컨트롤 바 V2 - included Poi Test */}
                {/* <ControlBarMainV2
                    excelTranslatorHeaderList={excelTranslatorHeaderList}
                    uploadedExcelData={uploadedExcelData}

                    handleUploadExcelData={handleUploadExcelData}
                    handleDownloadTranslatedExcelFile={handleDownloadTranslatedExcelFile}

                    __searchTranslatorHeaderList={__handleDataConnect().searchExcelTranslatorHeader}
                /> */}

                {/* 업로드 헤더 및 데이터 보드 */}
                <UploadContainerMain
                    excelTranslatorHeaderList={excelTranslatorHeaderList}
                    uploadedExcelData={uploadedExcelData}

                    handleUpdateUploadForm={handleUpdateUploadForm}
                    handleDownloadForUploadForm={handleDownloadForUploadForm}
                />

                {/* 다운로드 헤더 보드 */}
                <DownloadContainerMain
                    excelTranslatorHeaderList={excelTranslatorHeaderList}

                    handleUpdateDownloadForm={handleUpdateDownloadForm}
                />
            </Container>

            {/* Backdrop */}
            <BackdropLoading open={backdropLoading} />
        </>
    )
}
