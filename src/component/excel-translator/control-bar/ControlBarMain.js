import { useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';
import CreateTranslatorHeaderTitleComponent from "../modal/CreateTranslatorHeaderTitleComponent";
import ExcelTranslatorCommonModal from "../modal/ExcelTranslatorCommonModal";
import ModifyTranslatorHeaderTitleComponent from "../modal/ModifyTranslatorHeaderTitleComponent";
import ControlBarBody from "./ControlBarBody";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { excelTranslatorDataConnect } from "../../../data-connect/excelTranslatorDataConnect";

class ExcelTranslatorHeader {
    constructor() {
        this.id = uuidv4();
        this.uploadHeaderTitle = '';
        this.downloadHeaderTitle = '';
        this.uploadHeaderDetail = {
            details: []
        };
        this.downloadHeaderDetail = {
            details: []
        };
        this.rowStartNumber = 0;
    }

    toJSON() {
        return {
            id: this.id,
            uploadHeaderTitle: this.uploadHeaderTitle,
            downloadHeaderTitle: this.downloadHeaderTitle,
            uploadHeaderDetail: this.uploadHeaderDetail,
            downloadHeaderDetail: this.downloadHeaderDetail,
            rowStartNumber: this.rowStartNumber
        }
    }
}

const initialExcelTitle = null;

const excelTitleInfoReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'SET_DATA':
            return {
                ...state,
                [action.payload.name]: action.payload.value
            }
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

export default function ControlBarMain(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const query = queryString.parse(location.search)

    const [excelTitleInfo, dispatchExcelTitleInfo] = useReducer(excelTitleInfoReducer, initialExcelTitle);
    const [selectedHeader, setSelectedHeader] = useState(null);
    const [createHeaderModalOpen, setCreateHeaderModalOpen] = useState(false);
    const [modifyHeaderModalOpen, setModifyHeaderModalOpen] = useState(false);

    useEffect(() => {
        function initSelectedHeader() {
            let headerTitleState = props.excelTranslatorHeaderList.find(r => r.id === query.headerId);
            setSelectedHeader(headerTitleState)
        }

        if (!props.excelTranslatorHeaderList) {
            return;
        }
        
        if(!query.headerId) {
            setSelectedHeader(null);
            return;
        }

        initSelectedHeader();
    }, [query.headerId, props.excelTranslatorHeaderList]);


    const onCreateHeaderModalOpen = () => {
        setCreateHeaderModalOpen(true);
        dispatchExcelTitleInfo({
            type: 'CLEAR'
        })
    }

    const onCreateUploadExcelHeaderModalClose = () => {
        setCreateHeaderModalOpen(false);
    }

    const onModifyHeaderModalOpen = () => {
        if(!selectedHeader){
            alert('엑셀 형식을 먼저 선택해주세요.');
            return;
        }

        setModifyHeaderModalOpen(true);

        dispatchExcelTitleInfo({
            type: 'INIT_DATA',
            payload: {
                downloadHeaderTitle: selectedHeader.downloadHeaderTitle,
                uploadHeaderTitle: selectedHeader.uploadHeaderTitle,
                rowStartNumber: selectedHeader.rowStartNumber
            }
        });
    }

    const onModifyUploadExcelHeaderModalClose = () => {
        setModifyHeaderModalOpen(false);
    }

    const onChangeInputValue = (e) => {
        dispatchExcelTitleInfo({
            type: 'SET_DATA',
            payload: {
                name: e.target.name,
                value: e.target.value
            }
        });
    }

    const handleCreateTranslatorTitle = async (e) => {
        e.preventDefault();

        // 엑셀 타이틀 정보 설정 (업로드 타이틀, 다운로드 타이틀, 데이터 시작 행)
        let excelHeader = new ExcelTranslatorHeader().toJSON();
        excelHeader = {
            ...excelHeader,
            uploadHeaderTitle: excelTitleInfo.uploadHeaderTitle,
            downloadHeaderTitle: excelTitleInfo.downloadHeaderTitle,
            rowStartNumber: excelTitleInfo.rowStartNumber
        }
        
        await __dataConnectControl().createTranslatorForm(excelHeader);
        await props.__searchTranslatorHeaderList();

        // 새로 생성된 타이틀 형식이 선택되도록 설정.
        query.headerId = excelHeader.id

        navigate({
            pathname: location.pathname,
            search: `?${createSearchParams({...query})}`,
        }, {
            replace: true
        })
        
        onCreateUploadExcelHeaderModalClose();
    }

    const handleModifyTranslatorTitle = async (e) => {
        e.preventDefault();

        // 엑셀 타이틀 정보 설정 (업로드 타이틀, 다운로드 타이틀, 데이터 시작 행)
        let excelHeader = new ExcelTranslatorHeader().toJSON();
        excelHeader = {
            ...excelHeader,
            id: selectedHeader.id,
            uploadHeaderTitle: excelTitleInfo.uploadHeaderTitle,
            downloadHeaderTitle: excelTitleInfo.downloadHeaderTitle,
            rowStartNumber: excelTitleInfo.rowStartNumber
        }

        await __dataConnectControl().modifyTranslatorHeader(excelHeader);
        await props.__searchTranslatorHeaderList();
        onModifyUploadExcelHeaderModalClose();
    }

    const handleChangeSelectedHeader = (e) => {
        e.preventDefault();

        let selectedHeaderId = props.excelTranslatorHeaderList.find(r => r.id === e.target.value).id;
        query.headerId = selectedHeaderId

        navigate({
            pathname: location.pathname,
            search: `?${createSearchParams({...query})}`,
        }, {
            replace: true
        })
    }

    const handleDeleteTranslatorForm = async (e) => {
        e.preventDefault();

        if (!selectedHeader) {
            alert('삭제하려는 엑셀 형식을 먼저 선택해주세요.');
            return;
        }

        if (!window.confirm('정말 삭제하시겠습니까?')) {
            return;
        }

        await __dataConnectControl().deleteTranslatorHeader(selectedHeader.id);
        await props.__searchTranslatorHeaderList();

        delete query.headerId
        
        navigate({
            pathname: location.pathname,
            search: `?${createSearchParams({ ...query })}`,
        }, {
            replace: true
        })
    }

    const handleUploadExcelFile = async (e) => {
        e.preventDefault();

        // 헤더 타이틀을 선택하지 않은 경우
        if (!selectedHeader) {
            alert('헤더 형식을 먼저 선택해주세요.');
            return;
        }

        if (!(selectedHeader.uploadHeaderDetail.details.length > 0)) {
            alert('업로드 엑셀 양식을 먼저 설정해주세요.')
            return;
        }

        // 파일을 선택하지 않은 경우
        if (e.target.files.length === 0) return;

        let addFiles = e.target.files;

        var uploadedFormData = new FormData();
        uploadedFormData.append('file', addFiles[0]);
        uploadedFormData.append(
            "dto",
            new Blob([JSON.stringify(selectedHeader)], { type: "application/json" })
        );

        await props.handleUploadExcelData(uploadedFormData);
    }

    const handleDownloadTranslatedFile = async (e) => {
        e.preventDefault();

        if (!props.uploadedExcelData) {
            alert('엑셀 파일을 먼저 업로드 해주세요.');
            return;
        } else if (!(selectedHeader.uploadHeaderDetail.details.length > 0)) {
            alert('업로드 엑셀 양식을 설정해주세요.');
            return;
        } else if (!(selectedHeader.downloadHeaderDetail.details.length > 0)) {
            alert('다운로드 엑셀 양식을 설정해주세요.');
            return;
        }

        await props.handleDownloadTranslatedExcelFile(selectedHeader.downloadHeaderDetail.details);
    }

    const __dataConnectControl = () => {
        return {
            createTranslatorForm: async function (headerTitle) {
                await excelTranslatorDataConnect().createOne(headerTitle)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            alert('저장되었습니다.');
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.data?.message);
                    });
            },
            modifyTranslatorHeader: async function (headerTitle) {
                await excelTranslatorDataConnect().putOne(headerTitle)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            alert('수정되었습니다.');
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.data?.message);
                    });
            },
            deleteTranslatorHeader: async function (headerId) {
                await excelTranslatorDataConnect().deleteOne(headerId)
                    .then(res => {
                        if (res.status === 200 && res.data && res.data.message === 'success') {
                            alert('삭제되었습니다.');
                        }
                    })
                    .catch(err => {
                        let res = err.response;
                        alert(res?.data?.message);
                    });
            },
        }
    }

    return (
        <>
            <ControlBarBody
                excelTranslatorHeaderList={props.excelTranslatorHeaderList}
                selectedHeader={selectedHeader}
                
                handleChangeSelectedHeader={handleChangeSelectedHeader}
                handleDeleteTranslatorForm={handleDeleteTranslatorForm}
                handleUploadExcelFile={handleUploadExcelFile}
                handleDownloadTranslatedFile={handleDownloadTranslatedFile}
                onCreateHeaderModalOpen={onCreateHeaderModalOpen}
                onModifyHeaderModalOpen={onModifyHeaderModalOpen}
            />

            {/* Create Header Title Modal */}
            <ExcelTranslatorCommonModal
                open={createHeaderModalOpen}
                onClose={() => onCreateUploadExcelHeaderModalClose()}
                maxWidth={'xs'}
                fullWidth={true}
            >
                <CreateTranslatorHeaderTitleComponent
                    excelTitleInfo={excelTitleInfo}

                    onChangeInputValue={onChangeInputValue}
                    handleCreateTranslatorTitle={handleCreateTranslatorTitle}
                ></CreateTranslatorHeaderTitleComponent>
            </ExcelTranslatorCommonModal>

            {/* Modify Header Title Modal */}
            <ExcelTranslatorCommonModal
                open={modifyHeaderModalOpen}
                onClose={() => onModifyUploadExcelHeaderModalClose()}
                maxWidth={'xs'}
                fullWidth={true}
            >
                <ModifyTranslatorHeaderTitleComponent
                    excelTitleInfo={excelTitleInfo}

                    onChangeInputValue={onChangeInputValue}
                    handleModifyTranslatorTitle={handleModifyTranslatorTitle}
                ></ModifyTranslatorHeaderTitleComponent>
            </ExcelTranslatorCommonModal>
        </>
    )
}
