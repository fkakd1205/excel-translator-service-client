import { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import AddTaskIcon from '@mui/icons-material/AddTask';

const Container = styled.div`

`;

const ItemContainer = styled.div`
`;

const ItemWrapper = styled.div`
    background:white;
    border-radius: 5px;
`;

const ItemHeaderWrapper = styled.div`
    border-bottom: 1px solid #5961c788;
    padding:10px;
    overflow: auto;
    display: grid;
    grid-template-columns: 6fr 1fr;
`;

const GroupTitle = styled.div`
    font-size: 1.3rem;
    font-weight: 700;
    padding:15px;
    @media only screen and (max-width:425px){
        padding: 15px 0;
    }
`;

const DataTitle = styled.div`
    font-size: 1rem;
    font-weight: 500;
    padding:15px;
    @media only screen and (max-width:425px){
        padding: 15px 0;
    }
`;

const BodyContainer = styled.div`
    padding: 20px;
    background-color: rgb(232 236 247);
`;

const CommonInputEl = styled.input`
    font-size: 1.1rem;
    border: none;
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid #ced4da;
    &:focus{
        outline: none;
        border: 1px solid #4662B4;
        background: white;
    }
`;

const SubmitBtn = styled.button`
    border: none;
    border-radius: 50%;
    background-color: #c7cee3ee;
    margin: 8px 11px;

    &:hover{
        transform: scale(1.1);
    }

    &:active{
        transition: 0s;
        transform: scale(1.05);

        color: #8e90e3;
    }
`;

const HeaderInfo = styled.div`
    display: grid;
    grid-template-columns: 40% 50%;
    padding: 5px;
`;

const CreateTranslatorHeaderTitleComponent = (props) => {
    return (
        <>
            <Container>
                <form onSubmit={(e) => props.excelTranslatorHeaderControl().submit(e)}>
                    <ItemContainer>
                        <ItemWrapper>
                            <ItemHeaderWrapper>
                                <GroupTitle>엑셀 유형 등록</GroupTitle>
                                <SubmitBtn type='submit'><AddTaskIcon /></SubmitBtn>
                            </ItemHeaderWrapper>
                        </ItemWrapper>
                    </ItemContainer>
                    <BodyContainer>
                        <HeaderInfo className="input-group mb-3">
                            <DataTitle>업로드 엑셀 이름</DataTitle>
                            <CommonInputEl type="text" name='uploadHeaderTitle'
                                value={props.excelTitleInfo?.uploadHeaderTitle || ''}
                                onChange={(e) => props.onChangeInputValue(e)}
                                required
                            />
                        </HeaderInfo>
                        <HeaderInfo className="input-group mb-3">
                            <DataTitle>다운로드 엑셀 이름</DataTitle>
                            <CommonInputEl type="text" name='downloadHeaderTitle'
                                value={props.excelTitleInfo?.downloadHeaderTitle || ''}
                                onChange={(e) => props.onChangeInputValue(e)}
                                required
                            />
                        </HeaderInfo>
                        <HeaderInfo className="input-group mb-3">
                            <DataTitle>데이터 시작 행</DataTitle>
                            <CommonInputEl type="number" name='rowStartNumber'
                                value={props.excelTitleInfo?.rowStartNumber || ''}
                                onChange={(e) => props.onChangeInputValue(e)}
                                required
                            />
                        </HeaderInfo>
                    </BodyContainer>
                </form>
            </Container>
        </>
    )
}

export default CreateTranslatorHeaderTitleComponent;