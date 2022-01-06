import { useState, useReducer } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from 'uuid';
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
    grid-template-columns: 90% 10%;
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
    grid-template-columns: 1fr;
    column-gap: 10px;
`;

const BoardContainer = styled.div`
    background-color: white;
    overflow: auto;
    border-radius: 5px;
    font-size: 14px;

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
`;

const StoreBtn = styled.button`
    padding: 3%;
    background: rgb(179 199 219);
    color:white;
    font-size: 1em;
    font-weight: 500;
    border:1px solid rgb(179 199 219);
    border-radius: 20px;

    @media only screen and (max-width: 992px){
        display: inline-block;
        padding: 5px;
    }

    @media only screen and (max-width:576px ){
        padding: 0;
    }

    &:hover{
        cursor: pointer;
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

const initialDownloadHeaderDetail = null;

const downloadHeaderDetailReducer = (state, action) => {
    switch(action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'SET_DATA':
            return {
                ...state,
                [action.payload.name] : action.payload.value
            }
        case 'CLEAR':
            return null;
        default: return {...state}
    }
}

const ExcelTranslatorDownloadDataBoard = (props) => {
    const [downloadHeaderDetail, dispatchDownloadHeaderDetail] = useReducer(downloadHeaderDetailReducer, initialDownloadHeaderDetail);
    const [downloadHeaderDetailList, setDownloadHeaderDetailList] = useState([]);
    const [createTranslatorDownloadHeaderDetailModalOpen, setCreateTranslatorDownloadHeaderDetailModalOpen] = useState(false);
    const [fixedValueCheckList, setFixedValueCheckList] = useState([]);
    
    const onCreateTranslatorDownloadHeaderDetailModalOpen = () => {
        setCreateTranslatorDownloadHeaderDetailModalOpen(true);
    }

    const onCreateTranslatorDownloadHeaderDetailModalClose = () => {
        setCreateTranslatorDownloadHeaderDetailModalOpen(false);
    }

    const onChangeInputValue = (e, headerId) => {
        dispatchDownloadHeaderDetail({
            type: 'SET_DATA',
            payload: {
                name: e.target.name,
                value: e.target.value
            }
        })

        setDownloadHeaderDetailList(downloadHeaderDetailList.map(r => {
            if(r.id === headerId) {
                return {
                    ...r,
                    [e.target.name]: e.target.value
                }    
            }else{
                return r;
            }
        }));
    }

    const excelFormControl = () => {
        return {
            downloadExcelForm: function () {
                return {
                    open: function (e) {
                        e.preventDefault();

                        if(!props.selectedHeaderTitle) {
                            alert('헤더 형식을 먼저 선택해주세요.');
                            return;
                        }else if(!(props.selectedHeaderTitle.uploadHeaderDetail.details.length > 0)) {
                            alert('업로드 엑셀 양식을 먼저 설정해주세요.');
                            return;
                        }
                        

                        // 양식이 이미 설정되어 있다면
                        if(props.selectedHeaderTitle.downloadHeaderDetail.details.length > 0) {
                            let detailList = props.selectedHeaderTitle.downloadHeaderDetail.details;

                            setDownloadHeaderDetailList(detailList);
                            setFixedValueCheckList(detailList.filter(r => r.targetCellNumber === -1).map(r => r.id));
                        }else {     // 새로운 양식을 생성하는 경우
                            setDownloadHeaderDetailList([new DownloadHeaderDetail().toJSON()]);
                        }
                        onCreateTranslatorDownloadHeaderDetailModalOpen();
                    },
                    close: function () {
                        onCreateTranslatorDownloadHeaderDetailModalClose();
                    },
                    addCell: function (e) {
                        e.preventDefault();

                        setDownloadHeaderDetailList(downloadHeaderDetailList.concat(new DownloadHeaderDetail().toJSON()));
                    },
                    deleteCell: function (e, headerId) {
                        e.preventDefault();
        
                        if(downloadHeaderDetailList.length > 1){
                            setDownloadHeaderDetailList(downloadHeaderDetailList.filter(r => r.id !== headerId));
                        }
                    },
                    createDownloadExcelHeaderDetail: async function (e) {
                        e.preventDefault();
        
                        let excelHeader = props.selectedHeaderTitle;
                        excelHeader.downloadHeaderDetail.details = downloadHeaderDetailList;
        
                        await props.createDownloadHeaderDetailsControl(excelHeader);
        
                        onCreateTranslatorDownloadHeaderDetailModalClose();
                    },
                    selectedUploadHeaderName: function (e, customizedDataId, downloadHeaderDetailData) {
                        e.preventDefault();

                        setDownloadHeaderDetailList(downloadHeaderDetailList.map(r => {
                            if(r.id === customizedDataId) {
                                // 고정값 체크되지 않은 데이터들만 targetCellNumber을 변경
                                if(!fixedValueCheckList.includes(customizedDataId)){
                                    r.targetCellNumber = downloadHeaderDetailData.cellNumber;
                                }
                                r.refUploadHeaderName = downloadHeaderDetailData.headerName;
                                r.uploadHeaderId = downloadHeaderDetailData.id;
                                return r;
                            }else{
                                return r;
                            }
                        }))
                    },
                    isChecked: function (headerId) {
                        return fixedValueCheckList.includes(headerId);
                    },
                    checkOne: function (e, headerId) {
                        if (e.target.checked) {
                            setFixedValueCheckList(fixedValueCheckList.concat(headerId));
                            setDownloadHeaderDetailList(downloadHeaderDetailList.map(r => {
                                if(r.id === headerId) {
                                    r.targetCellNumber = -1;
                                    return r;
                                }else{
                                    return r;
                                }
                            }));
                        } else {
                            setFixedValueCheckList(fixedValueCheckList.filter(r => r !== headerId));
                        }
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
                                {props.selectedHeaderTitle?.downloadHeaderDetail.details.map((data, idx) => {
                                    return (
                                        <HeaderTh key={'download_header_idx' + idx} className="fixed-header large-cell" scope="col">
                                            <span>{idx+1}. </span><span>{data.headerName}</span>
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
                    selectedHeaderTitle={props.selectedHeaderTitle}
                    downloadHeaderDetailList={downloadHeaderDetailList}

                    downloadExcelFormControl={excelFormControl().downloadExcelForm}
                    onChangeInputValue={onChangeInputValue}
                ></CreateTranslatorDownloadHeaderDetailComponent>
            </ExcelTranslatorCommonModal>
        </>
    )
}

export default withRouter(ExcelTranslatorDownloadDataBoard);