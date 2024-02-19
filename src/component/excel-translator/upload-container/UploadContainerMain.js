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
const initialUploadExcelHeaderDataState = null;
const initialUploadExcelDataState = null;

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

const uploadExcelHeaderDataStateReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

const uploadExcelDataStateReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

export default function UploadContainerMain(props) {
    const location = useLocation()
    let query = queryString.parse(location.search);

    const [createTranslatorUploadHeaderDetailModalOpen, setCreateTranslatorUploadHeaderDetailModalOpen] = useState(false);
    const [selectedHeaderTitleState, dispatchSelectedHeaderTitleState] = useReducer(selectedHeaderTitleStateReducer, initialSelectedHeaderTitleState);
    const [createUploadHeaderDetailState, dispatchCreateUploadHeaderDetailState] = useReducer(createUploadHeaderDetailStateReducer, initialCreateUploadHeaderDetailState);
    const [uploadedExcelHeaderDataState, dispatchUploadedExcelHeaderDataState] = useReducer(uploadExcelHeaderDataStateReducer, initialUploadExcelHeaderDataState);
    const [uploadedExcelDataState, dispatchUploadedExcelDataState] = useReducer(uploadExcelDataStateReducer, initialUploadExcelDataState);


    useEffect(() => {
        function initHeaderTitleState() {
            if (!props.excelTranslatorHeaderList) {
                return;
            }

            if(!query.headerId) {
                dispatchSelectedHeaderTitleState({
                    type: 'CLEAR'
                });
                dispatchUploadedExcelHeaderDataState({
                    type: 'CLEAR'
                });
                dispatchUploadedExcelDataState({
                    type: 'CLEAR'
                })
                return;
            }

            dispatchUploadedExcelHeaderDataState({
                type: 'CLEAR'
            });
            dispatchUploadedExcelDataState({
                type: 'CLEAR'
            })
            
            let headerId = query.headerId;
            let headerTitleState = props.excelTranslatorHeaderList?.filter(r => r.id === headerId)[0];

            dispatchSelectedHeaderTitleState({
                type: 'INIT_DATA',
                payload: headerTitleState
            });
        }
        initHeaderTitleState();
    }, [query.headerId, props.excelTranslatorHeaderList]);

    useEffect(() => {
        if (!selectedHeaderTitleState) {
            return;
        }

        if (selectedHeaderTitleState?.uploadHeaderDetail.details.length) {
            let data = selectedHeaderTitleState.uploadHeaderDetail.details.map(r => {
                    return {
                        ...r,
                        colData: r.headerName
                    }
                });
            dispatchUploadedExcelHeaderDataState({
                type: 'INIT_DATA',
                payload: data
            });
            return;
        }

        if(!props.uploadedExcelData) {
            return;
        }

        // 헤더 데이터 설정
        dispatchUploadedExcelHeaderDataState({
            type: 'INIT_DATA',
            payload: props.uploadedExcelData[0].uploadedData.details
        });
    }, [selectedHeaderTitleState, props.uploadedExcelData]);

    useEffect(() => {
        if(!selectedHeaderTitleState) {
            return;
        }
        
        if(!props.uploadedExcelData) {
            return;
        }

        // 헤더 데이터를 제외한 데이터 설정
        dispatchUploadedExcelDataState({
            type: 'INIT_DATA',
            payload: props.uploadedExcelData?.filter((r, idx) => idx !== 0)
        });
    }, [selectedHeaderTitleState, props.uploadedExcelData]);

    const onCreateTranslatorUploadHeaderDetailModalOpen = () => {
        setCreateTranslatorUploadHeaderDetailModalOpen(true);
    }

    const onCreateTranslatorUploadHeaderDetailModalClose = () => {
        setCreateTranslatorUploadHeaderDetailModalOpen(false);
    }

    const excelFormControl = () => {
        return {
            uploadedExcelForm: function () {
                return {
                    open: function (e) {
                        e.preventDefault();

                        if (!selectedHeaderTitleState) {
                            alert('헤더 형식을 먼저 선택해주세요.');
                            return;
                        }

                        onCreateTranslatorUploadHeaderDetailModalOpen();

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
                    },
                    close: function () {
                        onCreateTranslatorUploadHeaderDetailModalClose()
                    },
                    storeUploadedExcelHeaderDetail: async function (e) {
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

                        await props.createUploadHeaderDetailsControl(excelHeader);

                        onCreateTranslatorUploadHeaderDetailModalClose();
                    },
                    onChangeInputValue: function (e, detailId) {
                        e.preventDefault();

                        let newDetails = createUploadHeaderDetailState?.uploadedData.details.map(r=>{
                            if(r.id === detailId){
                                return {
                                    ...r,
                                    [e.target.name] : e.target.value
                                }
                            }else{
                                return {
                                    ...r
                                }
                            }
                        });

                        dispatchCreateUploadHeaderDetailState({
                            type: 'SET_UPLOAD_HEADER_DETAIL_DATA',
                            payload: newDetails
                        });
                    },
                    deleteCell: function (e, uploadHeaderId) {
                        e.preventDefault();

                        let newDetails = createUploadHeaderDetailState.uploadedData.details.filter(r => r.id !== uploadHeaderId);

                        dispatchCreateUploadHeaderDetailState({
                            type: 'SET_UPLOAD_HEADER_DETAIL_DATA',
                            payload: newDetails
                        });
                    },
                    addCell: function (e) {
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
                    },
                    moveUp: function (e, detailId) {
                        e.preventDefault();

                        let targetIdx = -1;

                        createUploadHeaderDetailState.uploadedData.details.forEach((detail, idx) => {
                            if(detail.id === detailId) {
                                targetIdx = idx;
                                return;
                            }
                        });
                    
                        this.changeArrayControl(targetIdx, parseInt(targetIdx)-1);
                    },
                    moveDown: function (e, detailId) {
                        e.preventDefault();

                        let targetIdx = -1;

                        createUploadHeaderDetailState.uploadedData.details.forEach((detail, idx) => {
                            if(detail.id === detailId) {
                                targetIdx = idx;
                                return;
                            }
                        });
                    
                        this.changeArrayControl(targetIdx, parseInt(targetIdx)+1);
                    },
                    changeArrayControl: function (targetIdx, moveValue) {
                        if(!(createUploadHeaderDetailState.uploadedData.details.length > 1)) return;
                        
                        let newPosition = parseInt(moveValue);
                        if(newPosition < 0 || newPosition >= createUploadHeaderDetailState.uploadedData.details.length) return;

                        let headerDetailList = createUploadHeaderDetailState.uploadedData.details;
                        let target = headerDetailList.splice(targetIdx, 1)[0];
                        headerDetailList.splice(newPosition, 0, target);

                        dispatchCreateUploadHeaderDetailState({
                            type: 'SET_UPLOAD_HEADER_DETAIL_DATA',
                            payload: headerDetailList
                        })
                    },
                    download: async function (e){
                        e.preventDefault();

                        props.loadingControl().open();

                        let downloadDetail = selectedHeaderTitleState.uploadHeaderDetail.details.map(r => {
                            return {
                                ...r,
                                colData: r.headerName
                            }
                        });

                        await props.downloadUploadHeaderDetailsControl(downloadDetail);
                        props.loadingControl().close();
                    }
                }
            }
        }
    }

    return (
        <>
            <UploadContainerBody
                uploadedExcelHeaderDataState={uploadedExcelHeaderDataState}
                uploadedExcelDataState={uploadedExcelDataState}
                selectedHeaderTitleState={selectedHeaderTitleState}

                excelFormControl={excelFormControl}
            />

            {/* Create Upload Header Form Check Modal */}
            <ExcelTranslatorCommonModal
                open={createTranslatorUploadHeaderDetailModalOpen}
                onClose={() => excelFormControl().uploadedExcelForm().close()}
                maxWidth={'xs'}
                fullWidth={true}
            >
                <CreateTranslatorUploadHeaderDetailComponent
                    createUploadHeaderDetailState={createUploadHeaderDetailState}
                    selectedHeaderTitleState={selectedHeaderTitleState}

                    storeUploadExcelFormControl={(e) => excelFormControl().uploadedExcelForm().storeUploadedExcelHeaderDetail(e)}
                    onChangeUploadHeaderDetail={(e, detailId) => excelFormControl().uploadedExcelForm().onChangeInputValue(e, detailId)}
                    uploadHeaderFormDeleteCell={(e, headerId) => excelFormControl().uploadedExcelForm().deleteCell(e, headerId)}
                    uploadHeaderFormAddCell={(e) => excelFormControl().uploadedExcelForm().addCell(e)}
                    moveHeaderFormUp={(e, detailId) => excelFormControl().uploadedExcelForm().moveUp(e, detailId)}
                    moveHeaderFormDown={(e, detailId) => excelFormControl().uploadedExcelForm().moveDown(e, detailId)}
                ></CreateTranslatorUploadHeaderDetailComponent>
            </ExcelTranslatorCommonModal>
        </>
    )
}
