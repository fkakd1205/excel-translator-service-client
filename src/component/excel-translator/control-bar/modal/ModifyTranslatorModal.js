import AddTaskIcon from '@mui/icons-material/AddTask';
import { BodyContainer, CommonInputEl, Container, CreateBtn, DataTitle, GroupTitle, HeaderInfo, ItemContainer, ItemHeaderWrapper, ItemWrapper } from './styles/TranslatorModal.styled';

export default function ModifyTranslatorModal(props) {
    return (
        <>
            <Container>
                <form onSubmit={(e) => props.handleModifyTranslatorTitle(e)}>
                    <ItemContainer>
                        <ItemWrapper>
                            <ItemHeaderWrapper>
                                <GroupTitle>엑셀 유형 수정</GroupTitle>
                                <CreateBtn type='submit'><AddTaskIcon /></CreateBtn>
                            </ItemHeaderWrapper>
                        </ItemWrapper>
                    </ItemContainer>
                    <BodyContainer>
                        <HeaderInfo className="input-group mb-3">
                            <DataTitle><i className="icon-must" aria-label="필수항목"></i> 업로드 엑셀 이름</DataTitle>
                            <CommonInputEl type="text" name='uploadHeaderTitle'
                                value={props.excelTitleInfo?.uploadHeaderTitle || ''}
                                onChange={(e) => props.onChangeInputValue(e)}
                                required
                            />
                        </HeaderInfo>
                        <HeaderInfo className="input-group mb-3">
                            <DataTitle><i className="icon-must" aria-label="필수항목"></i> 다운로드 엑셀 이름</DataTitle>
                            <CommonInputEl type="text" name='downloadHeaderTitle'
                                value={props.excelTitleInfo?.downloadHeaderTitle || ''}
                                onChange={(e) => props.onChangeInputValue(e)}
                                required
                            />
                        </HeaderInfo>
                        <HeaderInfo className="input-group mb-3">
                            <DataTitle><i className="icon-must" aria-label="필수항목"></i> 데이터 시작 행</DataTitle>
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
