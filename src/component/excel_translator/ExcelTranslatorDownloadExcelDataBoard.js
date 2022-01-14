import { useState, useReducer, useEffect } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';
import { withRouter } from 'react-router';
import CreateTranslatorDownloadHeaderDetailComponent from "./modal/CreateTranslatorDownloadHeaderDetailComponent";
import ExcelTranslatorCommonModal from "./modal/ExcelTranslatorCommonModal";

const Container = styled.div`
    padding: 2%;
    background-color: #f2f5ff;
    padding-bottom: 100px;
`;

const BoardTitle = styled.div`
    font-size: large;
    color: rgba(000, 102, 153, 0.9);
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: center;
    padding: 10px;

    @media only screen and (max-width: 992px){
        grid-template-columns: 1fr;
        row-gap: 10px;
    }
    
    @media only screen and (max-width:576px){
        font-size: 16px;
    }

    @media only screen and (max-width:320px){
        font-size: 14px;
    }
`;

const DataOptionBox = styled.span`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 10px;

    @media only screen and (max-width: 992px) {
        padding: 1% 0%;
    }
`;

const BoardContainer = styled.div`
    background-color: white;
    border-radius: 5px;
    font-size: 14px;
    overflow: auto;
    box-shadow: 1px 1px 15px #a9b3d599;

    & .fixed-header {
        position: sticky;
        top: -1px;
        background: #d5dae9;
        z-index:10;
        padding: 2px;
        font-size: 16px;

        @media only screen and (max-width:576px){
            font-size: 12px;
        }
    }

    & .large-cell {
        width: 300px;
    }

    & .xlarge-cell {
        width: 500px;
    }

    @media only screen and (max-width:576px){
        font-size: 12px;
    }
`;

const HeaderTh = styled.th`
    vertical-align: middle !important;
    text-align: center;
    width: 150px;
    border-right: 1px solid #efefef;
`;

const StoreBtn = styled.button`
    padding: 2%;
    background: rgb(179 199 219);
    color: white;
    font-size: 1em;
    font-weight: 500;
    border:1px solid rgb(179 199 219);
    border-radius: 20px;
    float: right;
    grid-column-start: 2;

    @media only screen and (max-width: 992px){
        display: inline-block;
        padding: 4px;
        grid-column-start: 1;
        grid-column-end: 3;
    }

    @media only screen and (max-width:576px ){
        padding: 0;
    }

    &:hover{
        cursor: pointer;
        transition: 0.2s;
        transform: scale(1.05);
        background: rgb(160 180 200);
    }

    &:active{
        transition: 0s;
        transform: scale(1.05);
    }
`;

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

const ExcelTranslatorDownloadDataBoard = (props) => {
    let params = queryString.parse(props.location.search);

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

            if(!params.headerId) {
                dispatchSelectedHeaderTitleState({
                    type: 'CLEAR'
                });
                return;
            }

            let headerId = params.headerId;
            let headerTitleState = props.excelTranslatorHeaderList?.filter(r => r.id === headerId)[0];

            dispatchSelectedHeaderTitleState({
                type: 'INIT_DATA',
                payload: headerTitleState
            });
        }
        initHeaderTitleState();
    }, [params.headerId, props.excelTranslatorHeaderList]);

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

                        await props.createDownloadHeaderDetailsControl(updateDownloadHeaderForm);
                        
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
                        } else {
                            setFixedValueCheckList(fixedValueCheckList.filter(r => r !== downloadHeaderId));

                            // 체크 해제하면 fixedValue를 빈 값으로 변경
                            let newDetails = updateDownloadHeaderForm.downloadHeaderDetail.details.map(r=>{
                                if(r.id === downloadHeaderId){
                                    return {
                                        ...r,
                                        fixedValue: ""
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
            <Container>
                <BoardTitle>
                    <span>다운로드 엑셀 헤더</span>
                    <DataOptionBox>
                        <StoreBtn type="button" onClick={(e) => excelFormControl().downloadExcelForm().open(e)}>양식 설정</StoreBtn>
                    </DataOptionBox>
                </BoardTitle>
                <BoardContainer>
                    <table className="table table-sm" style={{ tableLayout: 'fixed', width: '100%' }}>
                        <thead>
                            <tr>
                                {selectedHeaderTitleState?.downloadHeaderDetail?.details.map((data, idx) => {
                                    return (
                                        <HeaderTh key={'download_header_idx' + idx} className="fixed-header large-cell" scope="col">
                                            <span>{idx + 1}. </span><span>{data.headerName}</span>
                                        </HeaderTh>
                                    )
                                })}
                            </tr>
                        </thead>
                    </table>
                </BoardContainer>
            </Container>

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

export default withRouter(ExcelTranslatorDownloadDataBoard);