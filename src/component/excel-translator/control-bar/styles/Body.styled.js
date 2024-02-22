import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`;

export const TitleSelector = styled.div`
    display: flex;
    text-align: center;
    align-items: center;
`;

export const FormInput = styled.div`
    color: black;
    display: flex;
    width: 400px;
    height: 55px;

    @media only screen and (max-width: 992px) {
        font-size: 10px;
        grid-row: end;
    }
`;

export const TitleControlBtn = styled.button`
    height: 55px;
    width: 55px;
    background: var(--main-color2);
    color:white;
    border:1px solid var(--main-color2);
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
`

export const FromGroup = styled.div`
    display: flex;
    gap: 15px;
    align-items: center;
    height: 55px;
    font-size: 18px;

    .button-box {
        width: 250px;
        height: 100%;
    }
`;

export const ControlLabel = styled.label`
    width: 100%;
    height: 100%;
    color: white;
    font-weight: 600;
    text-align: center;
    background-color: var(--main-color3);
    border-radius: 3px;
    transition: 0.15s linear;
    line-height: 55px;

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
    width: 100%;
    height: 100%;
    color: white;
    font-weight: 600;
    background-color: var(--main-color3);
    border-radius: 3px;
    border: none;
    transition: 0.15s linear;

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