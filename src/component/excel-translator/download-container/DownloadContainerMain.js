import { useState, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';
import CreateTranslatorDownloadHeaderDetailComponent from "../modal/CreateTranslatorDownloadHeaderDetailComponent";
import ExcelTranslatorCommonModal from "../modal/ExcelTranslatorCommonModal";
import DownloadContainerBody from "./DownloadContainerBody";
import { useLocation, useNavigate } from "react-router-dom";

class DownloadHeaderDetail {
    constructor() {
        this.id = uuidv4();
        this.headerName = '';
        this.targetCellNumber = -1;
        this.fixedValue = '';
        this.uploadHeaderId = null;
    }

    toJSON() {
        return {
            id: this.id,
            headerName: this.headerName,
            targetCellNumber: this.targetCellNumber,
            fixedValue: this.fixedValue,
            uploadHeaderId: this.uploadheaderId
        }
    }
}

const initialSelectedHeaderTitleState = null;
const initialUpdateDownloadHeaderForm = null;

const selectedHeaderTitleStateReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return {...action.payload};
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

const updateDownloadHeaderFormReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'SET_DOWNLOAD_HEADER_DETAIL_DATA':
            return {
                ...state,
                downloadHeaderDetail: {
                    ...state.downloadHeaderDetail,
                    details: action.payload
                }
            }
        case 'ADD_DATA':
            return {
                ...state,
                downloadHeaderDetail: {
                    ...state.downloadHeaderDetail,
                    details: state.downloadHeaderDetail.details.concat(new DownloadHeaderDetail().toJSON())
                }
            }
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

export default function DownloadContainerMain(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const query = queryString.parse(location.search)

    const [createTranslatorDownloadHeaderDetailModalOpen, setCreateTranslatorDownloadHeaderDetailModalOpen] = useState(false);
    const [fixedValueCheckList, setFixedValueCheckList] = useState([]);

    const [selectedHeaderTitleState, dispatchSelectedHeaderTitleState] = useReducer(selectedHeaderTitleStateReducer, initialSelectedHeaderTitleState);
    const [updateDownloadHeaderForm, dispatchUpdateDownloadHeaderForm] = useReducer(updateDownloadHeaderFormReducer, initialUpdateDownloadHeaderForm);

    const onCreateTranslatorDownloadHeaderDetailModalOpen = () => {
        setCreateTranslatorDownloadHeaderDetailModalOpen(true);
    }

    const onCreateTranslatorDownloadHeaderDetailModalClose = () => {
        setCreateTranslatorDownloadHeaderDetailModalOpen(false);
    }

    useEffect(() => {
        function initHeaderTitleState() {
            if (!props.excelTranslatorHeaderList) {
                return;
            }

            if(!query.headerId) {
                dispatchSelectedHeaderTitleState({
                    type: 'CLEAR'
                });
                return;
            }

            let headerId = query.headerId;
            let headerTitleState = props.excelTranslatorHeaderList?.filter(r => r.id === headerId)[0];

            dispatchSelectedHeaderTitleState({
                type: 'INIT_DATA',
                payload: headerTitleState
            });
        }
        initHeaderTitleState();
    }, [query.headerId, props.excelTranslatorHeaderList]);

    const excelFormControl = () => {
        return {
            downloadExcelForm: function () {
                return {
                    open: function (e) {
                        e.preventDefault();

                        if (!selectedHeaderTitleState) {
                            alert('헤더 형식을 먼저 선택해주세요.');
                            return;
                        } else if (!(selectedHeaderTitleState.uploadHeaderDetail.details.length > 0)) {
                            alert('업로드 엑셀 양식을 먼저 설정해주세요.');
                            return;
                        }

                        dispatchUpdateDownloadHeaderForm({
                            type: 'CLEAR'
                        });

                        dispatchUpdateDownloadHeaderForm({
                            type: 'INIT_DATA',
                            payload: {...selectedHeaderTitleState}
                        });

                        setFixedValueCheckList(selectedHeaderTitleState.downloadHeaderDetail.details.map(r => {
                            if(r.targetCellNumber === -1){
                                return r.id;
                            }
                        }));

                        if(!(selectedHeaderTitleState.downloadHeaderDetail.details.length > 0)){
                            dispatchUpdateDownloadHeaderForm({
                                type: 'INIT_DATA',
                                payload: {
                                    ...selectedHeaderTitleState,
                                    downloadHeaderDetail: {
                                        details : [new DownloadHeaderDetail().toJSON()]
                                    }
                                }
                            });
                        }
                        onCreateTranslatorDownloadHeaderDetailModalOpen();
                    },
                    close: function () {
                        onCreateTranslatorDownloadHeaderDetailModalClose();
                    },
                    addCell: function (e) {
                        e.preventDefault();

                        dispatchUpdateDownloadHeaderForm({
                            type: 'ADD_DATA'
                        });
                    },
                    deleteCell: function (e, downloadHeaderId) {
                        e.preventDefault();

                        if(updateDownloadHeaderForm.downloadHeaderDetail.details.length > 1) {
                            let newDetails = updateDownloadHeaderForm.downloadHeaderDetail.details.filter(r=> r.id !== downloadHeaderId);
                            
                            dispatchUpdateDownloadHeaderForm({
                                type: 'SET_DOWNLOAD_HEADER_DETAIL_DATA',
                                payload: newDetails
                            });
                        }else{
                            alert('삭제할 수 없습니다.');
                        }
                    },
                    createDownloadExcelHeaderDetail: async function (e) {
                        e.preventDefault();

                        await props.handleCreateDownloadForm(updateDownloadHeaderForm);
                        
                        dispatchSelectedHeaderTitleState({
                            type: 'INIT_DATA',
                            payload: updateDownloadHeaderForm
                        })
                        
                        onCreateTranslatorDownloadHeaderDetailModalClose();
                    },
                    selectedUploadHeaderName: function (e, downloadHeaderId) {
                        e.preventDefault();

                        let newDetails = updateDownloadHeaderForm.downloadHeaderDetail.details.map(r => {
                            if(r.id === downloadHeaderId){
                                let uploadHeaderId = updateDownloadHeaderForm.uploadHeaderDetail.details.filter(uploadHeader => uploadHeader.cellNumber === e.target.value)[0].id;

                                return {
                                    ...r,
                                    targetCellNumber : parseInt(e.target.value),
                                    uploadHeaderId : uploadHeaderId
                                }
                            }else{
                                return {
                                    ...r
                                }
                            }
                        });

                        dispatchUpdateDownloadHeaderForm({
                            type: 'SET_DOWNLOAD_HEADER_DETAIL_DATA',
                            payload: newDetails
                        })
                    },
                    isChecked: function (downloadHeaderId) {
                        return fixedValueCheckList.includes(downloadHeaderId);
                    },
                    checkOne: function (e, downloadHeaderId) {
                        if (e.target.checked) {
                            setFixedValueCheckList(fixedValueCheckList.concat(downloadHeaderId));

                            // 체크하면 targetCellNumber을 -1으로 변경
                            let newDetails = updateDownloadHeaderForm.downloadHeaderDetail.details.map(r=>{
                                if(r.id === downloadHeaderId){
                                    return {
                                        ...r,
                                        targetCellNumber: parseInt(-1)
                                    }
                                }else{
                                    return {
                                        ...r
                                    }
                                }
                            });
    
                            dispatchUpdateDownloadHeaderForm({
                                type: 'SET_DOWNLOAD_HEADER_DETAIL_DATA',
                                payload: newDetails
                            })
                        } else {
                            setFixedValueCheckList(fixedValueCheckList.filter(r => r !== downloadHeaderId));

                            // 체크 해제하면 fixedValue를 빈 값으로 변경
                            let newDetails = updateDownloadHeaderForm.downloadHeaderDetail.details.map(r=>{
                                if(r.id === downloadHeaderId){
                                    return {
                                        ...r,
                                        fixedValue: "",
                                        targetCellNumber: parseInt(-1)
                                    }
                                }else{
                                    return {
                                        ...r
                                    }
                                }
                            });
    
                            dispatchUpdateDownloadHeaderForm({
                                type: 'SET_DOWNLOAD_HEADER_DETAIL_DATA',
                                payload: newDetails
                            })
                        }
                    },
                    onChangeInputValue: function (e, downloadHeaderId) {
                        e.preventDefault();

                        let newDetails = updateDownloadHeaderForm?.downloadHeaderDetail.details.map(r=>{
                            if(r.id === downloadHeaderId){
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

                        dispatchUpdateDownloadHeaderForm({
                            type: 'SET_DOWNLOAD_HEADER_DETAIL_DATA',
                            payload: newDetails
                        })
                    }
                }
            }
        }
    }

    return (
        <>
            <DownloadContainerBody
                createTranslatorDownloadHeaderDetailModalOpen={createTranslatorDownloadHeaderDetailModalOpen}
                selectedHeaderTitleState={selectedHeaderTitleState}
                updateDownloadHeaderForm={updateDownloadHeaderForm}

                excelFormControl={excelFormControl}
            />

            {/* Create Download Header Modal */}
            <ExcelTranslatorCommonModal
                open={createTranslatorDownloadHeaderDetailModalOpen}
                onClose={() => excelFormControl().downloadExcelForm().close()}
                maxWidth={'md'}
                fullWidth={true}
            >
                <CreateTranslatorDownloadHeaderDetailComponent
                    selectedHeaderTitleState={selectedHeaderTitleState}
                    updateDownloadHeaderForm={updateDownloadHeaderForm}

                    downloadExcelFormControl={excelFormControl().downloadExcelForm}
                    selectedUploadHeaderNameControl={(e, downloadHeaderId)=>excelFormControl().downloadExcelForm().selectedUploadHeaderName(e, downloadHeaderId)}
                    onChangeInputValueControl={(e, downloadHeaderId)=>excelFormControl().downloadExcelForm().onChangeInputValue(e, downloadHeaderId)}
                ></CreateTranslatorDownloadHeaderDetailComponent>
            </ExcelTranslatorCommonModal>
        </>
    )
}
