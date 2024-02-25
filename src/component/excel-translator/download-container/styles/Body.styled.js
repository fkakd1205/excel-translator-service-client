import styled from "styled-components";

export const Container = styled.div`
    margin-bottom: 30px;
`;

export const BoardTitle = styled.div`
    font-size: large;
    color: rgba(000, 102, 153, 0.9);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    
    @media only screen and (max-width:576px){
        font-size: 16px;
    }

    @media only screen and (max-width:320px){
        font-size: 14px;
    }
`;

export const DataOptionBox = styled.span`
    display: flex;
    align-items: center;
    column-gap: 10px;
`;

export const BoardContainer = styled.div`
    background-color: white;
    border-radius: 5px;
    font-size: 14px;
    overflow: auto;
    box-shadow: 1px 1px 10px #a9b3d599;

    .info-text {
        text-align: center;
        padding: 10px;
        color: #8b8b8b;
    }

    & .fixed-header {
        position: sticky;
        top: -1px;
        background: #d5dae9;
        z-index:10;
        padding: 2px;
        font-size: 16px;

        @media only screen and (max-width:576px){
            font-size: 12px;
        }
    }

    & .large-cell {
        width: 300px;
    }

    & .xlarge-cell {
        width: 500px;
    }

    @media only screen and (max-width:576px){
        font-size: 12px;
    }
`;

export const HeaderTh = styled.th`
    vertical-align: middle !important;
    text-align: center;
    width: 150px;
    border-right: 1px solid #ffffff;

    :last-child {
        border-right: none;
    }
`;

export const StoreBtn = styled.button`
    padding: 5px;
    width: 180px;
    background: #ffffff;
    color: #5b5b5b;
    font-size: 1em;
    font-weight: 500;
    border:1px solid #5b5b5b;
    border-radius: 20px;
    float: right;
    transition: 0.2s all;

    &:hover{
        cursor: pointer;
        transition: 0.2s;
        transform: scale(1.025);
    }

    &:active{
        transition: 0s;
        transform: scale(1.025);
    }
`;