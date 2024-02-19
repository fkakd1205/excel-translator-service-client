import { useEffect, useReducer, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import queryString from 'query-string';
import CreateTranslatorHeaderTitleComponent from "../modal/CreateTranslatorHeaderTitleComponent";
import ExcelTranslatorCommonModal from "../modal/ExcelTranslatorCommonModal";
import ModifyTranslatorHeaderTitleComponent from "../modal/ModifyTranslatorHeaderTitleComponent";
import ControlBarBody from "./ControlBarBody";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";

class ExcelTranslatorHeader {
    constructor() {
        this.id = uuidv4();
        this.uploadHeaderTitle = '';
        this.downloadHeaderTitle = '';
        this.uploadHeaderDetail = {
            details: []
        };
        this.downloadHeaderDetail = {
            details: []
        };
        this.rowStartNumber = 0;
    }

    toJSON() {
        return {
            id: this.id,
            uploadHeaderTitle: this.uploadHeaderTitle,
            downloadHeaderTitle: this.downloadHeaderTitle,
            uploadHeaderDetail: this.uploadHeaderDetail,
            downloadHeaderDetail: this.downloadHeaderDetail,
            rowStartNumber: this.rowStartNumber
        }
    }
}

const initialExcelTitle = null;
const initialSelectedHeaderTitleState = null;

const excelTitleInfoReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'SET_DATA':
            return {
                ...state,
                [action.payload.name]: action.payload.value
            }
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

const selectedHeaderTitleStateReducer = (state, action) => {
    switch (action.type) {
        case 'INIT_DATA':
            return action.payload;
        case 'CLEAR':
            return null;
        default: return { ...state }
    }
}

export default function ControlBarMain(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname;
    const query = queryString.parse(location.search)

    const [excelTitleInfo, dispatchExcelTitleInfo] = useReducer(excelTitleInfoReducer, initialExcelTitle);
    const [selectedHeaderTitleState, dispatchSelectedHeaderTitleState] = useReducer(selectedHeaderTitleStateReducer, initialSelectedHeaderTitleState);
    const [createTranslatorHeaderTitleModalOpen, setCreateTranslatorHeaderTitleModalOpen] = useState(false);
    const [modifyTranslatorHeaderTitleModalOpen, setModifyTranslatorHeaderTitleModalOpen] = useState(false);

    // Get Excel Translator Header Detail
    useEffect(() => {
        function initHeaderTitleState() {
            if (!props.excelTranslatorHeaderList) {
                return;
            }
            
            if(!query.headerId) {
                dispatchSelectedHeaderTitleState({
                    type: 'CLEAR'
                })
                return;
            }

            let headerId = query.headerId;
            let headerTitleState = props.excelTranslatorHeaderList?.filter(r => r.id === headerId)[0];

            dispatchSelectedHeaderTitleState({
                type: 'INIT_DATA',
                payload: headerTitleState
            });
        }
        initHeaderTitleState();
    }, [query.headerId, props.excelTranslatorHeaderList]);


    const onCreateTranslatorHeaderTitleModalOpen = () => {
        setCreateTranslatorHeaderTitleModalOpen(true);
        dispatchExcelTitleInfo({
            type: 'CLEAR'
        })
    }

    const onCreateUploadExcelHeaderModalClose = () => {
        setCreateTranslatorHeaderTitleModalOpen(false);
    }

    const onModifyTranslatorHeaderTitleModalOpen = () => {
        if(!selectedHeaderTitleState){
            alert('엑셀 형식을 먼저 선택해주세요.');
            return;
        }

        setModifyTranslatorHeaderTitleModalOpen(true);

        dispatchExcelTitleInfo({
            type: 'INIT_DATA',
            payload: {
                downloadHeaderTitle: selectedHeaderTitleState.downloadHeaderTitle,
                uploadHeaderTitle: selectedHeaderTitleState.uploadHeaderTitle,
                rowStartNumber: selectedHeaderTitleState.rowStartNumber
            }
        });
    }

    const onModifyUploadExcelHeaderModalClose = () => {
        setModifyTranslatorHeaderTitleModalOpen(false);
    }

    const onChangeInputValue = (e) => {
        dispatchExcelTitleInfo({
            type: 'SET_DATA',
            payload: {
                name: e.target.name,
                value: e.target.value
            }
        });
    }

    const excelTranslatorHeaderControl = () => {
        return {
            submit: async function (e) {
                e.preventDefault();

                // 엑셀 타이틀 정보 설정 (업로드 타이틀, 다운로드 타이틀, 데이터 시작 행)
                let excelHeader = new ExcelTranslatorHeader().toJSON();
                excelHeader = {
                    ...excelHeader,
                    uploadHeaderTitle: excelTitleInfo.uploadHeaderTitle,
                    downloadHeaderTitle: excelTitleInfo.downloadHeaderTitle,
                    rowStartNumber: excelTitleInfo.rowStartNumber
                }
                
                await props.createTranslatorHeaderTitleControl(excelHeader);
                
                // 새로 생성된 타이틀 형식이 선택되도록 설정.
                // props.history.replace({
                //     pathname: pathname,
                //     search: `?${queryString.stringify({
                //         ...param,
                //         headerId: excelHeader.id
                //     })}`
                // })
                query.headerId = excelHeader.id

                navigate({
                    pathname: location.pathname,
                    search: `?${createSearchParams({...query})}`,
                }, {
                    replace: true
                })
                
                onCreateUploadExcelHeaderModalClose();
            },
            modify: async function (e) {
                e.preventDefault();

                // 엑셀 타이틀 정보 설정 (업로드 타이틀, 다운로드 타이틀, 데이터 시작 행)
                let excelHeader = new ExcelTranslatorHeader().toJSON();
                excelHeader = {
                    ...excelHeader,
                    id: selectedHeaderTitleState.id,
                    uploadHeaderTitle: excelTitleInfo.uploadHeaderTitle,
                    downloadHeaderTitle: excelTitleInfo.downloadHeaderTitle,
                    rowStartNumber: excelTitleInfo.rowStartNumber
                }

                await props.modifyTranslatorHeaderTitleControl(excelHeader);
                onModifyUploadExcelHeaderModalClose();
            },
            selectHeaderTitle: function (e) {
                e.preventDefault();

                let selectedHeaderId = props.excelTranslatorHeaderList.find(r => r.id === e.target.value).id;
                query.headerId = selectedHeaderId

                navigate({
                    pathname: location.pathname,
                    search: `?${createSearchParams({...query})}`,
                }, {
                    replace: true
                })
            },
            delete: async function (e) {
                e.preventDefault();

                if(!selectedHeaderTitleState) {
                    alert('삭제하려는 엑셀 형식을 먼저 선택해주세요.');
                    return;
                }
                
                if(!window.confirm('정말 삭제하시겠습니까?')) {
                    return;    
                }
                
                await props.deleteTranslatorHeaderTitleControl(selectedHeaderTitleState.id);

                navigate({
                    pathname: location.pathname,
                    search: `?${createSearchParams({...query})}`,
                }, {
                    replace: true
                })
            }
        }
    }

    const excelFileControl = () => {
        return {
            uploadExcel: function () {
                return {
                    uploadExcelFile: async function (e) {
                        e.preventDefault();

                        // 헤더 타이틀을 선택하지 않은 경우
                        if (!selectedHeaderTitleState) {
                            alert('헤더 형식을 먼저 선택해주세요.');
                            return;
                        }

                        // 파일을 선택하지 않은 경우
                        if (e.target.files.length === 0) return;

                        let addFiles = e.target.files;

                        var uploadedFormData = new FormData();
                        uploadedFormData.append('file', addFiles[0]);
                        uploadedFormData.append(
                            "dto",
                            new Blob([JSON.stringify(selectedHeaderTitleState)], { type: "application/json" })
                        );

                        props.loadingControl().open();
                        await props.uploadExcelFileControl(uploadedFormData);
                        props.loadingControl().close();
                    }
                }
            },
            downloadExcel: function () {
                return {
                    downloadTranslatedExcelFile: async function (e) {
                        e.preventDefault();

                        if(!props.uploadedExcelData) {
                            alert('엑셀 파일을 먼저 업로드 해주세요.');
                            return;
                        }else if(!(selectedHeaderTitleState.uploadHeaderDetail.details.length > 0)) {
                            alert('업로드 엑셀 양식을 설정해주세요.');
                            return;
                        }else if(!(selectedHeaderTitleState.downloadHeaderDetail.details.length > 0)) {
                            alert('다운로드 엑셀 양식을 설정해주세요.');
                            return;
                        }

                        props.loadingControl().open();
                        await props.downloadTranslatedExcelFileControl(selectedHeaderTitleState.downloadHeaderDetail.details);
                        props.loadingControl().close();
                    }
                }
            }
        }
    }

    return (
        <>
            <ControlBarBody
                excelTranslatorHeaderList={props.excelTranslatorHeaderList}
                selectedHeaderTitleState={selectedHeaderTitleState}

                excelFileControl={excelFileControl}
                excelTranslatorHeaderControl={excelTranslatorHeaderControl}
                onCreateTranslatorHeaderTitleModalOpen={onCreateTranslatorHeaderTitleModalOpen}
                onModifyTranslatorHeaderTitleModalOpen={onModifyTranslatorHeaderTitleModalOpen}
            />

            {/* Create Header Title Modal */}
            <ExcelTranslatorCommonModal
                open={createTranslatorHeaderTitleModalOpen}
                onClose={() => onCreateUploadExcelHeaderModalClose()}
                maxWidth={'xs'}
                fullWidth={true}
            >
                <CreateTranslatorHeaderTitleComponent
                    excelTitleInfo={excelTitleInfo}

                    onChangeInputValue={onChangeInputValue}
                    excelTranslatorHeaderControl={props.excelTranslatorHeaderControl}
                ></CreateTranslatorHeaderTitleComponent>
            </ExcelTranslatorCommonModal>

            {/* Modify Header Title Modal */}
            <ExcelTranslatorCommonModal
                open={modifyTranslatorHeaderTitleModalOpen}
                onClose={() => onModifyUploadExcelHeaderModalClose()}
                maxWidth={'xs'}
                fullWidth={true}
            >
                <ModifyTranslatorHeaderTitleComponent
                    excelTitleInfo={excelTitleInfo}

                    onChangeInputValue={onChangeInputValue}
                    excelTranslatorHeaderControl={props.excelTranslatorHeaderControl}
                ></ModifyTranslatorHeaderTitleComponent>
            </ExcelTranslatorCommonModal>
        </>
    )
}
