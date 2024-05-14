import styled from "styled-components";

export const Container = styled.div`
    .icon-must {
        position: relative;
        margin-right: 5px;
        width: 6px;
        height: 6px;
        display: inline-block;
        background-color: #ff545c;
        border-radius: 50%;
        vertical-align: middle;
    }
`;

export const ItemContainer = styled.div`
`;

export const ItemWrapper = styled.div`
    background:white;
    border-radius: 5px;
`;

export const ItemHeaderWrapper = styled.div`
    border-bottom: 1px solid #5961c788;
    padding:10px;
    align-items: center;
    overflow: auto;
    display: grid;
    grid-template-columns: 6fr 1fr;
`;

export const GroupTitle = styled.div`
    font-size: 1.3rem;
    font-weight: 700;
    padding:15px;
    @media only screen and (max-width:425px){
        padding: 15px 0;
    }
`;

export const DataTitle = styled.div`
    font-size: 1rem;
    font-weight: 500;
    padding: 15px 5px;
    @media only screen and (max-width:425px){
        padding: 15px 0;
    }
`;

export const BodyContainer = styled.div`
    padding: 20px;
    background-color: rgb(232 236 247);
    padding-bottom: 50px;
`;

export const CommonInputEl = styled.input`
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

export const SubmitBtn = styled.button`
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

export const HeaderInfo = styled.div`
    display: grid;
    grid-template-columns: 90%;
    place-content: center;
`;


export const CreateBtn = styled.button`
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