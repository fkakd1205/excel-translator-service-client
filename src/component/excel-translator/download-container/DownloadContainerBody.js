import CreateTranslatorDownloadHeaderDetailComponent from "../modal/CreateTranslatorDownloadHeaderDetailComponent";
import ExcelTranslatorCommonModal from "../modal/ExcelTranslatorCommonModal";
import { BoardContainer, BoardTitle, Container, DataOptionBox, HeaderTh, StoreBtn } from "./styles/Body.styled";

export default function DownloadContainerBody(props) {
    return (
        <>
            <Container>
                <BoardTitle>
                    <span>다운로드 엑셀 헤더</span>
                    <DataOptionBox>
                        <StoreBtn type="button" onClick={(e) => props.excelFormControl().downloadExcelForm().open(e)}>양식 설정</StoreBtn>
                    </DataOptionBox>
                </BoardTitle>
                <BoardContainer>
                    <table className="table table-sm" style={{ tableLayout: 'fixed', width: '100%' }}>
                        <thead>
                            <tr>
                                {props.selectedHeaderTitleState?.downloadHeaderDetail?.details.map((data, idx) => {
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
                open={props.createTranslatorDownloadHeaderDetailModalOpen}
                onClose={() => props.excelFormControl().downloadExcelForm().close()}
                maxWidth={'md'}
                fullWidth={true}
            >
                <CreateTranslatorDownloadHeaderDetailComponent
                    selectedHeaderTitleState={props.selectedHeaderTitleState}
                    updateDownloadHeaderForm={props.updateDownloadHeaderForm}

                    downloadExcelFormControl={props.excelFormControl().downloadExcelForm}
                    selectedUploadHeaderNameControl={(e, downloadHeaderId)=>props.excelFormControl().downloadExcelForm().selectedUploadHeaderName(e, downloadHeaderId)}
                    onChangeInputValueControl={(e, downloadHeaderId)=>props.excelFormControl().downloadExcelForm().onChangeInputValue(e, downloadHeaderId)}
                ></CreateTranslatorDownloadHeaderDetailComponent>
            </ExcelTranslatorCommonModal>
        </>
    )
}
