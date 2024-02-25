import { BoardContainer, BoardTitle, Container, DataOptionBox, HeaderTh, StoreBtn } from "./styles/Body.styled";

export default function DownloadContainerBody(props) {
    return (
        <>
            <Container>
                <BoardTitle>
                    <div>다운로드 엑셀 헤더</div>
                    <DataOptionBox>
                        <StoreBtn type="button" onClick={(e) => props.onCreateHeaderModalOpen(e)}>양식 설정</StoreBtn>
                    </DataOptionBox>
                </BoardTitle>
                <BoardContainer>
                    {props.selectedHeader?.downloadHeaderDetail?.details.length == 0 && <div className='info-text'>다운로드 엑셀 헤더 양식을 설정해주세요.</div>}
                    <table className="table table-sm" style={{ tableLayout: 'fixed', width: '100%', marginBottom: '0' }}>
                        <thead>
                            <tr>
                                {props.selectedHeader?.downloadHeaderDetail?.details.map((data, idx) => {
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
        </>
    )
}
