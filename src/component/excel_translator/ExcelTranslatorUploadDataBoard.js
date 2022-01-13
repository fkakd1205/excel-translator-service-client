import { useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';
import styled from "styled-components";
import { withRouter } from 'react-router';
import ExcelTranslatorCommonModal from "./modal/ExcelTranslatorCommonModal";
import { dateToYYMMDDhhmmss } from "./handler/dateHandler"
import CreateTranslatorUploadHeaderDetailComponent from "./modal/CreateTranslatorUploadHeaderDetailComponent";
import { isFocusable } from "@testing-library/user-event/dist/utils";

const Container = styled.div`
    padding: 0 2%;
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

    & .upload-header-create-btn {
        background: #c0bff3;
        border: 1px solid #c0bff3;

        &:hover{
            cursor: pointer;
            transition: 0.2s;
            transform: scale(1.05);
            background: #a5a3ff;
        }

        &:active{
            transition: 0s;
            transform: scale(1.05);
        }
    }

    & .upload-header-modify-btn {
        background: rgb(255 206 154);
        border: 1px solid rgb(255 206 154);

        &:hover{
            cursor: pointer;
            transition: 0.2s;
            transform: scale(1.05);
            background: rgb(255 172 139);
        }

        &:active{
            transition: 0s;
            transform: scale(1.05);
        }
    }
`;

const BoardContainer = styled.div`
    min-height: 60vh;
    max-height: 60px;
    background-color: white;
    overflow: auto;
    border-radius: 5px;
    font-size: 14px;
    box-shadow: 1px 1px 15px #a9b3d599;

    & .fixed-header {
        position: sticky;
        top: -1px;
        background: #d5dae9;
        z-index:10;
        padding: 2px;
        font-size: 16px;

        @media only screen and (max-width:576px){
            font-size: 14px;
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

const BodyTr = styled.tr`
    border-bottom: 1px solid #a7a7a740;
`;

const BodyTd = styled.td`
    vertical-align: middle !important;
    text-align: center;
    width: 150px;
    border-right: 1px solid #a7a7a720;
`;

const HeaderFormControlBtn = styled.button`
    padding: 3%;
    background: rgb(179 199 219);
    color:white;
    font-size: 1em;
    font-weight: 500;
    border:1px solid rgb(179 199 219);
    border-radius: 20px;
    
    @media only screen and (max-width: 992px){
        display: inline-block;
        padding: 4px;
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

const ExcelTranslatorUploadDataBoard = (props) => {
    let params = queryString.parse(props.location.search);

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

            if(!params.headerId) {
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
            
            let headerId = params.headerId;
            let headerTitleState = props.excelTranslatorHeaderList?.filter(r => r.id === headerId)[0];

            dispatchSelectedHeaderTitleState({
                type: 'INIT_DATA',
                payload: headerTitleState
            });
        }
        initHeaderTitleState();
    }, [params.headerId, props.excelTranslatorHeaderList]);

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
                    }
                }
            }
        }
    }

    return (
        <>
            <Container>
                <BoardTitle>
                    <span>업로드 엑셀 헤더 및 데이터</span>
                    <DataOptionBox>
                        <HeaderFormControlBtn type="button" onClick={(e) => excelFormControl().uploadedExcelForm().open(e)}>양식 설정</HeaderFormControlBtn>
                    </DataOptionBox>
                </BoardTitle>
                <BoardContainer>
                    <table className="table table-sm" style={{ tableLayout: 'fixed', width: '100%' }}>
                        <thead>
                            <tr>
                                {/* {uploadedExcelHeaderData?.map((data, idx) => { */}
                                {uploadedExcelHeaderDataState?.map((data, idx) => {
                                    return (
                                        <HeaderTh key={'upload_header_idx' + idx} className="fixed-header large-cell" scope="col">
                                            <span>{data.colData}</span>
                                        </HeaderTh>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody style={{ border: 'none' }}>
                            {uploadedExcelDataState?.map((data, idx) => {
                                return (
                                    <BodyTr
                                        key={'upload_exel_data_idx' + idx}
                                    >
                                        {data.uploadedData.details.map((detailData, detailIdx) => {
                                            return (
                                                <BodyTd key={'upload_excel_data_detail_idx' + detailIdx} className="col">
                                                    <span>{detailData.cellType === 'Date' ? dateToYYMMDDhhmmss(detailData.colData) : detailData.colData}</span>
                                                </BodyTd>
                                            )
                                        })}
                                    </BodyTr>
                                )
                            })}
                        </tbody>
                    </table>
                </BoardContainer>
            </Container>

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

export default withRouter(ExcelTranslatorUploadDataBoard);