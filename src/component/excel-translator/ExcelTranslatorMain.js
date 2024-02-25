import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { excelTranslatorDataConnect } from '../../data-connect/excelTranslatorDataConnect';
import BackdropLoading from '../loading/BackdropLoading';
import { Container } from './styles/Body.styled';
import ControlBarMain from './control-bar/ControlBarMain';
import DownloadContainerMain from './download-container/DownloadContainerMain';
import UploadContainerMain from './upload-container/UploadContainerMain';
import { dateToYYMMDD } from '../../handler/dateHandler';

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

export default function ExcelTranslatorMain(props) {
    const [excelTranslatorHeaderList, setExcelTranslatorHeaderList] = useState(null);
    const [uploadedExcelData, setUploadedExcelData] = useState(null);
    const [backdropLoading, setBackdropLoading] = useState(false);

    useEffect(() => {
        async function fetchInit() {
            await __handleDataConnect().searchExcelTranslatorHeader();
        }

        fetchInit();
    }, [])

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
            createUploadHeaderDetails: async function (uploadHeaderDetails) {
                await excelTranslatorDataConnect().createUploadHeaderDetail(uploadHeaderDetails)
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
            createDownloadHeaderDetails: async function (downloadHeaderDetails) {
                await excelTranslatorDataConnect().createDownloadHeaderDetails(downloadHeaderDetails)
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
            downloadTranslatedExcelFile: async function (translatedDetails) {
                await excelTranslatorDataConnect().downloadTranslatedExcelFile(translatedDetails)
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
            },
            downloadUploadedHeaderDetails: async function (titleData, uploadedDetails) {
                let date = new Date()
                let fileName = `[${dateToYYMMDD(date)}]${titleData.uploadHeaderTitle}_${titleData.downloadHeaderTitle}`

                await excelTranslatorDataConnect().downloadUploadedHeaderDetails(uploadedDetails)
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

    const handleDownloadTranslatedExcelFile = async (downloadHeaderDetail) => {
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

        await __handleDataConnect().downloadTranslatedExcelFile(translatedDetail);
    }

    const handleCreateUploadForm = async (uploadHeaderDetails) => {
        setBackdropLoading(true);
        await __handleDataConnect().createUploadHeaderDetails(uploadHeaderDetails);
        await __handleDataConnect().searchExcelTranslatorHeader();
        setBackdropLoading(false);
    }

    const handleDownloadForUploadForm = async (titleData, uploadHeaderDetails) => {
        setBackdropLoading(true);
        await __handleDataConnect().downloadUploadedHeaderDetails(titleData,uploadHeaderDetails);
        await __handleDataConnect().searchExcelTranslatorHeader();
        setBackdropLoading(false);
    }

    const handleCreateDownloadForm = async (downloadHeaderDetails) => {
        setBackdropLoading(true);
        await __handleDataConnect().createDownloadHeaderDetails(downloadHeaderDetails);
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

                {/* 업로드 헤더 및 데이터 보드 */}
                <UploadContainerMain
                    excelTranslatorHeaderList={excelTranslatorHeaderList}
                    uploadedExcelData={uploadedExcelData}

                    handleCreateUploadForm={handleCreateUploadForm}
                    handleDownloadForUploadForm={handleDownloadForUploadForm}
                />

                {/* 다운로드 헤더 보드 */}
                <DownloadContainerMain
                    excelTranslatorHeaderList={excelTranslatorHeaderList}

                    handleCreateDownloadForm={handleCreateDownloadForm}
                />
            </Container>

            {/* Backdrop */}
            <BackdropLoading open={backdropLoading} />
        </>
    )
}
