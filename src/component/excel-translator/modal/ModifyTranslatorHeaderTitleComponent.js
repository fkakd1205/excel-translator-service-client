import { useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import AddTaskIcon from '@mui/icons-material/AddTask';

const Container = styled.div`
    .icon-must {
        position: relative;
        margin-left: 5px;
        width: 6px;
        height: 6px;
        display: inline-block;
        background-color: #ff545c;
        border-radius: 50%;
        vertical-align: middle;
    }
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
    align-items: center;
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
    padding-bottom: 50px;
`;

const CommonInputEl = styled.input`
    font-size: 1.1rem;
    border: none;
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
        cursor: pointer;
    }

    &:active{
        transition: 0s;
        transform: scale(1.05);

        color: #8e90e3;
    }
`;

const HeaderInfo = styled.div`
    display: grid;
    grid-template-columns: 90%;
    place-content: center;
`;


const CreateBtn = styled.button`
    background: #aab3cdee;
    border:none;
    margin: 0 auto;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: 0.4s;

    & .button-img{
        width:32px;
        filter: invert(100%) sepia(1%) saturate(3%) hue-rotate(90deg) brightness(113%) contrast(89%);
    }

    &:hover{
        transform: scale(1.1);
    }
    
    &:active{
        transition: 0s;
        transform: scale(1.05);
        background: #c7cee3ee;
    }
`;

const ModifyTranslatorHeaderTitleComponent = (props) => {
    return (
        <>
            <Container>
                <form onSubmit={(e) => props.excelTranslatorHeaderControl().modify(e)}>
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

export default ModifyTranslatorHeaderTitleComponent;