import { useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';
import ExcelTranslatorCommonModal from "../../modal/CommonModal";
import { useLocation } from "react-router-dom";
import UploadContainerBody from "./UploadContainerBody";
import CreateUploadHeaderModal from "./modal/CreateUploadHeaderModal";

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

export default function UploadContainerMain(props) {
    const location = useLocation()
    let query = queryString.parse(location.search);

    const [createHeaderModalOpen, setCreateHeaderModalOpen] = useState(false);
    const [selectedHeaderTitleState, dispatchSelectedHeaderTitleState] = useReducer(selectedHeaderTitleStateReducer, initialSelectedHeaderTitleState);
    
    const [uploadedExcelData, setUploadExcelData] = useState(null);
    const [headerDetails, setHeaderDetails] = useState(null);

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
        if (!selectedHeaderTitleState) {
            alert('헤더 형식을 먼저 선택해주세요.');
            return;
        }

        let data = []
        // 이미 등록된 헤더 양식이 있는 경우
        if(selectedHeaderTitleState?.uploadHeaderDetail.details.length > 0) {
            data = [...selectedHeaderTitleState?.uploadHeaderDetail.details]
        }else {     // 새로운 양식을 만들 경우
            data = [{
                id: uuidv4(),
                headerName: '',
                cellType: 'String'
            }]
        }

        setHeaderDetails(data);
        setCreateHeaderModalOpen(true);
    }

    const onCreateHeaderModalClose = () => {
        setCreateHeaderModalOpen(false);
    }

    const handleCreateUploadHeader = async (e) => {
        e.preventDefault();
        
        let uploadDetails = headerDetails.map((r, idx) => {
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

        let data = headerDetails.map(r => {
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

        setHeaderDetails(data)
    }

    const handleRemoveCell = (e, headerId) => {
        e.preventDefault();

        let data = headerDetails.filter(r => r.id !== headerId);
        setHeaderDetails(data)
    }

    const handleAddCell = (e) => {
        e.preventDefault();

        let data = [{
            id: uuidv4(),
            colData: '',
            cellType: 'String'
        }]
        setHeaderDetails([...headerDetails, ...data])
    }

    const handleMoveCellUp = (e, detailId) => {
        e.preventDefault();

        let targetIdx = -1;

        headerDetails.forEach((detail, idx) => {
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

        headerDetails.forEach((detail, idx) => {
            if (detail.id === detailId) {
                targetIdx = idx;
                return;
            }
        });

        handleChangeArrayControl(targetIdx, parseInt(targetIdx) + 1);
    }

    const handleChangeArrayControl = (targetIdx, moveValue) => {
        if (!(headerDetails.length > 1)) return;

        let newPosition = parseInt(moveValue);
        if (newPosition < 0 || newPosition >= headerDetails.length) return;

        let data = headerDetails;
        let target = data.splice(targetIdx, 1)[0];
        data.splice(newPosition, 0, target);

        setHeaderDetails([...data])
    }

    const handleDownloadForm = async (e) => {
        e.preventDefault();

        // TODO :: colData로 변환하지 않고 다운로드 할 수 있는 방법 생각해보기
        let downloadDetail = selectedHeaderTitleState.uploadHeaderDetail.details.map(r => {
            return {
                ...r,
                colData: r.headerName
            }
        });

        await props.handleDownloadForUploadForm(selectedHeaderTitleState, downloadDetail);
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

            {/* 업로드 엑셀 헤더 설정 모달창 */}
            <ExcelTranslatorCommonModal
                open={createHeaderModalOpen}
                onClose={() => onCreateHeaderModalClose()}
                maxWidth={'xs'}
                fullWidth={true}
            >
                <CreateUploadHeaderModal
                    headerDetails={headerDetails}

                    handleCreateUploadHeader={handleCreateUploadHeader}
                    onChangeDetailInputValue={onChangeDetailInputValue}
                    handleRemoveCell={handleRemoveCell}
                    handleAddCell={handleAddCell}
                    handleMoveCellUp={handleMoveCellUp}
                    handleMoveCellDown={handleMoveCellDown}
                ></CreateUploadHeaderModal>
            </ExcelTranslatorCommonModal>
        </>
    )
}
