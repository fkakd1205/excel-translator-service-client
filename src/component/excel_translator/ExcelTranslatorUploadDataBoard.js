import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import styled from "styled-components";
import { withRouter } from 'react-router';
import ExcelTranslatorCommonModal from "./modal/ExcelTranslatorCommonModal";
import { dateToYYMMDDhhmmss } from "./handler/dateHandler"
import CreateTranslatorUploadHeaderDetailComponent from "./modal/CreateTranslatorUploadHeaderDetailComponent";

const Container = styled.div`
    padding: 0 2%;
    background-color: #f2f5ff;
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
    min-height: 60vh;
    max-height: 60px;
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

const ExcelTranslatorUploadDataBoard = (props) => {

    // 헤더 데이터
    let uploadedExcelHeaderData = props.uploadedExcelData !== null ? props.uploadedExcelData[0].uploadedData.details : null;

    // 선택된 헤더의 업로드 headerDetails가 설정되어있다면 colData 지정.
    if(props.selectedHeaderTitle?.uploadHeaderDetail.details.length) {
        uploadedExcelHeaderData = props.selectedHeaderTitle.uploadHeaderDetail.details;
        uploadedExcelHeaderData = uploadedExcelHeaderData.map(r => {
            return {
                ...r,
                colData: r.headerName
            }
        });
    }

    // 헤더 데이터를 제외한 데이터
    let uploadedExcelData = props.uploadedExcelData?.filter((r, idx) => idx !== 0);

    const [createTranslatorUploadHeaderDetailModalOpen, setCreateTranslatorUploadHeaderDetailModalOpen] = useState(false);

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

                        if(!props.selectedHeaderTitle) {
                            alert('헤더 형식을 먼저 선택해주세요.');
                            return;
                        }else if(props.selectedHeaderTitle.uploadHeaderDetail.details.length > 0) {
                            alert('이미 설정된 양식이 존재합니다.');
                            return;
                        }else if(!props.uploadedExcelData) {
                            alert('저장하려는 양식의 엑셀 파일을 먼저 업로드해주세요.');
                            return;
                        }
                        
                        onCreateTranslatorUploadHeaderDetailModalOpen();
                    },
                    close: function () {
                        onCreateTranslatorUploadHeaderDetailModalClose()
                    },
                    storeUploadedExcelHeaderDetail: async function (e) {
                        e.preventDefault();
        
                        // 업로드된 header 데이터
                        let uploadedHeader = props.uploadedExcelData[0].uploadedData;
        
                        let uploadDetails = uploadedHeader.details.map((r, idx) => {
                            let data = new UploadHeaderDetail().toJSON();
                            data.cellNumber = idx;
                            data.headerName = r.colData;
                            data.cellType = r.cellType;
        
                            return data;
                        })
        
                        let excelHeader = props.selectedHeaderTitle;
                        excelHeader.uploadHeaderDetail.details = uploadDetails;

                        await props.createUploadHeaderDetailsControl(excelHeader)
                        onCreateTranslatorUploadHeaderDetailModalClose();
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
                        <StoreBtn type="button" onClick={(e) => excelFormControl().uploadedExcelForm().open(e)}>양식 저장</StoreBtn>
                    </DataOptionBox>
                </BoardTitle>
                <BoardContainer>
                    <table className="table table-sm" style={{ tableLayout: 'fixed', width: '100%' }}>
                        <thead>
                            <tr>
                                {uploadedExcelHeaderData?.map((data, idx) => {
                                    return (
                                        <HeaderTh key={'upload_header_idx' + idx} className="fixed-header large-cell" scope="col">
                                            <span>{data.colData}</span>
                                        </HeaderTh>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {uploadedExcelData?.map((data, idx) => {
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
                    uploadedExcelDataHeader={props.uploadedExcelData}

                    storeUploadExcelFormControl={(e) => excelFormControl().uploadedExcelForm().storeUploadedExcelHeaderDetail(e)}
                ></CreateTranslatorUploadHeaderDetailComponent>
            </ExcelTranslatorCommonModal>
        </>
    )
}

export default withRouter(ExcelTranslatorUploadDataBoard);