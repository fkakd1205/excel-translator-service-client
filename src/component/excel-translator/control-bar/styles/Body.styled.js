import styled from "styled-components";

export const Container = styled.div`
`;

export const TitleSelector = styled.div`
    display: grid;
    grid-template-columns: 50% auto;
    padding: 20px 0px;
    text-align: center;
    align-items: center;

    @media only screen and (max-width: 992px) {
        padding: 10px;
        grid-template-columns: 100%;
        row-gap: 20px;
        place-content: center;
    }
`;

export const FormInput = styled.div`
    color: black;
    display: flex;
    vertical-align: middle;

    @media only screen and (max-width: 992px) {
        font-size: 10px;
        grid-row: end;
    }
`;

export const TitleControlBtn = styled.button`
    height: 50px;
    width: 50px;
    background: #989fb7;
    color:white;
    border:1px solid #989fb7;
    border-radius: 3px;
    margin-left: 10px;
    padding: 10px;

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    @media only screen and (max-width: 992px) {
        padding: 6px;
    }
`;

export const DataContainer = styled.div`
`;

export const TranslatorBtnBox = styled.div`
    padding: 0 3%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    text-align: center;
    align-items: center;

    @media only screen and (max-width: 992px){
        grid-template-columns: 100%;
    }
`;

export const Form = styled.form`
    margin: 10px;

    @media only screen and (max-width: 992px){
        margin: 0 auto;
        width: 100%;
    }
`;

export const FromGroup = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 20px;
    text-align: center;
    align-items: center;


    @media only screen and (max-width: 992px){
        grid-template-columns: none;
        grid-template-rows: repeat(1, 1fr);
    }
`;

export const ControlLabel = styled.label`
    font-size: 1rem;
    display: inline-block;
    margin: 4px;
    width: 100%;
    padding: 3% 0%;
    color: white;
    text-align: center;
    vertical-align: middle;
    background-color: #a9b3d5;
    border-radius: 3px;
    transition: 0.15s linear;
    font-weight: 600;

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    @media only screen and (max-width:992px){
        padding: 1.5% 0%;
    }

    @media only screen and (max-width:768px){
        font-size: 14px;
    }

    @media only screen and (max-width:576px){
        font-size: 12px;
    }
`;

export const ControlBtn = styled.button`
    font-size: 1rem;
    width: 100%;
    padding: 3% 0%;
    margin: 4px;
    color: white;
    vertical-align: middle;
    background-color: #a9b3d5;
    border-radius: 3px;
    border: none;
    transition: 0.15s linear;
    font-weight: 600;

    &:hover {
        opacity: 0.8;
        cursor: pointer;
    }

    @media only screen and (max-width:992px){
        padding: 1.5% 0%;
    }

    @media only screen and (max-width:768px){
        font-size: 14px;
    }

    @media only screen and (max-width:576px){
        font-size: 12px;
    }
`;

export const Input = styled.input`
    font-size: 20px;
    width: 100%;
    display: none;
`;

export const TitleControlBox = styled.div`
    display: flex;

    @media only screen and (max-width: 992px) {
        justify-content: flex-end;
    }
`;