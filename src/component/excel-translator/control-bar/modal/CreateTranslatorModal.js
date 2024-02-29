import AddTaskIcon from '@mui/icons-material/AddTask';
import { BodyContainer, CommonInputEl, Container, CreateBtn, DataTitle, GroupTitle, HeaderInfo, ItemContainer, ItemHeaderWrapper, ItemWrapper } from './styles/TranslatorModal.styled';

export default function CreateTranslatorModal(props) {
    return (
        <>
            <Container>
                <form onSubmit={(e) => props.handleCreateTranslatorTitle(e)}>
                    <ItemContainer>
                        <ItemWrapper>
                            <ItemHeaderWrapper>
                                <GroupTitle>엑셀 유형 등록</GroupTitle>
                                <CreateBtn type='submit'><AddTaskIcon /></CreateBtn>
                            </ItemHeaderWrapper>
                        </ItemWrapper>
                    </ItemContainer>
                    <BodyContainer>
                        <HeaderInfo className="input-group mb-3">
                            <DataTitle>
                                <i className="icon-must" aria-label="필수항목"></i>
                                <span>업로드 엑셀 이름</span>
                            </DataTitle>
                            <CommonInputEl type="text" name='uploadHeaderTitle'
                                value={props.excelTitleInfo?.uploadHeaderTitle || ''}
                                onChange={(e) => props.onChangeInputValue(e)}
                                required
                            />
                        </HeaderInfo>
                        <HeaderInfo className="input-group mb-3">
                            <DataTitle>
                                <i className="icon-must" aria-label="필수항목"></i>
                                <span>다운로드 엑셀 이름</span>
                            </DataTitle>
                            <CommonInputEl type="text" name='downloadHeaderTitle'
                                value={props.excelTitleInfo?.downloadHeaderTitle || ''}
                                onChange={(e) => props.onChangeInputValue(e)}
                                required
                            />
                        </HeaderInfo>
                        <HeaderInfo className="input-group mb-3">
                            <DataTitle>
                                <i className="icon-must" aria-label="필수항목"></i>
                                <span>데이터 시작 행</span>
                                <span style={{ color: '#5d5d5d', fontSize: '14px', padding: '0 10px' }}>(헤더 시작 행)</span>
                            </DataTitle>
                            <CommonInputEl type="number" name='rowStartNumber'
                                value={props.excelTitleInfo?.rowStartNumber || ''}
                                onChange={(e) => props.onChangeInputValue(e)}
                                placeholder="숫자를 입력하세요."
                                required
                            />
                        </HeaderInfo>
                    </BodyContainer>
                </form>
            </Container>
        </>
    )
}
