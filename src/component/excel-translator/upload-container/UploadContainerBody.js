import { dateToYYMMDDhhmmss } from "../../../handler/dateHandler"
import { BoardTitle, Container, DataOptionBox, HeaderFormControlBtn, BoardContainer, HeaderTh, BodyTr, BodyTd } from "./styles/Body.styled";

export default function UploadContainerBody(props) {
    return (
        <>
            <Container>
                <BoardTitle>
                    <div>업로드 엑셀 헤더 & 데이터</div>
                    <DataOptionBox>
                        <HeaderFormControlBtn type="button" className="upload-header-excel-download" onClick={(e) => props.handleDownloadForm(e)} disabled={!props.selectedHeaderTitleState?.uploadHeaderDetail.details.length}>양식 다운로드</HeaderFormControlBtn>
                        <HeaderFormControlBtn type="button" onClick={() => props.onCreateHeaderModalOpen()}>양식 설정</HeaderFormControlBtn>
                    </DataOptionBox>
                </BoardTitle>
                <BoardContainer>
                    {props.selectedHeaderTitleState?.uploadHeaderDetail?.details.length == 0 && <div className='info-text'>업로드 엑셀 헤더 양식을 설정해주세요.</div>}
                    <table className="table table-sm" style={{ tableLayout: 'fixed', width: '100%' }}>
                        <thead>
                            <tr>
                                {props.selectedHeaderTitleState?.uploadHeaderDetail?.details.map((data, idx) => {
                                    return (
                                        <HeaderTh key={'upload_header_idx' + idx} className="fixed-header large-cell" scope="col">
                                            <span>{data.headerName}</span>
                                        </HeaderTh>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody style={{ border: 'none' }}>
                            {props.uploadedExcelData?.map((data, idx) => {
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
