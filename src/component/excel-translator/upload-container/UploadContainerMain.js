import { useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';
import ExcelTranslatorCommonModal from "../modal/ExcelTranslatorCommonModal";
import CreateTranslatorUploadHeaderDetailComponent from "../modal/CreateTranslatorUploadHeaderDetailComponent";
import { useLocation } from "react-router-dom";
import UploadContainerBody from "./UploadContainerBody";

class UploadHeaderDetail {
    constructor() {
        this.id = uuidv4();
        this.cellNumber = -1;
        this.headerName = '';
        this.cellType = '';
    }

    toJSON() {
        return {
            id: this.id,
            cellNumber: this.cellNumber,
            headerName: this.headerName,
            cellType: this.cellType
        }
    }
}

const initialSelectedHeaderTitleState = null;
const initialCreateUploadHeaderDetailState = null;

const selectedHeaderTitleStateReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'SET_UPLOAD_HEADER_DETAIL_DATA':
            return {
                ...state,
                uploadHeaderDetail: {
                    ...state.uploadHeaderDetail,
                    details: action.payload
                }
            }
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

const createUploadHeaderDetailStateReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'SET_UPLOAD_HEADER_DETAIL_DATA':
            return {
                ...state,
                uploadedData: {
                    ...state.uploadedData,
                    details: action.payload
                }
            }
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

export default function UploadContainerMain(props) {
    const location = useLocation()
    let query = queryString.parse(location.search);

    const [createHeaderModalOpen, setCreateHeaderModalOpen] = useState(false);
    const [selectedHeaderTitleState, dispatchSelectedHeaderTitleState] = useReducer(selectedHeaderTitleStateReducer, initialSelectedHeaderTitleState);
    const [createUploadHeaderDetailState, dispatchCreateUploadHeaderDetailState] = useReducer(createUploadHeaderDetailStateReducer, initialCreateUploadHeaderDetailState);
    const [uploadedExcelData, setUploadExcelData] = useState(null);

    useEffect(() => {
        function initHeaderTitleState() {
            let headerId = query.headerId;
            let headerTitleState = props.excelTranslatorHeaderList.find(r => r.id === headerId);

            dispatchSelectedHeaderTitleState({
                type: 'INIT_DATA',
                payload: headerTitleState
            });
        }
        
        if (!props.excelTranslatorHeaderList) {
            return;
        }

        if(!query.headerId) {
            dispatchSelectedHeaderTitleState({
                type: 'CLEAR'
            });
            return;
        }

        initHeaderTitleState();
    }, [query.headerId, props.excelTranslatorHeaderList]);

    useEffect(() => {
        if(!selectedHeaderTitleState) {
            return;
        }
        
        if(!props.uploadedExcelData) {
            return;
        }

        // 헤더 데이터를 제외한 데이터 설정
        let data = props.uploadedExcelData?.filter((r, idx) => idx !== 0)
        setUploadExcelData([...data])
    }, [selectedHeaderTitleState, props.uploadedExcelData]);

    const onCreateHeaderModalOpen = () => {
        // 이미 등록된 헤더 양식이 있는 경우
        if(selectedHeaderTitleState?.uploadHeaderDetail.details.length > 0) {
            let createHeaderData = {
                uploadedData: {
                    details : selectedHeaderTitleState?.uploadHeaderDetail.details
                }
            }

            dispatchCreateUploadHeaderDetailState({
                type: 'INIT_DATA',
                payload: createHeaderData
            });
        }else if(props.uploadedExcelData) {     // 업로드된 엑셀 파일이 있는 경우
            dispatchCreateUploadHeaderDetailState({
                type: 'INIT_DATA',
                payload: props.uploadedExcelData[0]
            });
        }else {     // 새로운 양식을 만들 경우
            let createHeaderData = {
                id: uuidv4(),
                uploadedData : {
                    details : [{
                        id: uuidv4(),
                        headerName: '',
                        cellType: 'String'
                    }]
                }
            }

            dispatchCreateUploadHeaderDetailState({
                type: 'INIT_DATA',
                payload: createHeaderData
            })
        }

        setCreateHeaderModalOpen(true);
    }

    const onCreateHeaderModalClose = () => {
        setCreateHeaderModalOpen(false);
    }

    const handleCreateUploadHeader = async (e) => {
        e.preventDefault();

        let uploadedHeader = createUploadHeaderDetailState.uploadedData;
        let uploadDetails = uploadedHeader.details.map((r, idx) => {
            let data = new UploadHeaderDetail().toJSON();
            data = {
                ...data,
                cellNumber: idx,
                headerName: r.headerName || r.colData,
                cellType: r.cellType
            };

            return data;
        });

        let excelHeader = {
            ...selectedHeaderTitleState,
            uploadHeaderDetail: {
                ...selectedHeaderTitleState.uploadHeaderDetail,
                details: uploadDetails
            }
        };

        dispatchSelectedHeaderTitleState({
            type: 'SET_UPLOAD_HEADER_DETAIL_DATA',
            payload: uploadDetails
        });

        await props.handleCreateUploadForm(excelHeader);
        onCreateHeaderModalClose();
    }

    const onChangeDetailInputValue = (e, detailId) => {
        e.preventDefault();

        let newDetails = createUploadHeaderDetailState?.uploadedData.details.map(r => {
            if (r.id === detailId) {
                return {
                    ...r,
                    [e.target.name]: e.target.value
                }
            } else {
                return {
                    ...r
                }
            }
        });

        dispatchCreateUploadHeaderDetailState({
            type: 'SET_UPLOAD_HEADER_DETAIL_DATA',
            payload: newDetails
        });
    }

    const handleRemoveCell = (e, uploadHeaderId) => {
        e.preventDefault();

        let newDetails = createUploadHeaderDetailState.uploadedData.details.filter(r => r.id !== uploadHeaderId);

        dispatchCreateUploadHeaderDetailState({
            type: 'SET_UPLOAD_HEADER_DETAIL_DATA',
            payload: newDetails
        });
    }

    const handleAddCell = (e) => {
        e.preventDefault();

        let newDetail = {
            id: uuidv4(),
            colData: '',
            cellType: 'String'
        }

        dispatchCreateUploadHeaderDetailState({
            type: 'SET_UPLOAD_HEADER_DETAIL_DATA',
            payload: createUploadHeaderDetailState.uploadedData.details.concat(newDetail)
        });
    }

    const handleMoveCellUp = (e, detailId) => {
        e.preventDefault();

        let targetIdx = -1;

        createUploadHeaderDetailState.uploadedData.details.forEach((detail, idx) => {
            if (detail.id === detailId) {
                targetIdx = idx;
                return;
            }
        });

        handleChangeArrayControl(targetIdx, parseInt(targetIdx) - 1);
    }

    const handleMoveCellDown = (e, detailId) => {
        e.preventDefault();

        let targetIdx = -1;

        createUploadHeaderDetailState.uploadedData.details.forEach((detail, idx) => {
            if (detail.id === detailId) {
                targetIdx = idx;
                return;
            }
        });

        handleChangeArrayControl(targetIdx, parseInt(targetIdx) + 1);
    }

    const handleChangeArrayControl = (targetIdx, moveValue) => {
        if (!(createUploadHeaderDetailState.uploadedData.details.length > 1)) return;

        let newPosition = parseInt(moveValue);
        if (newPosition < 0 || newPosition >= createUploadHeaderDetailState.uploadedData.details.length) return;

        let headerDetailList = createUploadHeaderDetailState.uploadedData.details;
        let target = headerDetailList.splice(targetIdx, 1)[0];
        headerDetailList.splice(newPosition, 0, target);

        dispatchCreateUploadHeaderDetailState({
            type: 'SET_UPLOAD_HEADER_DETAIL_DATA',
            payload: headerDetailList
        })
    }

    const handleDownloadForm = async (e) => {
        e.preventDefault();

        let downloadDetail = selectedHeaderTitleState.uploadHeaderDetail.details.map(r => {
            return {
                ...r,
                colData: r.headerName
            }
        });

        await props.handleDownloadForUploadForm(downloadDetail);
    }

    return (
        <>
            <UploadContainerBody
                uploadedExcelData={uploadedExcelData}
                selectedHeaderTitleState={selectedHeaderTitleState}

                onCreateHeaderModalOpen={onCreateHeaderModalOpen}
                onCreateHeaderModalClose={onCreateHeaderModalClose}
                handleDownloadForm={handleDownloadForm}
            />

            {/* Create Upload Header Form Check Modal */}
            <ExcelTranslatorCommonModal
                open={createHeaderModalOpen}
                onClose={() => onCreateHeaderModalClose()}
                maxWidth={'xs'}
                fullWidth={true}
            >
                <CreateTranslatorUploadHeaderDetailComponent
                    createUploadHeaderDetailState={createUploadHeaderDetailState}

                    handleCreateUploadHeader={(e) => handleCreateUploadHeader(e)}
                    onChangeDetailInputValue={(e, detailId) => onChangeDetailInputValue(e, detailId)}
                    handleRemoveCell={(e, headerId) => handleRemoveCell(e, headerId)}
                    handleAddCell={(e) => handleAddCell(e)}
                    handleMoveCellUp={(e, detailId) => handleMoveCellUp(e, detailId)}
                    handleMoveCellDown={(e, detailId) => handleMoveCellDown(e, detailId)}
                ></CreateTranslatorUploadHeaderDetailComponent>
            </ExcelTranslatorCommonModal>
        </>
    )
}
