import { dateToYYMMDDhhmmss } from "../../../handler/dateHandler"
import { BoardTitle, Container, DataOptionBox, HeaderFormControlBtn, BoardContainer, HeaderTh, BodyTr, BodyTd } from "./styles/Body.styled";

export default function UploadContainerBody(props) {
    return (
        <>
            <Container>
                <BoardTitle>
                    <span>업로드 엑셀 헤더 및 데이터</span>
                    <DataOptionBox>
                        <HeaderFormControlBtn type="button" className="upload-header-excel-download" onClick={(e) => props.excelFormControl().uploadedExcelForm().download(e)} disabled={!props.selectedHeaderTitleState?.uploadHeaderDetail.details.length}>양식 다운로드</HeaderFormControlBtn>
                        <HeaderFormControlBtn type="button" onClick={(e) => props.excelFormControl().uploadedExcelForm().open(e)}>양식 설정</HeaderFormControlBtn>
                    </DataOptionBox>
                </BoardTitle>
                <BoardContainer>
                    <table className="table table-sm" style={{ tableLayout: 'fixed', width: '100%' }}>
                        <thead>
                            <tr>
                                {props.uploadedExcelHeaderDataState?.map((data, idx) => {
                                    return (
                                        <HeaderTh key={'upload_header_idx' + idx} className="fixed-header large-cell" scope="col">
                                            <span>{data.colData}</span>
                                        </HeaderTh>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody style={{ border: 'none' }}>
                            {props.uploadedExcelDataState?.map((data, idx) => {
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
        </>
    )
}
